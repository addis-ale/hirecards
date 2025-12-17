"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { TrendingUp, AlertCircle, CheckCircle, XCircle, ArrowRight, Lightbulb } from "lucide-react";
import { calculateRealityScore } from "@/components/RealityScoreCalculator";
import { useAcceptedFixes } from "@/contexts/AcceptedFixesContext";

// Helper function to load feasibility data from sessionStorage
const loadFeasibilityDataFromStorage = () => {
  if (typeof window === "undefined") {
    // Server-side: return default values
    return {
      feasibilityScore: "5.5/10",
      feasibilityTitle: "Possible — but only if alignment, speed, and comp tighten immediately.",
      feasibilitySubtext: "Not possible if criteria remain rigid or process is slow/vague.",
      keyInsights: [],
      helpsCase: [],
      hurtsCase: [],
      realityCheck1: "",
      realityCheck2: "",
      hiddenBottleneck: "",
      timelineToFailure: "",
      bottomLine1: "",
      bottomLine2: "",
    };
  }

  try {
    const saved = sessionStorage.getItem("editableRealityCard");
    if (saved) {
      const data = JSON.parse(saved);
      return {
        feasibilityScore: data.feasibilityScore || "5.5/10",
        feasibilityTitle: data.feasibilityTitle || "Possible — but only if alignment, speed, and comp tighten immediately.",
        feasibilitySubtext: data.feasibilitySubtext || "Not possible if criteria remain rigid or process is slow/vague.",
        keyInsights: data.keyInsights || [],
        helpsCase: data.helpsCase || [],
        hurtsCase: data.hurtsCase || [],
        realityCheck1: data.realityCheck1 || "",
        realityCheck2: data.realityCheck2 || "",
        hiddenBottleneck: data.hiddenBottleneck || "",
        timelineToFailure: data.timelineToFailure || "",
        bottomLine1: data.bottomLine1 || "",
        bottomLine2: data.bottomLine2 || "",
      };
    }
  } catch (e) {
    console.error("Failed to load feasibility data:", e);
  }

  // Default values (same as EditableRealityCard component)
  return {
    feasibilityScore: "5.5/10",
    feasibilityTitle: "Possible — but only if alignment, speed, and comp tighten immediately.",
    feasibilitySubtext: "Not possible if criteria remain rigid or process is slow/vague.",
    realityCheck1: "This hire is feasible but challenging. You're not sourcing an entry-level analyst, you're competing for senior Analytics Engineers who are already employed, well-compensated, and selective about where they go next.",
    realityCheck2: "Winning here requires competitive compensation, a tight fast hiring loop, consistent internal alignment, and clear ownership. Half-measures won't work in this market.",
    keyInsights: [
      "Market is tight: Senior Analytics Engineers are fully employed. Outbound sourcing is mandatory.",
      "Speed wins: If your loop is slower than 10–14 days, every top-tier candidate evaporates.",
      "Compensation reality: If you offer €80k, you won't hire a senior, you'll hire someone who thinks they're senior.",
    ],
    helpsCase: [
      "Product-facing analytics (rare → instantly attractive)",
      "Stack that seniors actually want (dbt, Snowflake, Looker)",
      "Clear domain ownership (AEs hate \"own everything\" chaos)",
      "Strong brand with real customer impact",
    ],
    hurtsCase: [
      "Amsterdam-only requirement",
      "4+ step interview loop",
      "Compensation ceilings below €90k",
      "PM / Data / Engineering pulling in different directions",
    ],
    hiddenBottleneck: "If your team doesn't agree on what good looks like in week one, a restart around week 5–7 is guaranteed. Most searches don't fail because \"the market is hard.\" They fail because internal alignment is harder.",
    timelineToFailure: "If alignment isn't fixed by Day 7 → expect a stall/reset around week 5–7. You won't know it's happening until candidates quietly stop responding.",
    bottomLine1: "If you: ✔ align fast ✔ move within 10–14 days ✔ pay proper senior rates ✔ run targeted outbound → You will hire.",
    bottomLine2: "If not → You won't.",
  };
};

