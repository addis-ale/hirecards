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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

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
          "Your chances of hiring the right person for this role, with your likely budget and location, are extremely low. Most teams lose 8–12 weeks only to restart from scratch. You need a clear hiring strategy before opening this role.",
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
      return text.toLowerCase().includes('http') || text.includes('www.');
    }
  };

  const getURLQuality = (url: string): 'poor' | 'well' | 'good' | 'great' | 'default' => {
    const lowerURL = url.toLowerCase();
    if (lowerURL.endsWith('/poor')) return 'poor';
    if (lowerURL.endsWith('/well')) return 'well';
    if (lowerURL.endsWith('/good')) return 'good';
    if (lowerURL.endsWith('/great')) return 'great';
    return 'default';
  };

  const handleAnalyze = () => {
    if (roleDescription.trim()) {
      setIsAnalyzing(true);

      // Simulate AI processing delay
      setTimeout(() => {
        const inputIsURL = isURL(roleDescription);
        
        let missing: string[] = [];
        let extractedFields: any = {};
        let score = 16;
        let category = "Low Feasibility";
        let message = "";
        let isIncomplete = true;

        if (inputIsURL) {
          const quality = getURLQuality(roleDescription);
          
          switch (quality) {
            case 'poor':
              // Only role and location - 8 fields missing
              extractedFields = {
                roleTitle: "Senior Backend Engineer",
                location: "San Francisco, CA",
              };
              missing = ["Experience Level", "Work Model", "Critical Skills", "Budget/Salary Range", "Why Hiring Now", "Non-Negotiables", "Timeline", "Flexible"];
              score = 31;
              category = "Low Feasibility";
              message = "Okay, so you dropped a URL like you're trying to impress us. Cool. We scraped it. Found a title and maybe a location. But here's the thing: your job description is basically a ghost town. No salary range? No must-haves? No timeline? We're giving you a 31, but honestly? That's just our best guess based on scraps. Your real score could be 60 if you're paying well, or 15 if you're living in fantasy land. Right now we're reading tea leaves. Want the actual truth? Fill in what's missing.";
              break;
              
            case 'well':
              // 4-6 fields missing
              extractedFields = {
                roleTitle: "Product Manager",
                location: "Remote (US)",
                experienceLevel: "4-6 years",
                workModel: "Fully Remote",
                criticalSkills: "Product strategy, user research, agile",
              };
              missing = ["Budget/Salary Range", "Why Hiring Now", "Non-Negotiables", "Timeline", "Flexible"];
              score = 58;
              category = "Moderate Feasibility";
              message = "Not bad! You've got most of the picture. We found role details, location, experience level, skills, good stuff. But here's where it gets fuzzy: no salary range, no timeline, no non-negotiables. That 58 you're seeing? It's a guess. If you're paying competitive rates with realistic expectations, you might hit 70-75. If you're lowballing or expecting to hire yesterday, you're looking at 40-45. See the problem? We're reading tea leaves. Fill in what's missing, and we'll tell you if you're competitive or dreaming.";
              break;
              
            case 'good':
              // 1-3 fields missing
              extractedFields = {
                roleTitle: "Senior Frontend Developer",
                location: "Austin, TX",
                experienceLevel: "5-7 years",
                workModel: "Hybrid (3 days on-site)",
                criticalSkills: "React, TypeScript, Next.js, Node.js",
                whyHiring: "Scaling product team for new feature launch",
                nonNegotiables: "Strong frontend architecture experience",
              };
              missing = ["Budget/Salary Range", "Timeline", "Flexible"];
              score = 65;
              category = "Moderate Feasibility";
              message = "Almost there! You've got most of the puzzle pieces. We found role details, location, experience, skills, even why you're hiring. Nice. But you're missing the big ones: salary range and timeline. That 65 you're seeing? Could swing ±15 points. If you're paying $140K-$180K (competitive for Austin) with a 6-8 week timeline, you're golden, might hit 75-80. If you're offering $100K and want someone yesterday, you're looking at 50-55. Fill in the gaps and we'll give you the real number, not a guess.";
              break;
              
            case 'great':
              // All fields present
              extractedFields = {
                roleTitle: "Backend Engineer",
                location: "New York, NY",
                experienceLevel: "3-5 years",
                workModel: "Hybrid (2 days on-site)",
                criticalSkills: "Python, Django, PostgreSQL, AWS",
                salary: "$130K - $160K",
                whyHiring: "Expanding engineering team",
                nonNegotiables: "Backend architecture experience",
                timeline: "6-8 weeks",
                flexible: "Open to different framework experience",
              };
              missing = [];
              score = 72;
              category = "Moderate-High Feasibility";
              message = "Well, well, look at you with a complete job description! Gold star for effort. We found everything we need... on paper. Here's the reality check: your salary range of $130K-$160K for NYC is competitive but on the lower end for mid-level engineers. The market's closer to $140K-$170K. Your timeline is solid, your requirements are clear, and the hybrid model is reasonable. You'll get applicants, but expect some to negotiate up or drop off for better offers. You're not asking for unicorns, which puts you ahead of 80% of job postings. Bump the range slightly and you're golden.";
              isIncomplete = false;
              break;
              
            default:
              // Default poor case
              extractedFields = {
                roleTitle: "Senior Backend Engineer",
                location: "San Francisco, CA",
              };
              missing = ["Experience Level", "Work Model", "Critical Skills", "Budget/Salary Range", "Why Hiring Now", "Non-Negotiables", "Timeline"];
              score = 31;
              category = "Low Feasibility";
              message = "Okay, so you dropped a URL like you're trying to impress us. Cool. We scraped it. Found a title and maybe a location. But here's the thing: your job description is basically a ghost town. No salary range? No must-haves? No timeline? We're giving you a 31, but honestly? That's just our best guess based on scraps. Your real score could be 60 if you're paying well, or 15 if you're living in fantasy land. Right now we're reading tea leaves. Want the actual truth? Fill in what's missing.";
              break;
          }
        } else {
          // Just job role - no URL
          extractedFields = {
            roleTitle: roleDescription,
          };
          missing = ["Experience Level", "Location", "Work Model", "Critical Skills", "Budget/Salary Range", "Why Hiring Now", "Non-Negotiables", "Timeline"];
          score = 16;
          category = "Ghost Town";
          message = "Just a job title? Really? That's like walking into a café and saying 'coffee' and expecting a masterpiece. We gave you a 16, but let's be real, we know nothing. Your actual feasibility could be 70 if you've got a solid offer, or it could be 10 if you're asking for a unicorn on a shoestring budget. This isn't an assessment, it's a coin flip. Give us actual details and we'll give you an actual answer.";
        }
        
        setMissingFields(missing);
        
        const mockIncompleteData = {
          isURL: inputIsURL,
          roleDescription: roleDescription,
          extractedFields: extractedFields,
          missingFields: missing,
        };
        
        // Store incomplete data
        sessionStorage.setItem("incompleteData", JSON.stringify(mockIncompleteData));
        
        // Generate result
        const result = {
          score: score,
          category: category,
          message: message,
          icon: <AlertTriangle className="w-12 h-12" />,
          isIncomplete: isIncomplete,
        };
        
        setAnalysisResult(result);
        setShowResults(true);
        setIsAnalyzing(false);
      }, 1500);
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
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-relaxed mt-16 md:mt-20"
              style={{ color: "#102a63" }}
            >
              <span className="block mb-3">
                Instant{" "}
                <span
                  className="px-3 py-1 rounded-lg"
                  style={{ backgroundColor: "#d7f4f2", color: "#102a63" }}
                >
                  Hiring Reality Check.
                </span>
              </span>
              <span className="text-2xl md:text-3xl lg:text-4xl block mb-2">
                Before You Waste 2 Months.
              </span>
              <span className="text-xl md:text-2xl lg:text-3xl block">
                <span
                  className="px-3 py-1 rounded-lg"
                  style={{ backgroundColor: "#d7f4f2", color: "#102a63" }}
                >
                  (And Your Hiring Budget)
                </span>
              </span>
            </h1>

            <p
              className="text-lg md:text-xl mb-6 max-w-3xl mx-auto leading-relaxed"
              style={{ color: "#102a63", opacity: 0.8 }}
            >
              Enter a job role or paste a job description URL. We&apos;ll tell you exactly why
              nobody&apos;s applying, or if you&apos;re actually offering
              market rate for a unicorn engineer.
            </p>

            {/* Role Description Input Section */}
            <div className="max-w-3xl mx-auto mb-4">
              <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={roleDescription}
                    onChange={(e) => setRoleDescription(e.target.value)}
                    placeholder="e.g., Senior Backend Engineer in Amsterdam or https://yourcompany.com/jobs/123"
                    className="w-full px-4 py-3 text-sm bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleAnalyze();
                      }
                    }}
                  />
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !roleDescription.trim()}
                  className="btn-primary flex items-center justify-center space-x-2 text-sm px-6 py-3 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <span>Reality Check</span>
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
                          <div className="mb-4 p-4 bg-orange-50 border-2 border-orange-300 rounded-lg">
                            <p className="text-xs font-bold mb-2" style={{ color: "#102a63" }}>
                              Missing Critical Data:
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center">
                              {missingFields.map((field: string, idx: number) => (
                                <span 
                                  key={idx}
                                  className="text-xs px-3 py-1 bg-white border border-orange-300 rounded-full"
                                  style={{ color: "#102a63" }}
                                >
                                  {field}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <Link
                              href="/create"
                              className="btn-primary inline-flex items-center justify-center space-x-2 text-sm px-6 py-3 mb-2 w-full sm:w-auto"
                            >
                              <Sparkles className="w-4 h-4" />
                              <span>
                                Stop Guessing. Get Accurate Results.
                              </span>
                            </Link>
                            <p
                              className="text-xs md:text-sm leading-relaxed font-medium"
                              style={{ color: "#102a63", opacity: 0.9 }}
                            >
                              Fill the blanks and we&apos;ll tell you the truth, whether this role is solid gold 
                              or hiring fantasy. Complete analysis with real market data, not guesswork.
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
                            Complete feasibility analysis, competitor
                            benchmarking, sourcing strategy, and battle-tested
                            reality check, tailored to your specific role. Stop
                            guessing, start hiring with confidence.
                          </p>
                        </div>
                      )}
                      <button
                        onClick={() => {
                          setShowResults(false);
                          setRoleDescription("");
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

            <p
              className="text-sm mb-10"
              style={{ color: "#102a63", opacity: 0.8 }}
            >
              No pressure. It&apos;s only your hiring budget on the line.
            </p>

            <div
              className="flex flex-wrap items-center justify-center gap-8 text-base mt-8"
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
