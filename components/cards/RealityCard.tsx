"use client";

import React from "react";
import { Target, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";

interface RealityCardProps {
  feasibilityScore: string;
  feasibilityMessage: string;
  keyInsights: string[];
  marketConditions: string[];
  dataSource?: string;
}

export const RealityCard = ({
  feasibilityScore,
  feasibilityMessage,
  keyInsights,
  marketConditions,
  dataSource
}: RealityCardProps) => {
  
  console.log("🎯 RealityCard received props:", { feasibilityScore, feasibilityMessage, keyInsights, marketConditions, dataSource });
  
  if (!feasibilityScore || !keyInsights || !marketConditions) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-bold text-red-600 mb-2">No Dynamic Data Available</h3>
        <p className="text-sm text-red-700">LinkedIn data was not loaded. Generate cards again.</p>
      </div>
    );
  }

  const scoreNum = parseInt(feasibilityScore.split('/')[0]);
  const scoreColor = scoreNum >= 7 ? "#278f8c" : scoreNum >= 5 ? "#f59e0b" : "#ef4444";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#278f8c] to-[#1a6764] flex items-center justify-center">
          <Target className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "#102a63" }}>
            Reality Card
          </h2>
          <p className="text-sm text-gray-600">Feasibility score and market reality based on LinkedIn data.</p>
        </div>
      </div>

      {/* Feasibility Score */}
      <div className="bg-gradient-to-br from-[#278f8c] to-[#1a6764] text-white rounded-xl p-8 text-center">
        <p className="text-sm font-medium mb-2 opacity-90">Feasibility Score</p>
        <div className="text-6xl font-bold mb-3">{feasibilityScore}</div>
        <p className="text-xl font-medium mb-2">{feasibilityMessage}</p>
        {dataSource && (
          <p className="text-sm opacity-80 mt-3">
            {dataSource}
          </p>
        )}
      </div>

      {/* Key Insights */}
      <div>
        <h3 className="font-bold text-lg mb-3" style={{ color: "#102a63" }}>
          Key Insights from LinkedIn
        </h3>
        <ul className="space-y-2">
          {keyInsights.map((insight, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm p-3 bg-blue-50 rounded-lg border border-blue-200" style={{ color: "#102a63" }}>
              <span className="text-blue-500 font-bold">•</span>
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Market Conditions */}
      {marketConditions.length > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
          <h3 className="font-bold text-lg mb-3 text-amber-900">
            Market Conditions
          </h3>
          <ul className="space-y-2">
            {marketConditions.map((condition, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <span>{condition}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bottom Line */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2" style={{ color: "#102a63" }}>
          <Target className="w-5 h-5 text-[#278f8c]" />
          The Bottom Line
        </h3>
        <p className="text-sm text-gray-800">
          Based on real LinkedIn market data, this hire is <strong style={{ color: scoreColor }}>{feasibilityMessage.toLowerCase()}</strong>. 
          The market is competitive with {marketConditions[0]?.toLowerCase() || "active hiring"}.
        </p>
      </div>
    </div>
  );
};
