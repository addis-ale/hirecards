"use client";

import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, AlertTriangle, Wrench, XCircle } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";
import { EditableList, EditableKeyValue, EditableText } from "@/components/EditableCard";
import { ScoreImpactTable, ScoreImpactRow } from "@/components/ui/ScoreImpactTable";
import { Card, CardHeader } from "@/components/ui/card";
import { SectionModal } from "@/components/ui/SectionModal";

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

  const [openModal, setOpenModal] = useState<string | null>(null);

  const sections = [
    {
      id: "expected-funnel",
      title: "Expected Funnel",
      subtitle: "Volume needed at each stage",
      Icon: BarChart3,
      tone: "info" as const,
      content: (
        <EditableKeyValue
          data={funnelStages}
          onChange={setFunnelStages}
        />
      ),
    },
    {
      id: "benchmarks",
      title: "Benchmarks",
      subtitle: "Industry standard metrics",
      Icon: TrendingUp,
      tone: "success" as const,
      content: (
        <EditableKeyValue
          data={benchmarks}
          onChange={setBenchmarks}
        />
      ),
    },
    {
      id: "brutal-truth",
      title: "Brutal Truth",
      subtitle: "The hard truth about your funnel",
      Icon: AlertTriangle,
      tone: "danger" as const,
      content: (
        <EditableText
          value={brutalTruth}
          onChange={setBrutalTruth}
          multiline
        />
      ),
    },
    {
      id: "red-flags",
      title: "Red Flags",
      subtitle: "Warning signs in your funnel",
      Icon: AlertTriangle,
      tone: "danger" as const,
      content: (
        <EditableList
          items={redFlags}
          onChange={setRedFlags}
          itemClassName="text-[13px] leading-snug text-red-700"
          markerColor="text-red-600"
        />
      ),
    },
    {
      id: "donts",
      title: "Don't Do This",
      subtitle: "Common funnel mistakes",
      Icon: XCircle,
      tone: "danger" as const,
      content: (
        <EditableList
          items={donts}
          onChange={setDonts}
          itemClassName="text-[13px] leading-snug text-red-700"
          markerColor="text-red-600"
        />
      ),
    },
    {
      id: "funnel-health",
      title: "Funnel Health Comparison",
      subtitle: "Healthy vs broken funnel outcomes",
      Icon: BarChart3,
      tone: "info" as const,
      content: (
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
      ),
    },
    {
      id: "score-impact",
      title: "Score Impact Fixes",
      subtitle: "Actions to improve your hiring score",
      Icon: TrendingUp,
      tone: "success" as const,
      content: <ScoreImpactTable rows={scoreImpactRows} totalUplift="+0.8" />,
    },
    {
      id: "hidden-bottleneck",
      title: "Hidden Bottleneck",
      subtitle: "The hidden factor affecting your funnel",
      Icon: AlertTriangle,
      tone: "warning" as const,
      content: (
        <EditableText
          value={hiddenBottleneck}
          onChange={setHiddenBottleneck}
          multiline
        />
      ),
    },
  ];

  return (
    <>
      {/* Instruction text */}
      <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
        <div className="flex items-center gap-1">
          <div className="flex-shrink-0 pb-1">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900">
              Explore each section below. Click any card to view detailed insights and actionable recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-0">
        {sections.map((section) => {
          const Icon = section.Icon;
          const toneColors: Record<string, { accent: string; bg: string }> = {
            info: { accent: "#2563eb", bg: "rgba(37,99,235,0.1)" },
            warning: { accent: "#d97706", bg: "rgba(217,119,6,0.1)" },
            purple: { accent: "#7c3aed", bg: "rgba(124,58,237,0.1)" },
            success: { accent: "#16a34a", bg: "rgba(22,163,74,0.1)" },
            danger: { accent: "#dc2626", bg: "rgba(220,38,38,0.1)" },
          };
          const colors = toneColors[section.tone] || toneColors.info;

          return (
            <Card
              key={section.id}
              className="w-full cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setOpenModal(section.id)}
            >
              <CardHeader className="p-4">
                <div className="flex flex-col items-center text-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${colors.accent} 0%, #1a6764 100%)` }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{section.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">{section.subtitle}</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Modals */}
      {sections.map((section) => {
        const Icon = section.Icon;
        return (
          <SectionModal
            key={section.id}
            isOpen={openModal === section.id}
            onClose={() => setOpenModal(null)}
            title={section.title}
            subtitle={section.subtitle}
            Icon={Icon}
            tone={section.tone}
          >
            {section.content}
          </SectionModal>
        );
      })}
    </>
  );
};
