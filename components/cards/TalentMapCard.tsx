"use client";

import React from "react";
import { Users, Target, AlertTriangle, Wrench, XCircle, Eye, Clock } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";

export const TalentMapCard = () => {
  const primaryFeeders = [
    "Adyen",
    "bunq",
    "Booking",
    "bol",
    "Picnic",
    "PayPal",
    "Klarna",
    "Revolut",
    "Mollie-like scaleups"
  ];

  const secondaryFeeders = [
    "ING",
    "Rabobank",
    "ABN AMRO",
    "Modern data consultancies"
  ];

  const avoidList = [
    "Legacy BI teams",
    "Excel-heavy organizations",
    "Candidates with no ownership experience",
    "Pure analysts dressed as engineers"
  ];

  const redFlags = [
    "Candidates who \"maintained dashboards\" rather than built modelling ecosystems",
    "Builders of internal-only tools who never shipped product-facing analytics"
  ];

  const donts = [
    "Target early-stage startups — modelling maturity tends to be low",
    "Target banking analytics teams without validating modelling experience"
  ];

  const fixes = [
    "Prioritize candidates frustrated by data chaos or slow product cycles",
    "Target people who own domains, not maintain pipelines"
  ];

  return (
    <div className="space-y-6">
      <Section title="Talent Map Card" subtitle="Where to find and avoid talent" Icon={Users} density="compact">
        <div className="space-y-4">
          {/* Primary Feeder Companies */}
          <div className="rounded-xl border border-emerald-200 p-4 bg-gradient-to-br from-emerald-50 to-white">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-emerald-700 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-2" style={{ color: "#102a63" }}>
                  Primary Feeder Companies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {primaryFeeders.map((company, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200"
                    >
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Feeder Companies */}
          <div className="rounded-xl border border-blue-200 p-4 bg-gradient-to-br from-blue-50 to-white">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-blue-700 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-2" style={{ color: "#102a63" }}>
                  Secondary Feeder Companies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {secondaryFeeders.map((company, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                    >
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Avoid */}
          <div className="rounded-xl border border-gray-300 p-4 bg-gradient-to-br from-gray-50 to-white">
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-gray-700 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-2" style={{ color: "#102a63" }}>
                  Avoid
                </h4>
                <ul className="list-disc pl-5 space-y-1 marker:text-gray-600">
                  {avoidList.map((item, idx) => (
                    <li key={idx} className="text-[13px] leading-snug text-gray-700">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Brutal Truth */}
          <Callout tone="danger" title="💥 Brutal Truth">
            Everyone is chasing the same top 10 companies. You won&apos;t win them on comp. You must win them on scope and shipping velocity.
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
            You&apos;re not just fighting for attention — you&apos;re fighting for credibility.
          </Callout>
        </div>
      </Section>
    </div>
  );
};
