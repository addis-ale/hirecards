"use client";

import React, { useState, useEffect } from "react";
import {
  CalendarCheck,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Wrench,
  XCircle,
  Zap,
  Target,
} from "lucide-react";
import { EditableList, EditableText } from "@/components/EditableCard";
import {
  ScoreImpactTable,
  ScoreImpactRow,
} from "@/components/ui/ScoreImpactTable";
import { Card, CardHeader } from "@/components/ui/card";
import { SectionModal } from "@/components/ui/SectionModal";

interface PlanCardProps {
  onNavigateToCard?: (cardId: string) => void;
  currentCardId?: string;
  data?: {
    first7Days?: string[];
    weeklyRhythm?: string[];
    brutalTruth?: string;
    redFlags?: string[];
    donts?: string[];
    fixes?: string[];
    fastestPath?: string[];
  };
}

export const EditablePlanCard: React.FC<PlanCardProps> = ({
  data,
  onNavigateToCard,
  currentCardId,
}) => {
  // Initialize from data or use defaults
  const [first7Days, setFirst7Days] = useState(
    data?.first7Days || [
      "Finalize RoleCard",
      "Align scorecard",
      "Approve comp",
      "Build outbound list",
      "Schedule weekly sync",
      "Launch sourcing",
    ]
  );
  const [weeklyRhythm, setWeeklyRhythm] = useState(
    data?.weeklyRhythm || [
      "Pipeline review",
      "Blockers removed",
      "Calibration maintained",
      "Messaging updated",
      "Time-to-align tracked",
    ]
  );
  const [brutalTruth, setBrutalTruth] = useState(
    data?.brutalTruth ||
      "Hiring delays come from internal blockers, not market scarcity."
  );
  const [redFlags, setRedFlags] = useState(
    data?.redFlags || [
      "Hiring manager unavailable",
      "TA chasing stakeholders",
      "Comp approval delays",
      "Slow feedback loops",
    ]
  );
  const [donts, setDonts] = useState(
    data?.donts || [
      "Start sourcing before alignment",
      "Launch job without scorecard",
      "Build funnel without messaging",
    ]
  );
  const [fixes, setFixes] = useState(
    data?.fixes || [
      "Enforce 24-hour feedback",
      "Use shared hiring dashboard",
      "Pre-book interview slots",
    ]
  );
  const [fastestPath, setFastestPath] = useState(
    data?.fastestPath || [
      "Broaden geo → EU-friendly remote/relocation",
      "Raise comp slightly or pre-align offer flexibility",
      "Simplify interview loop to 3 steps",
      "Use strong product-oriented messaging",
      "Run 2 outbound waves per week",
      "Calibrate early → avoid sourcing the wrong persona",
      "Keep stakeholders aligned weekly",
    ]
  );
  const [scoreImpactRows, setScoreImpactRows] = useState<ScoreImpactRow[]>([
    {
      fix: "Enforce 24h feedback",
      impact: "+0.3",
      tooltip: "Speed is your biggest competitive edge in this market.",
      talentPoolImpact: "+20% acceptance",
      riskReduction: "-20% dropout"
    },
    {
      fix: "Pre-block calendars",
      impact: "+0.2",
      tooltip: "Prevents long gaps between rounds that seniors won't tolerate.",
      talentPoolImpact: "+15% faster loops",
      riskReduction: "-12% stall"
    },
    {
      fix: "2 outbound waves weekly",
      impact: "+0.2",
      tooltip: "Senior roles require consistent outbound volume to avoid pipeline starvation.",
      talentPoolImpact: "+25% pipeline",
      riskReduction: "-10% starvation"
    },
    {
      fix: "Early calibration",
      impact: "+0.2",
      tooltip: "Adjust expectations before the funnel fills with mismatched candidates.",
      talentPoolImpact: "+10% match quality",
      riskReduction: "-15% restart"
    }
  ]);

  const [openModal, setOpenModal] = useState<string | null>(null);

  // Update when data changes
  useEffect(() => {
    if (data?.first7Days) setFirst7Days(data.first7Days);
    if (data?.weeklyRhythm) setWeeklyRhythm(data.weeklyRhythm);
    if (data?.brutalTruth) setBrutalTruth(data.brutalTruth);
    if (data?.redFlags) setRedFlags(data.redFlags);
    if (data?.donts) setDonts(data.donts);
    if (data?.fixes) setFixes(data.fixes);
    if (data?.fastestPath) setFastestPath(data.fastestPath);
  }, [data]);

  useEffect(() => {
    const data = {
      first7Days,
      weeklyRhythm,
      brutalTruth,
      redFlags,
      donts,
      fixes,
      fastestPath,
      scoreImpactRows,
    };
    sessionStorage.setItem("editablePlanCard", JSON.stringify(data));
  }, [
    first7Days,
    weeklyRhythm,
    brutalTruth,
    redFlags,
    donts,
    fixes,
    fastestPath,
    scoreImpactRows,
  ]);

  useEffect(() => {
    const saved = sessionStorage.getItem("editablePlanCard");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.first7Days) setFirst7Days(data.first7Days);
        if (data.weeklyRhythm) setWeeklyRhythm(data.weeklyRhythm);
        if (data.brutalTruth) setBrutalTruth(data.brutalTruth);
        if (data.redFlags) setRedFlags(data.redFlags);
        if (data.donts) setDonts(data.donts);
        if (data.fixes) setFixes(data.fixes);
        if (data.fastestPath) setFastestPath(data.fastestPath);
        if (data.scoreImpactRows) setScoreImpactRows(data.scoreImpactRows);
      } catch (e) {
        console.error("Failed to load saved data:", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const first7DaysContent = (
    <div className="space-y-6">
      <div className="rounded-xl border border-blue-200 p-4 bg-gradient-to-br from-blue-50 to-white">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-blue-700 mt-0.5" />
          <div className="flex-1">
            <h4
              className="text-sm font-semibold mb-3"
              style={{ color: "#102a63" }}
            >
              First 7 Days
            </h4>
            <EditableList
              items={first7Days}
              onChange={setFirst7Days}
              itemClassName="text-sm"
              markerColor="text-blue-600"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const weeklyRhythmContent = (
    <div className="space-y-6">
      <div className="rounded-xl border border-emerald-200 p-4 bg-gradient-to-br from-emerald-50 to-white">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-emerald-700 mt-0.5" />
          <div className="flex-1">
            <h4
              className="text-sm font-semibold mb-3"
              style={{ color: "#102a63" }}
            >
              Weekly Rhythm
            </h4>
            <EditableList
              items={weeklyRhythm}
              onChange={setWeeklyRhythm}
              itemClassName="text-sm text-emerald-800"
              markerColor="text-emerald-600"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const fastestPathContent = (
    <div className="space-y-6">
      <div
        className="rounded-xl border-2 p-5 bg-gradient-to-br from-amber-50 to-white"
        style={{ borderColor: "#f59e0b" }}
      >
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-amber-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-base font-bold mb-3 text-amber-900">
              Bonus: Fastest Path to Hire (for this role)
            </h4>
            <EditableList
              items={fastestPath}
              onChange={setFastestPath}
              itemClassName="text-sm text-amber-900"
              markerColor="text-amber-600"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const sections = [
    {
      id: "first-7-days",
      title: "First 7 Days",
      subtitle: "Critical actions to complete in the first week",
      Icon: Calendar,
      tone: "info" as const,
      content: first7DaysContent,
    },
    {
      id: "weekly-rhythm",
      title: "Weekly Rhythm",
      subtitle: "Ongoing activities to maintain momentum",
      Icon: TrendingUp,
      tone: "success" as const,
      content: weeklyRhythmContent,
    },
    {
      id: "fastest-path",
      title: "Fastest Path to Hire",
      subtitle: "Optimized actions to accelerate hiring",
      Icon: Zap,
      tone: "warning" as const,
      content: fastestPathContent,
    },
    {
      id: "red-flags",
      title: "Red Flags",
      subtitle: "Warning signs that indicate process problems",
      Icon: AlertTriangle,
      tone: "danger" as const,
      content: (
        <EditableList
          items={redFlags}
          onChange={setRedFlags}
          itemClassName="text-sm"
          markerColor="text-red-600"
        />
      ),
    },
    {
      id: "donts",
      title: "Don't Do This",
      subtitle: "Common planning mistakes to avoid",
      Icon: XCircle,
      tone: "danger" as const,
      content: (
        <EditableList
          items={donts}
          onChange={setDonts}
          itemClassName="text-sm"
          markerColor="text-red-600"
        />
      ),
    },
    {
      id: "fixes",
      title: "Fixes",
      subtitle: "Actionable improvements for your hiring plan",
      Icon: Wrench,
      tone: "success" as const,
      content: (
        <EditableList
          items={fixes}
          onChange={setFixes}
          itemClassName="text-sm"
          markerColor="text-emerald-600"
        />
      ),
    },
    {
      id: "score-impact",
      title: "Score Impact Fixes",
      subtitle: "Actions you can take to improve your plan score",
      Icon: Target,
      tone: "success" as const,
      content: (
        <ScoreImpactTable rows={scoreImpactRows} totalUplift="+0.9" />
      ),
    },
    {
      id: "brutal-truth",
      title: "Brutal Truth",
      subtitle: "The harsh reality about hiring plans",
      Icon: AlertTriangle,
      tone: "danger" as const,
      content: (
        <EditableText
          value={brutalTruth}
          onChange={setBrutalTruth}
          className="text-sm font-medium text-red-900"
          multiline
        />
      ),
    },
  ];

  return (
    <>
      <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
        <div className="flex items-center gap-1">
          <div className="flex-shrink-0 pb-1">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900">
              Explore each section below. Click any card to view detailed
              insights and actionable recommendations.
            </p>
          </div>
        </div>
      </div>
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
                    style={{
                      background: `linear-gradient(135deg, ${colors.accent} 0%, #1a6764 100%)`,
                    }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      {section.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {section.subtitle}
                    </p>
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
