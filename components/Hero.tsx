"use client"

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
  type ListX as JSX,
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
  icon: JSX.Element
  isIncomplete?: boolean
  hasAnyData?: boolean
  isInvalidURL?: boolean
  isProfileURL?: boolean
}

// Static orb component for background
const StaticOrb = ({
  size,
  initialX,
  initialY,
}: { size: number; initialX: number; initialY: number }) => (
  <div
    className="absolute rounded-full blur-3xl opacity-30 pointer-events-none"
    style={{
      width: size,
      height: size,
      left: `${initialX}%`,
      top: `${initialY}%`,
      background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #14b8a6 100%)",
    }}
  />
)

// Grid pattern background
const GridPattern = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `linear-gradient(#0f172a 1.5px, transparent 1.5px), linear-gradient(90deg, #0f172a 1.5px, transparent 1.5px)`,
        backgroundSize: "60px 60px",
      }}
    />
  </div>
)

// Static beam component (removed animation)
const StaticBeam = () => (
  <div
    className="absolute h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
    style={{ width: "100%", top: "50%" }}
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

  // Mouse tracking for subtle parallax
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

  // Prevent body scroll when modal is open
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
      className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-white via-emerald-50/30 to-white pt-20"
    >
      {/* Static background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-200/20 rounded-full blur-3xl" />
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />


      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-200/50 bg-gradient-to-r from-emerald-100 to-teal-100 shadow-sm mb-4"
          >
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
            <span className="text-emerald-700 text-sm font-medium tracking-wide">Not an ATS, not a sourcing tool</span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3 text-balance"
          >
            <span className="text-slate-900">HireCards is the </span>
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                strategy layer
              </span>
            </span>
            <br />
            <span className="text-slate-900">before hiring starts</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base sm:text-lg text-slate-900 max-w-2xl mx-auto mb-3 leading-relaxed font-bold"
          >
            Most roles fail before hiring even begins because scope, salary, and expectations don&apos;t match reality.
          </motion.p>

          {/* How it works */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto mb-6 leading-relaxed"
          >
            Paste a job post or add a few details. See hireability, what&apos;s off, how to fix it, and get your complete hiring strategy in under 5 minutes.
          </motion.p>

          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-2xl mx-auto mb-6"
          >
            <div className="relative rounded-2xl shadow-[0_0_15px_-5px_rgba(16,185,129,0.2)]">
              {/* Gradient border effect */}
              <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 opacity-50" />

              <div className="relative bg-white backdrop-blur-xl rounded-2xl p-1">
                <div className="bg-white rounded-xl p-3">
                  <Textarea
                    value={roleDescription}
                    onChange={(e) => setRoleDescription(e.target.value)}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    placeholder="Paste your job description URL or describe the role here..."
                    className="bg-transparent border-0 shadow-none focus-visible:ring-0 focus:ring-0 focus:outline-none resize-none text-sm md:text-base text-slate-900 placeholder:text-slate-400 min-h-[90px]"
                    disabled={isAnalyzing}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleAnalyze()
                      }
                    }}
                  />


                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200">
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <MousePointer2 className="w-3.5 h-3.5" />
                      <span>Press Enter to run reality check</span>
                    </div>

                    <motion.button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || !roleDescription.trim()}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`group relative flex items-center gap-2 px-5 py-2 rounded-xl font-semibold text-sm transition-all overflow-hidden ${
                        !roleDescription.trim() && !isAnalyzing
                          ? "bg-white border-2 border-slate-200 text-slate-400 cursor-not-allowed"
                          : "text-white shadow-lg"
                      }`}
                      style={roleDescription.trim() && !isAnalyzing ? { 
                        background: "linear-gradient(to right, #016B61, #70B2B2)",
                        boxShadow: "0 10px 25px -5px #016B6140"
                      } : {}}
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Running Reality Check...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className={`w-4 h-4 ${!roleDescription.trim() ? "text-slate-400" : "text-white"}`} />
                          <span>Run Reality Check</span>
                          <ArrowRight className={`w-4 h-4 ${!roleDescription.trim() ? "text-slate-400" : "text-white"} group-hover:translate-x-0.5 transition-transform`} />
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            {[
              { icon: Zap, text: "5-minute strategy", color: "from-amber-500 to-orange-500" },
              { icon: Target, text: "Reality-based scoring", color: "from-cyan-500 to-teal-500" },
              { icon: CheckCircle, text: "Fix issues before posting", color: "from-emerald-500 to-green-500" },
            ].map((feature) => (
              <div
                key={feature.text}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 backdrop-blur-sm shadow-sm"
              >
                <div className={`w-7 h-7 flex items-center justify-center rounded-full bg-gradient-to-br ${feature.color}`}>
                  <feature.icon className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-slate-700 font-medium text-xs">
                  {feature.text}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Full Screen Loading Dialog */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100"
          >
            <style jsx global>{`
              body { overflow: hidden !important; }
              @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
              }
            `}</style>

            <div className="max-w-xl mx-auto px-6 text-center">
              {/* Header */}
              <div className="mb-6">
                <h2
                  className="text-3xl md:text-4xl font-bold mb-2"
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
                    {Math.round(loadingProgress)}%
                  </span>
                </div>
                {/* Progress bar container */}
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full rounded-full relative transition-all duration-300 ease-out"
                    style={{
                      width: `${loadingProgress}%`,
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
                  key={loadingMessageIndex}
                  className="min-h-[45px] flex items-center justify-center px-2"
                >
                  <div
                    className="px-3 py-2 rounded-lg bg-white shadow-md border flex items-center space-x-2 max-w-full"
                    style={{ borderColor: "#d7f4f2" }}
                  >
                    {(() => {
                      const IconComponent = loadingMessages[loadingMessageIndex].icon;
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
                      {loadingMessages[loadingMessageIndex].text}
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chatbot Modal */}
      <AnimatePresence>
        {showChatModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={handleChatbotClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col"
              style={{ height: "85vh", maxHeight: "700px" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="flex items-center justify-between px-6 py-4 border-b"
                style={{ backgroundColor: "#f5f5f5" }}
              >
                <div className="flex items-center space-x-3">
                  <Sparkles
                    className="w-5 h-5 flex-shrink-0"
                    style={{ color: "#278f8c" }}
                  />
                  <div>
                    <h2
                      className="text-lg font-bold leading-tight"
                      style={{ color: "#102a63" }}
                    >
                      Complete Your Hiring Strategy
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Paste a job URL below or build from scratch with our AI chatbot
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleChatbotClose}
                  className="p-2 hover:bg-gray-200 transition-colors flex-shrink-0"
                  aria-label="Close"
                >
                  <svg
                    className="w-5 h-5"
                    style={{ color: "#102a63" }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <ConversationalChatbot />
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
