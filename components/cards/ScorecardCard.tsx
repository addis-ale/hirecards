"use client";

import React from "react";
import { ClipboardList, Target, AlertTriangle, Wrench, XCircle } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";

export const ScorecardCard = () => {
  const competencies = [
    "Modelling",
    "Data quality discipline",
    "Product thinking",
    "Collaboration",
    "Communication",
    "Ownership"
  ];

  const ratingAnchors = [
    { rating: "1", description: "slows the team" },
    { rating: "2", description: "needs coaching" },
    { rating: "3", description: "independent senior" },
    { rating: "4", description: "raises the bar" }
  ];

  const donts = [
    "Use vague competencies",
    "Let interviewers decide their own criteria",
    "Give everyone 3's"
  ];

  const fixes = [
    "Use behavioural anchors tied to outcomes",
    "Include \"negative examples\" for clarity",
    "Force a documented vote per interviewer"
  ];

  return (
    <div className="space-y-6">
      <Section title="Scorecard Card" subtitle="Evaluation criteria and rating system" Icon={ClipboardList} density="compact">
        <div className="space-y-4">
          {/* Competencies */}
          <div className="rounded-xl border border-blue-200 p-4 bg-gradient-to-br from-blue-50 to-white">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-blue-700 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-3" style={{ color: "#102a63" }}>
                  Competencies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {competencies.map((comp, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Rating Anchor */}
          <div className="rounded-xl border border-emerald-200 p-4 bg-gradient-to-br from-emerald-50 to-white">
            <div className="flex items-start gap-3">
              <ClipboardList className="w-5 h-5 text-emerald-700 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-3" style={{ color: "#102a63" }}>
                  Rating Anchor
                </h4>
                <div className="space-y-2">
                  {ratingAnchors.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">
                        {item.rating}
                      </span>
                      <span className="text-[13px] leading-relaxed text-emerald-800">
                        = {item.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Brutal Truth */}
          <Callout tone="danger" title="💥 Brutal Truth">
            Weak scorecards lead to emotional hiring.
          </Callout>

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
        </div>
      </Section>
    </div>
  );
};
