"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Target, AlertTriangle, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";
import { EditableText, EditableList } from "@/components/EditableCard";
import { ScoreProgressRing } from "@/components/ScoreProgressRing";
import { calculateRealityScore, getScoreLabel, getScoreSubtext } from "@/components/RealityScoreCalculator";
import { ScoreImpactTable, ScoreImpactRow } from "@/components/ui/ScoreImpactTable";

export const EditableRealityCard = ({ 
  onScoreChange,
  acceptedImprovementsBoost = 0,
  onNavigateToCard,
  currentCardId
}: { 
  onScoreChange?: (score: number) => void;
  acceptedImprovementsBoost?: number;
  onNavigateToCard?: (cardId: string) => void;
  currentCardId?: string;
}) => {
  const [feasibilityScore, setFeasibilityScore] = useState("5.5/10");
  const [feasibilityTitle, setFeasibilityTitle] = useState("Possible with alignment and speed");
  const [feasibilitySubtext, setFeasibilitySubtext] = useState(
    "Not possible with slow process or strict constraints"
  );
  const [previousScore, setPreviousScore] = useState<number | undefined>(undefined);
  const [realityCheck1, setRealityCheck1] = useState(
    "This hire is feasible but challenging. You're not sourcing an entry-level analyst, you're competing for senior Analytics Engineers who are already employed, well-compensated, and selective about where they go next."
  );
  const [realityCheck2, setRealityCheck2] = useState(
    "Winning here requires competitive compensation, a tight fast hiring loop, consistent internal alignment, and clear ownership. Half-measures won't work in this market."
  );
  const [keyInsights, setKeyInsights] = useState([
    "Market is tight: Senior Analytics Engineers are fully employed. Outbound sourcing is mandatory.",
    "Speed wins: If your loop is slower than 10–14 days, every top-tier candidate evaporates.",
    "Compensation reality: If you offer €80k, you won't hire a senior, you'll hire someone who thinks they're senior."
  ]);
  const [helpsCase, setHelpsCase] = useState([
    "Modern stack (dbt, Snowflake, Looker)",
    "Customer-facing product impact",
    "Strong brand + scale-up momentum",
    "Clear ownership and autonomy in the Insights product"
  ]);
  const [hurtsCase, setHurtsCase] = useState([
    "Amsterdam-only requirement",
    "Slow or unclear interview loop",
    "Comp ceilings below market",
    "Misalignment between Data, PM & Engineering"
  ]);
  const [hiddenBottleneck, setHiddenBottleneck] = useState(
    "Stakeholder alignment. If PM, Data, and Engineering want different outcomes, no candidate will pass all interviews. This is the #1 reason these searches restart."
  );
  const [timelineToFailure, setTimelineToFailure] = useState(
    "If alignment isn't locked in during week 1 → expect the search to stall and restart around week 6."
  );
  const [bottomLine1, setBottomLine1] = useState(
    "Move fast (10-14 day loop), pay market rate (€95k-110k), and run targeted outbound sourcing, you'll hire."
  );
  const [bottomLine2, setBottomLine2] = useState(
    "Post-and-pray, take 4-6 weeks to decide, and lowball on comp, you won't."
  );
  const [whatsReallyGoingOn, setWhatsReallyGoingOn] = useState(
    "You're competing for senior Analytics Engineers who are: fully employed, well-paid, selective, not browsing job boards for fun. If your scope, messaging, and speed aren't sharp, you're effectively entering the race with untied shoelaces."
  );
  const [redFlags, setRedFlags] = useState([
    "JD reads like BI maintenance",
    "Stakeholders give different definitions of success",
    "No owner for modelling standards",
    "\"Comp is still being figured out\""
  ]);
  const [donts, setDonts] = useState([
    "Post-and-pray",
    "Pretend data debt is tiny (they'll find it faster than you think)",
    "Add every nice-to-have into the JD",
    "Start sourcing before alignment is real, not imagined"
  ]);
  const [scoreImpactRows, setScoreImpactRows] = useState<ScoreImpactRow[]>([
    {
      fix: "Align on 3 non-negotiable skills",
      impact: "+0.2",
      tooltip: "Why it matters: Removes noisy requirements. Reduces friction with HM.",
      talentPoolImpact: "+18% available market",
      riskReduction: "-10% restart risk"
    },
    {
      fix: "Pre-approve comp guardrails",
      impact: "+0.3",
      tooltip: "Why it matters: Prevents late rejections; seniors won't move without clarity.",
      talentPoolImpact: "+22% candidate engagement",
      riskReduction: "-20% offer-fail risk"
    },
    {
      fix: "Pre-block interview slots",
      impact: "+0.2",
      tooltip: "Why it matters: Time kills deals. Removes hidden bottlenecks.",
      talentPoolImpact: "+12% conversion",
      riskReduction: "-15% dropout risk"
    },
    {
      fix: "Clarify modelling ownership",
      impact: "+0.3",
      tooltip: "Why it matters: Seniors reject vague jobs instantly.",
      talentPoolImpact: "+15% persona match",
      riskReduction: "-25% misalignment risk"
    }
  ]);

  useEffect(() => {
    const data = {
      feasibilityScore, feasibilityTitle, feasibilitySubtext,
      realityCheck1, realityCheck2, keyInsights, helpsCase, hurtsCase,
      hiddenBottleneck, timelineToFailure, bottomLine1, bottomLine2,
      whatsReallyGoingOn, redFlags, donts, scoreImpactRows
    };
    sessionStorage.setItem("editableRealityCard", JSON.stringify(data));
  }, [feasibilityScore, feasibilityTitle, feasibilitySubtext, realityCheck1, realityCheck2, 
      keyInsights, helpsCase, hurtsCase, hiddenBottleneck, timelineToFailure, bottomLine1, bottomLine2,
      whatsReallyGoingOn, redFlags, donts, scoreImpactRows]);

  useEffect(() => {
    const saved = sessionStorage.getItem("editableRealityCard");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.feasibilityScore) setFeasibilityScore(data.feasibilityScore);
        if (data.feasibilityTitle) setFeasibilityTitle(data.feasibilityTitle);
        if (data.feasibilitySubtext) setFeasibilitySubtext(data.feasibilitySubtext);
        if (data.realityCheck1) setRealityCheck1(data.realityCheck1);
        if (data.realityCheck2) setRealityCheck2(data.realityCheck2);
        if (data.keyInsights) setKeyInsights(data.keyInsights);
        if (data.helpsCase) setHelpsCase(data.helpsCase);
        if (data.hurtsCase) setHurtsCase(data.hurtsCase);
        if (data.hiddenBottleneck) setHiddenBottleneck(data.hiddenBottleneck);
        if (data.timelineToFailure) setTimelineToFailure(data.timelineToFailure);
        if (data.bottomLine1) setBottomLine1(data.bottomLine1);
        if (data.bottomLine2) setBottomLine2(data.bottomLine2);
        if (data.whatsReallyGoingOn) setWhatsReallyGoingOn(data.whatsReallyGoingOn);
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
  }, [feasibilityScore, helpsCase, hurtsCase, keyInsights, realityCheck1, realityCheck2, hiddenBottleneck, timelineToFailure, bottomLine1, bottomLine2, acceptedImprovementsBoost]);

  // Track previous calculated score to prevent unnecessary updates
  const previousCalculatedScoreRef = useRef<number | undefined>(undefined);

  // Update score when it changes
  useEffect(() => {
    if (calculatedScore !== undefined && previousCalculatedScoreRef.current !== calculatedScore) {
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

  return (
    <div className="space-y-6">

      {/* Feasibility Score with Progress Ring */}
      <div className="bg-gradient-to-br from-[#278f8c] to-[#1a6764] text-white rounded-xl p-8">
        <p className="text-sm font-medium mb-4 opacity-90 text-center">Feasibility Score</p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-4">
          {/* Progress Ring */}
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
          
          {/* Score Details */}
          <div className="flex-1 text-center md:text-left">
            <div className="text-4xl font-bold mb-2">{calculatedScore.toFixed(1)}/10</div>
            <div className="text-lg font-medium mb-2">
              <EditableText
                value={feasibilityTitle}
                onChange={setFeasibilityTitle}
                className="text-lg font-medium text-white"
                style={{ color: 'white' }}
              />
            </div>
            <div className="text-sm opacity-90">
              <EditableText
                value={feasibilitySubtext}
                onChange={setFeasibilitySubtext}
                className="text-sm text-white opacity-90"
                style={{ color: 'white' }}
              />
            </div>
          </div>
        </div>

        {/* Manual Score Override (Optional) */}
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="text-xs opacity-75 mb-2 text-center">Manual Override (Optional)</div>
          <div className="flex items-center justify-center gap-2">
            <EditableText
              value={feasibilityScore}
              onChange={setFeasibilityScore}
              className="text-sm font-medium text-white bg-white/10 px-3 py-1 rounded"
              style={{ color: 'white' }}
              placeholder="5.5/10"
            />
            <span className="text-xs opacity-75">(Auto-calculated: {calculatedScore.toFixed(1)}/10)</span>
          </div>
        </div>
      </div>

      {/* What's Really Going On */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <h3 className="font-bold text-lg mb-3" style={{ color: "#102a63" }}>
          What's Really Going On
        </h3>
        <EditableText
          value={whatsReallyGoingOn}
          onChange={setWhatsReallyGoingOn}
          className="text-sm leading-relaxed"
          style={{ color: "#102a63" }}
          multiline
        />
      </div>

      {/* What Helps Your Case */}
      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
        <h3 className="font-bold text-lg mb-3 text-green-700">
          What Helps Your Case
        </h3>
        <EditableList
          items={helpsCase}
          onChange={setHelpsCase}
          itemClassName="text-sm text-green-900"
          markerColor="text-green-600"
        />
      </div>

      {/* What Hurts Your Case */}
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
        <h3 className="font-bold text-lg mb-3 text-red-700">
          What Hurts Your Case
        </h3>
        <EditableList
          items={hurtsCase}
          onChange={setHurtsCase}
          itemClassName="text-sm text-red-900"
          markerColor="text-red-600"
        />
      </div>

      {/* Brutal Truth */}
      <Callout tone="danger" title="Brutal Truth">
        <EditableText
          value={hiddenBottleneck}
          onChange={setHiddenBottleneck}
          multiline
        />
      </Callout>

      {/* Red Flags */}
      <Section title="Red Flags" Icon={AlertTriangle} tone="danger" collapsible={true} defaultExpanded={false}>
        <EditableList
          items={redFlags}
          onChange={setRedFlags}
          itemClassName="text-sm text-red-700"
          markerColor="text-red-600"
        />
      </Section>

      {/* Don't Do This */}
      <Section title="Don't Do This" Icon={AlertTriangle} tone="danger" collapsible={true} defaultExpanded={false}>
        <EditableList
          items={donts}
          onChange={setDonts}
          itemClassName="text-sm text-red-700"
          markerColor="text-red-600"
        />
      </Section>

      {/* Fix This Now — Score Impact Table */}
      <ScoreImpactTable rows={scoreImpactRows} totalUplift="+1.0" />

      {/* Timeline to Failure */}
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
        <div className="flex items-start gap-2">
          <Clock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-bold text-base mb-2 text-yellow-900">
              Timeline to Failure
            </h3>
            <EditableText
              value={timelineToFailure}
              onChange={setTimelineToFailure}
              className="text-sm text-yellow-900"
              multiline
            />
          </div>
        </div>
      </div>


      {/* Bottom Line */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2" style={{ color: "#102a63" }}>
          <Target className="w-5 h-5 text-[#278f8c]" />
          Bottom Line
        </h3>
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
      </div>

    </div>
  );
};
