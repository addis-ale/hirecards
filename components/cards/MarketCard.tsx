"use client";

import React from "react";
import { TrendingUp } from "lucide-react";
import { Section } from "@/components/ui/Section";

interface MarketCardProps {
  talentPool: {
    local: number;
    relocation: number;
    remote: number;
  };
  marketConditions: string[];
  talentSupply?: Array<{ level: string; status: "high" | "low" | "very-low" }>;
  insights?: string[];
  dataSource?: string;
}

export const MarketCard = ({
  talentPool,
  marketConditions,
  talentSupply,
  insights = [],
  dataSource
}: MarketCardProps) => {
  
  console.log("🌍 MarketCard received props:", { talentPool, marketConditions, insights, dataSource });
  
  if (!talentPool || !marketConditions) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-bold text-red-600 mb-2">No Dynamic Data Available</h3>
        <p className="text-sm text-red-700">LinkedIn data was not loaded.</p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#278f8c] to-[#1a6764] flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "#102a63" }}>
            Market Card
          </h2>
          <p className="text-sm text-gray-600">How big the talent pool is and how competitive the market is for this profile.</p>
        </div>
      </div>

      {/* Talent Pool Estimate */}
      <div>
        <h3 className="font-bold text-lg mb-3" style={{ color: "#102a63" }}>
          Talent Pool Estimate
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold mb-1" style={{ color: "#278f8c" }}>
              {talentPool.local || 300}
            </div>
            <p className="text-sm font-medium text-gray-600">Local Market</p>
            <p className="text-xs text-gray-500 mt-1">Based on LinkedIn data</p>
          </div>
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold mb-1" style={{ color: "#278f8c" }}>
              ~{talentPool.relocation || 1500}+
            </div>
            <p className="text-sm font-medium text-gray-600">With Relocation</p>
            <p className="text-xs text-gray-500 mt-1">Estimated</p>
          </div>
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold mb-1" style={{ color: "#278f8c" }}>
              ~{talentPool.remote || 3000}+
            </div>
            <p className="text-sm font-medium text-gray-600">Remote/Flexible</p>
            <p className="text-xs text-gray-500 mt-1">Estimated</p>
          </div>
        </div>
        {dataSource && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            {dataSource}
          </p>
        )}
      </div>

      {/* Dynamic Insights */}
      {insights.length > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <h4 className="text-sm font-semibold mb-2" style={{ color: "#102a63" }}>
            Market Insights
          </h4>
          <ul className="space-y-1">
            {insights.map((insight, idx) => (
              <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Market Conditions */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <h3 className="font-bold text-lg mb-3" style={{ color: "#102a63" }}>
          Market Conditions
        </h3>
        <ul className="space-y-2">
          {[
            "Top talent is employed",
            "High competition",
            "Outbound required"
          ].map((condition, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm" style={{ color: "#102a63" }}>
              <span className="text-blue-500 font-bold">•</span>
              <span>{condition}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Talent Supply */}
      <div>
        <h3 className="font-bold text-lg mb-3" style={{ color: "#102a63" }}>
          Talent Supply
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-2 bg-green-50 border border-green-200 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <div className="flex-1">
              <p className="text-xs font-bold" style={{ color: "#102a63" }}>High for mid-level</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="flex-1">
              <p className="text-xs font-bold" style={{ color: "#102a63" }}>Low for senior</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2 bg-red-50 border border-red-200 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="flex-1">
              <p className="text-xs font-bold" style={{ color: "#102a63" }}>Very low for product-minded</p>
            </div>
          </div>
        </div>
      </div>

      {/* Brutal Truth */}
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
        <h3 className="font-bold text-lg mb-2 text-red-700">
          Brutal Truth
        </h3>
        <p className="text-sm font-medium text-red-900">
          Strict location + low comp = long search.
        </p>
      </div>
    </div>
  );
};
