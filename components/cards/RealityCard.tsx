"use client";

import React from "react";
import { Target } from "lucide-react";
import { Section } from "@/components/ui/Section";

export const RealityCard = () => {
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
          <p className="text-sm text-gray-600">Feasibility Assessment</p>
        </div>
      </div>

      {/* Feasibility Score */}
      <div className="bg-gradient-to-br from-[#278f8c] to-[#1a6764] text-white rounded-xl p-8 text-center">
        <p className="text-sm font-medium mb-2 opacity-90">Feasibility Score</p>
        <div className="text-6xl font-bold mb-3">5.5/10</div>
        <p className="text-xl font-medium mb-2">Possible with alignment and speed</p>
        <p className="text-sm opacity-80">
          Not possible with slow process or strict constraints
        </p>
      </div>

      {/* What Helps */}
      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
        <h3 className="font-bold text-lg mb-2 text-green-700">
          What Helps
        </h3>
        <ul className="space-y-1">
          {[
            "Modern stack",
            "Strong brand",
            "Product work"
          ].map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-green-900">
              <span className="text-green-500 font-bold">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* What Hurts */}
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
        <h3 className="font-bold text-lg mb-2 text-red-700">
          What Hurts
        </h3>
        <ul className="space-y-1">
          {[
            "Talent scarcity",
            "Location limits",
            "Slow process"
          ].map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-red-900">
              <span className="text-red-500 font-bold">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
