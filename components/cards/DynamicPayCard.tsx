"use client";

import React from "react";
import { DollarSign, TrendingUp, AlertTriangle, Wrench, XCircle } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";

export interface PayCardData {
  marketCompensation: Array<{
    label: string;
    value: string;
  }>;
  recommendedRange: string;
  location: string;
  currency?: string;
  brutalTruth: string;
  redFlags: string[];
  donts: string[];
  fixes: string[];
  hiddenBottleneck: string;
  timelineToFailure: string;
}

interface DynamicPayCardProps {
  data?: PayCardData;
  loading?: boolean;
}

export const DynamicPayCard: React.FC<DynamicPayCardProps> = ({ 
  data, 
  loading = false 
}) => {
  // Default fallback data
  const defaultData: PayCardData = {
    marketCompensation: [
      { label: "Base", value: "€85k–€100k" },
      { label: "Total comp", value: "€95k–€115k" },
      { label: "Published range", value: "€6,100–€7,900/month" },
    ],
    recommendedRange: "€90k–€105k for top-tier senior",
    location: "Amsterdam",
    currency: "EUR",
    brutalTruth: "If you offer €80k, you will not hire a senior. You will hire someone who thinks they're senior.",
    redFlags: [
      "Candidate wants >20% above internal band",
      "Company refuses to budge on comp",
      "Internal equity blocks competitive offers",
    ],
    donts: [
      "Hide comp until final stage",
      "Use equity as compensation if it's not meaningful",
      "Expect senior technical talent at mid-level pay",
    ],
    fixes: [
      "Align comp band before launching the search",
      "Offer clarity upfront",
      "Highlight ownership + product impact as value drivers",
    ],
    hiddenBottleneck: "Your comp is competing with remote US employers you can't see.",
    timelineToFailure: "If comp approval takes >5 days → expect candidate rejection.",
  };

  const cardData = data || defaultData;

  if (loading) {
    return (
      <div className="space-y-6">
        <Section title="Pay Card" subtitle="Loading market compensation data..." Icon={DollarSign} density="compact">
          <div className="space-y-4 animate-pulse">
            <div className="rounded-xl border border-gray-200 p-4 bg-gray-50 h-32" />
            <div className="rounded-xl border border-gray-200 p-4 bg-gray-50 h-24" />
            <div className="rounded-xl border border-gray-200 p-4 bg-gray-50 h-20" />
          </div>
        </Section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Section 
        title="Pay Card" 
        subtitle={`What candidates expect to earn in this market and how your budget compares. (Based on ${cardData.location})`} 
        Icon={DollarSign} 
        density="compact"
      >
        <div className="space-y-4">
          {/* Market Compensation */}
          <div className="rounded-xl border border-emerald-200 p-4 bg-gradient-to-br from-emerald-50 to-white">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-emerald-700 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-3" style={{ color: "#102a63" }}>
                  Market Compensation ({cardData.location})
                </h4>
                <div className="space-y-2">
                  {cardData.marketCompensation.map((item, idx) => (
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
                  {cardData.recommendedRange}
                </p>
              </div>
            </div>
          </div>

          {/* Brutal Truth */}
          <Callout tone="danger" title="💥 Brutal Truth">
            {cardData.brutalTruth}
          </Callout>

          {/* Red Flags */}
          <Section title="⚠️ Red Flags" Icon={AlertTriangle} tone="danger">
            <ul className="list-disc pl-5 space-y-2 marker:text-red-600">
              {cardData.redFlags.map((flag, idx) => (
                <li key={idx} className="text-[13px] leading-snug text-red-700">
                  {flag}
                </li>
              ))}
            </ul>
          </Section>

          {/* Don't Do This */}
          <Section title="❌ Don't Do This" Icon={XCircle} tone="danger">
            <ul className="list-disc pl-5 space-y-2 marker:text-red-600">
              {cardData.donts.map((dont, idx) => (
                <li key={idx} className="text-[13px] leading-snug text-red-700">
                  {dont}
                </li>
              ))}
            </ul>
          </Section>

          {/* Fix This Now */}
          <Section title="🔧 Fix This Now" Icon={Wrench} tone="success">
            <ul className="list-disc pl-5 space-y-2 marker:text-emerald-600">
              {cardData.fixes.map((fix, idx) => (
                <li key={idx} className="text-[13px] leading-snug text-emerald-800">
                  {fix}
                </li>
              ))}
            </ul>
          </Section>

          {/* Hidden Bottleneck */}
          <Callout tone="warning" title="🔍 Hidden Bottleneck">
            {cardData.hiddenBottleneck}
          </Callout>

          {/* Timeline to Failure */}
          <Callout tone="danger" title="⏳ Timeline to Failure">
            {cardData.timelineToFailure}
          </Callout>
        </div>
      </Section>
    </div>
  );
};
