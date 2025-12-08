"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Info,
  Lightbulb,
  XCircle,
} from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";
import { EditableText, EditableList } from "@/components/EditableCard";
import { ScoreProgressRing } from "@/components/ScoreProgressRing";
import {
  calculateRealityScore,
  getScoreLabel,
  getScoreSubtext,
} from "@/components/RealityScoreCalculator";
import {
  ScoreImpactTable,
  ScoreImpactRow,
} from "@/components/ui/ScoreImpactTable";
import { Card, CardHeader } from "@/components/ui/card";
import { SectionModal } from "@/components/ui/SectionModal";

interface RealityCardProps {
  data?: {
    keyInsights?: string[];
    helpsCase?: string[];
    hurtsCase?: string[];
    hiddenBottleneck?: string;
    timelineToFailure?: string;
    bottomLine1?: string;
    bottomLine2?: string;
    whatsReallyGoingOn?: string;
    redFlags?: string[];
    donts?: string[];
  };
  onScoreChange?: (score: number) => void;
  acceptedImprovementsBoost?: number;
  onNavigateToCard?: (cardId: string) => void;
  currentCardId?: string;
}

export const EditableRealityCard = ({
  data,
  onScoreChange,
  acceptedImprovementsBoost = 0,
  onNavigateToCard,
  currentCardId,
}: RealityCardProps) => {
  const [feasibilityScore, setFeasibilityScore] = useState("5.5/10");
  const [feasibilityTitle, setFeasibilityTitle] = useState(
    "Possible with alignment and speed"
  );
  const [feasibilitySubtext, setFeasibilitySubtext] = useState(
    "Not possible with slow process or strict constraints"
  );
  const [previousScore, setPreviousScore] = useState<number | undefined>(
    undefined
  );
  const [realityCheck1, setRealityCheck1] = useState(
    "This hire is feasible but challenging. You're not sourcing an entry-level analyst, you're competing for senior Analytics Engineers who are already employed, well-compensated, and selective about where they go next."
  );
  const [realityCheck2, setRealityCheck2] = useState(
    "Winning here requires competitive compensation, a tight fast hiring loop, consistent internal alignment, and clear ownership. Half-measures won't work in this market."
  );
  const [keyInsights, setKeyInsights] = useState(
    data?.keyInsights || [
      "Market is tight: Senior Analytics Engineers are fully employed. Outbound sourcing is mandatory.",
      "Speed wins: If your loop is slower than 10–14 days, every top-tier candidate evaporates.",
      "Compensation reality: If you offer €80k, you won't hire a senior, you'll hire someone who thinks they're senior.",
    ]
  );
  const [helpsCase, setHelpsCase] = useState(
    data?.helpsCase || [
      "Modern stack (dbt, Snowflake, Looker)",
      "Customer-facing product impact",
      "Strong brand + scale-up momentum",
      "Clear ownership and autonomy in the Insights product",
    ]
  );
  const [hurtsCase, setHurtsCase] = useState(
    data?.hurtsCase || [
      "Amsterdam-only requirement",
      "Slow or unclear interview loop",
      "Comp ceilings below market",
      "Misalignment between Data, PM & Engineering",
    ]
  );
  const [hiddenBottleneck, setHiddenBottleneck] = useState(
    data?.hiddenBottleneck ||
      "Stakeholder alignment. If PM, Data, and Engineering want different outcomes, no candidate will pass all interviews. This is the #1 reason these searches restart."
  );
  const [timelineToFailure, setTimelineToFailure] = useState(
    data?.timelineToFailure ||
      "If alignment isn't locked in during week 1 → expect the search to stall and restart around week 6."
  );
  const [bottomLine1, setBottomLine1] = useState(
    data?.bottomLine1 ||
      "Move fast (10-14 day loop), pay market rate (€95k-110k), and run targeted outbound sourcing, you'll hire."
  );
  const [bottomLine2, setBottomLine2] = useState(
    data?.bottomLine2 ||
      "Post-and-pray, take 4-6 weeks to decide, and lowball on comp, you won't."
  );
  const [whatsReallyGoingOn, setWhatsReallyGoingOn] = useState(
    data?.whatsReallyGoingOn ||
      "You're competing for senior Analytics Engineers who are: fully employed, well-paid, selective, not browsing job boards for fun. If your scope, messaging, and speed aren't sharp, you're effectively entering the race with untied shoelaces."
  );
  const [redFlags, setRedFlags] = useState(
    data?.redFlags || [
      "JD reads like BI maintenance",
      "Stakeholders give different definitions of success",
      "No owner for modelling standards",
      '"Comp is still being figured out"',
    ]
  );
  const [donts, setDonts] = useState(
    data?.donts || [
      "Post-and-pray",
      "Pretend data debt is tiny (they'll find it faster than you think)",
      "Add every nice-to-have into the JD",
      "Start sourcing before alignment is real, not imagined",
    ]
  );

  // Update when data prop changes
  useEffect(() => {
    if (data?.keyInsights) setKeyInsights(data.keyInsights);
    if (data?.helpsCase) setHelpsCase(data.helpsCase);
    if (data?.hurtsCase) setHurtsCase(data.hurtsCase);
    if (data?.hiddenBottleneck) setHiddenBottleneck(data.hiddenBottleneck);
    if (data?.timelineToFailure) setTimelineToFailure(data.timelineToFailure);
    if (data?.bottomLine1) setBottomLine1(data.bottomLine1);
    if (data?.bottomLine2) setBottomLine2(data.bottomLine2);
    if (data?.whatsReallyGoingOn)
      setWhatsReallyGoingOn(data.whatsReallyGoingOn);
    if (data?.redFlags) setRedFlags(data.redFlags);
    if (data?.donts) setDonts(data.donts);
  }, [data]);
  const [scoreImpactRows, setScoreImpactRows] = useState<ScoreImpactRow[]>([
    {
      fix: "Align on 3 non-negotiable skills",
      impact: "+0.2",
      tooltip:
        "Why it matters: Removes noisy requirements. Reduces friction with HM.",
      talentPoolImpact: "+18% available market",
      riskReduction: "-10% restart risk",
    },
    {
      fix: "Pre-approve comp guardrails",
      impact: "+0.3",
      tooltip:
        "Why it matters: Prevents late rejections; seniors won't move without clarity.",
      talentPoolImpact: "+22% candidate engagement",
      riskReduction: "-20% offer-fail risk",
    },
    {
      fix: "Pre-block interview slots",
      impact: "+0.2",
      tooltip: "Why it matters: Time kills deals. Removes hidden bottlenecks.",
      talentPoolImpact: "+12% conversion",
      riskReduction: "-15% dropout risk",
    },
    {
      fix: "Clarify modelling ownership",
      impact: "+0.3",
      tooltip: "Why it matters: Seniors reject vague jobs instantly.",
      talentPoolImpact: "+15% persona match",
      riskReduction: "-25% misalignment risk",
    },
  ]);

  useEffect(() => {
    const data = {
      feasibilityScore,
      feasibilityTitle,
      feasibilitySubtext,
      realityCheck1,
      realityCheck2,
      keyInsights,
      helpsCase,
      hurtsCase,
      hiddenBottleneck,
      timelineToFailure,
      bottomLine1,
      bottomLine2,
      whatsReallyGoingOn,
      redFlags,
      donts,
      scoreImpactRows,
    };
    sessionStorage.setItem("editableRealityCard", JSON.stringify(data));
  }, [
    feasibilityScore,
    feasibilityTitle,
    feasibilitySubtext,
    realityCheck1,
    realityCheck2,
    keyInsights,
    helpsCase,
    hurtsCase,
    hiddenBottleneck,
    timelineToFailure,
    bottomLine1,
    bottomLine2,
    whatsReallyGoingOn,
    redFlags,
    donts,
    scoreImpactRows,
  ]);

  useEffect(() => {
    const saved = sessionStorage.getItem("editableRealityCard");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.feasibilityScore) setFeasibilityScore(data.feasibilityScore);
        if (data.feasibilityTitle) setFeasibilityTitle(data.feasibilityTitle);
        if (data.feasibilitySubtext)
          setFeasibilitySubtext(data.feasibilitySubtext);
        if (data.realityCheck1) setRealityCheck1(data.realityCheck1);
        if (data.realityCheck2) setRealityCheck2(data.realityCheck2);
        if (data.keyInsights) setKeyInsights(data.keyInsights);
        if (data.helpsCase) setHelpsCase(data.helpsCase);
        if (data.hurtsCase) setHurtsCase(data.hurtsCase);
        if (data.hiddenBottleneck) setHiddenBottleneck(data.hiddenBottleneck);
        if (data.timelineToFailure)
          setTimelineToFailure(data.timelineToFailure);
        if (data.bottomLine1) setBottomLine1(data.bottomLine1);
        if (data.bottomLine2) setBottomLine2(data.bottomLine2);
        if (data.whatsReallyGoingOn)
          setWhatsReallyGoingOn(data.whatsReallyGoingOn);
        if (data.redFlags) setRedFlags(data.redFlags);
        if (data.donts) setDonts(data.donts);
        if (data.scoreImpactRows) setScoreImpactRows(data.scoreImpactRows);
      } catch (e) {
        console.error("Failed to load saved data:", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate dynamic score based on card data + accepted improvements
  const calculatedScore = useMemo(() => {
    const baseScore = calculateRealityScore({
      feasibilityScore,
      helpsCase,
      hurtsCase,
      keyInsights,
      realityCheck1,
      realityCheck2,
      hiddenBottleneck,
      timelineToFailure,
      bottomLine1,
      bottomLine2,
    });
    // Add accepted improvements boost (capped at 10)
    return Math.min(10, baseScore + acceptedImprovementsBoost);
  }, [
    feasibilityScore,
    helpsCase,
    hurtsCase,
    keyInsights,
    realityCheck1,
    realityCheck2,
    hiddenBottleneck,
    timelineToFailure,
    bottomLine1,
    bottomLine2,
    acceptedImprovementsBoost,
  ]);

  // Track previous calculated score to prevent unnecessary updates
  const previousCalculatedScoreRef = useRef<number | undefined>(undefined);

  // Update score when it changes
  useEffect(() => {
    if (
      calculatedScore !== undefined &&
      previousCalculatedScoreRef.current !== calculatedScore
    ) {
      previousCalculatedScoreRef.current = calculatedScore;
      onScoreChange?.(calculatedScore);
      // Update previous score after a delay to show change animation
      const timer = setTimeout(() => {
        setPreviousScore(calculatedScore);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [calculatedScore, onScoreChange]);

  // Auto-update title and subtext based on calculated score (optional - commented out to preserve user edits)
  // Uncomment if you want automatic updates, but this may overwrite user customizations
  // useEffect(() => {
  //   const expectedTitle = getScoreLabel(calculatedScore);
  //   const expectedSubtext = getScoreSubtext(calculatedScore);
  //   setFeasibilityTitle(expectedTitle);
  //   setFeasibilitySubtext(expectedSubtext);
  // }, [calculatedScore]);

  const [openModal, setOpenModal] = useState<string | null>(null);

  const sections = [
    {
      id: "whats-going-on",
      title: "What's Really Going On",
      subtitle: "The honest assessment of your hiring situation",
      Icon: Info,
      tone: "info" as const,
      content: (
        <EditableText
          value={whatsReallyGoingOn}
          onChange={setWhatsReallyGoingOn}
          className="text-sm leading-relaxed"
          style={{ color: "#102a63" }}
          multiline
        />
      ),
    },
    {
      id: "helps-case",
      title: "What Helps Your Case",
      subtitle: "Factors that work in your favor",
      Icon: CheckCircle,
      tone: "success" as const,
      content: (
        <EditableList
          items={helpsCase}
          onChange={setHelpsCase}
          itemClassName="text-sm text-green-900"
          markerColor="text-green-600"
        />
      ),
    },
    {
      id: "hurts-case",
      title: "What Hurts Your Case",
      subtitle: "Factors that work against you",
      Icon: XCircle,
      tone: "danger" as const,
      content: (
        <EditableList
          items={hurtsCase}
          onChange={setHurtsCase}
          itemClassName="text-sm text-red-900"
          markerColor="text-red-600"
        />
      ),
    },
    {
      id: "brutal-truth",
      title: "Brutal Truth",
      subtitle: "The hidden bottleneck you need to address",
      Icon: AlertTriangle,
      tone: "danger" as const,
      content: (
        <EditableText
          value={hiddenBottleneck}
          onChange={setHiddenBottleneck}
          multiline
        />
      ),
    },
    {
      id: "red-flags",
      title: "Red Flags",
      subtitle: "Warning signs to watch out for",
      Icon: AlertTriangle,
      tone: "danger" as const,
      content: (
        <EditableList
          items={redFlags}
          onChange={setRedFlags}
          itemClassName="text-sm text-red-700"
          markerColor="text-red-600"
        />
      ),
    },
    {
      id: "donts",
      title: "Don't Do This",
      subtitle: "Common mistakes to avoid",
      Icon: AlertTriangle,
      tone: "warning" as const,
      content: (
        <EditableList
          items={donts}
          onChange={setDonts}
          itemClassName="text-sm text-red-700"
          markerColor="text-red-600"
        />
      ),
    },
    {
      id: "score-impact",
      title: "Score Impact Fixes",
      subtitle: "Actions to improve your hiring score",
      Icon: Target,
      tone: "success" as const,
      content: <ScoreImpactTable rows={scoreImpactRows} totalUplift="+1.0" />,
    },
    {
      id: "timeline-failure",
      title: "Timeline to Failure",
      subtitle: "When things go wrong if not addressed",
      Icon: Clock,
      tone: "warning" as const,
      content: (
        <EditableText
          value={timelineToFailure}
          onChange={setTimelineToFailure}
          className="text-sm text-yellow-900"
          multiline
        />
      ),
    },
    {
      id: "bottom-line",
      title: "Bottom Line",
      subtitle: "The key takeaways and recommendations",
      Icon: Target,
      tone: "info" as const,
      content: (
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <EditableText
              value={bottomLine1}
              onChange={setBottomLine1}
              className="text-sm text-gray-800"
              multiline
            />
          </div>
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <EditableText
              value={bottomLine2}
              onChange={setBottomLine2}
              className="text-sm text-gray-800"
              multiline
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Feasibility Score with Progress Ring - Keep visible */}
      <div className="bg-gradient-to-br from-[#278f8c] to-[#1a6764] text-white rounded-xl p-8 mb-6">
        <p className="text-sm font-medium mb-4 opacity-90 text-center">
          Feasibility Score
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-4">
          <div className="flex-shrink-0">
            <ScoreProgressRing
              currentScore={calculatedScore}
              previousScore={previousScore}
              maxScore={10}
              size={140}
              strokeWidth={10}
              showChange={true}
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="text-4xl font-bold mb-2">
              {calculatedScore.toFixed(1)}/10
            </div>
            <div className="text-lg font-medium mb-2">
              <EditableText
                value={feasibilityTitle}
                onChange={setFeasibilityTitle}
                className="text-lg font-medium text-white"
                style={{ color: "white" }}
              />
            </div>
            <div className="text-sm opacity-90">
              <EditableText
                value={feasibilitySubtext}
                onChange={setFeasibilitySubtext}
                className="text-sm text-white opacity-90"
                style={{ color: "white" }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="text-xs opacity-75 mb-2 text-center">
            Manual Override (Optional)
          </div>
          <div className="flex items-center justify-center gap-2">
            <EditableText
              value={feasibilityScore}
              onChange={setFeasibilityScore}
              className="text-sm font-medium text-white bg-white/10 px-3 py-1 rounded"
              style={{ color: "white" }}
              placeholder="5.5/10"
            />
            <span className="text-xs opacity-75">
              (Auto-calculated: {calculatedScore.toFixed(1)}/10)
            </span>
          </div>
        </div>
      </div>

      {/* Instruction text */}
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
