"use client";

import React from "react";
import {
  MessageSquare,
  Target,
  AlertTriangle,
  Wrench,
  XCircle,
  Eye,
  FileText,
  TerminalSquare,
  AlignLeft,
} from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";

export const MessageCard = () => {
  const donts = [
    "Start with company history",
    "Over-describe culture",
    "Use clichés (\"fast-paced environment\")",
  ];

  const templates = [
    {
      title: "⚡ Short ‘Scroll-Stopper’ (General Audience)",
      icon: Eye,
      content: `"We're hiring a ${"{ROLE}"}. But here's the difference: 
Your work becomes an actual customer-facing product feature, not a buried internal dashboard. 
If you want a role where impact is visible in weeks (not quarters), this is it."`
    },
    {
      title: "🧠 Medium-Length Technical Pitch (Engineer-Focused)",
      icon: TerminalSquare,
      content: `"Most data roles optimize pipelines. This one optimizes outcomes.

We’re looking for a ${"{ROLE}"} who wants to work on:
• Production-facing models that power merchant analytics  
• Systems where correctness matters more than dashboards  
• A stack grounded in ${"{TECH_STACK}"} with room for ownership end-to-end  

If you enjoy turning ambiguous problems into real product capabilities, let’s talk."`,
    },
    {
      title: "📜 Long-Form Story / Senior Talent Pitch",
      icon: FileText,
      content: `"Every data team claims impact. Few can prove it.

At ${"{COMPANY}"} the models our team builds determine what thousands of businesses see on their screens every day. 
Your work becomes the 'why' behind key decisions, not the forgotten system behind the scenes.

We’re hiring a ${"{ROLE}"} who wants:
• Ownership of model strategy  
• A tight feedback loop with product + engineering  
• The ability to shape an analytics platform used globally  

If you're tired of doing invisible work and want your output to *change how businesses make decisions*, this is your seat at the table."`,
    },
  ];

  return (
    <div className="space-y-6">
      <Section
        title="Message Card"
        subtitle="How to pitch the role in a way that actually gets replies."
        Icon={MessageSquare}
        density="compact"
      >
        <div className="space-y-6">
          {/* Core Pitch */}
          <div
            className="rounded-xl border-2 p-5 bg-gradient-to-br from-blue-50 to-white"
            style={{ borderColor: "#278f8c" }}
          >
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 mt-0.5" style={{ color: "#278f8c" }} />
              <div className="flex-1">
                <h4
                  className="text-sm font-semibold mb-2"
                  style={{ color: "#102a63" }}
                >
                  Core Pitch
                </h4>
                <p
                  className="text-[13px] leading-relaxed italic font-medium"
                  style={{ color: "#278f8c" }}
                >
                  &quot;Your models will directly power merchant-facing
                  analytics used by thousands of businesses, not internal
                  dashboards. You shape the product, not just the pipeline.&quot;
                </p>
              </div>
            </div>
          </div>

          {/* Brutal Truth */}
          <Callout tone="danger" title="💥 Brutal Truth">
            If your messaging sounds like every other &quot;modern dbt stack +
            impact&quot; pitch, candidates ignore you.
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
            Your messaging is often too polite and too vague. Senior talent
            responds to direct, specific value, not generalities.
          </Callout>

          {/* ====================== */}
          {/* NEW - Message Templates */}
          {/* ====================== */}
          <Section title="📝 Message Templates" Icon={AlignLeft} >
            <div className="space-y-4">
              {templates.map((t, idx) => (
                <div
                  key={idx}
                  className="border rounded-xl p-4 bg-white shadow-sm"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <t.icon className="w-4 h-4 text-slate-600 mt-0.5" />
                    <h4 className="text-[14px] font-semibold text-slate-800">
                      {t.title}
                    </h4>
                  </div>
                  <p className="text-[13px] leading-relaxed whitespace-pre-line text-slate-700">
                    {t.content}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </Section>
    </div>
  );
};
