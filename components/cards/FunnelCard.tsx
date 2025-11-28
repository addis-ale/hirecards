"use client";

import React from "react";
import { BarChart3, TrendingUp, AlertTriangle, Wrench, XCircle, Eye } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";

export const FunnelCard = () => {
  const funnelStages = [
    { stage: "Outreach", count: "120–150" },
    { stage: "Positive replies", count: "20–25" },
    { stage: "Screens", count: "10–12" },
    { stage: "Tech rounds", count: "7–8" },
    { stage: "Finalists", count: "2–3" },
    { stage: "Offers", count: "1–2" },
    { stage: "Hire", count: "1" },
  ];

  const benchmarks = [
    { label: "Outbound reply rate", value: "20–30%" },
    { label: "Tech pass rate", value: "40–60%" },
    { label: "Offer acceptance", value: "70–85%" },
  ];

  const redFlags = [
    "Gaps >72 hours between stages",
    "Tech test longer than 2 hours",
    "Generic messaging",
    "Late comp conversations"
  ];

  const donts = [
    "Rely only on LinkedIn outbound",
    "Overqualify early",
    "Add take-home assignments for seniors"
  ];

  const fixes = [
    "Warm candidates every 48–72 hours",
    "Kill long take-homes",
    "Use calendar blocking for interviewers",
    "Review pipeline every week with HM"
  ];

  return (
    <div className="space-y-6">
      <Section title="Funnel Card" subtitle="The volume of outreach and interviews you'll need to fill the role." Icon={BarChart3} density="compact">
        <div className="space-y-4">
          {/* Expected Funnel */}
          <div className="rounded-xl border border-blue-200 p-4 bg-gradient-to-br from-blue-50 to-white">
            <div className="flex items-start gap-3">
              <BarChart3 className="w-5 h-5 text-blue-700 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-3" style={{ color: "#102a63" }}>
                  Expected Funnel
                </h4>
                <div className="space-y-2">
                  {funnelStages.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-blue-100 last:border-0">
                      <span className="text-[13px] font-medium" style={{ color: "#102a63", opacity: 0.8 }}>
                        {item.stage}
                      </span>
                      <span className="text-sm font-bold text-blue-700">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Benchmarks */}
          <div className="rounded-xl border border-emerald-200 p-4 bg-gradient-to-br from-emerald-50 to-white">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-emerald-700 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-3" style={{ color: "#102a63" }}>
                  Benchmarks
                </h4>
                <div className="space-y-2">
                  {benchmarks.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-emerald-100 last:border-0">
                      <span className="text-[13px] font-medium" style={{ color: "#102a63", opacity: 0.8 }}>
                        {item.label}
                      </span>
                      <span className="text-sm font-bold text-emerald-700">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Brutal Truth */}
          <Callout tone="danger" title="💥 Brutal Truth">
            Your biggest funnel leak isn&apos;t sourcing. It&apos;s candidate dropout caused by internal delays.
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

          {/* Hidden Bottleneck */}
          <Callout tone="warning" title="🔍 Hidden Bottleneck">
            Your first screening question: If the recruiter can&apos;t articulate the product impact clearly → conversion dies.
          </Callout>
        </div>
      </Section>
    </div>
  );
};
