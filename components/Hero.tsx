"use client"

import Link from "next/link"
import { Zap, Target, Sparkles, AlertTriangle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import type { JSX } from "react/jsx-runtime"

interface AnalysisResult {
  score: number
  category: string
  message: string
  icon: JSX.Element
  isIncomplete?: boolean
}

export const Hero = () => {
  const [roleDescription, setRoleDescription] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [missingFields, setMissingFields] = useState<string[]>([])

  const handleAnalyze = async () => {
    if (roleDescription.trim()) {
      setIsAnalyzing(true)

      try {
        const parseResponse = await fetch("/api/parse-role", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ input: roleDescription }),
        })

        const parseResult = await parseResponse.json()

        if (!parseResult.success) {
          throw new Error("Failed to parse role")
        }

        const parsedData = parseResult.data
        const inputIsURL = parsedData.isURL

        const extractedFields: any = {
          roleTitle: parsedData.jobTitle,
        }

        if (parsedData.location) extractedFields.location = parsedData.location
        if (parsedData.workModel) extractedFields.workModel = parsedData.workModel
        if (parsedData.experienceLevel) extractedFields.experienceLevel = parsedData.experienceLevel
        if (parsedData.department) extractedFields.department = parsedData.department
        if (parsedData.skills && parsedData.skills.length > 0) {
          extractedFields.criticalSkills = parsedData.skills.join(", ")
        }

        const missing: string[] = []
        if (!parsedData.experienceLevel) missing.push("Experience Level")
        if (!parsedData.location) missing.push("Location")
        if (!parsedData.workModel) missing.push("Work Model")
        if (!parsedData.skills || parsedData.skills.length === 0) missing.push("Critical Skills")
        missing.push("Budget/Salary Range")
        missing.push("Non-Negotiables")
        missing.push("Timeline")

        const fieldsProvided = 8 - missing.length
        const completenessScore = (fieldsProvided / 8) * 100
        const confidenceWeight = parsedData.confidence || 0.5
        let score = Math.round(completenessScore * confidenceWeight)

        score = Math.max(16, Math.min(85, score))

        let category = "Low Feasibility"
        let message = ""
        let isIncomplete = missing.length > 0

        if (missing.length === 0) {
          score = Math.max(score, 70)
          category = "Moderate-High Feasibility"
          message = `Well, well, look at you with ${inputIsURL ? "a complete job description URL" : "detailed information"}! We found: role, location, experience level, work model, and skills. Here's the reality check: we still need salary range, timeline, and non-negotiables to give you the full picture. Your score of ${score} is solid, but could swing ±15 points based on compensation and urgency. Fill in the missing pieces for an accurate assessment.`
          isIncomplete = true
        } else if (missing.length <= 2) {
          score = Math.max(score, 60)
          category = "Moderate Feasibility"
          message = `Almost there! We extracted: ${Object.keys(extractedFields)
            .map((k) => (k === "roleTitle" ? "role title" : k))
            .join(
              ", ",
            )}. But you're missing the critical ones: ${missing.slice(0, 2).join(", ")}. That ${score} you're seeing? Could swing ±15 points. Give us the full picture and we'll tell you the real feasibility.`
        } else if (missing.length <= 5) {
          score = Math.max(score, 35)
          category = "Low Feasibility"
          message = `Not bad, but here's where it gets fuzzy. We found: ${Object.keys(extractedFields)
            .map((k) => (k === "roleTitle" ? "role title" : k))
            .join(
              ", ",
            )}. Missing: ${missing.slice(0, 3).join(", ")} and more. That ${score}? It's a guess. Your real score could be 70 if you're paying competitive rates, or 20 if you're lowballing. Fill in what's missing for an accurate reality check.`
        } else {
          score = Math.max(score, 16)
          category = "Ghost Town"
          message = `${inputIsURL ? "Dropped a URL but it's thin on details." : "Just a job title?"} We found: ${parsedData.jobTitle}${parsedData.location ? ` in ${parsedData.location}` : ""}. That's it. We gave you a ${score}, but let's be real, we know almost nothing. Your actual feasibility could be 70 or it could be 10. This isn't an assessment, it's a coin flip. Give us actual details and we'll give you an actual answer.`
        }

        setMissingFields(missing)

        const incompleteData = {
          isURL: inputIsURL,
          roleDescription: roleDescription,
          extractedFields: extractedFields,
          missingFields: missing,
          parsedData: parsedData,
        }

        sessionStorage.setItem("incompleteData", JSON.stringify(incompleteData))

        const result = {
          score: score,
          category: category,
          message: message,
          icon: <AlertTriangle className="w-12 h-12" />,
          isIncomplete: isIncomplete,
        }

        setAnalysisResult(result)
        setShowResults(true)
      } catch (error) {
        console.error("Error analyzing role:", error)
        const result = {
          score: 16,
          category: "Error",
          message: "We couldn't analyze this role properly. Please try again or provide more details.",
          icon: <AlertTriangle className="w-12 h-12" />,
          isIncomplete: true,
        }
        setAnalysisResult(result)
        setShowResults(true)
      } finally {
        setIsAnalyzing(false)
      }
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-0 md:pt-24 md:pb-8 overflow-hidden bg-gradient-to-b from-card via-background to-background">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(236, 76, 47, 0.05) 35px, rgba(236, 76, 47, 0.05) 70px)",
          }}
        />

        {/* Animated poker chips */}
        <motion.div
          className="absolute top-1/4 left-10 w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent shadow-2xl opacity-20"
          animate={{ rotate: 360, y: [0, 20, 0] }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-32 h-32 rounded-full bg-gradient-to-br from-accent to-primary shadow-2xl opacity-15"
          animate={{ rotate: -360, y: [0, -20, 0] }}
          transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
        />
        <motion.div
          className="absolute top-1/3 right-20 w-20 h-20 rounded-full bg-primary/20 shadow-xl opacity-25"
          animate={{ rotate: 360, x: [0, 15, 0] }}
          transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, delay: 2 }}
        />
      </div>

      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="mb-4 flex items-center justify-center gap-2">
              <span className="text-4xl">♠</span>
              <span className="text-sm font-bold tracking-widest text-primary uppercase">All In On Talent</span>
              <span className="text-4xl">♥</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-balance">
              <span className="block text-foreground">Your Hiring</span>
              <span className="block">
                <span className="relative inline-block">
                  <span className="absolute -inset-2 bg-primary/10 blur-xl" />
                  <span className="relative bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                    Reality Check.
                  </span>
                </span>
              </span>
              <span className="block text-2xl md:text-3xl font-medium text-muted-foreground mt-4">
                Know Your Hand Before You Bet.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Enter a job role or paste a job description. We'll analyze your hand and tell you if you're holding pocket
              aces or a bad beat waiting to happen.
            </p>

            <div className="max-w-3xl mx-auto mb-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500" />
                <div className="relative flex flex-col sm:flex-row gap-3 p-1 bg-card rounded-2xl shadow-2xl border-2 border-primary/30 backdrop-blur-sm">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={roleDescription}
                      onChange={(e) => setRoleDescription(e.target.value)}
                      placeholder="e.g., Senior Backend Engineer or paste a job URL..."
                      className="w-full px-5 py-4 text-base bg-transparent border-0 focus:outline-none focus:ring-0 text-foreground placeholder-muted-foreground"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleAnalyze()
                        }
                      }}
                    />
                  </div>
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !roleDescription.trim()}
                    className="flex items-center justify-center space-x-2 text-sm px-8 py-4 whitespace-nowrap font-bold rounded-xl bg-gradient-to-r from-primary to-accent hover:shadow-2xl hover:shadow-primary/50 text-primary-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-95 uppercase tracking-wider"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>Check Your Hand</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {showResults && analysisResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="max-w-3xl mx-auto mb-12"
                >
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-2xl blur opacity-40" />
                    <div className="relative bg-card rounded-2xl shadow-2xl border-2 border-primary/40 p-8 md:p-10 backdrop-blur-sm">
                      {/* Poker chip decorations */}
                      <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg flex items-center justify-center text-white font-bold text-xl border-4 border-card">
                        {analysisResult.score}
                      </div>

                      <div className="flex flex-col items-center mb-8">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                          className="mb-4"
                        >
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary">
                            {analysisResult.icon}
                          </div>
                        </motion.div>
                        <div className="text-center">
                          <div className="text-xl md:text-2xl font-bold text-foreground mb-2">
                            {analysisResult.category}
                          </div>
                          <p className="text-sm text-muted-foreground">Your current hand strength</p>
                        </div>
                      </div>

                      <div className="mb-8 p-6 bg-primary/5 rounded-xl border-2 border-primary/20 backdrop-blur-sm">
                        <p className="text-base md:text-lg leading-relaxed text-foreground/90">
                          {analysisResult.message}
                        </p>
                      </div>

                      <div className="border-t-2 border-primary/20 my-8" />

                      <div className="text-center space-y-6">
                        {analysisResult.isIncomplete ? (
                          <>
                            <div className="mb-6 p-4 bg-primary/10 border-2 border-primary/30 rounded-xl backdrop-blur-sm">
                              <p className="text-xs font-bold mb-3 text-foreground">Missing From Your Hand:</p>
                              <div className="flex flex-wrap gap-2 justify-center">
                                {missingFields.map((field: string, idx: number) => (
                                  <motion.span
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="text-xs px-4 py-2 bg-card border-2 border-primary/30 rounded-full text-foreground font-bold"
                                  >
                                    {field}
                                  </motion.span>
                                ))}
                              </div>
                            </div>

                            <Link
                              href="/create"
                              className="inline-flex items-center justify-center space-x-2 text-base px-8 py-4 font-bold rounded-xl bg-gradient-to-r from-primary to-accent hover:shadow-2xl hover:shadow-primary/50 text-primary-foreground transition-all shadow-lg active:scale-95 uppercase tracking-wider"
                            >
                              <Sparkles className="w-5 h-5" />
                              <span>Go All In</span>
                            </Link>
                            <p className="text-sm text-muted-foreground font-medium">
                              Complete your hand and reveal the truth.
                            </p>
                          </>
                        ) : (
                          <>
                            <Link
                              href="/results"
                              className="inline-flex items-center justify-center space-x-2 text-base px-8 py-4 font-bold rounded-xl bg-gradient-to-r from-primary to-accent hover:shadow-2xl hover:shadow-primary/50 text-primary-foreground transition-all shadow-lg active:scale-95 uppercase tracking-wider"
                            >
                              <Sparkles className="w-5 h-5" />
                              <span>Show Your Cards</span>
                            </Link>
                            <p className="text-sm text-muted-foreground font-medium">
                              Get your full strategic play and sourcing strategy.
                            </p>
                          </>
                        )}
                        <button
                          onClick={() => {
                            setShowResults(false)
                            setRoleDescription("")
                          }}
                          className="block mx-auto text-sm font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
                        >
                          Fold & Try Again →
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
            >
              {[
                { icon: Zap, suit: "♠", title: "Read the Table", desc: "Instant position analysis" },
                { icon: Target, suit: "♥", title: "Calculate Odds", desc: "Real feasibility metrics" },
                { icon: Sparkles, suit: "♦", title: "Play Smart", desc: "Data-driven strategy" },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-accent/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
                  <div className="relative p-6 rounded-xl bg-card border-2 border-primary/20 backdrop-blur-sm hover:border-primary/50 transition-all">
                    <div className="text-3xl mb-3">{feature.suit}</div>
                    <feature.icon className="w-8 h-8 text-primary mb-3 group-hover:text-accent transition-colors" />
                    <h3 className="font-bold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <p className="text-sm text-muted-foreground mt-12 font-bold uppercase tracking-wider">
              The house always knows. Now so will you. 🎰
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
