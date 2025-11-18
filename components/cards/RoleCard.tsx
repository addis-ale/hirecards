"use client";

import React from "react";
import { Briefcase, Target, Trophy, AlertTriangle, Wrench, FlagTriangleRight, Hourglass } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";
import { Pill } from "@/components/ui/Pill";

export const RoleCard = () => {
  const outcomes = [
    "Deliver stable, documented dbt models used across product + analytics teams.",
    "Replace 50–70% of legacy modelling with modern, tested pipelines.",
    "Ship two merchant-facing analytics features with measurable adoption.",
    "Improve data quality SLAs & reduce incidents.",
    "Mentor analysts → raise overall modelling quality.",
  ];

  const redFlags = [
    "Responsibilities read like \"BI developer with nicer job title.\"",
    "JD overloaded with buzzwords instead of outcomes.",
    "No clear ownership area or modelling domain.",
  ];

  const donts = [
    "Copy competitor job descriptions.",
    "Hide the real complexity of your data.",
    "List 20+ responsibilities. It signals chaos.",
  ];

  const fixes = [
    "Show candidates exactly where the mess is. It builds trust.",
    "Rewrite responsibilities to outcomes (not task lists).",
    "Align hiring manager + PM on what \"success\" looks like BEFORE sourcing starts.",
  ];

  return (
    <div className="space-y-6">
      <Section title="Role Card" subtitle="Role summary, outcomes, truth, and actions" Icon={Briefcase} density="compact">
        <div className="space-y-4">
          {/* Role Summary */}
          <div className="rounded-xl border border-gray-200 p-4 bg-gradient-to-br from-blue-50 to-white">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-blue-700 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold mb-1" style={{ color: "#102a63" }}>Role Summary</h4>
                <p className="text-[13px] leading-snug" style={{ color: "#102a63", opacity: 0.9 }}>
                  Design, build, and maintain production-grade analytics models that power Mollie&apos;s merchant
                  analytics experiences, internal and customer-facing. Own modelling standards, improve data quality,
                  and partner with Engineering & Product to ship meaningful analytics features.
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
            Most companies hiring “Senior Analytics Engineers” actually want someone to clean up five years of data debt.
            If your team isn&apos;t honest about the mess, senior candidates will smell it and run.
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

          {/* Hidden Bottleneck */}
          <Callout tone="neutral" title="Hidden Bottleneck">
            <strong>Stakeholder alignment.</strong> If PM, Data, and Engineering want different outcomes, no candidate will pass all interviews.
          </Callout>

          {/* Timeline to Failure */}
          <Callout tone="warning" title="Timeline to Failure">
            If outcomes aren&apos;t aligned in week 1 → expect the search to restart around week 6.
          </Callout>
        </div>
      </Section>
    </div>
  );
};
