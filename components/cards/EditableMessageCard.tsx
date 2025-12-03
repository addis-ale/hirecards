"use client";

import React, { useState, useEffect } from "react";
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
import { EditableText, EditableList } from "@/components/EditableCard";

export const EditableMessageCard = () => {
  const [corePitch, setCorePitch] = useState(
    "Your models will directly power merchant-facing analytics used by thousands of businesses, not internal dashboards. You shape the product, not just the pipeline."
  );
  const [brutalTruth, setBrutalTruth] = useState(
    "If your messaging sounds like every other \"modern dbt stack + impact\" pitch, candidates ignore you."
  );
  const [donts, setDonts] = useState([
    "Start with company history",
    "Over-describe culture",
    "Use clichés (\"fast-paced environment\")",
  ]);
  const [fixThisNow, setFixThisNow] = useState(
    "The data models become product features, not support work."
  );
  const [hiddenBottleneck, setHiddenBottleneck] = useState(
    "Your messaging is often too polite and too vague. Senior talent responds to direct, specific value, not generalities."
  );
  const [template1, setTemplate1] = useState(
    "We're hiring a {ROLE}. But here's the difference: \nYour work becomes an actual customer-facing product feature, not a buried internal dashboard. \nIf you want a role where impact is visible in weeks (not quarters), this is it."
  );
  const [template2, setTemplate2] = useState(
    "Most data roles optimize pipelines. This one optimizes outcomes.\n\nWe're looking for a {ROLE} who wants to work on:\n• Production-facing models that power merchant analytics  \n• Systems where correctness matters more than dashboards  \n• A stack grounded in {TECH_STACK} with room for ownership end-to-end  \n\nIf you enjoy turning ambiguous problems into real product capabilities, let's talk."
  );
  const [template3, setTemplate3] = useState(
    "Every data team claims impact. Few can prove it.\n\nAt {COMPANY} the models our team builds determine what thousands of businesses see on their screens every day. \nYour work becomes the 'why' behind key decisions, not the forgotten system behind the scenes.\n\nWe're hiring a {ROLE} who wants:\n• Ownership of model strategy  \n• A tight feedback loop with product + engineering  \n• The ability to shape an analytics platform used globally  \n\nIf you're tired of doing invisible work and want your output to *change how businesses make decisions*, this is your seat at the table."
  );

  useEffect(() => {
    const data = {
      corePitch, brutalTruth, donts, fixThisNow, hiddenBottleneck,
      template1, template2, template3
    };
    sessionStorage.setItem("editableMessageCard", JSON.stringify(data));
  }, [corePitch, brutalTruth, donts, fixThisNow, hiddenBottleneck, template1, template2, template3]);

  useEffect(() => {
    const saved = sessionStorage.getItem("editableMessageCard");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.corePitch) setCorePitch(data.corePitch);
        if (data.brutalTruth) setBrutalTruth(data.brutalTruth);
        if (data.donts) setDonts(data.donts);
        if (data.fixThisNow) setFixThisNow(data.fixThisNow);
        if (data.hiddenBottleneck) setHiddenBottleneck(data.hiddenBottleneck);
        if (data.template1) setTemplate1(data.template1);
        if (data.template2) setTemplate2(data.template2);
        if (data.template3) setTemplate3(data.template3);
      } catch (e) {
        console.error("Failed to load saved data:", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                <EditableText
                  value={corePitch}
                  onChange={setCorePitch}
                  className="text-[13px] leading-relaxed italic font-medium"
                  style={{ color: "#278f8c" }}
                  multiline
                />
              </div>
            </div>
          </div>

          {/* Brutal Truth */}
          <Callout tone="danger" title="💥 Brutal Truth">
            <EditableText
              value={brutalTruth}
              onChange={setBrutalTruth}
              multiline
            />
          </Callout>

          {/* Don't Do This */}
          <Section title="❌ Don't Do This" Icon={XCircle} tone="danger">
            <EditableList
              items={donts}
              onChange={setDonts}
              itemClassName="text-[13px] leading-snug text-red-700"
              markerColor="text-red-600"
            />
          </Section>

          {/* Fix This Now */}
          <Section title="🔧 Fix This Now" Icon={Wrench} tone="success">
            <div className="space-y-3">
              <p className="text-[13px] font-medium text-emerald-800">
                Lead with one undeniable differentiator:
              </p>
              <div className="pl-4 border-l-4 border-emerald-500 py-2">
                <EditableText
                  value={fixThisNow}
                  onChange={setFixThisNow}
                  className="text-[13px] italic font-medium text-emerald-800"
                  multiline
                />
              </div>
            </div>
          </Section>

          {/* Hidden Bottleneck */}
          <Callout tone="warning" title="🔍 Hidden Bottleneck">
            <EditableText
              value={hiddenBottleneck}
              onChange={setHiddenBottleneck}
              multiline
            />
          </Callout>

          {/* Message Templates */}
          <Section title="📝 Message Templates" Icon={AlignLeft}>
            <div className="space-y-4">
              {/* Template 1 */}
              <div className="border rounded-xl p-4 bg-white shadow-sm">
                <div className="flex items-start gap-3 mb-2">
                  <Eye className="w-4 h-4 text-slate-600 mt-0.5" />
                  <h4 className="text-[14px] font-semibold text-slate-800">
                    ⚡ Short &apos;Scroll-Stopper&apos; (General Audience)
                  </h4>
                </div>
                <EditableText
                  value={template1}
                  onChange={setTemplate1}
                  className="text-[13px] leading-relaxed whitespace-pre-line text-slate-700"
                  multiline
                />
              </div>

              {/* Template 2 */}
              <div className="border rounded-xl p-4 bg-white shadow-sm">
                <div className="flex items-start gap-3 mb-2">
                  <TerminalSquare className="w-4 h-4 text-slate-600 mt-0.5" />
                  <h4 className="text-[14px] font-semibold text-slate-800">
                    🧠 Medium-Length Technical Pitch (Engineer-Focused)
                  </h4>
                </div>
                <EditableText
                  value={template2}
                  onChange={setTemplate2}
                  className="text-[13px] leading-relaxed whitespace-pre-line text-slate-700"
                  multiline
                />
              </div>

              {/* Template 3 */}
              <div className="border rounded-xl p-4 bg-white shadow-sm">
                <div className="flex items-start gap-3 mb-2">
                  <FileText className="w-4 h-4 text-slate-600 mt-0.5" />
                  <h4 className="text-[14px] font-semibold text-slate-800">
                    📜 Long-Form Story / Senior Talent Pitch
                  </h4>
                </div>
                <EditableText
                  value={template3}
                  onChange={setTemplate3}
                  className="text-[13px] leading-relaxed whitespace-pre-line text-slate-700"
                  multiline
                />
              </div>
            </div>
          </Section>
        </div>
      </Section>
    </div>
  );
};
