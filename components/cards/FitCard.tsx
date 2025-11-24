"use client";

import React from "react";
import { UserCheck, Target, ThumbsUp, ThumbsDown, AlertTriangle, Wrench, XCircle, Eye } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";
import { Pill } from "@/components/ui/Pill";

export const FitCard = () => {
  const motivatedBy = [
    "Ownership",
    "Impact",
    "Modern modelling standards",
    "Clean data and clear interfaces",
    "Tight PM partnership"
  ];

  const avoids = [
    "Unclear ownership",
    "Legacy BI environments",
    "Slow decision-making",
    "Chaotic business stakeholders"
  ];

  const redFlags = [
    "Wants pure DS/ML work",
    "Wants minimal stakeholder interaction",
    "Wants only dashboards"
  ];

  const donts = [
    "Pitch the role as \"modern stack, impact, ownership\" — every company says this",
    "Oversell AI elements",
    "Pretend data quality is perfect"
  ];

  const fixes = [
    "Show \"the messy truth\" early — AEs love honesty",
    "Position the role as product-building, not \"reporting\""
  ];

  const candidateEvaluation = [
    "Team competence",
    "Modelling standards",
    "Data quality",
    "PM alignment",
    "Product roadmap clarity",
    "Transparency about challenges"
  ];

  return (
    <div className="space-y-6">
      <Section title="Fit Card" subtitle="Ideal candidate persona and alignment" Icon={UserCheck} density="compact">
        <div className="space-y-4">
          {/* Persona */}
          <div className="rounded-xl border-2 p-4 bg-gradient-to-br from-blue-50 to-white" style={{ borderColor: "#278f8c" }}>
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 mt-0.5" style={{ color: "#278f8c" }} />
              <div>
                <h4 className="text-base font-bold mb-1" style={{ color: "#102a63" }}>
                  Persona: Product-Minded AE
                </h4>
              </div>
            </div>
          </div>

          {/* Motivated By */}
          <div className="rounded-xl border border-emerald-200 p-4 bg-gradient-to-br from-emerald-50 to-white">
            <div className="flex items-start gap-3">
              <ThumbsUp className="w-5 h-5 text-emerald-700 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-2" style={{ color: "#102a63" }}>
                  Motivated by:
                </h4>
                <ul className="list-disc pl-5 space-y-1 marker:text-emerald-600">
                  {motivatedBy.map((item, idx) => (
                    <li key={idx} className="text-[13px] leading-snug text-emerald-800">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Avoids */}
          <div className="rounded-xl border border-red-200 p-4 bg-gradient-to-br from-red-50 to-white">
            <div className="flex items-start gap-3">
              <ThumbsDown className="w-5 h-5 text-red-700 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-2" style={{ color: "#102a63" }}>
                  Avoids:
                </h4>
                <ul className="list-disc pl-5 space-y-1 marker:text-red-600">
                  {avoids.map((item, idx) => (
                    <li key={idx} className="text-[13px] leading-snug text-red-700">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Brutal Truth */}
          <Callout tone="danger" title="💥 Brutal Truth">
            Your strongest candidates aren&apos;t job hunting. You need to make the role sound energizing, not &quot;stable.&quot;
          </Callout>

          {/* Red Flags */}
          <Section title="⚠️ Red Flags" Icon={AlertTriangle} tone="danger">
            <ul className="list-disc pl-5 space-y-2 marker:text-red-600">
              {redFlags.map((flag, idx) => (
                <li key={idx} className="text-[13px] leading-snug text-red-700">
                  {flag}
                </li>
              ))}
            </ul>
          </Section>

          {/* Don't Do This */}
          <Section title="❌ Don't Do This" Icon={XCircle} tone="danger">
            <ul className="list-disc pl-5 space-y-2 marker:text-red-600">
              {donts.map((dont, idx) => (
                <li key={idx} className="text-[13px] leading-snug text-red-700">
                  {dont}
                </li>
              ))}
            </ul>
          </Section>

          {/* Fix This Now */}
          <Section title="🔧 Fix This Now" Icon={Wrench} tone="success">
            <ul className="list-disc pl-5 space-y-2 marker:text-emerald-600">
              {fixes.map((fix, idx) => (
                <li key={idx} className="text-[13px] leading-snug text-emerald-800">
                  {fix}
                </li>
              ))}
            </ul>
          </Section>

          {/* Candidate Flip Test */}
          <Callout tone="warning" title="🔍 Candidate Flip Test">
            <p className="text-sm mb-2 font-medium" style={{ color: "#102a63" }}>
              Candidates are evaluating YOU on:
            </p>
            <div className="flex flex-wrap gap-2">
              {candidateEvaluation.map((item, idx) => (
                <Pill key={idx} tone="orange">{item}</Pill>
              ))}
            </div>
          </Callout>
        </div>
      </Section>
    </div>
  );
};
