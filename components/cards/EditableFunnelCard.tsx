"use client";

import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, AlertTriangle, Wrench, XCircle } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";
import { EditableList, EditableKeyValue, EditableText } from "@/components/EditableCard";
import { ScoreImpactTable, ScoreImpactRow } from "@/components/ui/ScoreImpactTable";

export const EditableFunnelCard = ({
  onNavigateToCard,
  currentCardId
}: {
  onNavigateToCard?: (cardId: string) => void;
  currentCardId?: string;
} = {}) => {
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
  const [funnelHealthComparison, setFunnelHealthComparison] = useState([
    { type: "Healthy (48–72 hr flow, clear comp, strong message)", outcome: "Hire in 25–35 days" },
    { type: "Typical (slow communication, vague JD)", outcome: "Hire in 50–70 days" },
    { type: "Broken (4–5 rounds, unprepared interviewers)", outcome: "Restart at week 6" }
  ]);
  const [scoreImpactRows, setScoreImpactRows] = useState<ScoreImpactRow[]>([
    {
      fix: "Warm candidates every 48–72h",
      impact: "+0.2",
      tooltip: "Seniors vanish if they think they're not a priority.",
      talentPoolImpact: "+12% retention",
      riskReduction: "-10% ghosting"
    },
    {
      fix: "Remove long take-homes (>2h)",
      impact: "+0.2",
      tooltip: "Seniors don't do unpaid labour; they drop instantly.",
      talentPoolImpact: "+10% conversion",
      riskReduction: "-15% stage abandonment"
    },
    {
      fix: "Block interviewer calendars ahead of time",
      impact: "+0.2",
      tooltip: "Eliminates week-long delays and funnel decay.",
      talentPoolImpact: "+15% pipeline speed",
      riskReduction: "-12% delay risk"
    },
    {
      fix: "Pre-align comp & share early",
      impact: "+0.2",
      tooltip: "Prevents late-stage rejection or negotiation collapse.",
      talentPoolImpact: "+10% offer success",
      riskReduction: "-10% offer collapse"
    }
  ]);

  useEffect(() => {
    const data = {
      funnelStages, benchmarks, brutalTruth, redFlags, donts, fixes, hiddenBottleneck, funnelHealthComparison, scoreImpactRows
    };
    sessionStorage.setItem("editableFunnelCard", JSON.stringify(data));
  }, [funnelStages, benchmarks, brutalTruth, redFlags, donts, fixes, hiddenBottleneck, funnelHealthComparison, scoreImpactRows]);

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
        if (data.funnelHealthComparison) setFunnelHealthComparison(data.funnelHealthComparison);
        if (data.scoreImpactRows) setScoreImpactRows(data.scoreImpactRows);
      } catch (e) {
        console.error("Failed to load saved data:", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <Section subtitle="The volume of outreach and interviews you'll need to fill the role." Icon={BarChart3} density="compact" collapsible={true} defaultExpanded={false}>
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

          {/* Funnel Health Comparison */}
          <div className="rounded-xl border border-blue-200 p-4 bg-gradient-to-br from-blue-50 to-white">
            <h4 className="text-sm font-semibold mb-3" style={{ color: "#102a63" }}>
              Funnel Health Comparison
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-blue-100 border-b-2 border-blue-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-blue-900">Funnel Type</th>
                    <th className="px-4 py-3 text-left font-semibold text-blue-900">Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {funnelHealthComparison.map((item, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{item.type}</td>
                      <td className="px-4 py-3 text-gray-700">{item.outcome}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fix This Now — Score Impact Table */}
          <ScoreImpactTable rows={scoreImpactRows} totalUplift="+0.8" />

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
