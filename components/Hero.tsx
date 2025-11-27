"use client"

import type React from "react"

import {
  Zap,
  Target,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  XCircle,
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
  ArrowRight,
  MousePointer2,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react"
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { Textarea } from "./ui/textarea"
import ConversationalChatbot from "./ConversationalChatbot"
import ClarityScoreModal from "./ClarityScoreModal"

interface AnalysisResult {
  score: number
  category: string
  message: string
  icon: React.ReactNode
  isIncomplete?: boolean
  hasAnyData?: boolean
  isInvalidURL?: boolean
  isProfileURL?: boolean
}

const FloatingOrb = ({
  delay,
  duration,
  size,
  initialX,
  initialY,
}: { delay: number; duration: number; size: number; initialX: number; initialY: number }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-[0.08] pointer-events-none"
    style={{
      width: size,
      height: size,
      left: `${initialX}%`,
      top: `${initialY}%`,
      background: "linear-gradient(135deg, #10b981 0%, #34d399 50%, #6ee7b7 100%)",
    }}
    animate={{
      x: [0, 50, -30, 0],
      y: [0, -40, 20, 0],
      scale: [1, 1.2, 0.9, 1],
    }}
    transition={{
      duration,
      delay,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    }}
  />
)

const GridPattern = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }}
    />
  </div>
)

const AnimatedBeam = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent"
    style={{ width: "200px", left: "-200px", top: "50%" }}
    animate={{ x: [0, 2000] }}
    transition={{ duration: 4, delay, repeat: Number.POSITIVE_INFINITY, ease: "linear", repeatDelay: 2 }}
  />
)

