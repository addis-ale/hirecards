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

      {/* Reality Check */}
      <Section title="Reality Check" tone="default">
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            This role is <strong className="text-[#102a63]">feasible but challenging</strong>. You&apos;re not hiring an entry-level data analyst—you&apos;re competing for senior Analytics Engineers who are already employed, well-compensated, and selective about their next move.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Success requires a combination of competitive positioning, efficient process, and realistic expectations. Half-measures won&apos;t work in this market.
          </p>
        </div>
      </Section>

      {/* What Helps */}
      <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
        <h3 className="font-bold text-lg mb-4 text-green-700">
          ✓ What Helps Your Case
        </h3>
        <ul className="space-y-3">
          {[
            {
              title: "Modern stack (dbt, Snowflake, Looker)",
              desc: "Analytics Engineers want to work with modern tools, not legacy systems"
            },
            {
              title: "Strong brand or product",
              desc: "Recognizable companies or exciting products attract passive candidates"
            },
            {
              title: "Product-focused work",
              desc: "Building data products is more attractive than maintaining dashboards"
            },
            {
              title: "Remote/hybrid flexibility",
              desc: "Expands your talent pool significantly beyond local candidates"
            },
            {
              title: "Clear growth path",
              desc: "Senior candidates want to know where they can go next"
            }
          ].map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm">
              <span className="text-green-500 font-bold mt-1 text-lg">•</span>
              <div>
                <p className="font-semibold text-green-900">{item.title}</p>
                <p className="text-green-800 opacity-90">{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* What Hurts */}
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
        <h3 className="font-bold text-lg mb-4 text-red-700">
          ✗ What Hurts Your Case
        </h3>
        <ul className="space-y-3">
          {[
            {
              title: "Severe talent scarcity",
              desc: "Only ~200-300 qualified Analytics Engineers exist in your target market"
            },
            {
              title: "Office-only requirement",
              desc: "Eliminates 60-70% of potential candidates who prefer remote/hybrid"
            },
            {
              title: "Slow hiring process (>14 days)",
              desc: "Top candidates receive multiple offers and move fast"
            },
            {
              title: "Below-market compensation",
              desc: "Offering €80k when market rate is €95-110k won't attract seniors"
            },
            {
              title: "Vague role definition",
              desc: "Unclear expectations signal disorganization and future frustration"
            },
            {
              title: "Legacy tech stack",
              desc: "Senior engineers avoid outdated tools that limit their career growth"
            }
          ].map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm">
              <span className="text-red-500 font-bold mt-1 text-lg">•</span>
              <div>
                <p className="font-semibold text-red-900">{item.title}</p>
                <p className="text-red-800 opacity-90">{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Line */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2" style={{ color: "#102a63" }}>
          <Target className="w-5 h-5 text-[#278f8c]" />
          The Bottom Line
        </h3>
        <div className="space-y-3 text-sm text-gray-800">
          <p>
            <strong className="text-[#102a63]">If you move fast</strong> (10-14 day loop), 
            <strong className="text-[#102a63]"> pay market rate</strong> (€95k-110k), and 
            <strong className="text-[#102a63]"> run targeted outbound</strong> sourcing—you&apos;ll hire.
          </p>
          <p>
            <strong className="text-[#102a63]">If you post-and-pray</strong>, take 4-6 weeks to decide, and 
            <strong className="text-[#102a63]"> lowball on comp</strong>—you won&apos;t.
          </p>
          <p className="pt-2 border-t border-blue-200 mt-4">
            <strong className="text-[#102a63]">Reality doesn&apos;t care about your budget constraints or approval chains.</strong> The market will do what it does. Your job is to adapt or accept the consequences.
          </p>
        </div>
      </div>
    </div>
  );
};
