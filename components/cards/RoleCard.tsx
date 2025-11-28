"use client";

import React from "react";
import { Briefcase, Target, Trophy, AlertTriangle, Wrench, FlagTriangleRight, Hourglass } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";
import { Pill } from "@/components/ui/Pill";

export const RoleCard = () => {
  const outcomes = [
    "Deliver stable dbt models",
    "Replace legacy pipelines",
    "Ship analytics features",
    "Improve data quality",
    "Mentor team members",
  ];

  const redFlags = [
    "Generic job description",
    "Buzzwords over outcomes",
    "No clear ownership",
  ];

  const donts = [
    "Copy competitor JDs",
    "Hide data complexity",
    "List 20+ responsibilities",
  ];

  const fixes = [
    "Show real challenges upfront",
    "Focus on outcomes not tasks",
    "Align stakeholders early",
  ];

  return (
    <div className="space-y-6">
      <Section title="Role Card" subtitle="What this person will actually do and what success looks like in the first 6–12 months." Icon={Briefcase} density="compact">
        <div className="space-y-4">
          {/* Role Summary */}
          <div className="rounded-xl border border-gray-200 p-4 bg-gradient-to-br from-blue-50 to-white">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-blue-700 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold mb-1" style={{ color: "#102a63" }}>Role Summary</h4>
                <p className="text-[13px] leading-snug" style={{ color: "#102a63", opacity: 0.9 }}>
                  Build production-grade analytics models, own modelling standards, and partner with teams to ship features.
                </p>
              </div>
            </div>
          </div>

          {/* Top Outcomes */}
          <div className="rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-5 h-5 text-emerald-700" />
              <h4 className="text-base font-semibold" style={{ color: "#102a63" }}>Top 5 Outcomes (12 months)</h4>
            </div>
            <ol className="list-decimal pl-5 space-y-2 md:columns-2 md:gap-8 marker:text-emerald-700 marker:font-semibold">
              {outcomes.map((o, i) => (
                <li key={i} className="text-[13px] leading-snug" style={{ color: "#102a63" }}>
                  {o}
                </li>
              ))}
            </ol>
          </div>

          {/* What Great Looks Like */}
          <Callout tone="success" title="What Great Looks Like">
            <div className="flex flex-wrap gap-2">
              <Pill tone="green">Clear ownership</Pill>
              <Pill tone="green">Strong modelling taste</Pill>
              <Pill tone="green">Tight feedback loops</Pill>
              <Pill tone="green">High trust from PM & Engineering</Pill>
            </div>
          </Callout>

          {/* Brutal Truth */}
          <Callout tone="danger" title="Brutal Truth">
            Be honest about the data debt. Seniors will discover it anyway.
          </Callout>

          {/* Red Flags */}
          <Section title="Red Flags" Icon={FlagTriangleRight} tone="danger">
            <ul className="list-disc pl-5 space-y-1 md:columns-2 md:gap-8 marker:text-red-600">
              {redFlags.map((f, i) => (
                <li key={i} className="text-[13px] leading-snug text-red-700">
                  {f}
                </li>
              ))}
            </ul>
          </Section>

          {/* Don&apos;t Do This */}
          <Section title="Don&apos;t Do This" Icon={AlertTriangle} tone="danger">
            <ul className="list-disc pl-5 space-y-1 md:columns-2 md:gap-8 marker:text-red-600">
              {donts.map((d, i) => (
                <li key={i} className="text-[13px] leading-snug text-red-700">
                  {d}
                </li>
              ))}
            </ul>
          </Section>

          {/* Fix This Now */}
          <Section title="Fix This Now" Icon={Wrench} tone="success">
            <ul className="list-disc pl-5 space-y-1 md:columns-2 md:gap-8 marker:text-emerald-600">
              {fixes.map((f, i) => (
                <li key={i} className="text-[13px] leading-snug text-emerald-800">
                  {f}
                </li>
              ))}
            </ul>
          </Section>

        </div>
      </Section>
    </div>
  );
};