export const Hero = () => {
  const [roleDescription, setRoleDescription] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [missingFields, setMissingFields] = useState<string[]>([])
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [showChatModal, setShowChatModal] = useState(false)
  const [parsedData, setParsedData] = useState<any>(null)
  const [showClarityModal, setShowClarityModal] = useState(false)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [showScrapedData, setShowScrapedData] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left - rect.width / 2) / 50
        const y = (e.clientY - rect.top - rect.height / 2) / 50
        mouseX.set(x)
        mouseY.set(y)
      }
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  useEffect(() => {
    if (showChatModal) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = "hidden"
      document.body.classList.add("modal-open")
      return () => {
        document.body.style.overflow = originalOverflow
        document.body.classList.remove("modal-open")
      }
    }
  }, [showChatModal])

  const loadingMessages = [
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

  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length)
      }, 3000)
      return () => clearInterval(interval)
    } else {
      setLoadingMessageIndex(0)
    }
  }, [isAnalyzing, loadingMessages.length])

  useEffect(() => {
    if (isAnalyzing) {
      setLoadingProgress(5)
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
        setLoadingProgress(Math.min(progress, 95))
      }, 200)
      return () => clearInterval(timer)
    } else {
      setLoadingProgress((prev) => {
        if (prev > 0 && prev < 100) return 100
        return prev
      })
    }
  }, [isAnalyzing])

  const getAnalysisResult = (role: string): AnalysisResult => {
    const length = role.length
    const hasLocation = /in [A-Z]|remote|anywhere/.test(role)
    const hasSeniority = /senior|lead|staff|principal|junior|mid-level/i.test(role)
    let baseScore = 30 + Math.floor(Math.random() * 40)
    if (hasSeniority) baseScore += 15
    if (hasLocation) baseScore += 10
    if (length > 30) baseScore += 10
    const score = Math.min(95, Math.max(12, baseScore))

    if (score <= 20) {
      return {
        score,
        category: "Extremely Low",
        message:
          "Your chances of hiring the right person for this role, with your likely budget and location, are extremely low.",
        icon: <XCircle className="w-12 h-12" />,
      }
    } else if (score <= 40) {
      return {
        score,
        category: "Low",
        message: "This role will struggle. You're competing against companies with bigger budgets.",
        icon: <AlertTriangle className="w-12 h-12" />,
      }
    } else if (score <= 60) {
      return {
        score,
        category: "Medium",
        message: "You can hire this role, but not without clear tradeoffs.",
        icon: <TrendingUp className="w-12 h-12" />,
      }
    } else if (score <= 80) {
      return {
        score,
        category: "Good",
        message: "You'll fill the role, but quality is the real risk.",
        icon: <CheckCircle className="w-12 h-12" />,
      }
    } else {
      return {
        score,
        category: "Strong",
        message: "You have a realistic shot at hiring well.",
        icon: <CheckCircle className="w-12 h-12" />,
      }
    }
  }

  const isURL = (text: string): boolean => {
    try {
      new URL(text)
      return true
    } catch {
      return text.toLowerCase().includes("http") || text.includes("www.")
    }
  }

  const handleCompleteFields = () => {
    setShowClarityModal(false)
    setShowChatModal(true)
  }

  const handleChatbotClose = () => {
    setShowChatModal(false)
    setShowClarityModal(true)
  }

  const handleGenerateAnyway = () => {
    setShowClarityModal(false)
    window.location.href = "/results"
  }

  const handleAnalyze = async () => {
    if (roleDescription.trim()) {
      setIsAnalyzing(true)

      try {
        const parseResponse = await fetch("/api/parse-role", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: roleDescription }),
        })

        if (!parseResponse.ok) {
          throw new Error(`API returned ${parseResponse.status}: ${parseResponse.statusText}`)
        }

        const contentType = parseResponse.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          const text = await parseResponse.text()
          throw new Error("Server returned non-JSON response")
        }

        const parseResult = await parseResponse.json()
        if (!parseResult.success) throw new Error("Failed to parse role")

        const parsedData = parseResult.data

        if (parsedData.minSalary && parsedData.maxSalary) {
          const min = Number.parseInt(String(parsedData.minSalary).replace(/[^0-9]/g, ""))
          const max = Number.parseInt(String(parsedData.maxSalary).replace(/[^0-9]/g, ""))
          if (min > max) {
            parsedData.minSalary = String(max)
            parsedData.maxSalary = String(min)
          } else {
            parsedData.minSalary = String(min)
            parsedData.maxSalary = String(max)
          }
        }

        setParsedData(parsedData)
        const inputIsURL = parsedData.isURL

        const isValidValue = (value: any): boolean => {
          if (!value) return false
          if (typeof value === "string") {
            const normalized = value.toLowerCase().trim()
            return (
              normalized !== "not specified" &&
              normalized !== "n/a" &&
              normalized !== "unknown" &&
              normalized !== "tbd" &&
              normalized !== ""
            )
          }
          if (Array.isArray(value)) return value.length > 0 && value.some((v) => isValidValue(v))
          return true
        }

        const extractedFields: any = {}
        if (parsedData.jobTitle && parsedData.jobTitle !== "Job Position" && isValidValue(parsedData.jobTitle)) {
          extractedFields.roleTitle = parsedData.jobTitle
        }
        if (isValidValue(parsedData.location)) extractedFields.location = parsedData.location
        if (isValidValue(parsedData.workModel)) extractedFields.workModel = parsedData.workModel
        if (isValidValue(parsedData.experienceLevel)) extractedFields.experienceLevel = parsedData.experienceLevel
        if (isValidValue(parsedData.department)) extractedFields.department = parsedData.department
        if (parsedData.skills && parsedData.skills.length > 0 && isValidValue(parsedData.skills)) {
          extractedFields.criticalSkills = parsedData.skills.join(", ")
        }

        let missing: string[] = []
        if (!parsedData.jobTitle || parsedData.jobTitle === "Job Position" || !isValidValue(parsedData.jobTitle))
          missing.push("Role Title")
        if (!isValidValue(parsedData.department)) missing.push("Department")
        if (!isValidValue(parsedData.experienceLevel)) missing.push("Experience Level")
        if (!isValidValue(parsedData.location)) missing.push("Location")
        if (!isValidValue(parsedData.workModel)) missing.push("Work Model")
        if (!parsedData.skills || parsedData.skills.length === 0 || !isValidValue(parsedData.skills))
          missing.push("Critical Skills")
        if (!isValidValue(parsedData.minSalary) || !isValidValue(parsedData.maxSalary))
          missing.push("Budget/Salary Range")
        if (!parsedData.requirements || parsedData.requirements.length === 0 || !isValidValue(parsedData.requirements))
          missing.push("Non-Negotiables")
        if (!isValidValue(parsedData.timeline)) missing.push("Timeline")
        missing.push("Nice-to-Have Skills")

        const fieldsProvided = 10 - missing.length
        const hasAnyData = Object.keys(extractedFields).length > 0
        const isInvalidURL = parsedData.isJobPosting === false || parsedData.confidence === 0
        const urlLower = (typeof roleDescription === "string" ? roleDescription : "").toLowerCase()
        const isProfileURL = urlLower.includes("/in/") || urlLower.includes("/profile/")

        let score = 0
        if (hasAnyData && !isInvalidURL && !isProfileURL && missing.length < 10) {
          const completenessScore = (fieldsProvided / 10) * 100
          const confidenceWeight = parsedData.confidence || 0.5
          score = Math.round(completenessScore * confidenceWeight)
          score = Math.max(16, Math.min(85, score))
        }

        let message = ""
        let isIncomplete = missing.length > 0

        if (missing.length === 0) {
          score = Math.max(score, 70)
          message = `Complete job description found! Score: ${score}. Still need salary, timeline, and non-negotiables for the full picture.`
          isIncomplete = true
        } else if (missing.length <= 2) {
          score = Math.max(score, 60)
          message = `Almost there! Found: ${Object.keys(extractedFields).join(", ")}. Missing: ${missing.slice(0, 2).join(", ")}.`
        } else if (missing.length <= 5) {
          score = Math.max(score, 35)
          message = `Found: ${Object.keys(extractedFields).join(", ")}. Missing: ${missing.slice(0, 3).join(", ")} and more.`
        } else {
          if (score !== 0) score = Math.max(score, 16)
          if (!hasAnyData || isInvalidURL || isProfileURL || missing.length === 10) {
            message = `This job posting needs more details. Clarity score of 0 means we have almost nothing to work with.`
          } else {
            message = `Found: ${Object.keys(extractedFields).join(", ")}. That's it. We need more details.`
          }
        }

        let category = "Ghost Town"
        if (score >= 70) category = "Moderate-High Clarity"
        else if (score >= 60) category = "Moderate Clarity"
        else if (score >= 35) category = "Low Clarity"

        setMissingFields(missing)

        const incompleteData = {
          isURL: inputIsURL,
          roleDescription: roleDescription,
          extractedFields: extractedFields,
          missingFields: missing,
          parsedData: parsedData,
        }

        sessionStorage.setItem("incompleteData", JSON.stringify(incompleteData))

        const formData = {
          roleTitle:
            parsedData.jobTitle && parsedData.jobTitle !== "Job Position" && isValidValue(parsedData.jobTitle)
              ? parsedData.jobTitle
              : "",
          department: isValidValue(parsedData.department) ? parsedData.department : "",
          experienceLevel: isValidValue(parsedData.experienceLevel) ? parsedData.experienceLevel : "",
          location: isValidValue(parsedData.location) ? parsedData.location : "",
          workModel: isValidValue(parsedData.workModel) ? parsedData.workModel : "",
          criticalSkills: parsedData.skills && isValidValue(parsedData.skills) ? parsedData.skills : [],
          minSalary: isValidValue(parsedData.minSalary) ? String(parsedData.minSalary) : "",
          maxSalary: isValidValue(parsedData.maxSalary) ? String(parsedData.maxSalary) : "",
          nonNegotiables:
            parsedData.requirements && isValidValue(parsedData.requirements)
              ? parsedData.requirements.slice(0, 3).join(", ")
              : "",
          flexible: "",
          timeline: "",
        }

        sessionStorage.setItem("heroAnalysisData", JSON.stringify(formData))

        const hasSignificantData =
          (parsedData.skills?.length > 0 && isValidValue(parsedData.skills)) ||
          isValidValue(parsedData.experienceLevel) ||
          isValidValue(parsedData.location) ||
          isValidValue(parsedData.workModel) ||
          isValidValue(parsedData.department)

        if (hasSignificantData) {
          sessionStorage.setItem("formData", JSON.stringify(formData))
        } else {
          sessionStorage.removeItem("formData")
          if (missing.length < 10) {
            missing = [
              "Role Title",
              "Department",
              "Experience Level",
              "Location",
              "Work Model",
              "Critical Skills",
              "Budget/Salary Range",
              "Non-Negotiables",
              "Timeline",
              "Nice-to-Have Skills",
            ]
            setMissingFields(missing)
          }
        }

        try {
          const roastResponse = await fetch("/api/roast-hiring", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              score: score,
              category: category,
              roleDescription: roleDescription,
              extractedFields: extractedFields,
              missingFields: missing,
            }),
          })

          const roastData = await roastResponse.json()
          const aiMessage = roastData.success ? roastData.roast : message

          const result = {
            score: score,
            category: category,
            message: aiMessage,
            icon: <AlertTriangle className="w-12 h-12" />,
            isIncomplete: isIncomplete,
            hasAnyData: hasAnyData,
            isInvalidURL: isInvalidURL,
            isProfileURL: isProfileURL,
          }

          setAnalysisResult(result)
          setShowResults(true)
          setShowClarityModal(true)
        } catch (roastError) {
          const result = {
            score: score,
            category: category,
            message: message,
            icon: <AlertTriangle className="w-12 h-12" />,
            isIncomplete: isIncomplete,
            hasAnyData: hasAnyData,
            isInvalidURL: isInvalidURL,
            isProfileURL: isProfileURL,
          }
          setAnalysisResult(result)
          setShowResults(true)
          setShowClarityModal(true)
        }
      } catch (error) {
        const result = {
          score: 16,
          category: "Error",
          message: "We couldn't analyze this role properly. Please try again or provide more details.",
          icon: <AlertTriangle className="w-12 h-12" />,
          isIncomplete: true,
        }
        setAnalysisResult(result)
        setShowResults(true)
        setShowClarityModal(true)
      } finally {
        setIsAnalyzing(false)
      }
    }
  }

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(180deg, #ffffff 0%, #f9fafb 50%, #f3f4f6 100%)" }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingOrb delay={0} duration={20} size={600} initialX={-10} initialY={20} />
        <FloatingOrb delay={5} duration={25} size={400} initialX={70} initialY={60} />
        <FloatingOrb delay={10} duration={22} size={500} initialX={50} initialY={10} />
      </div>

      <GridPattern />

      {/* Animated beams */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <AnimatedBeam delay={0} />
        <AnimatedBeam delay={2} />
        <AnimatedBeam delay={4} />
      </div>

      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 50%, transparent 0%, rgba(255,255,255,0.9) 100%)",
        }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div style={{ x: springX, y: springY }} className="text-center">
          {/* Badge - light theme badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-200 bg-emerald-50 backdrop-blur-sm mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-emerald-700 text-sm font-medium tracking-wide">AI-Powered Hiring Intelligence</span>
          </motion.div>

          {/* Main headline - dark text for light background */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-balance"
          >
            <span className="text-slate-800">Stop </span>
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-red-500 via-rose-500 to-orange-500 bg-clip-text text-transparent">
                Guessing
              </span>
              <motion.span
                className="absolute -inset-1 bg-gradient-to-r from-red-500/10 to-orange-500/10 blur-lg rounded-lg"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
            </span>
            <br />
            <span className="text-slate-800">Start </span>
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Hiring Right
              </span>
              <motion.span
                className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 blur-lg rounded-lg"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
              />
            </span>
          </motion.h1>

          {/* Subheadline - slate text for light bg */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg sm:text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-4 leading-relaxed text-pretty"
          >
            Get an instant <span className="text-slate-800 font-semibold">reality check</span> on your job posting.
            <br className="hidden sm:block" />
            Know your <span className="text-emerald-600">hireability score</span> before you waste weeks.
          </motion.p>

          {/* Warning tag - light theme warning */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 mb-10"
          >
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <div className="text-rose-600 text-sm font-medium">
              <span className="text-[25px]">Not an ATS</span> • Not a sourcing tool • Pure strategy
            </div>
          </motion.div>

          {/* Input Section - light theme input box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div
              className={`relative rounded-2xl transition-all duration-500 ${
                isInputFocused
                  ? "shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]"
                  : "shadow-[0_0_20px_-10px_rgba(16,185,129,0.15)]"
              }`}
            >
              {/* Gradient border effect */}
              <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 opacity-40" />

              <div className="relative bg-white rounded-2xl p-1.5">
                <div className="bg-slate-50 rounded-xl p-4">
                  <Textarea
                    value={roleDescription}
                    onChange={(e) => setRoleDescription(e.target.value)}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    placeholder="Paste a job post URL or describe your role...

Example: 'Senior React Developer, NYC, $150-180k, 5+ years experience'"
                    className="bg-transparent border-0 shadow-none focus-visible:ring-0 resize-none text-base md:text-lg text-slate-800 placeholder:text-slate-400 min-h-[120px]"
                    disabled={isAnalyzing}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleAnalyze()
                      }
                    }}
                  />

                  {/* Collapsible Scraped Data Section */}
                  <AnimatePresence>
                    {parsedData && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t border-slate-200"
                      >
                        <button
                          onClick={() => setShowScrapedData(!showScrapedData)}
                          className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors group"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-emerald-600" />
                            <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">
                              View Scraped Data
                            </span>
                            <span className="text-xs text-slate-500 bg-white px-2 py-0.5 rounded-full">
                              {parsedData.isURL ? "From URL" : "From Text"}
                            </span>
                          </div>
                          {showScrapedData ? (
                            <ChevronUp className="w-4 h-4 text-slate-500" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-500" />
                          )}
                        </button>

                        <AnimatePresence>
                          {showScrapedData && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="mt-2 p-4 rounded-lg bg-white border border-slate-200 overflow-hidden"
                            >
                              <div className="max-h-[300px] overflow-y-auto space-y-3 text-sm">
                                {parsedData.jobTitle && (
                                  <div>
                                    <span className="text-slate-500 font-medium">Job Title:</span>
                                    <span className="ml-2 text-slate-700">{parsedData.jobTitle}</span>
                                  </div>
                                )}
                                {parsedData.department && (
                                  <div>
                                    <span className="text-slate-500 font-medium">Department:</span>
                                    <span className="ml-2 text-slate-700">{parsedData.department}</span>
                                  </div>
                                )}
                                {parsedData.experienceLevel && (
                                  <div>
                                    <span className="text-slate-500 font-medium">Experience Level:</span>
                                    <span className="ml-2 text-slate-700">{parsedData.experienceLevel}</span>
                                  </div>
                                )}
                                {parsedData.location && (
                                  <div>
                                    <span className="text-slate-500 font-medium">Location:</span>
                                    <span className="ml-2 text-slate-700">{parsedData.location}</span>
                                  </div>
                                )}
                                {parsedData.workModel && (
                                  <div>
                                    <span className="text-slate-500 font-medium">Work Model:</span>
                                    <span className="ml-2 text-slate-700">{parsedData.workModel}</span>
                                  </div>
                                )}
                                {parsedData.minSalary && parsedData.maxSalary && (
                                  <div>
                                    <span className="text-slate-500 font-medium">Salary Range:</span>
                                    <span className="ml-2 text-slate-700">
                                      ${parsedData.minSalary} - ${parsedData.maxSalary}
                                    </span>
                                  </div>
                                )}
                                {parsedData.skills && parsedData.skills.length > 0 && (
                                  <div>
                                    <span className="text-slate-500 font-medium">Skills:</span>
                                    <div className="mt-1 flex flex-wrap gap-1">
                                      {parsedData.skills.map((skill: string, index: number) => (
                                        <span
                                          key={index}
                                          className="px-2 py-1 bg-emerald-50 border border-emerald-200 rounded text-emerald-700 text-xs"
                                        >
                                          {skill}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {parsedData.requirements && parsedData.requirements.length > 0 && (
                                  <div>
                                    <span className="text-slate-500 font-medium">Requirements:</span>
                                    <ul className="mt-1 ml-4 space-y-1 list-disc list-inside text-slate-700">
                                      {parsedData.requirements.map((req: string, index: number) => (
                                        <li key={index}>{req}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {parsedData.timeline && (
                                  <div>
                                    <span className="text-slate-500 font-medium">Timeline:</span>
                                    <span className="ml-2 text-slate-700">{parsedData.timeline}</span>
                                  </div>
                                )}
                                {parsedData.confidence !== undefined && (
                                  <div className="pt-2 border-t border-slate-200">
                                    <span className="text-slate-500 font-medium">Confidence Score:</span>
                                    <span className="ml-2 text-slate-700">
                                      {Math.round(parsedData.confidence * 100)}%
                                    </span>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <MousePointer2 className="w-4 h-4" />
                      <span>Press Enter to analyze</span>
                    </div>

                    <motion.button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || !roleDescription.trim()}
                      whileTap={{ scale: 0.98 }}
                      className="group relative flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-base disabled:opacity-40 disabled:cursor-not-allowed transition-all overflow-hidden"
                      style={{
                        background:
                          isAnalyzing || !roleDescription.trim()
                            ? "#d1d5db"
                            : "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)",
                      }}
                    >
                      {/* Button shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full transition-transform duration-700" />

                      {isAnalyzing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span className="text-white">Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 text-white" />
                          <span className="text-white">Get Reality Check</span>
                          <ArrowRight className="w-4 h-4 text-white" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature pills - light theme pills - removed floating hover effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            {[
              { icon: Zap, text: "5-minute strategy", color: "from-amber-400 to-orange-400" },
              { icon: Target, text: "Reality-based scoring", color: "from-emerald-400 to-teal-400" },
              { icon: CheckCircle, text: "Fix issues before posting", color: "from-cyan-400 to-blue-400" },
            ].map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="group flex items-center gap-3 px-5 py-3 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-default"
              >
                <div className={`p-2 rounded-full bg-gradient-to-br ${feature.color}`}>
                  <feature.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-slate-600 font-medium text-sm group-hover:text-slate-800 transition-colors">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Full Screen Loading Dialog - light theme loading */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "linear-gradient(180deg, #ffffff 0%, #f9fafb 50%, #f3f4f6 100%)" }}
          >
            <style jsx global>{`
              body { overflow: hidden !important; }
              @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
              }
            `}</style>

            <div className="max-w-xl mx-auto px-6 text-center">
              {/* Pulsing orb */}
              <motion.div
                className="w-24 h-24 mx-auto mb-8 rounded-full relative"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 blur-xl opacity-40" />
                <div className="absolute inset-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
              </motion.div>

              <motion.h2
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-2xl md:text-3xl font-bold text-slate-800 mb-2"
              >
                Analyzing Your Role
              </motion.h2>
              <p className="text-slate-600 mb-8">Keep this page open for your personalized analysis</p>

              {/* Progress bar */}
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  <span className="text-emerald-600 font-medium">Processing...</span>
                  <span className="text-emerald-600 font-bold">{Math.round(loadingProgress)}%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full relative bg-gradient-to-r from-emerald-500 to-teal-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${loadingProgress}%` }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className="absolute inset-0 opacity-50"
                      style={{
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
                        animation: "shimmer 2s infinite",
                      }}
                    />
                  </motion.div>
                </div>
              </div>

              {/* Status message */}
              <motion.div
                key={loadingMessageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-white border border-slate-200 shadow-sm"
              >
                {(() => {
                  const IconComponent = loadingMessages[loadingMessageIndex].icon
                  return <IconComponent className="w-5 h-5 text-emerald-600" />
                })()}
                <span className="text-slate-700">{loadingMessages[loadingMessageIndex].text}</span>
              </motion.div>

              <p className="text-slate-500 text-sm mt-6">Initial generation takes 30-45 seconds</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chatbot Modal - light theme modal */}
      <AnimatePresence>
        {showChatModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md"
            onClick={handleChatbotClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col border border-slate-200"
              style={{ height: "85vh", maxHeight: "700px" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">Complete Your Hiring Strategy</h2>
                </div>
                <button
                  onClick={handleChatbotClose}
                  className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-500 hover:text-slate-800"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 min-h-0 flex flex-col bg-white">
                <div className="p-4 flex-1 flex flex-col min-h-0">
                  <ConversationalChatbot />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clarity Score Modal */}
      <ClarityScoreModal
        isOpen={showClarityModal}
        onClose={() => setShowClarityModal(false)}
        score={analysisResult?.score || 0}
        category={analysisResult?.category || ""}
        message={analysisResult?.message || ""}
        missingFields={missingFields}
        onCompleteFields={handleCompleteFields}
        onGenerateAnyway={handleGenerateAnyway}
      />
    </section>
  )
}
