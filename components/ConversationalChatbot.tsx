"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Loader2, 
  Send, 
  Bot,
  AlertCircle,
  MessageSquareIcon,
  Search,
  BarChart3,
  Globe,
  Briefcase,
  Crosshair,
  LineChart,
  Microscope,
  Shield,
  GraduationCap,
  Star,
  Sparkles
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
  const [error, setError] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showURLInput, setShowURLInput] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingMessageIndex, setGeneratingMessageIndex] = useState(0);
  const [generatingProgress, setGeneratingProgress] = useState(0);
  
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
    { icon: Search, text: "Scanning 1,200+ trusted job market sources..." },
    {
      icon: BarChart3,
      text: "Analyzing real-time salary data from verified databases...",
    },
    {
      icon: Globe,
      text: "Cross-referencing international market standards...",
    },
    {
      icon: Briefcase,
      text: "Comparing with similar roles across 50+ industries...",
    },
    {
      icon: Crosshair,
      text: "Evaluating skill requirements against market demand...",
    },
    {
      icon: LineChart,
      text: "Processing compensation trends from top companies...",
    },
    {
      icon: Microscope,
      text: "Running deep analysis on job description clarity...",
    },
    { icon: Shield, text: "Validating data accuracy from multiple sources..." },
    {
      icon: GraduationCap,
      text: "Matching requirements with industry certifications...",
    },
    { icon: Star, text: "Calculating your competitive positioning score..." },
  ];

  // Cycle through generating messages
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setGeneratingMessageIndex((prev) => (prev + 1) % generatingMessages.length);
      }, 3000);
      return () => clearInterval(interval);
    } else {
      setGeneratingMessageIndex(0);
    }
  }, [isGenerating, generatingMessages.length]);

  // Define handleComplete with useCallback
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
      // Map to API expected format
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

  // Progress bar animation - synced with actual generation
  useEffect(() => {
    if (isGenerating) {
      setGeneratingProgress(5); // Start at 5% immediately
      const startTime = Date.now();

      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;

        // Progress curve: fast at start, slower towards end
        // 0-10s: reach 50%
        // 10-30s: reach 85%
        // 30s+: slowly approach 95%
        let progress;
        if (elapsed < 10000) {
          // First 10 seconds: 5% -> 50%
          progress = 5 + (elapsed / 10000) * 45;
        } else if (elapsed < 30000) {
          // 10-30 seconds: 50% -> 85%
          progress = 50 + ((elapsed - 10000) / 20000) * 35;
        } else {
          // After 30s: slowly approach 95%
          progress = 85 + Math.min(((elapsed - 30000) / 60000) * 10, 10);
        }

        setGeneratingProgress(Math.min(progress, 95));
      }, 200); // Update every 200ms

      return () => clearInterval(timer);
    } else {
      // When generation completes, set to 100%
      setGeneratingProgress((prev) => {
        if (prev > 0 && prev < 100) {
          return 100;
        }
        return prev;
      });
    }
  }, [isGenerating]);

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
          // Some data exists - acknowledge it and list what's missing
          greeting += `Good start! ${filledCount}/${TOTAL_FIELDS} fields done. Let's knock out the rest.\n\n`;
          
          // Ask about the first missing field directly
          if (!extractedData.roleTitle) {
            greeting += "What role are you hiring for?";
          } else if (!extractedData.department) {
            greeting += "What department?";
          } else if (!extractedData.criticalSkills || extractedData.criticalSkills.length === 0) {
            greeting += "What critical skills must they have?";
          } else if (!extractedData.experienceLevel) {
            greeting += "Experience level?";
            suggestions = ["Entry Level", "Mid-Level", "Senior", "Lead/Principal"];
          } else if (!extractedData.nonNegotiables) {
            greeting += "What are your non-negotiables?";
          } else if (!extractedData.minSalary || !extractedData.maxSalary) {
            greeting += "Salary range? (Min and max)";
          } else if (!extractedData.location) {
            greeting += "Where's this position located?";
            suggestions = ["Remote", "New York, NY", "San Francisco, CA", "London, UK"];
          } else if (!extractedData.workModel) {
            greeting += "Remote, hybrid, or on-site?";
            suggestions = ["Remote", "Hybrid", "On-site"];
          } else if (!extractedData.timeline) {
            greeting += "Timeline to fill this role?";
            suggestions = ["Urgent (1-2 weeks)", "Standard (1 month)", "Flexible (2-3 months)"];
          } else if (!extractedData.flexible) {
            greeting += "Any nice-to-have skills?";
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

    // Check if the input is a URL
    const urlPattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    const isURL = urlPattern.test(userMessage);

    if (isURL) {
      // Handle URL - Show generating screen and process
      addUserMessage(userMessage);
      setIsGenerating(true); // Show the full loading screen
      
      try {
        const response = await fetch("/api/scrape-job", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: userMessage }),
        });

        const result = await response.json();

        if (result.success && result.data) {
          // Update extracted data with scraped information
          const updatedData: Partial<ExtractedData> = {};

          if (result.data.roleTitle) updatedData.roleTitle = result.data.roleTitle;
          if (result.data.department) updatedData.department = result.data.department;
          if (result.data.experienceLevel) updatedData.experienceLevel = result.data.experienceLevel;
          if (result.data.location) updatedData.location = result.data.location;
          if (result.data.workModel) updatedData.workModel = result.data.workModel;
          if (result.data.criticalSkills) {
            if (Array.isArray(result.data.criticalSkills)) {
              updatedData.criticalSkills = result.data.criticalSkills;
            } else if (typeof result.data.criticalSkills === 'string') {
              updatedData.criticalSkills = result.data.criticalSkills.split(',').map((s: string) => s.trim()).filter((s: string) => s);
            }
          }
          if (result.data.minSalary) updatedData.minSalary = result.data.minSalary;
          if (result.data.maxSalary) updatedData.maxSalary = result.data.maxSalary;
          if (result.data.nonNegotiables) updatedData.nonNegotiables = result.data.nonNegotiables;
          if (result.data.flexible) updatedData.flexible = result.data.flexible;
          if (result.data.timeline) updatedData.timeline = result.data.timeline;

          const newExtractedData = { ...extractedData, ...updatedData };
          setExtractedData(newExtractedData);

          const filledCount = countFilledFields(newExtractedData);
          setCompleteness(Math.round((filledCount / TOTAL_FIELDS) * 100));

          // Save to sessionStorage
          const formData = {
            roleTitle: newExtractedData.roleTitle || "",
            department: newExtractedData.department || "",
            experienceLevel: newExtractedData.experienceLevel || "",
            location: newExtractedData.location || "",
            workModel: newExtractedData.workModel || "",
            criticalSkills: newExtractedData.criticalSkills || [],
            minSalary: newExtractedData.minSalary || "",
            maxSalary: newExtractedData.maxSalary || "",
            nonNegotiables: newExtractedData.nonNegotiables || "",
            flexible: newExtractedData.flexible || "",
            timeline: newExtractedData.timeline || "",
          };
          sessionStorage.setItem("formData", JSON.stringify(formData));

          setIsGenerating(false); // Hide loading screen

          // Provide feedback based on extraction results
          setTimeout(() => {
            let greeting = "";
            
            if (filledCount === 0) {
              greeting = "Aaaand... it's useless. 💀\n\nThat wasn't a job posting. That was a LinkedIn fever dream. Or maybe just Google's homepage.\n\nLet's try this again. Drop the actual role you're hiring for. Use words, not buzzwords.";
            } else if (filledCount < TOTAL_FIELDS) {
              greeting = `Pulled ${filledCount}/${TOTAL_FIELDS} fields. Could be worse.\n\n`;
              
              const missingFields: string[] = [];
              if (!newExtractedData.roleTitle) missingFields.push("Role Title");
              if (!newExtractedData.department) missingFields.push("Department");
              if (!newExtractedData.experienceLevel) missingFields.push("Experience Level");
              if (!newExtractedData.location) missingFields.push("Location");
              if (!newExtractedData.workModel) missingFields.push("Work Model");
              if (!newExtractedData.criticalSkills || newExtractedData.criticalSkills.length === 0) missingFields.push("Critical Skills");
              if (!newExtractedData.minSalary || !newExtractedData.maxSalary) missingFields.push("Salary Range");
              if (!newExtractedData.nonNegotiables) missingFields.push("Non-Negotiables");
              if (!newExtractedData.timeline) missingFields.push("Timeline");
              if (!newExtractedData.flexible) missingFields.push("Nice-to-Have Skills");
              
              greeting += `Still missing: ${missingFields.join(", ")}.\n\n`;
              greeting += "Time to fill the gaps. No excuses.";
              
              if (!newExtractedData.roleTitle) {
                greeting += "\n\nJob title? And if you're about to type 'Rockstar Ninja,' save us both the pain and don't.";
              } else if (!newExtractedData.department) {
                greeting += "\n\nDepartment? Engineering? Marketing? Or is this one of those 'cross-functional vibes-only' roles?";
              } else if (!newExtractedData.criticalSkills || newExtractedData.criticalSkills.length === 0) {
                greeting += "\n\nMust-have skills? Not the fantasy wishlist. The actual deal-breakers.";
              } else if (!newExtractedData.experienceLevel) {
                greeting += "\n\nExperience level? Entry, mid, senior? Or the illegal combo: '10 years experience, entry-level pay'?";
              } else if (!newExtractedData.nonNegotiables) {
                greeting += "\n\nNon-negotiables? The stuff that's an instant reject. No fluffy HR speak.";
              } else if (!newExtractedData.minSalary || !newExtractedData.maxSalary) {
                greeting += "\n\nTime to talk numbers. What's your salary range? Min and max, please.";
              } else if (!newExtractedData.location) {
                greeting += "\n\nLocation? Actual city, or are we doing the 2025 thing and going full remote?";
              } else if (!newExtractedData.workModel) {
                greeting += "\n\nRemote, hybrid, or office? Choose wisely. Office-only mandates are basically self-sabotage at this point.";
              } else if (!newExtractedData.timeline) {
                greeting += "\n\nHow fast do you need this filled? ASAP? Normal pace? Or 'we'll know it when we see it' mode?";
              } else if (!newExtractedData.flexible) {
                greeting += "\n\nNice-to-haves? The bonus skills that won't torpedo the hire if missing.";
              }
            } else {
              greeting = "Okay, that URL was actually legit. Shocked. Pleasantly. 🎯\n\nAlright, let's roast this thing. Generating your HireCard...";
              setTimeout(() => {
                handleComplete();
              }, 2000);
            }
            
            addAssistantMessage(greeting);
          }, 500);
        } else {
          setIsGenerating(false);
          addAssistantMessage("Hmm, couldn't extract data from that URL. Either it's not a job posting, or the site is blocking us. Try copy-pasting the job description text instead?");
        }
      } catch (err) {
        console.error("URL scraping error:", err);
        setIsGenerating(false);
        addAssistantMessage("Failed to process that URL. Try sharing the job details directly instead?");
      }
    } else {
      // Handle regular text message
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
          const completionPhrases = [
            "i have everything",
            "generate your hirecard",
            "*generate* your hirecard",
            "generating your hirecard",
            "you actually finished",
            "alright, you actually finished",
            "let me roast"
          ];
          
          const messageLower = chatResult.message.toLowerCase();
          const isComplete = completionPhrases.some(phrase => messageLower.includes(phrase));
          
          if (isComplete) {
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
    const filledCount = countFilledFields(newExtractedData);
    setCompleteness(Math.round((filledCount / TOTAL_FIELDS) * 100));

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
      
      let greeting = "";
      
      // Check if this was an irrelevant URL (0 fields extracted)
      if (filledCount === 0) {
        greeting = "Aaaand... it's useless. 💀\n\nThat wasn't a job posting. That was a LinkedIn fever dream. Or maybe just Google's homepage.\n\nLet's try this again. Drop the actual role you're hiring for. Use words, not buzzwords.";
      } else if (filledCount < TOTAL_FIELDS) {
        greeting = `Pulled ${filledCount}/${TOTAL_FIELDS} fields. Could be worse.\n\n`;
        
        // Build list of missing fields
        const missingFields: string[] = [];
        if (!newExtractedData.roleTitle) missingFields.push("Role Title");
        if (!newExtractedData.department) missingFields.push("Department");
        if (!newExtractedData.experienceLevel) missingFields.push("Experience Level");
        if (!newExtractedData.location) missingFields.push("Location");
        if (!newExtractedData.workModel) missingFields.push("Work Model");
        if (!newExtractedData.criticalSkills || newExtractedData.criticalSkills.length === 0) missingFields.push("Critical Skills");
        if (!newExtractedData.minSalary || !newExtractedData.maxSalary) missingFields.push("Salary Range");
        if (!newExtractedData.nonNegotiables) missingFields.push("Non-Negotiables");
        if (!newExtractedData.timeline) missingFields.push("Timeline");
        if (!newExtractedData.flexible) missingFields.push("Nice-to-Have Skills");
        
        greeting += `Still missing: ${missingFields.join(", ")}.\n\n`;
        greeting += "Time to fill the gaps. No excuses.";
        
        // Intelligently ask about the first missing field with maximum sass
        if (!newExtractedData.roleTitle) {
          greeting += "\n\nJob title? And if you're about to type 'Rockstar Ninja,' save us both the pain and don't.";
        } else if (!newExtractedData.department) {
          greeting += "\n\nDepartment? Engineering? Marketing? Or is this one of those 'cross-functional vibes-only' roles?";
        } else if (!newExtractedData.criticalSkills || newExtractedData.criticalSkills.length === 0) {
          greeting += "\n\nMust-have skills? Not the fantasy wishlist. The actual deal-breakers.";
        } else if (!newExtractedData.experienceLevel) {
          greeting += "\n\nExperience level? Entry, mid, senior? Or the illegal combo: '10 years experience, entry-level pay'?";
        } else if (!newExtractedData.nonNegotiables) {
          greeting += "\n\nNon-negotiables? The stuff that's an instant reject. No fluffy HR speak.";
        } else if (!newExtractedData.minSalary || !newExtractedData.maxSalary) {
          greeting += "\n\nTime to talk numbers. What's your salary range? Min and max, please.";
        } else if (!newExtractedData.location) {
          greeting += "\n\nLocation? Actual city, or are we doing the 2025 thing and going full remote?";
        } else if (!newExtractedData.workModel) {
          greeting += "\n\nRemote, hybrid, or office? Choose wisely. Office-only mandates are basically self-sabotage at this point.";
        } else if (!newExtractedData.timeline) {
          greeting += "\n\nHow fast do you need this filled? ASAP? Normal pace? Or 'we'll know it when we see it' mode?";
        } else if (!newExtractedData.flexible) {
          greeting += "\n\nNice-to-haves? The bonus skills that won't torpedo the hire if missing.";
        }
      } else {
        greeting = "Okay, that URL was actually legit. Shocked. Pleasantly. 🎯\n\nAlright, let's roast this thing. Generating your HireCard...";
        setTimeout(() => {
          handleComplete();
        }, 2000);
      }
      
      addAssistantMessage(greeting);
    }, 500);
  };

  const filledFieldsCount = countFilledFields(extractedData);

  return (
    <div className="flex flex-col h-full relative">
      {/* Generating Loading Screen */}
      {isGenerating && (
        <div 
          className="absolute inset-0 z-50 flex items-center justify-center overflow-y-auto"
          style={{ backgroundColor: "#f5f5f5" }}
        >
          {/* Prevent body scrolling but allow dialog scrolling */}
          <style jsx global>{`
            body {
              overflow: hidden !important;
            }
            @keyframes shimmer {
              0% {
                transform: translateX(-100%);
              }
              100% {
                transform: translateX(100%);
              }
            }
          `}</style>

          <div className="max-w-xl mx-auto px-4 text-center py-8 w-full">
            {/* Main Heading */}
            <div className="mb-3">
              <h2
                className="text-2xl md:text-3xl font-bold mb-1"
                style={{ color: "#102a63" }}
              >
                KEEP THIS PAGE OPEN
              </h2>
              <p
                className="text-base md:text-lg"
                style={{ color: "#102a63", opacity: 0.8 }}
              >
                Keep this page open to see your personalized hiring analysis!
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-3 w-full max-w-md mx-auto">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles
                    className="w-5 h-5 animate-pulse"
                    style={{ color: "#278f8c" }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#102a63" }}
                  >
                    Analyzing...
                  </span>
                </div>
                <span
                  className="text-lg font-bold"
                  style={{ color: "#278f8c" }}
                >
                  {Math.round(generatingProgress)}%
                </span>
              </div>
              {/* Progress bar container */}
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full rounded-full relative transition-all duration-300 ease-out"
                  style={{
                    width: `${generatingProgress}%`,
                    backgroundColor: "#278f8c",
                  }}
                >
                  {/* Shimmer effect */}
                  <div
                    className="absolute inset-0 opacity-50"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
                      animation: "shimmer 2s infinite",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Time Estimate */}
            <div className="mb-3 space-y-1">
              <div
                className="inline-block px-3 py-1.5 rounded-full border-2 shadow-sm"
                style={{
                  backgroundColor: "#d7f4f2",
                  borderColor: "#278f8c",
                }}
              >
                <p
                  className="text-sm font-semibold"
                  style={{ color: "#102a63" }}
                >
                  Initial generation takes 30–45 seconds
                </p>
              </div>
              <p
                className="text-sm"
                style={{ color: "#102a63", opacity: 0.7 }}
              >
                This is completely normal. We&apos;re doing deep market
                research for you
              </p>
            </div>

            {/* Status Messages */}
            <div className="mb-3">
              <p
                className="text-base md:text-lg font-medium mb-2"
                style={{ color: "#102a63" }}
              >
                We&apos;re analyzing opportunities for you
              </p>

              {/* Progress Steps */}
              <div className="flex items-center justify-center space-x-1.5 text-sm mb-3">
                <span
                  className="font-medium animate-pulse"
                  style={{ color: "#278f8c" }}
                >
                  Starting
                </span>
                <span style={{ color: "#102a63", opacity: 0.4 }}>
                  →
                </span>
                <span
                  className="font-medium animate-pulse"
                  style={{ color: "#278f8c", animationDelay: "0.5s" }}
                >
                  Searching
                </span>
                <span style={{ color: "#102a63", opacity: 0.4 }}>
                  →
                </span>
                <span
                  className="font-medium animate-pulse"
                  style={{ color: "#278f8c", animationDelay: "1s" }}
                >
                  Analyzing
                </span>
                <span style={{ color: "#102a63", opacity: 0.4 }}>
                  →
                </span>
                <span
                  className="font-medium animate-pulse"
                  style={{ color: "#278f8c", animationDelay: "1.5s" }}
                >
                  Complete
                </span>
              </div>

              {/* Rotating Trust Messages */}
              <div
                key={generatingMessageIndex}
                className="min-h-[45px] flex items-center justify-center px-2"
              >
                <div
                  className="px-3 py-2 rounded-lg bg-white shadow-md border flex items-center space-x-2 max-w-full"
                  style={{ borderColor: "#d7f4f2" }}
                >
                  {(() => {
                    const IconComponent =
                      generatingMessages[generatingMessageIndex].icon;
                    return (
                      <IconComponent
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: "#278f8c" }}
                      />
                    );
                  })()}
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#278f8c" }}
                  >
                    {generatingMessages[generatingMessageIndex].text}
                  </p>
                </div>
              </div>
            </div>

            {/* Inspiration Section */}
            <div
              className="mt-4 p-3 rounded-lg bg-white shadow-md border-2"
              style={{ borderColor: "#d7f4f2" }}
            >
              <p
                className="text-sm font-semibold mb-1"
                style={{ color: "#278f8c" }}
              >
                Hiring Wisdom
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#102a63", opacity: 0.8 }}
              >
                While we work, remember: The best hires aren&apos;t
                always the ones with the most experience, they&apos;re
                the ones who understand your mission and bring the
                energy to execute it.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Debug Data Viewer - Hidden in modal */}
      {/* <DebugDataViewer storageKey="formData" title="Debug: Chat Data" /> */}

      <div className="bg-white overflow-hidden flex flex-col flex-1 min-h-0">
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
            <div className="flex flex-col items-end">
              <div className="text-xs text-white/80 mb-1">Progress</div>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${completeness}%` }}
                  />
                </div>
                <span className="text-sm font-semibold">{completeness}%</span>
              </div>
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
              placeholder="Type your message or paste a job URL..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#278f8c] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed h-12"
              style={{ minHeight: "48px", maxHeight: "48px" }}
            />
            <button
              type="submit"
              disabled={!currentInput.trim() || isLoading}
              className="w-12 h-12 bg-[#278f8c] hover:bg-[#1f6f6c] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0 rounded-full relative transition-all duration-200 shadow-lg hover:shadow-xl"
              style={{ padding: 0 }}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-white relative z-10" />
              ) : (
                <Send className="w-5 h-5 text-white relative z-10" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
