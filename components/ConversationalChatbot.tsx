"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Loader2, 
  Send, 
  Bot,
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
import JobURLInput from "./JobURLInput";
import DebugDataViewer from "./DebugDataViewer";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface ExtractedData {
  roleTitle: string | null;
  department: string | null;
  experienceLevel: string | null;
  location: string | null;
  workModel: string | null;
  criticalSkills: string[] | null;
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
    department: null,
    experienceLevel: null,
    location: null,
    workModel: null,
    criticalSkills: null,
    minSalary: null,
    maxSalary: null,
    nonNegotiables: null,
    flexible: null,
    timeline: null,
  });
  const [completeness, setCompleteness] = useState(0);
  const [conversationComplete, setConversationComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showURLInput, setShowURLInput] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingMessageIndex, setGeneratingMessageIndex] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const conversationMessages = useRef<Array<{ role: string; content: string }>>([]);
  const greetingAdded = useRef(false);

  // Helper function to count filled fields (treat salary range as one field)
  const countFilledFields = (data: ExtractedData): number => {
    let count = 0;
    
    // Individual fields
    if (data.roleTitle) count++;
    if (data.department) count++;
    if (data.experienceLevel) count++;
    if (data.location) count++;
    if (data.workModel) count++;
    if (data.criticalSkills && data.criticalSkills.length > 0) count++;
    if (data.nonNegotiables) count++;
    if (data.flexible) count++;
    if (data.timeline) count++;
    
    // Salary range as ONE field (both min and max needed)
    if (data.minSalary && data.maxSalary) count++;
    
    return count;
  };

  // Total fields = 10 (salary range counts as 1)
  const TOTAL_FIELDS = 10;

  const generatingMessages = [
    "🎯 Analyzing your role requirements...",
    "💼 Scanning market data for similar positions...",
    "📊 Calculating competitive salary ranges...",
    "🔍 Identifying key skill gaps in the market...",
    "🌐 Cross-referencing with global hiring trends...",
    "✨ Crafting your personalized HireCard strategy...",
    "🎨 Generating battle cards and insights...",
    "🚀 Finalizing your hiring roadmap..."
  ];

  // Cycle through generating messages
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setGeneratingMessageIndex((prev) => (prev + 1) % generatingMessages.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isGenerating, generatingMessages.length]);

  // Load any pre-existing data from storage on mount
  useEffect(() => {
    const loadExistingData = () => {
      // Check sessionStorage first (from form mode or previous session)
      const sessionData = sessionStorage.getItem("formData");
      if (sessionData) {
        try {
          const parsed = JSON.parse(sessionData);
          const newExtractedData: ExtractedData = {
            roleTitle: parsed.roleTitle || null,
            department: parsed.department || null,
            experienceLevel: parsed.experienceLevel || null,
            location: parsed.location || null,
            workModel: parsed.workModel || null,
            criticalSkills: (Array.isArray(parsed.criticalSkills) && parsed.criticalSkills.length > 0) ? parsed.criticalSkills : null,
            minSalary: parsed.minSalary || null,
            maxSalary: parsed.maxSalary || null,
            nonNegotiables: parsed.nonNegotiables || null,
            flexible: parsed.flexible || null,
            timeline: parsed.timeline || null,
          };
          setExtractedData(newExtractedData);
          
          // Calculate completeness
          const filledCount = countFilledFields(newExtractedData);
          setCompleteness(Math.round((filledCount / TOTAL_FIELDS) * 100));
          
          // Hide URL input if data already exists
          if (filledCount > 0) {
            setShowURLInput(false);
            console.log("✅ Loaded existing data, hiding URL input. Fields:", filledCount);
          }
        } catch (err) {
          console.error("Failed to load session data:", err);
        }
      }
      
      setDataLoaded(true);
    };

    loadExistingData();
  }, []);

  // Initial greeting - Smart and context-aware
  useEffect(() => {
    // Wait for data to be loaded first
    if (!dataLoaded) return;
    
    // Only add greeting once (unless manually reset by URL extraction)
    if (!greetingAdded.current) {
      greetingAdded.current = true;
      setTimeout(() => {
        // Check what data is already available
        const filledCount = countFilledFields(extractedData);
        
        let greeting = "Hey there! 👋 I'm your AI hiring assistant. I'm here to help you create a perfect HireCard strategy.\n\n";
        let suggestions: string[] | undefined = undefined;
        
        if (filledCount === 0) {
          // No data yet - ask for the role (could be from irrelevant URL or fresh start)
          greeting += "Let's build your HireCard from scratch. I'll guide you through the process with a few quick questions.\n\nWhat role are you looking to hire for?";
        } else if (filledCount < TOTAL_FIELDS) {
          // Some data exists - acknowledge it and ask about what's missing
          greeting += `I've collected the following information so far:\n\n`;
          
          // List what we have
          let collectedInfo: string[] = [];
          if (extractedData.roleTitle) collectedInfo.push(`✓ Role Title: ${extractedData.roleTitle}`);
          if (extractedData.department) collectedInfo.push(`✓ Department: ${extractedData.department}`);
          if (extractedData.experienceLevel) collectedInfo.push(`✓ Experience Level: ${extractedData.experienceLevel}`);
          if (extractedData.location) collectedInfo.push(`✓ Location: ${extractedData.location}`);
          if (extractedData.workModel) collectedInfo.push(`✓ Work Model: ${extractedData.workModel}`);
          if (extractedData.criticalSkills && extractedData.criticalSkills.length > 0) {
            collectedInfo.push(`✓ Critical Skills: ${Array.isArray(extractedData.criticalSkills) ? extractedData.criticalSkills.join(", ") : extractedData.criticalSkills}`);
          }
          if (extractedData.minSalary && extractedData.maxSalary) collectedInfo.push(`✓ Salary Range: ${extractedData.minSalary} - ${extractedData.maxSalary}`);
          if (extractedData.nonNegotiables) collectedInfo.push(`✓ Non-Negotiables: ${extractedData.nonNegotiables}`);
          if (extractedData.timeline) collectedInfo.push(`✓ Timeline: ${extractedData.timeline}`);
          if (extractedData.flexible) collectedInfo.push(`✓ Nice-to-Haves: ${extractedData.flexible}`);
          
          greeting += collectedInfo.join("\n") + `\n\n**Progress: ${filledCount}/${TOTAL_FIELDS} fields complete** 🎉\n\nLet me ask you about the remaining details to complete your HireCard strategy.`;
          
          // Intelligently ask about the first missing field
          if (!extractedData.roleTitle) {
            greeting += "\n\nFirst, what role are you hiring for?";
          } else if (!extractedData.department) {
            greeting += "\n\nWhat department is this role for?";
          } else if (!extractedData.criticalSkills || extractedData.criticalSkills.length === 0) {
            greeting += "\n\nWhat are the critical technical skills this person must have?";
          } else if (!extractedData.experienceLevel) {
            greeting += "\n\nWhat experience level are you looking for?";
          } else if (!extractedData.nonNegotiables) {
            greeting += "\n\nWhat are the must-have requirements for this role?";
          } else if (!extractedData.minSalary || !extractedData.maxSalary) {
            greeting += "\n\nWhat's your salary range for this position?";
          } else if (!extractedData.location) {
            greeting += "\n\nWhere is this position located?";
            suggestions = ["Remote", "New York, NY", "San Francisco, CA", "London, UK"];
          } else if (!extractedData.workModel) {
            greeting += "\n\nIs this role remote, hybrid, or on-site?";
            suggestions = ["Remote", "Hybrid", "On-site"];
          } else if (!extractedData.timeline) {
            greeting += "\n\nWhat's your timeline for filling this position?";
            suggestions = ["Urgent (1-2 weeks)", "Standard (1 month)", "Flexible (2-3 months)"];
          } else if (!extractedData.flexible) {
            greeting += "\n\nAny nice-to-have skills or flexible requirements?";
          }
        } else {
          // All data is filled!
          greeting += "Wow! I can see all your information is already filled in. Perfect! 🎉\n\nLet me generate your HireCard strategy now!";
          setTimeout(() => {
            handleComplete();
          }, 2000);
        }
        
        addAssistantMessage(greeting, suggestions);
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataLoaded, extractedData]);


  // Focus input without scrolling
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  }, [isLoading]);

  const addAssistantMessage = (content: string, suggestions?: string[]) => {
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
        suggestions,
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
          currentData: extractedData, // Pass current data to prevent resets
        }),
      });

      const result = await response.json();

      if (result.success) {
        // IMPORTANT: Merge with existing data, never overwrite with null/empty
        setExtractedData(prevData => {
          const mergedData = { ...prevData };
          
          // Only update fields that have new non-empty values
          Object.keys(result.data).forEach((key) => {
            const newValue = result.data[key];
            const existingValue = prevData[key as keyof ExtractedData];
            
            // Only update if new value is not null/empty
            if (newValue !== null && newValue !== "" && newValue !== undefined) {
              if (Array.isArray(newValue) && newValue.length > 0) {
                // For arrays (like criticalSkills), merge and deduplicate
                if (Array.isArray(existingValue)) {
                  mergedData[key as keyof ExtractedData] = [...new Set([...existingValue, ...newValue])] as any;
                } else {
                  mergedData[key as keyof ExtractedData] = newValue as any;
                }
              } else if (!Array.isArray(newValue)) {
                // For non-arrays, only update if we don't have a value yet
                if (!existingValue) {
                  mergedData[key as keyof ExtractedData] = newValue as any;
                }
              }
            }
          });
          
          return mergedData;
        });
        
        // Recalculate completeness based on merged data
        setCompleteness(prevCompleteness => {
          const newFilledCount = countFilledFields(extractedData);
          const newCompleteness = Math.round((newFilledCount / TOTAL_FIELDS) * 100);
          // Only update if completeness increased, never decrease
          return Math.max(prevCompleteness, newCompleteness);
        });
        
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
            // For criticalSkills array, merge with existing
            if (key === "criticalSkills" && Array.isArray(extractionResult.extracted[key])) {
              const existingSkills = updatedExtractedData.criticalSkills || [];
              const newSkills = extractionResult.extracted[key];
              // Merge and deduplicate
              updatedExtractedData.criticalSkills = [...new Set([...existingSkills, ...newSkills])];
            } else {
              (updatedExtractedData as any)[key] = extractionResult.extracted[key];
            }
          }
        });

        // Update state
        setExtractedData(updatedExtractedData);

        // Update completeness
        const newFilledCount = countFilledFields(updatedExtractedData);
        setCompleteness(Math.round((newFilledCount / TOTAL_FIELDS) * 100));
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

        // Save updated data to sessionStorage to prevent any resets
        const formData = {
          roleTitle: updatedExtractedData.roleTitle || "",
          department: updatedExtractedData.department || "",
          experienceLevel: updatedExtractedData.experienceLevel || "",
          location: updatedExtractedData.location || "",
          workModel: updatedExtractedData.workModel || "",
          criticalSkills: updatedExtractedData.criticalSkills || [],
          minSalary: updatedExtractedData.minSalary || "",
          maxSalary: updatedExtractedData.maxSalary || "",
          nonNegotiables: updatedExtractedData.nonNegotiables || "",
          flexible: updatedExtractedData.flexible || "",
          timeline: updatedExtractedData.timeline || "",
        };
        sessionStorage.setItem("formData", JSON.stringify(formData));
        console.log("✅ Updated sessionStorage after user input:", formData);

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

  const handleURLDataExtracted = (data: any) => {
    // Update extracted data with scraped information
    const updatedData: Partial<ExtractedData> = {};

    if (data.roleTitle) updatedData.roleTitle = data.roleTitle;
    if (data.department) updatedData.department = data.department;
    if (data.experienceLevel) updatedData.experienceLevel = data.experienceLevel;
    if (data.location) updatedData.location = data.location;
    if (data.workModel) updatedData.workModel = data.workModel;
    if (data.criticalSkills) {
      // Handle both array and string formats
      if (Array.isArray(data.criticalSkills)) {
        updatedData.criticalSkills = data.criticalSkills;
      } else if (typeof data.criticalSkills === 'string') {
        updatedData.criticalSkills = data.criticalSkills.split(',').map((s: string) => s.trim()).filter((s: string) => s);
      }
    } else if (data.criticalSkill) {
      // Fallback for old format
      updatedData.criticalSkills = [data.criticalSkill];
    }
    if (data.minSalary) updatedData.minSalary = data.minSalary;
    if (data.maxSalary) updatedData.maxSalary = data.maxSalary;
    if (data.nonNegotiables) updatedData.nonNegotiables = data.nonNegotiables;
    if (data.flexible) updatedData.flexible = data.flexible;
    if (data.timeline) updatedData.timeline = data.timeline;

    // Create new extracted data by merging with existing
    const newExtractedData = { ...extractedData, ...updatedData };
    
    // Update state immediately
    setExtractedData(newExtractedData);

    // Update completeness
    const filledCount = Object.values(newExtractedData).filter(v => {
      if (Array.isArray(v)) return v.length > 0;
      return v !== null && v !== "";
    }).length;
    setCompleteness(Math.round((filledCount / 11) * 100));

    // Save to sessionStorage (clean structure, no duplicates)
    const formData = {
      roleTitle: newExtractedData.roleTitle || "",
      department: newExtractedData.department || "",
      experienceLevel: newExtractedData.experienceLevel || "",
      location: newExtractedData.location || "",
      workModel: newExtractedData.workModel || "",
      criticalSkills: newExtractedData.criticalSkills || [], // Array of skills (merged)
      minSalary: newExtractedData.minSalary || "",
      maxSalary: newExtractedData.maxSalary || "",
      nonNegotiables: newExtractedData.nonNegotiables || "", // Requirements (merged)
      flexible: newExtractedData.flexible || "",
      timeline: newExtractedData.timeline || "",
    };
    sessionStorage.setItem("formData", JSON.stringify(formData));
    console.log("✅ Chatbot saved to sessionStorage:", formData);

    // Hide URL input after successful extraction
    setShowURLInput(false);

    // Always trigger greeting after URL extraction
    setTimeout(() => {
      const filledCount = countFilledFields(newExtractedData);
      
      let greeting = "Great! I've extracted information from that job posting. 🎉\n\n";
      greeting += `I found ${filledCount}/${TOTAL_FIELDS} fields. `;
      
      if (filledCount < TOTAL_FIELDS) {
        greeting += "Let me ask you about the remaining details to complete your HireCard strategy.";
        
        // Intelligently ask about the first missing field
        if (!newExtractedData.roleTitle) {
          greeting += "\n\nFirst, what role are you hiring for?";
        } else if (!newExtractedData.department) {
          greeting += "\n\nWhat department is this role for?";
        } else if (!newExtractedData.criticalSkills || newExtractedData.criticalSkills.length === 0) {
          greeting += "\n\nWhat are the critical technical skills this person must have?";
        } else if (!newExtractedData.experienceLevel) {
          greeting += "\n\nWhat experience level are you looking for?";
        } else if (!newExtractedData.nonNegotiables) {
          greeting += "\n\nWhat are the must-have requirements for this role?";
        } else if (!newExtractedData.minSalary || !newExtractedData.maxSalary) {
          greeting += "\n\nWhat's your salary range for this position?";
        } else if (!newExtractedData.location) {
          greeting += "\n\nWhere is this position located?";
        } else if (!newExtractedData.workModel) {
          greeting += "\n\nIs this role remote, hybrid, or on-site?";
        } else if (!newExtractedData.timeline) {
          greeting += "\n\nWhat's your timeline for filling this position?";
        } else if (!newExtractedData.flexible) {
          greeting += "\n\nAny nice-to-have skills or flexible requirements?";
        }
      } else {
        greeting += "Perfect! I have everything I need. Let me generate your HireCard strategy now! 🎉";
        setTimeout(() => {
          handleComplete();
        }, 2000);
      }
      
      addAssistantMessage(greeting);
    }, 500);
  };

  const handleComplete = async () => {
    // Show generating screen
    setIsGenerating(true);

    // Prepare form data (clean structure)
    const formData = {
      roleTitle: extractedData.roleTitle || "",
      department: extractedData.department || "",
      experienceLevel: extractedData.experienceLevel || "",
      location: extractedData.location || "",
      workModel: extractedData.workModel || "",
      criticalSkills: extractedData.criticalSkills || [], // Array only (no criticalSkill string)
      minSalary: extractedData.minSalary || "",
      maxSalary: extractedData.maxSalary || "",
      nonNegotiables: extractedData.nonNegotiables || "", // Single field (no requirements duplicate)
      flexible: extractedData.flexible || "",
      timeline: extractedData.timeline || "",
    };

    // Save to sessionStorage
    sessionStorage.setItem("formData", JSON.stringify(formData));

    try {
      // Generate cards
      const response = await fetch("/api/generate-cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (result.success) {
        sessionStorage.setItem("battleCards", JSON.stringify(result.cards));
        sessionStorage.setItem("sessionId", result.sessionId);
      }
    } catch (error) {
      console.error("Error generating cards:", error);
    }

    // Always navigate to results after generation (success or fail)
    router.push("/results");
  };

  const filledFieldsCount = countFilledFields(extractedData);

  return (
    <div className="flex flex-col h-full relative">
      {/* Generating Loading Screen */}
      {isGenerating && (
        <div className="absolute inset-0 bg-white z-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-16 h-16 animate-spin mx-auto mb-6 text-[#278f8c]" />
            <h3 className="text-2xl font-bold text-[#102a63] mb-2">
              Generating Your HireCard Strategy
            </h3>
            <p className="text-lg text-gray-600 animate-pulse">
              {generatingMessages[generatingMessageIndex]}
            </p>
          </div>
        </div>
      )}

      {/* Debug Data Viewer - Hidden in modal */}
      {/* <DebugDataViewer storageKey="formData" title="Debug: Chat Data" /> */}
      
      {/* Job URL Input - Show at the beginning */}
      {showURLInput && (
        <div className="mb-4 flex-shrink-0">
          <JobURLInput onDataExtracted={handleURLDataExtracted} />
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col flex-1 min-h-0">
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
              <div className="text-lg font-bold">{filledFieldsCount}/{TOTAL_FIELDS}</div>
            </div>
          </div>
        </div>

        {/* Messages Container - Scrollable area */}
        <Conversation className="flex-1 min-h-0">
          <ConversationContent>
            {messages.length === 0 ? (
              <ConversationEmptyState
                description="Start chatting to create your HireCard strategy. I'll guide you through the process!"
                icon={<MessageSquareIcon className="size-8" />}
                title="Ready to start?"
              />
            ) : (
              <>
                {messages.map((message) => (
                  <div key={message.id}>
                    <Message from={message.role}>
                      <MessageContent isUser={message.role === "user"}>
                        {message.content}
                      </MessageContent>
                    </Message>
                    {/* Suggestion chips */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2 ml-11">
                        {message.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setCurrentInput(suggestion);
                              inputRef.current?.focus();
                            }}
                            className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-full hover:bg-[#278f8c] hover:text-white hover:border-[#278f8c] transition-colors duration-200"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
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
          <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#278f8c] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed h-12"
              style={{ minHeight: "48px", maxHeight: "48px" }}
            />
            <button
              type="submit"
              disabled={!currentInput.trim() || isLoading}
              className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 h-12 flex-shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
