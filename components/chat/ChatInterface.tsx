"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send, AlertCircle } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message as MessageComponent, MessageContent } from "@/components/ai-elements/message";
import { Message, ExtractedData } from "@/types/chat";
import { useChatState } from "@/hooks/useChatState";
import { useChatAPI } from "@/hooks/useChatAPI";
import { useCompletenessTracking } from "@/hooks/useCompletenessTracking";
import ChatHeader from "./ChatHeader";
import GeneratingLoadingScreen from "./GeneratingLoadingScreen";
import JobURLInput from "../JobURLInput";

export default function ChatInterface() {
  const router = useRouter();
  const {
    messages,
    setMessages,
    currentInput,
    setCurrentInput,
    isLoading,
    setIsLoading,
    error,
    setError,
    clearError,
    extractedData,
    setExtractedData,
    updateExtractedData,
    addMessage,
  } = useChatState();

  const [dataLoaded, setDataLoaded] = useState(false);
  const [showURLInput, setShowURLInput] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingMessageIndex, setGeneratingMessageIndex] = useState(0);
  const [generatingProgress, setGeneratingProgress] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const conversationMessages = useRef<Array<{ role: string; content: string }>>([]);
  const greetingAdded = useRef(false);

  const { completeness, filledFieldsCount, totalFields, countFilledFields } = useCompletenessTracking(extractedData);

  const addAssistantMessage = useCallback((content: string, suggestions?: string[]) => {
    setMessages((prev) => {
      const isDuplicate = prev.some(
        (msg) => msg.role === "assistant" && msg.content === content
      );
      if (isDuplicate) return prev;
      
      const message: Message = {
        id: `assistant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        role: "assistant",
        content,
        timestamp: new Date(),
        suggestions,
      };
      
      conversationMessages.current.push({
        role: "assistant",
        content,
      });
      
      return [...prev, message];
    });
  }, [setMessages]);

  const addUserMessage = useCallback((content: string) => {
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
  }, [setMessages]);

  const { sendChatMessage, scrapeJobURL } = useChatAPI({
    conversationMessages,
    extractedData,
    setExtractedData,
    setIsLoading,
    setError,
    addAssistantMessage,
  });

  const handleComplete = useCallback(async () => {
    setIsGenerating(true);

    const formData = {
      roleTitle: extractedData.roleTitle || "",
      department: extractedData.department || "",
      experienceLevel: extractedData.experienceLevel || "",
      location: extractedData.location || "",
      workModel: extractedData.workModel || "",
      criticalSkills: extractedData.criticalSkills || [],
      minSalary: extractedData.minSalary || "",
      maxSalary: extractedData.maxSalary || "",
      nonNegotiables: extractedData.nonNegotiables || "",
      flexible: extractedData.flexible || "",
      timeline: extractedData.timeline || "",
    };

    sessionStorage.setItem("formData", JSON.stringify(formData));

    try {
      const apiFormData = {
        jobTitle: extractedData.roleTitle || "",
        department: extractedData.department || "",
        experienceLevel: extractedData.experienceLevel || "",
        location: extractedData.location || "",
        workModel: extractedData.workModel || "",
        salaryRange: extractedData.minSalary && extractedData.maxSalary 
          ? `${extractedData.minSalary} - ${extractedData.maxSalary}`
          : "",
        requiredSkills: Array.isArray(extractedData.criticalSkills) 
          ? extractedData.criticalSkills.join(", ")
          : "",
        keyResponsibilities: extractedData.nonNegotiables || "",
        hiringTimeline: extractedData.timeline || "",
        companySize: "Not specified",
      };

      const response = await fetch("/api/generate-cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiFormData),
      });

      const result = await response.json();

      if (result.success) {
        sessionStorage.setItem("battleCards", JSON.stringify(result.cards));
        sessionStorage.setItem("sessionId", result.sessionId);
      }
    } catch (error) {
      console.error("Error generating cards:", error);
    }

    router.push("/results");
  }, [extractedData, router]);

  // Cycle through generating messages
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setGeneratingMessageIndex((prev) => (prev + 1) % 10);
      }, 3000);
      return () => clearInterval(interval);
    } else {
      setGeneratingMessageIndex(0);
    }
  }, [isGenerating]);

  // Progress bar animation
  useEffect(() => {
    if (isGenerating) {
      setGeneratingProgress(5);
      const startTime = Date.now();

      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        let progress;
        
        if (elapsed < 10000) {
          progress = 5 + (elapsed / 10000) * 45;
        } else if (elapsed < 30000) {
          progress = 50 + ((elapsed - 10000) / 20000) * 35;
        } else {
          progress = 85 + Math.min(((elapsed - 30000) / 60000) * 10, 10);
        }

        setGeneratingProgress(Math.min(progress, 95));
      }, 200);

      return () => clearInterval(timer);
    } else {
      setGeneratingProgress((prev) => {
        if (prev > 0 && prev < 100) {
          return 100;
        }
        return prev;
      });
    }
  }, [isGenerating]);

  // Load existing data from storage
  useEffect(() => {
    const loadExistingData = () => {
      const sessionData = sessionStorage.getItem("formData");
      if (sessionData) {
        try {
          const parsed = JSON.parse(sessionData);
          const newExtractedData: ExtractedData = {
            roleTitle: parsed.roleTitle || "",
            department: parsed.department || "",
            experienceLevel: parsed.experienceLevel || "",
            location: parsed.location || "",
            workModel: parsed.workModel || "",
            criticalSkills: (Array.isArray(parsed.criticalSkills) && parsed.criticalSkills.length > 0) ? parsed.criticalSkills : [],
            minSalary: parsed.minSalary || "",
            maxSalary: parsed.maxSalary || "",
            nonNegotiables: parsed.nonNegotiables || "",
            flexible: parsed.flexible || "",
            timeline: parsed.timeline || "",
            company: parsed.company || "",
          };
          setExtractedData(newExtractedData);
          
          const filledCount = countFilledFields(newExtractedData);
          if (filledCount > 0) {
            setShowURLInput(false);
          }
        } catch (err) {
          console.error("Failed to load session data:", err);
        }
      }
      
      setDataLoaded(true);
    };

    loadExistingData();
  }, [countFilledFields, setExtractedData]);

  // Initial greeting
  useEffect(() => {
    if (!dataLoaded || greetingAdded.current) return;
    
    greetingAdded.current = true;
    setTimeout(() => {
      const filledCount = countFilledFields(extractedData);
      
      let greeting = "Hey there! 👋 I'm your AI hiring assistant. I'm here to help you create a perfect HireCard strategy.\n\n";
      
      if (filledCount === 0) {
        greeting += "Let's build your HireCard from scratch. I'll guide you through the process with a few quick questions.\n\nWhat role are you looking to hire for?";
      } else if (filledCount < totalFields) {
        greeting += `Good start! ${filledCount}/${totalFields} fields done. Let's knock out the rest.\n\nWhat's the next piece of information you can provide?`;
      } else {
        greeting += "Wow! I can see all your information is already filled in. Perfect! 🎉\n\nLet me generate your HireCard strategy now!";
        setTimeout(() => {
          handleComplete();
        }, 2000);
      }
      
      addAssistantMessage(greeting);
    }, 500);
  }, [dataLoaded, extractedData, countFilledFields, totalFields, addAssistantMessage, handleComplete]);

  // Focus input
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  }, [isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim() || isLoading) return;

    const userMessage = currentInput.trim();
    setCurrentInput("");
    clearError();

    // Check if URL
    const urlPattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    const isURL = urlPattern.test(userMessage);

    if (isURL) {
      addUserMessage(userMessage);
      setIsGenerating(true);
      
      const result = await scrapeJobURL(userMessage);
      setIsGenerating(false);

      if (result.success && result.data) {
        // Update extracted data
        updateExtractedData(result.data);
        
        // Save to sessionStorage
        const formData = {
          ...extractedData,
          ...result.data,
        };
        sessionStorage.setItem("formData", JSON.stringify(formData));

        setShowURLInput(false);
        addAssistantMessage("Great! I've extracted the job details. Let me know if you need to add or change anything.");
      } else {
        addAssistantMessage("Hmm, couldn't extract data from that URL. Try sharing the job details directly?");
      }
    } else {
      // Handle regular message
      addUserMessage(userMessage);
      const result = await sendChatMessage(userMessage);

      if (result?.success) {
        // Check for completion phrases
        const completionPhrases = [
          "i have everything",
          "generate your hirecard",
          "generating your hirecard",
        ];
        
        const messageLower = result.message.toLowerCase();
        const isComplete = completionPhrases.some(phrase => messageLower.includes(phrase));
        
        if (isComplete) {
          setTimeout(() => {
            handleComplete();
          }, 2000);
        }
      }
    }
  };

  const handleURLDataExtracted = (data: any) => {
    updateExtractedData(data);
    setShowURLInput(false);
    
    // Save to sessionStorage
    const formData = {
      ...extractedData,
      ...data,
    };
    sessionStorage.setItem("formData", JSON.stringify(formData));

    setTimeout(() => {
      const filledCount = countFilledFields({ ...extractedData, ...data });
      let greeting = "";
      
      if (filledCount === 0) {
        greeting = "That URL didn't contain job posting data. Let's start fresh - what role are you hiring for?";
      } else if (filledCount < totalFields) {
        greeting = `Pulled ${filledCount}/${totalFields} fields. What else can you tell me about this role?`;
      } else {
        greeting = "Perfect! I have everything I need. Generating your HireCard...";
        setTimeout(() => {
          handleComplete();
        }, 2000);
      }
      
      addAssistantMessage(greeting);
    }, 500);
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Generating Loading Screen */}
      {isGenerating && (
        <GeneratingLoadingScreen 
          progress={generatingProgress} 
          messageIndex={generatingMessageIndex} 
        />
      )}

      <div className="bg-white overflow-hidden flex flex-col flex-1 min-h-0">
        {/* Chat Header */}
        <ChatHeader completeness={completeness} />

        {/* Messages Container */}
        <Conversation className="flex-1 min-h-0">
          <ConversationContent>
            {messages.length === 0 ? (
              <ConversationEmptyState
                title="Start a conversation"
                description="I'll help you create the perfect HireCard strategy"
              />
            ) : (
              messages.map((message) => (
                <MessageComponent
                  key={message.id}
                  role={message.role}
                  timestamp={message.timestamp.toISOString()}
                >
                  <MessageContent>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setCurrentInput(suggestion);
                              inputRef.current?.focus();
                            }}
                            className="px-3 py-1.5 text-sm bg-[#d7f4f2] text-[#102a63] rounded-full hover:bg-[#278f8c] hover:text-white transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </MessageContent>
                </MessageComponent>
              ))
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        {/* URL Input Section */}
        {showURLInput && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <JobURLInput onDataExtracted={handleURLDataExtracted} />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="px-6 py-2 bg-red-50 border-t border-red-200 flex items-center gap-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-6 border-t border-gray-200 bg-white">
          <div className="flex items-end gap-3">
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="Type your message or paste a job URL..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#278f8c] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={isLoading || !currentInput.trim()}
              className="px-6 py-3 bg-[#278f8c] text-white rounded-lg hover:bg-[#1f7673] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
