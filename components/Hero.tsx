"use client";

import Link from "next/link";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Textarea } from "./ui/textarea";
import ConversationalChatbot from "./ConversationalChatbot";

interface AnalysisResult {
  score: number;
  category: string;
  message: string;
  icon: JSX.Element;
  isIncomplete?: boolean;
}

export const Hero = () => {
  const [roleDescription, setRoleDescription] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showChatModal, setShowChatModal] = useState(false);

  // Prevent body scroll and hide navbar when modal is open
  useEffect(() => {
    if (showChatModal) {
      // Save current overflow value
      const originalOverflow = document.body.style.overflow;
      // Prevent scrolling
      document.body.style.overflow = "hidden";
      
      // Hide navbar by adding a class to body
      document.body.classList.add("modal-open");
      
      // Cleanup: restore original overflow and remove class when modal closes
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.classList.remove("modal-open");
      };
    }
  }, [showChatModal]);

  const loadingMessages = [
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

  // Cycle through loading messages every 3 seconds
  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 3000);
      return () => clearInterval(interval);
    } else {
      setLoadingMessageIndex(0);
    }
  }, [isAnalyzing, loadingMessages.length]);

  // Progress bar animation - synced with actual analysis
  useEffect(() => {
    if (isAnalyzing) {
      setLoadingProgress(5); // Start at 5% immediately
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

        setLoadingProgress(Math.min(progress, 95));
      }, 200); // Update every 200ms

      return () => clearInterval(timer);
    } else {
      // When analysis completes, set to 100%
      setLoadingProgress((prev) => {
        if (prev > 0 && prev < 100) {
          return 100;
        }
        return prev;
      });
    }
  }, [isAnalyzing]);

  const getAnalysisResult = (role: string): AnalysisResult => {
    // Simple analysis logic - in production, this would call an AI API
    // For now, we'll generate a semi-random but realistic result
    const length = role.length;
    const hasLocation = /in [A-Z]|remote|anywhere/.test(role);
    const hasSeniority = /senior|lead|staff|principal|junior|mid-level/i.test(
      role
    );

    // Calculate a pseudo-score based on role description quality
    let baseScore = 30 + Math.floor(Math.random() * 40);
    if (hasSeniority) baseScore += 15;
    if (hasLocation) baseScore += 10;
    if (length > 30) baseScore += 10;

    const score = Math.min(95, Math.max(12, baseScore));

    if (score <= 20) {
      return {
        score,
        category: "Extremely Low",
        message:
          "Your chances of hiring the right person for this role, with your likely budget and location, are extremely low. Most teams lose 8-12 weeks only to restart from scratch. You need a clear hiring strategy before opening this role.",
        icon: <XCircle className="w-12 h-12" />,
      };
    } else if (score <= 40) {
      return {
        score,
        category: "Low",
        message:
          "This role will struggle. You're competing against companies with bigger budgets, clearer positioning, and faster pipelines. Most teams in this range spend 10+ weeks and still compromise on quality. Without a sharper strategy, you're burning time.",
        icon: <AlertTriangle className="w-12 h-12" />,
      };
    } else if (score <= 60) {
      return {
        score,
        category: "Medium",
        message:
          "You can hire this role, but not without clear tradeoffs. Most teams underestimate funnel volume and get stuck halfway. You'll likely need to adjust your expectations, timeline, or compensation to close someone solid.",
        icon: <TrendingUp className="w-12 h-12" />,
      };
    } else if (score <= 80) {
      return {
        score,
        category: "Good",
        message:
          "You'll fill the role, but quality is the real risk. Without alignment, you may hire someone who looks great on paper and underperforms six months later. Speed matters less than getting the criteria right upfront.",
        icon: <CheckCircle className="w-12 h-12" />,
      };
    } else {
      return {
        score,
        category: "Strong",
        message:
          "You have a realistic shot at hiring well, but even strong setups fail without clarity on must-haves vs. nice-to-haves. The best hiring processes still lose great candidates to poor coordination or unclear selling points.",
        icon: <CheckCircle className="w-12 h-12" />,
      };
    }
  };

  const isURL = (text: string): boolean => {
    try {
      new URL(text);
      return true;
    } catch {
      return text.toLowerCase().includes("http") || text.includes("www.");
    }
  };

  const getURLQuality = (
    url: string
  ): "poor" | "well" | "good" | "great" | "default" => {
    const lowerURL = url.toLowerCase();
    if (lowerURL.endsWith("/poor")) return "poor";
    if (lowerURL.endsWith("/well")) return "well";
    if (lowerURL.endsWith("/good")) return "good";
    if (lowerURL.endsWith("/great")) return "great";
    return "default";
  };

  const handleAnalyze = async () => {
    if (roleDescription.trim()) {
      setIsAnalyzing(true);

      try {
        // Call AI-powered parsing API
        const parseResponse = await fetch("/api/parse-role", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ input: roleDescription }),
        });

        // Check if response is OK
        if (!parseResponse.ok) {
          console.error(
            "API Error:",
            parseResponse.status,
            parseResponse.statusText
          );
          throw new Error(
            `API returned ${parseResponse.status}: ${parseResponse.statusText}`
          );
        }

        // Check content type before parsing
        const contentType = parseResponse.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await parseResponse.text();
          console.error("Non-JSON response:", text);
          throw new Error("Server returned non-JSON response");
        }

        const parseResult = await parseResponse.json();

        if (!parseResult.success) {
          throw new Error("Failed to parse role");
        }

        const parsedData = parseResult.data;
        const inputIsURL = parsedData.isURL;

        // Helper function to check if a value is valid (not null, not empty, not "Not specified")
        const isValidValue = (value: any): boolean => {
          if (!value) return false;
          if (typeof value === 'string') {
            const normalized = value.toLowerCase().trim();
            return normalized !== 'not specified' && 
                   normalized !== 'n/a' && 
                   normalized !== 'unknown' &&
                   normalized !== 'tbd' &&
                   normalized !== '';
          }
          if (Array.isArray(value)) {
            return value.length > 0 && value.some(v => isValidValue(v));
          }
          return true;
        };

        // Build extracted fields from AI parsing
        let extractedFields: any = {};

        // Only add roleTitle if it's not the generic fallback and is valid
        if (parsedData.jobTitle && 
            parsedData.jobTitle !== "Job Position" && 
            isValidValue(parsedData.jobTitle)) {
          extractedFields.roleTitle = parsedData.jobTitle;
        }

        if (isValidValue(parsedData.location)) extractedFields.location = parsedData.location;
        if (isValidValue(parsedData.workModel)) extractedFields.workModel = parsedData.workModel;
        if (isValidValue(parsedData.experienceLevel)) extractedFields.experienceLevel = parsedData.experienceLevel;
        if (isValidValue(parsedData.department)) extractedFields.department = parsedData.department;
        if (parsedData.skills && parsedData.skills.length > 0 && isValidValue(parsedData.skills)) {
          extractedFields.criticalSkills = parsedData.skills.join(", ");
        }

        // Determine missing fields (all 10 fields) - use isValidValue to check
        let missing: string[] = [];
        // Treat "Job Position" (generic fallback) or invalid values as missing title
        if (!parsedData.jobTitle || parsedData.jobTitle === "Job Position" || !isValidValue(parsedData.jobTitle))
          missing.push("Role Title");
        if (!isValidValue(parsedData.department)) missing.push("Department");
        if (!isValidValue(parsedData.experienceLevel)) missing.push("Experience Level");
        if (!isValidValue(parsedData.location)) missing.push("Location");
        if (!isValidValue(parsedData.workModel)) missing.push("Work Model");
        if (!parsedData.skills || parsedData.skills.length === 0 || !isValidValue(parsedData.skills))
          missing.push("Critical Skills");
        if (!isValidValue(parsedData.minSalary) || !isValidValue(parsedData.maxSalary))
          missing.push("Budget/Salary Range");
        if (!parsedData.requirements || parsedData.requirements.length === 0 || !isValidValue(parsedData.requirements))
          missing.push("Non-Negotiables");
        if (!isValidValue(parsedData.timeline)) missing.push("Timeline");
        // Flexible field is rarely in job postings, so always consider it missing from URL scraping
        missing.push("Nice-to-Have Skills");

        // Calculate score based on completeness and confidence
        const fieldsProvided = 10 - missing.length;
        const completenessScore = (fieldsProvided / 10) * 100;
        const confidenceWeight = parsedData.confidence || 0.5;
        let score = Math.round(completenessScore * confidenceWeight);

        // Adjust score based on quality
        score = Math.max(16, Math.min(85, score));

        let category = "Low Clarity";
        let message = "";
        let isIncomplete = missing.length > 0;

        if (missing.length === 0) {
          // Complete information (from URL)
          score = Math.max(score, 70);
          category = "Moderate-High Clarity";
          message = `Well, well, look at you with ${
            inputIsURL
              ? "a complete job description URL"
              : "detailed information"
          }! We found: role, location, experience level, work model, and skills. Here's the reality check: we still need salary range, timeline, and non-negotiables to give you the full picture. Your score of ${score} is solid, but could swing ±15 points based on compensation and urgency. Fill in the missing pieces for an accurate assessment.`;
          isIncomplete = true; // Still missing salary, timeline, etc.
        } else if (missing.length <= 2) {
          score = Math.max(score, 60);
          category = "Moderate Clarity";
          message = `Almost there! We extracted: ${Object.keys(extractedFields)
            .map((k) => (k === "roleTitle" ? "role title" : k))
            .join(", ")}. But you're missing the critical ones: ${missing
            .slice(0, 2)
            .join(
              ", "
            )}. That ${score} you're seeing? Could swing ±15 points. Give us the full picture and we'll tell you the real clarity score.`;
        } else if (missing.length <= 5) {
          score = Math.max(score, 35);
          category = "Low Clarity";
          message = `Not bad, but here's where it gets fuzzy. We found: ${Object.keys(
            extractedFields
          )
            .map((k) => (k === "roleTitle" ? "role title" : k))
            .join(", ")}. Missing: ${missing
            .slice(0, 3)
            .join(
              ", "
            )} and more. That ${score}? It's a guess. Your real score could be 70 if you're paying competitive rates, or 20 if you're lowballing. Fill in what's missing for an accurate reality check.`;
        } else {
          score = Math.max(score, 16);
          category = "Ghost Town";

          // Check if we have any meaningful data at all
          const hasAnyData = Object.keys(extractedFields).length > 0;

          if (!hasAnyData) {
            message = `${
              inputIsURL
                ? "That URL doesn't look like a job posting."
                : "We need more details."
            } We couldn't extract any meaningful information. Your score of ${score} is basically a coin flip. This could be a great opportunity or a disaster—we simply don't know. Give us actual job details (role, skills, location, salary, etc.) and we'll give you a real assessment.`;
          } else {
            message = `${
              inputIsURL
                ? "Dropped a URL but it's thin on details."
                : "Just a job title?"
            } We found: ${Object.keys(extractedFields)
              .map((k) =>
                k === "roleTitle" ? parsedData.jobTitle : extractedFields[k]
              )
              .join(
                ", "
              )}. That's it. We gave you a ${score}, but let's be real, we know almost nothing. Your actual clarity could be 70 or it could be 10. This isn't an assessment, it's a coin flip. Give us actual details and we'll give you an actual answer.`;
          }
        }

        setMissingFields(missing);

        const incompleteData = {
          isURL: inputIsURL,
          roleDescription: roleDescription,
          extractedFields: extractedFields,
          missingFields: missing,
          parsedData: parsedData,
        };

        // Store incomplete data for debugging
        sessionStorage.setItem(
          "incompleteData",
          JSON.stringify(incompleteData)
        );

        // Convert extracted data to formData format (clean, no duplicates)
        const formData = {
          roleTitle:
            parsedData.jobTitle && parsedData.jobTitle !== "Job Position" && isValidValue(parsedData.jobTitle)
              ? parsedData.jobTitle
              : "",
          department: isValidValue(parsedData.department) ? parsedData.department : "",
          experienceLevel: isValidValue(parsedData.experienceLevel) ? parsedData.experienceLevel : "",
          location: isValidValue(parsedData.location) ? parsedData.location : "",
          workModel: isValidValue(parsedData.workModel) ? parsedData.workModel : "",
          criticalSkills: (parsedData.skills && isValidValue(parsedData.skills)) ? parsedData.skills : [], // Array of skills (merged)
          minSalary: "",
          maxSalary: "",
          nonNegotiables: (parsedData.requirements && isValidValue(parsedData.requirements)) ? parsedData.requirements.slice(0, 3).join(", ") : "", // Requirements (merged)
          flexible: "",
          timeline: "",
        };

        // Save to both locations:
        // - heroAnalysisData: for results page (when user clicks "Generate Now")
        // - formData: for chatbot ONLY if URL was scraped (when user clicks "Complete Details")
        sessionStorage.setItem("heroAnalysisData", JSON.stringify(formData));

        // Only save to formData if a URL was actually scraped (has significant data)
        // If user just typed text, don't pre-fill the chatbot
        const hasSignificantData =
          (parsedData.skills?.length > 0 && isValidValue(parsedData.skills)) ||
          isValidValue(parsedData.experienceLevel) ||
          isValidValue(parsedData.location) ||
          isValidValue(parsedData.workModel) ||
          isValidValue(parsedData.department);
        if (hasSignificantData) {
          sessionStorage.setItem("formData", JSON.stringify(formData));
          console.log("✅ Hero saved URL-scraped data to formData:", formData);
        } else {
          // Clear formData so chatbot starts fresh with 0/10
          sessionStorage.removeItem("formData");
          // Also ensure missing fields shows all 10 fields
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
              "Nice-to-Have Skills"
            ];
            setMissingFields(missing);
          }
          console.log(
            "✅ Hero cleared formData (irrelevant URL or no data, chatbot will start fresh with 0/10)"
          );
        }

        // Get AI-generated roast
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
          });

          const roastData = await roastResponse.json();
          const aiMessage = roastData.success ? roastData.roast : message; // Fallback to static message

          // Generate result with AI-generated message
          const result = {
            score: score,
            category: category,
            message: aiMessage,
            icon: <AlertTriangle className="w-12 h-12" />,
            isIncomplete: isIncomplete,
          };

          setAnalysisResult(result);
          setShowResults(true);
        } catch (roastError) {
          console.error("Error getting roast:", roastError);
          // Fallback to static message if AI fails
          const result = {
            score: score,
            category: category,
            message: message,
            icon: <AlertTriangle className="w-12 h-12" />,
            isIncomplete: isIncomplete,
          };
          setAnalysisResult(result);
          setShowResults(true);
        }
      } catch (error) {
        console.error("Error analyzing role:", error);
        // Fallback to basic analysis
        const result = {
          score: 16,
          category: "Error",
          message:
            "We couldn't analyze this role properly. Please try again or provide more details.",
          icon: <AlertTriangle className="w-12 h-12" />,
          isIncomplete: true,
        };
        setAnalysisResult(result);
        setShowResults(true);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  return (
    <section
      className="relative min-h-screen flex items-center pt-24 pb-0 md:pt-32 md:pb-4 overflow-hidden mb-8"
      style={{ backgroundColor: "#f5f5f5" }}
    >
      <div className="section-container relative z-10 w-full">
        <div className="text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-relaxed mt-8 md:mt-12"
              style={{ color: "#102a63" }}
            >
              YOUR HIRING PROCESS<br />
              IS PROBABLY TRASH ANYWAY.<br />
              <span
                className="px-2 py-0.5 rounded-lg"
                style={{ backgroundColor: "#d7f4f2", color: "#102a63" }}
              >
                PROVE US WRONG.
              </span>
            </h1>

            <p
              className="text-xl md:text-2xl mb-4 max-w-3xl mx-auto leading-relaxed"
              style={{ color: "#102a63", opacity: 0.9 }}
            >
              Most roles fail before they hit the market.{" "}
              <span className="font-bold" style={{ color: "#102a63" }}>
                Wrong scope
              </span>
              ,{" "}
              <span className="font-bold" style={{ color: "#102a63" }}>
                wrong salary
              </span>
              ,{" "}
              <span className="font-bold" style={{ color: "#102a63" }}>
                wrong expectations
              </span>
              .
            </p>

            <p
              className="text-base md:text-lg mb-4 max-w-3xl mx-auto leading-relaxed"
              style={{ color: "#102a63", opacity: 0.8 }}
            >
              Paste a job URL or add a few role details. Get a full hiring
              strategy in under{" "}
              <span
                className="px-1.5 py-0.5 rounded-lg font-bold"
                style={{ backgroundColor: "#d7f4f2", color: "#102a63" }}
              >
                5 minutes
              </span>
              .
            </p>

            {/* Full Screen Loading Dialog */}
            <AnimatePresence>
              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
                  style={{
                    height: "100vh",
                    width: "100vw",
                    backgroundColor: "#f5f5f5",
                  }}
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
                    <motion.div
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="mb-3"
                    >
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
                        Keep this page open to see your personalized hiring
                        analysis!
                      </p>
                    </motion.div>

                    {/* Progress Bar */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mb-3 w-full max-w-md mx-auto"
                    >
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
                        <motion.div
                          className="h-full rounded-full relative"
                          style={{
                            width: `${loadingProgress}%`,
                            backgroundColor: "#278f8c",
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${loadingProgress}%` }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
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
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Time Estimate */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="mb-3 space-y-1"
                    >
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
                        This is completely normal — we&apos;re doing deep market
                        research for you
                      </p>
                    </motion.div>

                    {/* Status Messages */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="mb-3"
                    >
                      <p
                        className="text-base md:text-lg font-medium mb-2"
                        style={{ color: "#102a63" }}
                      >
                        We&apos;re analyzing opportunities for you
                      </p>

                      {/* Progress Steps */}
                      <div className="flex items-center justify-center space-x-1.5 text-sm mb-3">
                        <motion.span
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          style={{ color: "#278f8c" }}
                          className="font-medium"
                        >
                          Starting
                        </motion.span>
                        <span style={{ color: "#102a63", opacity: 0.4 }}>
                          →
                        </span>
                        <motion.span
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: 0.5,
                          }}
                          style={{ color: "#278f8c" }}
                          className="font-medium"
                        >
                          Searching
                        </motion.span>
                        <span style={{ color: "#102a63", opacity: 0.4 }}>
                          →
                        </span>
                        <motion.span
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: 1,
                          }}
                          style={{ color: "#278f8c" }}
                          className="font-medium"
                        >
                          Analyzing
                        </motion.span>
                        <span style={{ color: "#102a63", opacity: 0.4 }}>
                          →
                        </span>
                        <motion.span
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: 1.5,
                          }}
                          style={{ color: "#278f8c" }}
                          className="font-medium"
                        >
                          Complete
                        </motion.span>
                      </div>

                      {/* Rotating Trust Messages */}
                      <motion.div
                        key={loadingMessageIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5 }}
                        className="min-h-[45px] flex items-center justify-center px-2"
                      >
                        <div
                          className="px-3 py-2 rounded-lg bg-white shadow-md border flex items-center space-x-2 max-w-full"
                          style={{ borderColor: "#d7f4f2" }}
                        >
                          {(() => {
                            const IconComponent =
                              loadingMessages[loadingMessageIndex].icon;
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
                      </motion.div>
                    </motion.div>

                    {/* Inspiration Section */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
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
                        always the ones with the most experience — they&apos;re
                        the ones who understand your mission and bring the
                        energy to execute it.
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Role Description Input Section */}
            <div className="max-w-3xl mx-auto mb-4">
              <div className="flex flex-col gap-3 p-2 bg-white rounded-xl shadow-lg border border-gray-200 relative">
                <div className="flex-1 relative">
                  <Textarea
                    value={roleDescription}
                    onChange={(e) => setRoleDescription(e.target.value)}
                    placeholder="Paste a job URL or add a few role details. Get a full hiring strategy in under 5 minutes."
                    className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
                    disabled={isAnalyzing}
                    rows={3}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleAnalyze();
                      }
                    }}
                  />
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !roleDescription.trim()}
                  className="btn-primary w-full flex items-center justify-center space-x-2 text-xs px-6 py-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <span>Run My Reality Check</span>
                  )}
                </button>
              </div>
            </div>

            {/* Analysis Results Section */}
            <AnimatePresence>
              {showResults && analysisResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="max-w-2xl mx-auto mb-8 mt-6"
                >
                  <div
                    className="bg-white rounded-xl shadow-lg border-2 p-6 md:p-8"
                    style={{ borderColor: "#d7f4f2" }}
                  >
                    {/* Score Header */}
                    <div className="flex flex-col items-center mb-4">
                      <div className="mb-3" style={{ color: "#278f8c" }}>
                        {analysisResult.icon}
                      </div>
                      <div className="text-center">
                        <div
                          className="text-5xl md:text-6xl font-bold mb-1"
                          style={{ color: "#278f8c" }}
                        >
                          {analysisResult.score}
                          <span className="text-3xl md:text-4xl">/100</span>
                        </div>
                        <div
                          className="text-xl md:text-2xl font-bold"
                          style={{ color: "#102a63" }}
                        >
                          {analysisResult.category}
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="mb-6">
                      <p
                        className="text-base md:text-lg leading-relaxed text-center"
                        style={{ color: "#102a63" }}
                      >
                        {analysisResult.message}
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-5"></div>

                    {/* Call to Action Section */}
                    <div className="text-center">
                      {analysisResult.isIncomplete ? (
                        <>
                          {/* Show uncertainty warning */}
                          <div className="mb-4">
                            <p
                              className="text-sm font-bold mb-3"
                              style={{ color: "#102a63" }}
                            >
                              Complete These Fields for Better Results:
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center mb-4">
                              {missingFields.map(
                                (field: string, idx: number) => (
                                  <span
                                    key={idx}
                                    className="text-xs px-3 py-1 rounded-full font-medium"
                                    style={{
                                      backgroundColor: "#d7f4f2",
                                      color: "#102a63",
                                    }}
                                  >
                                    {field}
                                  </span>
                                )
                              )}
                            </div>
                            <p
                              className="text-xs text-center mb-3 leading-relaxed"
                              style={{ color: "#102a63", opacity: 0.8 }}
                            >
                              Choose your path: Complete fields for accuracy, or
                              generate quickly with what we have.
                            </p>
                          </div>

                          <div className="mb-4">
                            {/* Two equal buttons side by side on large screens */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                              {/* Primary CTA - Complete for better results */}
                              <button
                                onClick={() => setShowChatModal(true)}
                                className="btn-primary inline-flex items-center justify-center space-x-2 text-sm px-4 py-2.5"
                              >
                                <Target className="w-4 h-4" />
                                <span>Complete Missing Fields</span>
                              </button>

                              {/* Secondary CTA - Generate with what we have (for people in a hurry) */}
                              <Link
                                href="/results"
                                className="inline-flex items-center justify-center space-x-2 text-sm px-4 py-2.5 border-2 rounded-lg font-medium transition-all hover:bg-gray-50"
                                style={{
                                  color: "#278f8c",
                                  borderColor: "#278f8c",
                                }}
                              >
                                <Sparkles className="w-4 h-4" />
                                <span>Generate Anyway (Quick)</span>
                              </Link>
                            </div>

                            <p
                              className="text-xs text-center leading-relaxed"
                              style={{ color: "#102a63", opacity: 0.7 }}
                            >
                              Complete fields for accurate results, or generate
                              quickly with what we have
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="mb-4">
                          <Link
                            href="/results"
                            className="btn-primary inline-flex items-center justify-center space-x-2 text-sm px-6 py-3 mb-2 w-full sm:w-auto"
                          >
                            <Sparkles className="w-4 h-4" />
                            <span>
                              Get Your Full HireCard Strategy For This Role
                            </span>
                          </Link>
                          <p
                            className="text-xs md:text-sm leading-relaxed font-medium"
                            style={{ color: "#102a63", opacity: 0.9 }}
                          >
                            Complete clarity analysis, competitor benchmarking,
                            sourcing strategy, and battle-tested reality check,
                            tailored to your specific role. Stop guessing, start
                            hiring with confidence.
                          </p>
                        </div>
                      )}
                      <button
                        onClick={() => {
                          setShowResults(false);
                          setRoleDescription("");
                          setLoadingProgress(0);
                        }}
                        className="text-xs font-medium underline hover:no-underline transition-all"
                        style={{ color: "#278f8c" }}
                      >
                        Try Another Role
                      </button>
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
                  onClick={() => setShowChatModal(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col"
                    style={{ height: "85vh", maxHeight: "700px" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Modal Header */}
                    <div
                      className="flex items-center justify-between p-4 border-b"
                      style={{ backgroundColor: "#f5f5f5" }}
                    >
                      <div className="flex items-center space-x-2">
                        <Sparkles
                          className="w-5 h-5"
                          style={{ color: "#278f8c" }}
                        />
                        <h2
                          className="text-lg font-bold"
                          style={{ color: "#102a63" }}
                        >
                          Complete Your Hiring Strategy
                        </h2>
                      </div>
                      <button
                        onClick={() => setShowChatModal(false)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        aria-label="Close"
                      >
                        <svg
                          className="w-5 h-5"
                          style={{ color: "#102a63" }}
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>

                    {/* Modal Content - Chatbot */}
                    <div
                      className="flex-1 min-h-0 flex flex-col"
                      style={{ backgroundColor: "#f5f5f5" }}
                    >
                      <div className="p-4 flex-1 flex flex-col min-h-0">
                        <ConversationalChatbot />
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <p
              className="text-sm mb-12 mt-6"
              style={{ color: "#102a63", opacity: 0.8 }}
            >
              No pressure. It&apos;s only your hiring budget on the line.
            </p>

            <div
              className="flex flex-wrap items-center justify-center gap-8 text-base mt-12"
              style={{ color: "#102a63" }}
            >
              <div className="flex items-center space-x-2">
                <Zap
                  className="w-7 h-7"
                  style={{ color: "#278f8c", fill: "#278f8c" }}
                />
                <span className="font-medium">Faster than regret</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-7 h-7" style={{ color: "#278f8c" }} />
                <span className="font-medium">Brutally honest scoring</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-7 h-7" style={{ color: "#278f8c" }} />
                <span className="font-medium">No BS, just data</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
