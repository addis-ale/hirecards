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
        <h3 className="font-bold text-lg mb-3 text-green-700">
          What Helps
        </h3>
        <ul className="space-y-2">
          {[
            "Modern stack",
            "Strong brand",
            "Product-facing work",
            "AI component = appeal"
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
        <h3 className="font-bold text-lg mb-3 text-red-700">
          What Hurts
        </h3>
        <ul className="space-y-2">
          {[
            "Senior AE scarcity",
            "Amsterdam-only",
            "Slow loop",
            "Comp ceilings"
          ].map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-red-900">
              <span className="text-red-500 font-bold">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Brutal Truth */}
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
        <h3 className="font-bold text-lg mb-2 text-red-700">
          Brutal Truth
        </h3>
        <p className="text-sm font-medium text-red-900">
          You&apos;re not the candidate&apos;s only option. You&apos;re one of many.
        </p>
      </div>

      {/* Red Flags */}
      <Section title="Red Flags" Icon={Target} tone="danger">
        <ul className="list-disc pl-5 space-y-1 md:columns-2 md:gap-8 marker:text-red-600">
          {[
            "4–6 interview stages → seniors drop",
            "No fast-track for top candidates",
            "Comp confusion",
            "Messy internal alignment"
          ].map((flag, idx) => (
            <li key={idx} className="text-[13px] leading-snug text-red-700">
              {flag}
            </li>
          ))}
        </ul>
      </Section>

      {/* Don't Do This */}
      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
        <h3 className="font-bold text-lg mb-3 text-red-700">
          Don&apos;t Do This
        </h3>
        <ul className="space-y-2">
          {[
            "Over-evaluate",
            "Delay decisions",
            "Add unnecessary stakeholders"
          ].map((dont, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-red-900">
              <span className="text-red-500 font-bold">•</span>
              <span>{dont}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Fix This Now */}
      <Section title="Fix This Now" Icon={Target} tone="success">
        <ul className="list-disc pl-5 space-y-1 md:columns-2 md:gap-8 marker:text-emerald-600">
          {[
            "Reduce loop to 3 stages",
            "Pre-approve comp band",
            "Same-week interviews",
            "Weekly alignment rituals"
          ].map((fix, idx) => (
            <li key={idx} className="text-[13px] leading-snug text-emerald-800">
              {fix}
            </li>
          ))}
        </ul>
      </Section>

      {/* Hidden Bottleneck */}
      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
        <h3 className="font-bold text-lg mb-2 text-purple-700">
          Hidden Bottleneck
        </h3>
        <p className="text-sm font-medium text-purple-900">
          <strong>Slowness.</strong> Speed is your only competitive advantage that&apos;s free.
        </p>
      </div>

      {/* Timeline to Failure */}
      <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-lg">
        <h3 className="font-bold text-lg mb-2 text-yellow-700">
          Timeline to Failure
        </h3>
        <p className="text-sm font-medium text-yellow-900">
          If your loop is slower than 10–14 days → every top-tier candidate evaporates.
        </p>
      </div>
    </div>
  );
};
