"use client";

import React from "react";
import { MessageSquare, Target, AlertTriangle, Wrench, XCircle, Eye } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";

export const MessageCard = () => {
  const donts = [
    "Start with company history",
    "Over-describe culture",
    "Use clichés (\"fast-paced environment\")"
  ];

  return (
    <div className="space-y-6">
      <Section title="Message Card" subtitle="Core pitch and positioning" Icon={MessageSquare} density="compact">
        <div className="space-y-4">
          {/* Core Pitch */}
          <div className="rounded-xl border-2 p-5 bg-gradient-to-br from-blue-50 to-white" style={{ borderColor: "#278f8c" }}>
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 mt-0.5" style={{ color: "#278f8c" }} />
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-2" style={{ color: "#102a63" }}>
                  Core Pitch
                </h4>
                <p className="text-[13px] leading-relaxed italic font-medium" style={{ color: "#278f8c" }}>
                  &quot;Your models will directly power merchant-facing analytics used by thousands of businesses — not internal dashboards. You shape the product, not just the pipeline.&quot;
                </p>
              </div>
            </div>
          </div>

          {/* Brutal Truth */}
          <Callout tone="danger" title="💥 Brutal Truth">
            If your messaging sounds like every other &quot;modern dbt stack + impact&quot; pitch, candidates ignore you.
          </Callout>

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
            <div className="space-y-3">
              <p className="text-[13px] font-medium text-emerald-800">
                Lead with one undeniable differentiator:
              </p>
              <div className="pl-4 border-l-4 border-emerald-500 py-2">
                <p className="text-[13px] italic font-medium text-emerald-800">
                  The data models become product features, not support work.
                </p>
              </div>
            </div>
          </Section>

          {/* Hidden Bottleneck */}
          <Callout tone="warning" title="🔍 Hidden Bottleneck">
            Your messaging is often too polite and too vague. Senior talent responds to direct, specific value — not generalities.
          </Callout>
        </div>
      </Section>
    </div>
  );
};
