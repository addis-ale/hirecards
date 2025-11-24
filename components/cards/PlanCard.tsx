"use client";

import React from "react";
import { CalendarCheck, Calendar, TrendingUp, AlertTriangle, Wrench, XCircle, Zap } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";

export const PlanCard = () => {
  const first7Days = [
    "Finalize RoleCard",
    "Align scorecard",
    "Approve comp",
    "Build outbound list",
    "Schedule weekly sync",
    "Launch sourcing"
  ];

  const weeklyRhythm = [
    "Pipeline review",
    "Blockers removed",
    "Calibration maintained",
    "Messaging updated",
    "Time-to-align tracked"
  ];

  const redFlags = [
    "Hiring manager unavailable",
    "TA chasing stakeholders",
    "Comp approval delays",
    "Slow feedback loops"
  ];

  const donts = [
    "Start sourcing before alignment",
    "Launch job without scorecard",
    "Build funnel without messaging"
  ];

  const fixes = [
    "Enforce 24-hour feedback",
    "Use shared hiring dashboard",
    "Pre-book interview slots"
  ];

  const fastestPath = [
    "Broaden geo → EU-friendly remote/relocation",
    "Raise comp slightly or pre-align offer flexibility",
    "Simplify interview loop to 3 steps",
    "Use strong product-oriented messaging",
    "Run 2 outbound waves per week",
    "Calibrate early → avoid sourcing the wrong persona",
    "Keep stakeholders aligned weekly"
  ];

  return (
    <div className="space-y-6">
      <Section title="Plan Card" subtitle="Launch plan and weekly rhythm" Icon={CalendarCheck} density="compact">
        <div className="space-y-4">
          {/* First 7 Days */}
          <div className="rounded-xl border border-blue-200 p-4 bg-gradient-to-br from-blue-50 to-white">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-700 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-3" style={{ color: "#102a63" }}>
                  First 7 Days
                </h4>
                <ul className="list-disc pl-5 space-y-2 marker:text-blue-600">
                  {first7Days.map((item, idx) => (
                    <li key={idx} className="text-[13px] leading-snug" style={{ color: "#102a63" }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Weekly Rhythm */}
          <div className="rounded-xl border border-emerald-200 p-4 bg-gradient-to-br from-emerald-50 to-white">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-emerald-700 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-3" style={{ color: "#102a63" }}>
                  Weekly Rhythm
                </h4>
                <ul className="list-disc pl-5 space-y-2 marker:text-emerald-600">
                  {weeklyRhythm.map((item, idx) => (
                    <li key={idx} className="text-[13px] leading-snug text-emerald-800">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Brutal Truth */}
          <Callout tone="danger" title="💥 Brutal Truth">
            Hiring delays come from internal blockers, not market scarcity.
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

          {/* Bonus: Fastest Path to Hire */}
          <div className="rounded-xl border-2 p-5 bg-gradient-to-br from-amber-50 to-white" style={{ borderColor: "#f59e0b" }}>
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-base font-bold mb-3 text-amber-900">
                  Bonus: Fastest Path to Hire (for this role)
                </h4>
                <ul className="list-disc pl-5 space-y-2 marker:text-amber-600">
                  {fastestPath.map((item, idx) => (
                    <li key={idx} className="text-[13px] leading-snug text-amber-900">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};
