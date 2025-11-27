"use client";

import React from "react";
import { Send, AlertTriangle, X, Wrench, Search, Clock } from "lucide-react";
import { Callout } from "@/components/ui/Callout";

export const OutreachCard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#278f8c] to-[#1a6764] flex items-center justify-center">
          <Send className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "#102a63" }}>
            Outreach Card
          </h2>
          <p className="text-sm text-gray-600">3-Step Outreach (Tailored to Product-Minded Analytics Engineers)</p>
        </div>
      </div>

      {/* Introduction */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <p className="text-sm leading-relaxed" style={{ color: "#102a63" }}>
          Short, sharp messages built around what this persona actually cares about: product impact, ownership, modelling quality, and shipping.
        </p>
      </div>

      {/* 3-Step Sequence */}
      <div>
        <h3 className="font-bold text-lg mb-3" style={{ color: "#102a63" }}>
          3-Step Outreach Sequence
        </h3>
        <div className="space-y-3">
          {/* Message 1 */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
            <h4 className="font-bold text-sm mb-2" style={{ color: "#278f8c" }}>
              Message 1 — Relevance First
            </h4>
            <p className="text-sm text-gray-700">
              1–2 lines referencing their modelling work + a clean hook about customer-facing analytics.
            </p>
          </div>

          {/* Message 2 */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
            <h4 className="font-bold text-sm mb-2" style={{ color: "#278f8c" }}>
              Message 2 — Scope & Product Impact
            </h4>
            <p className="text-sm text-gray-700">
              A line showing the unique value: shipping models that become live product features inside Mollie&apos;s merchant dashboard.
            </p>
          </div>

          {/* Message 3 */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
            <h4 className="font-bold text-sm mb-2" style={{ color: "#278f8c" }}>
              Message 3 — Soft Follow-Up
            </h4>
            <p className="text-sm text-gray-700">
              &quot;Worth a quick sanity check?&quot; → no pressure, no oversell.
            </p>
          </div>
        </div>
      </div>

      {/* Brutal Truth */}
      <Callout tone="danger" title="Brutal Truth">
        Analytics engineers get hammered with &quot;modern stack + dbt + impact&quot; pitches. If your outreach sounds like that, you disappear instantly. The only thing that cuts through is product ownership — not dashboards, not stack, not buzzwords.
      </Callout>

      {/* Red Flags */}
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
        <h3 className="font-bold text-lg mb-3 text-red-700">
          Red Flags
        </h3>
        <ul className="space-y-2">
          {[
            "Outreach leading with \"We're hiring a Senior AE.\"",
            "Messages longer than 4 lines.",
            "No reference to their modelling domain.",
            "Generic adjectives (\"fast-paced,\" \"data-driven,\" \"AI-powered\")."
          ].map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-red-900">
              <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Don't Do This */}
      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
        <h3 className="font-bold text-lg mb-3 text-orange-700">
          Don&apos;t Do This
        </h3>
        <ul className="space-y-2">
          {[
            "Describe the job ad in DM format.",
            "Open with culture fluff.",
            "Pitch AI without showing how it's used.",
            "Ask for a call before giving context."
          ].map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-orange-900">
              <X className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Fix This Now */}
      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
        <h3 className="font-bold text-lg mb-3 text-green-700">
          Fix This Now
        </h3>
        <ul className="space-y-2">
          {[
            "Tie your opener to a specific repo, modelling decision, or dashboard they built.",
            "Lead with the real differentiator: your models go straight into customer-facing UX, not buried in BI.",
            "Mention the Insights product: a new, AI-assisted analytics suite with real revenue impact.",
            "Keep your CTA soft and optional."
          ].map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-green-900">
              <Wrench className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Hidden Bottleneck */}
      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
        <div className="flex items-start gap-2">
          <Search className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-base mb-2 text-purple-900">
              Hidden Bottleneck
            </h3>
            <p className="text-sm text-purple-900">
              If you can&apos;t clearly explain how this role shapes Mollie&apos;s merchant analytics experience in the first message, the candidate assumes it&apos;s another BI cleanup job — and ignores you.
            </p>
          </div>
        </div>
      </div>

      {/* Timeline to Failure */}
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
        <div className="flex items-start gap-2">
          <Clock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-base mb-2 text-yellow-900">
              Timeline to Failure
            </h3>
            <p className="text-sm text-yellow-900 mb-2">
              If messages aren&apos;t personalised in week 1 → expect reply rates under 15%.
            </p>
            <p className="text-sm text-yellow-900">
              If you lead with &quot;dbt + ownership + impact&quot; like every fintech → expect under 10%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
