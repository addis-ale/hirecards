"use client";

import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, AlertTriangle, Wrench, XCircle } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";
import { EditableList, EditableKeyValue, EditableText } from "@/components/EditableCard";

export const EditableFunnelCard = () => {
  const [funnelStages, setFunnelStages] = useState([
    { label: "Outreach", value: "120–150" },
    { label: "Positive replies", value: "20–25" },
    { label: "Screens", value: "10–12" },
    { label: "Tech rounds", value: "7–8" },
    { label: "Finalists", value: "2–3" },
    { label: "Offers", value: "1–2" },
    { label: "Hire", value: "1" },
  ]);
  const [benchmarks, setBenchmarks] = useState([
    { label: "Outbound reply rate", value: "20–30%" },
    { label: "Tech pass rate", value: "40–60%" },
    { label: "Offer acceptance", value: "70–85%" },
  ]);
  const [brutalTruth, setBrutalTruth] = useState(
    "Your biggest funnel leak isn't sourcing. It's candidate dropout caused by internal delays."
  );
  const [redFlags, setRedFlags] = useState([
    "Gaps >72 hours between stages",
    "Tech test longer than 2 hours",
    "Generic messaging",
    "Late comp conversations"
  ]);
  const [donts, setDonts] = useState([
    "Rely only on LinkedIn outbound",
    "Overqualify early",
    "Add take-home assignments for seniors"
  ]);
  const [fixes, setFixes] = useState([
    "Warm candidates every 48–72 hours",
    "Kill long take-homes",
    "Use calendar blocking for interviewers",
    "Review pipeline every week with HM"
  ]);
  const [hiddenBottleneck, setHiddenBottleneck] = useState(
    "Your first screening question: If the recruiter can't articulate the product impact clearly → conversion dies."
  );

  useEffect(() => {
    const data = {
      funnelStages, benchmarks, brutalTruth, redFlags, donts, fixes, hiddenBottleneck
    };
    sessionStorage.setItem("editableFunnelCard", JSON.stringify(data));
  }, [funnelStages, benchmarks, brutalTruth, redFlags, donts, fixes, hiddenBottleneck]);

  useEffect(() => {
    const saved = sessionStorage.getItem("editableFunnelCard");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.funnelStages) setFunnelStages(data.funnelStages);
        if (data.benchmarks) setBenchmarks(data.benchmarks);
        if (data.brutalTruth) setBrutalTruth(data.brutalTruth);
        if (data.redFlags) setRedFlags(data.redFlags);
        if (data.donts) setDonts(data.donts);
        if (data.fixes) setFixes(data.fixes);
        if (data.hiddenBottleneck) setHiddenBottleneck(data.hiddenBottleneck);
      } catch (e) {
        console.error("Failed to load saved data:", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <Section title="Funnel Card" subtitle="The volume of outreach and interviews you'll need to fill the role." Icon={BarChart3} density="compact">
        <div className="space-y-4">
          {/* Expected Funnel */}
          <div className="rounded-xl border border-blue-200 p-4 bg-gradient-to-br from-blue-50 to-white">
            <div className="flex items-start gap-3">
              <BarChart3 className="w-5 h-5 text-blue-700 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-3" style={{ color: "#102a63" }}>
                  Expected Funnel
                </h4>
                <EditableKeyValue
                  data={funnelStages}
                  onChange={setFunnelStages}
                />
              </div>
            </div>
          </div>

          {/* Benchmarks */}
          <div className="rounded-xl border border-emerald-200 p-4 bg-gradient-to-br from-emerald-50 to-white">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-emerald-700 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-3" style={{ color: "#102a63" }}>
                  Benchmarks
                </h4>
                <EditableKeyValue
                  data={benchmarks}
                  onChange={setBenchmarks}
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

          {/* Red Flags */}
          <Section title="⚠️ Red Flags" Icon={AlertTriangle} tone="danger">
            <EditableList
              items={redFlags}
              onChange={setRedFlags}
              itemClassName="text-[13px] leading-snug text-red-700"
              markerColor="text-red-600"
            />
          </Section>

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
            <EditableList
              items={fixes}
              onChange={setFixes}
              itemClassName="text-[13px] leading-snug text-emerald-800"
              markerColor="text-emerald-600"
            />
          </Section>

          {/* Hidden Bottleneck */}
          <Callout tone="warning" title="🔍 Hidden Bottleneck">
            <EditableText
              value={hiddenBottleneck}
              onChange={setHiddenBottleneck}
              multiline
            />
          </Callout>
        </div>
      </Section>
    </div>
  );
};