export const RealityCardBanner: React.FC = () => {
  const router = useRouter();
  const { getTotalImpact } = useAcceptedFixes();
  // Initialize state with data from sessionStorage immediately
  const [feasibilityData, setFeasibilityData] = useState<{
    feasibilityScore: string;
    feasibilityTitle: string;
    feasibilitySubtext: string;
    keyInsights?: string[];
    helpsCase?: string[];
    hurtsCase?: string[];
    realityCheck1?: string;
    realityCheck2?: string;
    hiddenBottleneck?: string;
    timelineToFailure?: string;
    bottomLine1?: string;
    bottomLine2?: string;
  }>(loadFeasibilityDataFromStorage);

  useEffect(() => {
    // Load feasibility data from sessionStorage
    const loadFeasibilityData = () => {
      const data = loadFeasibilityDataFromStorage();
      setFeasibilityData(data);
    };

    // Load immediately on mount
    loadFeasibilityData();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadFeasibilityData();
    };

    window.addEventListener("storage", handleStorageChange);
    // Also check periodically in case of same-tab updates
    const interval = setInterval(loadFeasibilityData, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Calculate the score the same way as EditableRealityCard
  // Must be called before early return to maintain hook order
  const calculatedScore = useMemo(() => {
    if (!feasibilityData) return 5.5;
    
    const baseScore = calculateRealityScore({
      feasibilityScore: feasibilityData.feasibilityScore,
      helpsCase: feasibilityData.helpsCase || [],
      hurtsCase: feasibilityData.hurtsCase || [],
      keyInsights: feasibilityData.keyInsights || [],
      realityCheck1: feasibilityData.realityCheck1 || "",
      realityCheck2: feasibilityData.realityCheck2 || "",
      hiddenBottleneck: feasibilityData.hiddenBottleneck || "",
      timelineToFailure: feasibilityData.timelineToFailure || "",
      bottomLine1: feasibilityData.bottomLine1 || "",
      bottomLine2: feasibilityData.bottomLine2 || "",
    });
    // Add accepted improvements boost from all cards (capped at 9.9)
    const totalAcceptedImpact = getTotalImpact();
    return Math.min(9.9, baseScore + totalAcceptedImpact);
  }, [
    feasibilityData,
    getTotalImpact,
  ]);

  // Parse max score from feasibilityScore string (e.g., "5.5/10" -> 10)
  const scoreMatch = feasibilityData?.feasibilityScore?.match(/(\d+\.?\d*)\s*\/\s*(\d+\.?\d*)/);
  const maxScore = scoreMatch ? parseFloat(scoreMatch[2]) : 10;
  const currentScore = calculatedScore;

  const handleCardClick = () => {
    router.push("/cards/reality");
  };

  return (
    <div className="max-w-7xl mx-auto mb-6">
      <motion.div
        whileHover={{ scale: 1.01, y: -2 }}
        whileTap={{ scale: 0.99 }}
        onClick={handleCardClick}
        className="bg-white rounded-xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all cursor-pointer overflow-hidden"
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-[#278f8c] to-[#1a6764] text-white p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold">Feasibility Score</h3>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
          {/* Score display - Centered */}
          <div className="text-center mb-6">
            <div className="relative bg-white rounded-2xl p-8 shadow-lg border-2 border-emerald-200 max-w-lg mx-auto overflow-hidden">
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-100 rounded-full -ml-12 -mb-12 opacity-50"></div>
              
              <div className="relative z-10">
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-4">Feasibility Score</p>
                <div className="flex items-baseline justify-center gap-3 mb-3">
                  <span className="text-6xl font-bold bg-gradient-to-br from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    {currentScore.toFixed(1)}
                  </span>
                  <span className="text-3xl font-semibold text-gray-400">/</span>
                  <span className="text-3xl font-bold text-gray-500">{maxScore.toFixed(1)}</span>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full">
                  <span className="text-sm font-semibold text-emerald-800">{currentScore.toFixed(1)}/{maxScore.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Content */}
          {feasibilityData.realityCheck1 && (
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4 mb-4">
              <div className="flex items-start gap-2 mb-2">
                <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <h4 className="text-sm font-bold text-blue-900">Reality Check</h4>
              </div>
              <p className="text-sm text-blue-900 mb-2">{feasibilityData.realityCheck1}</p>
              {feasibilityData.realityCheck2 && (
                <p className="text-sm text-blue-900">{feasibilityData.realityCheck2}</p>
              )}
            </div>
          )}

          {/* Key Insights */}
          {feasibilityData.keyInsights && feasibilityData.keyInsights.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-bold text-gray-900 mb-3">Key Insights</h4>
              <ul className="space-y-2">
                {feasibilityData.keyInsights.slice(0, 3).map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-blue-500 font-bold mt-0.5">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* What Helps / What Hurts */}
          <div className="grid md:grid-cols-2 gap-4">
            {feasibilityData.helpsCase && feasibilityData.helpsCase.length > 0 && (
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-sm font-bold text-emerald-900">What Helps</h4>
                </div>
                <ul className="space-y-1">
                  {feasibilityData.helpsCase.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="text-xs text-emerald-800">• {item}</li>
                  ))}
                </ul>
              </div>
            )}

            {feasibilityData.hurtsCase && feasibilityData.hurtsCase.length > 0 && (
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <h4 className="text-sm font-bold text-red-900">What Hurts</h4>
                </div>
                <ul className="space-y-1">
                  {feasibilityData.hurtsCase.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="text-xs text-red-800">• {item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* See More Button at Bottom */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#278f8c] to-[#1a6764] text-white rounded-lg hover:from-[#1a6764] hover:to-[#278f8c] transition-all font-medium shadow-md hover:shadow-lg"
            >
              See more
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

