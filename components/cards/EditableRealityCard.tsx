"use client";

import React, { useState, useEffect } from "react";
import { Target, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";
import { EditableText, EditableList } from "@/components/EditableCard";

export const EditableRealityCard = () => {
  const [feasibilityScore, setFeasibilityScore] = useState("5.5/10");
  const [feasibilityTitle, setFeasibilityTitle] = useState("Possible with alignment and speed");
  const [feasibilitySubtext, setFeasibilitySubtext] = useState(
    "Not possible with slow process or strict constraints"
  );
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

  useEffect(() => {
    const data = {
      feasibilityScore, feasibilityTitle, feasibilitySubtext,
      realityCheck1, realityCheck2, keyInsights, helpsCase, hurtsCase,
      hiddenBottleneck, timelineToFailure, bottomLine1, bottomLine2
    };
    sessionStorage.setItem("editableRealityCard", JSON.stringify(data));
  }, [feasibilityScore, feasibilityTitle, feasibilitySubtext, realityCheck1, realityCheck2, 
      keyInsights, helpsCase, hurtsCase, hiddenBottleneck, timelineToFailure, bottomLine1, bottomLine2]);

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
      } catch (e) {
        console.error("Failed to load saved data:", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#278f8c] to-[#1a6764] flex items-center justify-center">
          <Target className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "#102a63" }}>
            Reality Card
          </h2>
          <p className="text-sm text-gray-600">Feasibility score, market conditions, what helps or hurts your case, and the truth about making this hire.</p>
        </div>
      </div>

      {/* Feasibility Score */}
      <div className="bg-gradient-to-br from-[#278f8c] to-[#1a6764] text-white rounded-xl p-8 text-center">
        <p className="text-sm font-medium mb-2 opacity-90">Feasibility Score</p>
        <div className="text-6xl font-bold mb-3">
          <EditableText
            value={feasibilityScore}
            onChange={setFeasibilityScore}
            className="text-6xl font-bold text-white"
            style={{ color: 'white' }}
          />
        </div>
        <div className="text-xl font-medium mb-2">
          <EditableText
            value={feasibilityTitle}
            onChange={setFeasibilityTitle}
            className="text-xl font-medium text-white"
            style={{ color: 'white' }}
          />
        </div>
        <div className="text-sm opacity-80">
          <EditableText
            value={feasibilitySubtext}
            onChange={setFeasibilitySubtext}
            className="text-sm text-white opacity-80"
            style={{ color: 'white' }}
          />
        </div>
      </div>

      {/* Reality Check */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <h3 className="font-bold text-lg mb-3" style={{ color: "#102a63" }}>
          Reality Check
        </h3>
        <EditableText
          value={realityCheck1}
          onChange={setRealityCheck1}
          className="text-sm leading-relaxed mb-3"
          style={{ color: "#102a63" }}
          multiline
        />
        <EditableText
          value={realityCheck2}
          onChange={setRealityCheck2}
          className="text-sm leading-relaxed"
          style={{ color: "#102a63" }}
          multiline
        />
      </div>

      {/* Key Insights */}
      <div>
        <h3 className="font-bold text-lg mb-3" style={{ color: "#102a63" }}>
          Key Insights
        </h3>
        <EditableList
          items={keyInsights}
          onChange={setKeyInsights}
          itemClassName="text-sm"
          markerColor="text-blue-500"
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

      {/* Hidden Bottleneck */}
      <Callout tone="danger" title="Hidden Bottleneck">
        <EditableText
          value={hiddenBottleneck}
          onChange={setHiddenBottleneck}
          multiline
        />
      </Callout>

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
          The Bottom Line
        </h3>
        <div className="space-y-3">
          <EditableText
            value={bottomLine1}
            onChange={setBottomLine1}
            className="text-sm text-gray-800"
            multiline
          />
          <EditableText
            value={bottomLine2}
            onChange={setBottomLine2}
            className="text-sm text-gray-800"
            multiline
          />
        </div>
      </div>
    </div>
  );
};
