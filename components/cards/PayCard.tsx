"use client";

import React from "react";
import { DollarSign, TrendingUp, AlertTriangle, Wrench, XCircle, Eye, Clock } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";

export const PayCard = () => {
  const marketComp = [
    { label: "Base", value: "€85k–€100k" },
    { label: "Total comp", value: "€95k–€115k" },
    { label: "Published range", value: "€6,100–€7,900/month" },
  ];

  const redFlags = [
    "Candidate wants >20% above internal band",
    "Company refuses to budge on comp",
    "Internal equity blocks competitive offers"
  ];

  const donts = [
    "Hide comp until final stage",
    "Use equity as compensation if it's not meaningful",
    "Expect senior technical talent at mid-level pay"
  ];

  const fixes = [
    "Align comp band before launching the search",
    "Offer clarity upfront",
    "Highlight ownership + product impact as value drivers"
  ];

  return (
    <div className="space-y-6">
      <Section title="Pay Card" subtitle="Compensation strategy and market data" Icon={DollarSign} density="compact">
        <div className="space-y-4">
          {/* Market Compensation */}
          <div className="rounded-xl border border-emerald-200 p-4 bg-gradient-to-br from-emerald-50 to-white">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-emerald-700 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-3" style={{ color: "#102a63" }}>
                  Market Compensation (Amsterdam)
                </h4>
                <div className="space-y-2">
                  {marketComp.map((item, idx) => (
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

          {/* Recommended Hire Range */}
          <div className="rounded-xl border-2 p-4 bg-gradient-to-br from-blue-50 to-white" style={{ borderColor: "#278f8c" }}>
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 mt-0.5" style={{ color: "#278f8c" }} />
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-1" style={{ color: "#102a63" }}>
                  Recommended Hire Range
                </h4>
                <p className="text-lg font-bold" style={{ color: "#278f8c" }}>
                  €90k–€105k for top-tier senior
                </p>
              </div>
            </div>
          </div>

          {/* Brutal Truth */}
          <Callout tone="danger" title="💥 Brutal Truth">
            If you offer €80k, you will not hire a senior. You will hire someone who thinks they&apos;re senior.
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
            Your comp is competing with remote US employers you can&apos;t see.
          </Callout>

          {/* Timeline to Failure */}
          <Callout tone="danger" title="⏳ Timeline to Failure">
            If comp approval takes &gt;5 days → expect candidate rejection.
          </Callout>
        </div>
      </Section>
    </div>
  );
};
