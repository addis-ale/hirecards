"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
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
  Sparkles,
} from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  suggestions?: string[]
}

interface ExtractedData {
  roleTitle: string | null
  department: string | null
  experienceLevel: string | null
  location: string | null
  workModel: string | null
  criticalSkills: string[] | null
  minSalary: string | null
  maxSalary: string | null
  nonNegotiables: string | null
  flexible: string | null
  timeline: string | null
}

export default function ConversationalChatbot() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [currentInput, setCurrentInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
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
  })
  const [completeness, setCompleteness] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatingMessageIndex, setGeneratingMessageIndex] = useState(0)
  const [generatingProgress, setGeneratingProgress] = useState(0)

  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const conversationMessages = useRef<Array<{ role: string; content: string }>>([])
  const greetingAdded = useRef(false)

  // Helper function to count filled fields (treat salary range as one field)
  const countFilledFields = (data: ExtractedData): number => {
    let count = 0

    if (data.roleTitle) count++
    if (data.department) count++
    if (data.experienceLevel) count++
    if (data.location) count++
    if (data.workModel) count++
    if (data.criticalSkills && data.criticalSkills.length > 0) count++
    if (data.nonNegotiables) count++
    if (data.flexible) count++
    if (data.timeline) count++
    if (data.minSalary && data.maxSalary) count++

    return count
  }

  const TOTAL_FIELDS = 10

  const generatingMessages = [
    { icon: Search, text: "Scanning 1,200+ trusted job market sources..." },
    { icon: BarChart3, text: "Analyzing real-time salary data from verified databases..." },
    { icon: Globe, text: "Cross-referencing international market standards..." },
    { icon: Briefcase, text: "Comparing with similar roles across 50+ industries..." },
    { icon: Crosshair, text: "Evaluating skill requirements against market demand..." },
    { icon: LineChart, text: "Processing compensation trends from top companies..." },
    { icon: Microscope, text: "Running deep analysis on job description clarity..." },
    { icon: Shield, text: "Validating data accuracy from multiple sources..." },
    { icon: GraduationCap, text: "Matching requirements with industry certifications..." },
    { icon: Star, text: "Calculating your competitive positioning score..." },
  ]

  // Cycle through generating messages
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setGeneratingMessageIndex((prev) => (prev + 1) % generatingMessages.length)
      }, 3000)
      return () => clearInterval(interval)
    } else {
      setGeneratingMessageIndex(0)
    }
  }, [isGenerating, generatingMessages.length])

  // Progress bar animation
  useEffect(() => {
    if (isGenerating) {
      setGeneratingProgress(5)
      const startTime = Date.now()

      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime

        let progress
        if (elapsed < 10000) {
          progress = 5 + (elapsed / 10000) * 45
        } else if (elapsed < 30000) {
          progress = 50 + ((elapsed - 10000) / 20000) * 35
        } else {
          progress = 85 + Math.min(((elapsed - 30000) / 60000) * 10, 10)
        }

        setGeneratingProgress(Math.min(progress, 95))
      }, 200)

      return () => clearInterval(timer)
    } else {
      setGeneratingProgress((prev) => {
        if (prev > 0 && prev < 100) {
          return 100
        }
        return prev
      })
    }
  }, [isGenerating])

  // Define handleComplete before it's used in useEffect
  const handleComplete = useCallback(async () => {
    setIsGenerating(true)

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
    }

    sessionStorage.setItem("formData", JSON.stringify(formData))

    try {
      const response = await fetch("/api/generate-cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        sessionStorage.setItem("battleCards", JSON.stringify(result.cards))
        sessionStorage.setItem("sessionId", result.sessionId)
      }
    } catch (error) {
      console.error("Error generating cards:", error)
    }

    router.push("/results")
  }, [extractedData, router])

  // Load existing data from storage on mount
  useEffect(() => {
    const loadExistingData = () => {
      const sessionData = sessionStorage.getItem("formData")
      if (sessionData) {
        try {
          const parsed = JSON.parse(sessionData)
          const newExtractedData: ExtractedData = {
            roleTitle: parsed.roleTitle || null,
            department: parsed.department || null,
            experienceLevel: parsed.experienceLevel || null,
            location: parsed.location || null,
            workModel: parsed.workModel || null,
            criticalSkills:
              Array.isArray(parsed.criticalSkills) && parsed.criticalSkills.length > 0 ? parsed.criticalSkills : null,
            minSalary: parsed.minSalary || null,
            maxSalary: parsed.maxSalary || null,
            nonNegotiables: parsed.nonNegotiables || null,
            flexible: parsed.flexible || null,
            timeline: parsed.timeline || null,
          }
          setExtractedData(newExtractedData)

          const filledCount = countFilledFields(newExtractedData)
          setCompleteness(Math.round((filledCount / TOTAL_FIELDS) * 100))
        } catch (err) {
          console.error("Failed to load session data:", err)
        }
      }

      setDataLoaded(true)
    }

    loadExistingData()
  }, [])

  // Initial greeting
  useEffect(() => {
    if (!dataLoaded) return

    if (!greetingAdded.current) {
      greetingAdded.current = true
      setTimeout(() => {
        const filledCount = countFilledFields(extractedData)

        let greeting =
          "Hey there! I'm your AI hiring assistant. I'm here to help you create a perfect HireCard strategy.\n\n"
        let suggestions: string[] | undefined = undefined

        if (filledCount === 0) {
          greeting +=
            "Let's build your HireCard from scratch. I'll guide you through the process with a few quick questions.\n\nWhat role are you looking to hire for?"
        } else if (filledCount < TOTAL_FIELDS) {
          greeting += `${filledCount}/${TOTAL_FIELDS} fields filled.\n\n`

          const missingFields: string[] = []
          if (!extractedData.roleTitle) missingFields.push("Role Title")
          if (!extractedData.department) missingFields.push("Department")
          if (!extractedData.experienceLevel) missingFields.push("Experience Level")
          if (!extractedData.location) missingFields.push("Location")
          if (!extractedData.workModel) missingFields.push("Work Model")
          if (!extractedData.criticalSkills || extractedData.criticalSkills.length === 0)
            missingFields.push("Critical Skills")
          if (!extractedData.minSalary || !extractedData.maxSalary) missingFields.push("Salary Range")
          if (!extractedData.nonNegotiables) missingFields.push("Non-Negotiables")
          if (!extractedData.timeline) missingFields.push("Timeline")
          if (!extractedData.flexible) missingFields.push("Nice-to-Have Skills")

          greeting += `Still missing: ${missingFields.join(", ")}.\n\n`

          if (!extractedData.roleTitle) {
            greeting += "First, what role are you hiring for?"
          } else if (!extractedData.department) {
            greeting += "What department is this role for?"
          } else if (!extractedData.criticalSkills || extractedData.criticalSkills.length === 0) {
            greeting += "What are the critical technical skills this person must have?"
          } else if (!extractedData.experienceLevel) {
            greeting += "What experience level are you looking for?"
          } else if (!extractedData.nonNegotiables) {
            greeting += "What are the must-have requirements for this role?"
          } else if (!extractedData.minSalary || !extractedData.maxSalary) {
            greeting += "What's your salary range? Min and max, please."
          } else if (!extractedData.location) {
            greeting += "Where is this position located?"
            suggestions = ["Remote", "New York, NY", "San Francisco, CA", "London, UK"]
          } else if (!extractedData.workModel) {
            greeting += "Is this role remote, hybrid, or on-site?"
            suggestions = ["Remote", "Hybrid", "On-site"]
          } else if (!extractedData.timeline) {
            greeting += "What's your timeline for filling this position?"
            suggestions = ["Urgent (1-2 weeks)", "Standard (1 month)", "Flexible (2-3 months)"]
          } else if (!extractedData.flexible) {
            greeting += "Any nice-to-have skills or flexible requirements?"
          }
        } else {
          greeting += "All your information is filled in. Perfect!\n\nLet me generate your HireCard strategy now!"
          setTimeout(() => {
            handleComplete()
          }, 2000)
        }

        addAssistantMessage(greeting, suggestions)
      }, 500)
    }
  }, [dataLoaded, extractedData, handleComplete])

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus({ preventScroll: true })
    }
  }, [isLoading])

  const addAssistantMessage = (content: string, suggestions?: string[]) => {
    setMessages((prev) => {
      const isDuplicate = prev.some((msg) => msg.role === "assistant" && msg.content === content)
      if (isDuplicate) {
        return prev
      }

      const message: Message = {
        id: `assistant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        role: "assistant",
        content,
        timestamp: new Date(),
        suggestions,
      }

      conversationMessages.current.push({
        role: "assistant",
        content,
      })

      return [...prev, message]
    })
  }

  const addUserMessage = (content: string) => {
    const message: Message = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role: "user",
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, message])
    conversationMessages.current.push({
      role: "user",
      content,
    })
  }

  const extractDataFromConversation = async () => {
    try {
      const response = await fetch("/api/extract-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: conversationMessages.current,
          currentData: extractedData,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setExtractedData((prevData) => {
          const mergedData = { ...prevData }

          Object.keys(result.data).forEach((key) => {
            const newValue = result.data[key]
            const existingValue = prevData[key as keyof ExtractedData]

            if (newValue !== null && newValue !== "" && newValue !== undefined) {
              if (Array.isArray(newValue) && newValue.length > 0) {
                if (Array.isArray(existingValue)) {
                  mergedData[key as keyof ExtractedData] = [...new Set([...existingValue, ...newValue])] as any
                } else {
                  mergedData[key as keyof ExtractedData] = newValue as any
                }
              } else if (!Array.isArray(newValue)) {
                if (!existingValue) {
                  mergedData[key as keyof ExtractedData] = newValue as any
                }
              }
            }
          })

          return mergedData
        })

        setCompleteness((prevCompleteness) => {
          const newFilledCount = countFilledFields(extractedData)
          const newCompleteness = Math.round((newFilledCount / TOTAL_FIELDS) * 100)
          return Math.max(prevCompleteness, newCompleteness)
        })
      }
    } catch (err) {
      console.error("Failed to extract data:", err)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentInput.trim() || isLoading) return

    const userMessage = currentInput.trim()
    setCurrentInput("")
    setError(null)

    addUserMessage(userMessage)
    setIsLoading(true)

    try {
      const extractionResponse = await fetch("/api/intelligent-extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          currentData: extractedData,
        }),
      })

      const extractionResult = await extractionResponse.json()

      const updatedExtractedData = { ...extractedData }

      if (extractionResult.success && extractionResult.hasNewData) {
        Object.keys(extractionResult.extracted).forEach((key) => {
          if (extractionResult.extracted[key]) {
            if (key === "criticalSkills" && Array.isArray(extractionResult.extracted[key])) {
              const existingSkills = updatedExtractedData.criticalSkills || []
              const newSkills = extractionResult.extracted[key]
              updatedExtractedData.criticalSkills = [...new Set([...existingSkills, ...newSkills])]
            } else {
              ;(updatedExtractedData as any)[key] = extractionResult.extracted[key]
            }
          }
        })

        setExtractedData(updatedExtractedData)

        const newFilledCount = countFilledFields(updatedExtractedData)
        setCompleteness(Math.round((newFilledCount / TOTAL_FIELDS) * 100))
      }

      const chatResponse = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: conversationMessages.current,
          extractedData: updatedExtractedData,
        }),
      })

      const chatResult = await chatResponse.json()
      if (chatResult.success) {
        addAssistantMessage(chatResult.message)

        setIsLoading(false)

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
        }
        sessionStorage.setItem("formData", JSON.stringify(formData))

        extractDataFromConversation()

        const completionPhrases = [
          "i have everything",
          "generate your hirecard",
          "*generate* your hirecard",
          "generating your hirecard",
          "you actually finished",
          "alright, you actually finished",
          "let me roast",
        ]

        const messageLower = chatResult.message.toLowerCase()
        const isComplete = completionPhrases.some((phrase) => messageLower.includes(phrase))

        if (isComplete) {
          setTimeout(() => {
            handleComplete()
          }, 2000)
        }
      } else {
        setError(chatResult.error || "Failed to get response")
        setIsLoading(false)
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Generating Loading Screen */}
      {isGenerating && (
        <div className="absolute inset-0 z-50 flex items-center justify-center overflow-y-auto bg-white">
          <style jsx global>{`
            body {
              overflow: hidden !important;
            }
            @keyframes shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          `}</style>

          <div className="max-w-xl mx-auto px-4 text-center py-8 w-full">
            {/* Main Heading */}
            <div className="mb-3">
              <h2 className="text-2xl md:text-3xl font-bold mb-1 text-slate-800">KEEP THIS PAGE OPEN</h2>
              <p className="text-base md:text-lg text-slate-600">
                Keep this page open to see your personalized hiring analysis!
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-3 w-full max-w-md mx-auto">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 animate-pulse text-emerald-500" />
                  <span className="text-sm font-medium text-slate-700">Analyzing...</span>
                </div>
                <span className="text-lg font-bold text-emerald-500">{Math.round(generatingProgress)}%</span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full rounded-full relative transition-all duration-300 ease-out bg-emerald-500"
                  style={{ width: `${generatingProgress}%` }}
                >
                  <div
                    className="absolute inset-0 opacity-50"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
                      animation: "shimmer 2s infinite",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Time Estimate */}
            <div className="mb-3 space-y-1">
              <div className="inline-block px-3 py-1.5 rounded-full border-2 shadow-sm bg-emerald-50 border-emerald-500">
                <p className="text-sm font-semibold text-slate-800">Initial generation takes 30-45 seconds</p>
              </div>
              <p className="text-sm text-slate-500">
                This is completely normal - we&apos;re doing deep market research for you
              </p>
            </div>

            {/* Status Messages */}
            <div className="mb-3">
              <p className="text-base md:text-lg font-medium mb-2 text-slate-800">
                We&apos;re analyzing opportunities for you
              </p>

              {/* Progress Steps */}
              <div className="flex items-center justify-center space-x-1.5 text-sm mb-3">
                <span className="font-medium animate-pulse text-emerald-500">Starting</span>
                <span className="text-slate-300">→</span>
                <span className="font-medium animate-pulse text-emerald-500" style={{ animationDelay: "0.5s" }}>
                  Searching
                </span>
                <span className="text-slate-300">→</span>
                <span className="font-medium animate-pulse text-emerald-500" style={{ animationDelay: "1s" }}>
                  Analyzing
                </span>
                <span className="text-slate-300">→</span>
                <span className="font-medium animate-pulse text-emerald-500" style={{ animationDelay: "1.5s" }}>
                  Complete
                </span>
              </div>

              {/* Rotating Trust Messages */}
              <div key={generatingMessageIndex} className="min-h-[45px] flex items-center justify-center px-2">
                <div className="px-3 py-2 rounded-lg bg-white shadow-md border border-emerald-100 flex items-center space-x-2 max-w-full">
                  {(() => {
                    const IconComponent = generatingMessages[generatingMessageIndex].icon
                    return <IconComponent className="w-4 h-4 flex-shrink-0 text-emerald-500" />
                  })()}
                  <p className="text-sm font-medium text-emerald-600">
                    {generatingMessages[generatingMessageIndex].text}
                  </p>
                </div>
              </div>
            </div>

            {/* Inspiration Section */}
            <div className="mt-4 p-3 rounded-lg bg-white shadow-md border-2 border-emerald-100">
              <p className="text-sm font-semibold mb-1 text-emerald-600">Hiring Wisdom</p>
              <p className="text-sm leading-relaxed text-slate-600">
                While we work, remember: The best hires aren&apos;t always the ones with the most experience —
                they&apos;re the ones who understand your mission and bring the energy to execute it.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white overflow-hidden flex flex-col flex-1 min-h-0">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-4 flex-shrink-0">
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

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <MessageSquareIcon className="w-12 h-12 text-emerald-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Ready to start?</h3>
              <p className="text-slate-500">
                Start chatting to create your HireCard strategy. I&apos;ll guide you through the process!
              </p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div key={message.id}>
                  <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-emerald-500 text-white"
                          : "bg-white text-slate-700 border border-slate-200 shadow-sm"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                  {/* Suggestion chips */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 ml-2">
                      {message.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setCurrentInput(suggestion)
                            inputRef.current?.focus()
                          }}
                          className="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-full hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-colors duration-200 text-slate-600"
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
                <div className="flex justify-start">
                  <div className="bg-white text-slate-700 border border-slate-200 shadow-sm rounded-2xl px-4 py-3">
                    <div className="flex space-x-1">
                      <div
                        className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
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

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-200 p-4 bg-white flex-shrink-0">
          <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed h-12 bg-slate-50 text-slate-800 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!currentInput.trim() || isLoading}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 h-12 flex-shrink-0 transition-colors"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
