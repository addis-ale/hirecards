"use client";

import React from "react";
import { Mic, CheckCircle, AlertTriangle, Wrench, XCircle } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";

export const InterviewCard = () => {
  const optimalLoop = [
    "Recruiter screen",
    "Modelling + SQL deep dive",
    "Product/PM collaboration session",
    "Final cultural alignment"
  ];

  const redFlags = [
    "Interviewers \"wing it\"",
    "Vague questions",
    "\"Tell me about a time...\" with no follow-ups",
    "No scorecard → chaos"
  ];

  const donts = [
    "Add extra rounds",
    "Leave feedback to the end of the week",
    "Use take-homes >3h"
  ];

  const fixes = [
    "Standardize questions",
    "Train panel in probing, bias avoidance",
    "24-hour feedback SLA"
  ];

  return (
    <div className="space-y-6">
      <Section title="Interview Card" subtitle="The recommended interview process and competencies to assess at each stage." Icon={Mic} density="compact">
        <div className="space-y-4">
          {/* Optimal Loop */}
          <div className="rounded-xl border border-emerald-200 p-4 bg-gradient-to-br from-emerald-50 to-white">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-700 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-3" style={{ color: "#102a63" }}>
                  Optimal Loop
                </h4>
                <ol className="list-decimal pl-5 space-y-2 marker:text-emerald-700 marker:font-semibold">
                  {optimalLoop.map((step, idx) => (
                    <li key={idx} className="text-[13px] leading-snug text-emerald-800">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          {/* Brutal Truth */}
          <Callout tone="danger" title="💥 Brutal Truth">
            If the interviewers aren&apos;t trained, you&apos;re not evaluating candidates — you&apos;re filtering them at random.
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
        </div>
      </Section>
    </div>
  );
};
