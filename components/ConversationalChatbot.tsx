"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Loader2, 
  Send, 
  Bot,
  CheckCircle2,
  AlertCircle,
  MessageSquareIcon
} from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ExtractedData {
  roleTitle: string | null;
  experienceLevel: string | null;
  location: string | null;
  workModel: string | null;
  criticalSkill: string | null;
  minSalary: string | null;
  maxSalary: string | null;
  nonNegotiables: string | null;
  flexible: string | null;
  timeline: string | null;
}

export default function ConversationalChatbot() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData>({
    roleTitle: null,
    experienceLevel: null,
    location: null,
    workModel: null,
    criticalSkill: null,
    minSalary: null,
    maxSalary: null,
    nonNegotiables: null,
    flexible: null,
    timeline: null,
  });
  const [completeness, setCompleteness] = useState(0);
  const [conversationComplete, setConversationComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const conversationMessages = useRef<Array<{ role: string; content: string }>>([]);
  const greetingAdded = useRef(false);

  // Initial greeting
  useEffect(() => {
    // Only add greeting once
    if (!greetingAdded.current) {
      greetingAdded.current = true;
      setTimeout(() => {
        const greeting = "Hey there! 👋 I'm your AI hiring assistant. I'm here to help you create a perfect HireCard strategy.\n\nJust tell me about the role you're hiring for, and I'll guide you through the process with a few quick questions.\n\nLet's get started! What role are you looking to hire for?";
        addAssistantMessage(greeting);
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // Focus input without scrolling
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  }, [isLoading]);

  const addAssistantMessage = (content: string) => {
    // Check if this exact message already exists (prevent duplicates)
    setMessages((prev) => {
      const isDuplicate = prev.some(
        (msg) => msg.role === "assistant" && msg.content === content
      );
      if (isDuplicate) {
        return prev; // Don't add duplicate
      }
      
      const message: Message = {
        id: `assistant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        role: "assistant",
        content,
        timestamp: new Date(),
      };
      
      conversationMessages.current.push({
        role: "assistant",
        content,
      });
      
      return [...prev, message];
    });
  };

  const addUserMessage = (content: string) => {
    const message: Message = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, message]);
    conversationMessages.current.push({
      role: "user",
      content,
    });
  };

  const extractDataFromConversation = async () => {
    // Extract data silently in background without showing loading state
    try {
      const response = await fetch("/api/extract-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: conversationMessages.current,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setExtractedData(result.data);
        setCompleteness(result.completeness);
        
        // Check if conversation is complete
        if (result.isComplete) {
          setConversationComplete(true);
        }
      }
    } catch (err) {
      console.error("Failed to extract data:", err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim() || isLoading) return;

    const userMessage = currentInput.trim();
    setCurrentInput("");
    setError(null);

    // Add user message
    addUserMessage(userMessage);
    setIsLoading(true);

    try {
      // STEP 1: Intelligent extraction from user message (real-time)
      const extractionResponse = await fetch("/api/intelligent-extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          currentData: extractedData,
        }),
      });

      const extractionResult = await extractionResponse.json();
      
      // Merge extracted data immediately before sending to chat API
      let updatedExtractedData = { ...extractedData };
      
      if (extractionResult.success && extractionResult.hasNewData) {
        // Update extracted data with new information
        Object.keys(extractionResult.extracted).forEach((key) => {
          if (extractionResult.extracted[key]) {
            // For skills array, merge with existing
            if (key === "skills" && Array.isArray(extractionResult.extracted[key])) {
              updatedExtractedData.criticalSkill = extractionResult.extracted[key][0] || updatedExtractedData.criticalSkill;
            } else {
              (updatedExtractedData as any)[key] = extractionResult.extracted[key];
            }
          }
        });

        // Update state
        setExtractedData(updatedExtractedData);

        // Update completeness
        const newFilledCount = Object.values(updatedExtractedData).filter((v) => v !== null && v !== "").length;
        setCompleteness(Math.round((newFilledCount / 10) * 100));
      }

      // STEP 2: Get AI response with the LATEST extracted data
      const chatResponse = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: conversationMessages.current,
          extractedData: updatedExtractedData, // Use the updated data!
        }),
      });

      // Process chat response
      const chatResult = await chatResponse.json();
      if (chatResult.success) {
        addAssistantMessage(chatResult.message);
        
        // Stop loading immediately after adding message
        setIsLoading(false);

        // Extract data in background (don't block UI)
        extractDataFromConversation();

        // Check if assistant says it's complete
        if (chatResult.message.toLowerCase().includes("i have everything") ||
            chatResult.message.toLowerCase().includes("generate your hirecard")) {
          setTimeout(() => {
            handleComplete();
          }, 2000);
        }
      } else {
        setError(chatResult.error || "Failed to get response");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    // Prepare form data
    const formData = {
      roleTitle: extractedData.roleTitle || "",
      experienceLevel: extractedData.experienceLevel || "",
      location: extractedData.location || "",
      workModel: extractedData.workModel || "",
      criticalSkill: extractedData.criticalSkill || "",
      minSalary: extractedData.minSalary || "",
      maxSalary: extractedData.maxSalary || "",
      salaryRange: extractedData.minSalary && extractedData.maxSalary 
        ? `${extractedData.minSalary} - ${extractedData.maxSalary}`
        : "",
      nonNegotiables: extractedData.nonNegotiables || "",
      flexible: extractedData.flexible || "",
      timeline: extractedData.timeline || "",
    };

    // Save to sessionStorage
    sessionStorage.setItem("formData", JSON.stringify(formData));

    // Generate cards in background
    fetch("/api/generate-cards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          sessionStorage.setItem("battleCards", JSON.stringify(result.cards));
          sessionStorage.setItem("sessionId", result.sessionId);
        }
      })
      .catch(() => {
        // Silently fail
      });

    // Redirect to results
    router.push("/results");
  };

  const getFieldLabel = (field: string): string => {
    const labels: { [key: string]: string } = {
      roleTitle: "Role",
      experienceLevel: "Experience",
      location: "Location",
      workModel: "Work Model",
      criticalSkill: "Critical Skill",
      minSalary: "Min Salary",
      maxSalary: "Max Salary",
      nonNegotiables: "Must-Haves",
      flexible: "Nice-to-Haves",
      timeline: "Timeline",
    };
    return labels[field] || field;
  };

  const filledFieldsCount = Object.values(extractedData).filter(v => v !== null && v !== "").length;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col" style={{ height: "700px" }}>
        {/* Chat Header - Fixed at top */}
        <div className="bg-gradient-to-r from-[#278f8c] to-[#20706e] text-white px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">AI Hiring Assistant</h3>
                <p className="text-sm text-white/80">Powered by ChatGPT</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-white/80">Information Collected</div>
              <div className="text-lg font-bold">{filledFieldsCount}/10</div>
            </div>
          </div>
        </div>

        {/* Messages Container - Scrollable area */}
        <Conversation className="flex-1 overflow-hidden">
          <ConversationContent className="data-[conversation-content]" data-conversation-content>
            {messages.length === 0 ? (
              <ConversationEmptyState
                description="Start chatting to create your HireCard strategy. I'll guide you through the process!"
                icon={<MessageSquareIcon className="size-8" />}
                title="Ready to start?"
              />
            ) : (
              <>
                {messages.map((message) => (
                  <Message from={message.role} key={message.id}>
                    <MessageContent isUser={message.role === "user"}>
                      {message.content}
                    </MessageContent>
                  </Message>
                ))}

                {/* Typing Indicator */}
                {isLoading && (
                  <Message from="assistant" key="typing">
                    <MessageContent>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      </div>
                    </MessageContent>
                  </Message>
                )}

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-2 mx-4">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-red-800">{error}</p>
                      <button
                        onClick={() => setError(null)}
                        className="text-xs text-red-600 hover:text-red-800 mt-1 underline"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        {/* Input Area - Fixed at bottom */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 flex-shrink-0">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading || conversationComplete}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#278f8c] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={!currentInput.trim() || isLoading || conversationComplete}
              className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>

          {/* Progress Bar */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#278f8c] h-2 rounded-full transition-all duration-500"
                style={{ width: `${completeness}%` }}
              />
            </div>
            <span className="text-xs text-gray-600 font-medium min-w-[40px] text-right">
              {completeness}%
            </span>
          </div>

          {/* Extracted Data Preview (Collapsible) */}
          {filledFieldsCount > 0 && (
            <details className="mt-3">
              <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Captured Information ({filledFieldsCount}/10)</span>
              </summary>
              <div className="mt-2 p-3 bg-white rounded-lg border border-gray-200 text-xs space-y-1">
                {Object.entries(extractedData).map(([key, value]) => {
                  if (!value) return null;
                  return (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600">{getFieldLabel(key)}:</span>
                      <span className="text-gray-900 font-medium">{value}</span>
                    </div>
                  );
                })}
              </div>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
