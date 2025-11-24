"use client";

import React from "react";
import { Send, Wrench } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";

export const OutreachCard = () => {
  const fixes = [
    "Keep it human",
    "Keep it short",
    "Keep it specific",
    "Lead with influence, not stack"
  ];

  return (
    <div className="space-y-6">
      <Section title="Outreach Card" subtitle="LinkedIn sequence and best practices" Icon={Send} density="compact">
        <div className="space-y-4">
          {/* 3-Step LinkedIn Sequence */}
          <div className="rounded-xl border-2 p-5 bg-gradient-to-br from-blue-50 to-white" style={{ borderColor: "#278f8c" }}>
            <div className="flex items-start gap-3">
              <Send className="w-5 h-5 mt-0.5" style={{ color: "#278f8c" }} />
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-2" style={{ color: "#102a63" }}>
                  3-Step LinkedIn Sequence
                </h4>
                <p className="text-[13px] text-gray-600 italic">
                  (Short, sharp, high-signal.)
                </p>
              </div>
            </div>
          </div>

          {/* Brutal Truth */}
          <Callout tone="danger" title="💥 Brutal Truth">
            Most outreach fails because it&apos;s generic and 3 paragraphs too long.
          </Callout>

          {/* Fix This Now */}
          <Section title="🔧 Fix This Now" Icon={Wrench} tone="success">
            <ul className="list-disc pl-5 space-y-2 marker:text-emerald-600">
              {fixes.map((fix, idx) => (
                <li key={idx} className="text-[13px] leading-snug text-emerald-800 font-medium">
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
