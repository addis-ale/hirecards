"use client";

import React from "react";
import { DollarSign, TrendingUp, AlertTriangle, Wrench, XCircle, Eye, Clock } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";

interface PayCardProps {
  marketComp: Array<{ label: string; value: string }>;
  recommendedRange: string;
  insights?: string[];
  dataSource?: string;
}

export const PayCard = ({ 
  marketComp,
  recommendedRange,
  insights = [],
  dataSource
}: PayCardProps) => {
  
  // Debug: Log what props we received
  console.log("💳 PayCard received props:", { marketComp, recommendedRange, insights, dataSource });
  
  // If no data, show error
  if (!marketComp || !recommendedRange) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-bold text-red-600 mb-2">No Dynamic Data Available</h3>
        <p className="text-sm text-red-700">LinkedIn data was not loaded. Generate cards again with LinkedIn scraping enabled.</p>
      </div>
    );
  }

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
      <Section title="Pay Card" subtitle="What candidates expect to earn in this market and how your budget compares." Icon={DollarSign} density="compact">
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
                  {recommendedRange}
                </p>
                {dataSource && (
                  <p className="text-xs text-gray-500 mt-1">
                    {dataSource}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Dynamic Insights */}
          {insights.length > 0 && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <h4 className="text-sm font-semibold mb-2" style={{ color: "#102a63" }}>
                Market Insights
              </h4>
              <ul className="space-y-1">
                {insights.map((insight, idx) => (
                  <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

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
