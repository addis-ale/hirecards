"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ScoreProgressRingProps {
  currentScore: number;
  previousScore?: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  showChange?: boolean;
}

export const ScoreProgressRing: React.FC<ScoreProgressRingProps> = ({
  currentScore,
  previousScore,
  maxScore = 10,
  size = 120,
  strokeWidth = 8,
  showChange = true,
}) => {
  const [animatedScore, setAnimatedScore] = useState(previousScore || currentScore);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = (currentScore / maxScore) * 100;
  const offset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(currentScore);
    }, 100);
    return () => clearTimeout(timer);
  }, [currentScore]);

  const getScoreColor = (score: number) => {
    const ratio = score / maxScore;
    if (ratio >= 0.8) return "#10b981"; // green
    if (ratio >= 0.6) return "#f59e0b"; // amber
    if (ratio >= 0.4) return "#f97316"; // orange
    return "#ef4444"; // red
  };

  const scoreChange = previousScore !== undefined ? currentScore - previousScore : 0;
  const hasChanged = Math.abs(scoreChange) > 0.1;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getScoreColor(currentScore)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      
      {/* Score text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          key={currentScore}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-3xl font-bold"
          style={{ color: getScoreColor(currentScore) }}
        >
          {currentScore.toFixed(1)}
        </motion.div>
        <div className="text-xs text-gray-500 mt-0.5">/ {maxScore}</div>
      </div>

      {/* Change indicator */}
      {showChange && hasChanged && previousScore !== undefined && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-2 -right-2 flex items-center gap-1 px-2 py-1 bg-white rounded-full shadow-lg border"
          style={{ borderColor: scoreChange > 0 ? "#10b981" : "#ef4444" }}
        >
          {scoreChange > 0 ? (
            <TrendingUp className="w-4 h-4 text-green-600" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-600" />
          )}
          <span
            className="text-xs font-bold"
            style={{ color: scoreChange > 0 ? "#10b981" : "#ef4444" }}
          >
            {scoreChange > 0 ? "+" : ""}
            {scoreChange.toFixed(1)}
          </span>
        </motion.div>
      )}
    </div>
  );
};

