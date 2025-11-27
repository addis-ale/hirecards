"use client";

import React from "react";
import { Target, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";

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
          <p className="text-sm text-gray-600">Feasibility & Hiring Conditions</p>
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

      {/* Reality Check */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <h3 className="font-bold text-lg mb-3" style={{ color: "#102a63" }}>
          Reality Check
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "#102a63" }}>
          This hire is feasible but challenging. You&apos;re not sourcing an entry-level analyst—you&apos;re competing for senior Analytics Engineers who are already employed, well-compensated, and selective about where they go next.
        </p>
        <p className="text-sm leading-relaxed mt-3" style={{ color: "#102a63" }}>
          Winning here requires competitive compensation, a tight fast hiring loop, consistent internal alignment, and clear ownership. Half-measures won&apos;t work in this market.
        </p>
      </div>

      {/* Key Insights */}
      <div>
        <h3 className="font-bold text-lg mb-3" style={{ color: "#102a63" }}>
          Key Insights
        </h3>
        <ul className="space-y-2">
          {[
            { label: "Market is tight", desc: "Senior Analytics Engineers are fully employed. Outbound sourcing is mandatory." },
            { label: "Speed wins", desc: "If your loop is slower than 10–14 days, every top-tier candidate evaporates." },
            { label: "Compensation reality", desc: "If you offer €80k, you won't hire a senior—you'll hire someone who thinks they're senior." }
          ].map((insight, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm" style={{ color: "#102a63" }}>
              <span className="text-blue-500 font-bold">•</span>
              <span>
                <strong>{insight.label}:</strong> {insight.desc}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* What Helps Your Case */}
      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
        <h3 className="font-bold text-lg mb-3 text-green-700">
          What Helps Your Case
        </h3>
        <ul className="space-y-2">
          {[
            "Modern stack (dbt, Snowflake, Looker)",
            "Customer-facing product impact",
            "Strong brand + scale-up momentum",
            "Clear ownership and autonomy in the Insights product"
          ].map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-green-900">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* What Hurts Your Case */}
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
        <h3 className="font-bold text-lg mb-3 text-red-700">
          What Hurts Your Case
        </h3>
        <ul className="space-y-2">
          {[
            "Amsterdam-only requirement",
            "Slow or unclear interview loop",
            "Comp ceilings below market",
            "Misalignment between Data, PM & Engineering"
          ].map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-red-900">
              <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Hidden Bottleneck */}
      <Callout tone="danger" title="Hidden Bottleneck">
        <strong>Stakeholder alignment.</strong> If PM, Data, and Engineering want different outcomes, no candidate will pass all interviews. This is the #1 reason these searches restart.
      </Callout>

      {/* Timeline to Failure */}
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
        <div className="flex items-start gap-2">
          <Clock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-base mb-2 text-yellow-900">
              Timeline to Failure
            </h3>
            <p className="text-sm text-yellow-900">
              If alignment isn&apos;t locked in during week 1 → expect the search to stall and restart around week 6.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2" style={{ color: "#102a63" }}>
          <Target className="w-5 h-5 text-[#278f8c]" />
          The Bottom Line
        </h3>
        <div className="space-y-3 text-sm text-gray-800">
          <p>
            <strong className="text-[#102a63]">Move fast</strong> (10-14 day loop), 
            <strong className="text-[#102a63]"> pay market rate</strong> (€95k-110k), and 
            <strong className="text-[#102a63]"> run targeted outbound</strong> sourcing—you&apos;ll hire.
          </p>
          <p>
            <strong className="text-[#102a63]">Post-and-pray</strong>, take 4-6 weeks to decide, and 
            <strong className="text-[#102a63]"> lowball on comp</strong>—you won&apos;t.
          </p>
        </div>
      </div>
    </div>
  );
};
