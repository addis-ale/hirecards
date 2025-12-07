"use client";

import React, { useState, useEffect } from "react";
import { ClipboardList, Target, AlertTriangle, Wrench, XCircle } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";
import { EditableList, EditableText } from "@/components/EditableCard";
import { ScoreImpactTable, ScoreImpactRow } from "@/components/ui/ScoreImpactTable";

export const EditableScorecardCard = ({
  onNavigateToCard,
  currentCardId
}: {
  onNavigateToCard?: (cardId: string) => void;
  currentCardId?: string;
} = {}) => {
  const [competencies, setCompetencies] = useState([
    "Modelling",
    "Data quality discipline",
    "Product thinking",
    "Collaboration",
    "Communication",
    "Ownership"
  ]);
  const [rating1, setRating1] = useState("slows the team");
  const [rating2, setRating2] = useState("needs coaching");
  const [rating3, setRating3] = useState("independent senior");
  const [rating4, setRating4] = useState("raises the bar");
  const [brutalTruth, setBrutalTruth] = useState(
    "Weak scorecards lead to emotional hiring."
  );
  const [donts, setDonts] = useState([
    "Use vague competencies",
    "Let interviewers decide their own criteria",
    "Give everyone 3's"
  ]);
  const [fixes, setFixes] = useState([
    "Use behavioural anchors tied to outcomes",
    "Include \"negative examples\" for clarity",
    "Force a documented vote per interviewer"
  ]);
  const [evaluationMapping, setEvaluationMapping] = useState([
    { stage: "Stage 1 — Recruiter Screen", competencies: "Communication, Ownership" },
    { stage: "Stage 2 — Technical Deep Dive", competencies: "Modelling, Reliability" },
    { stage: "Stage 3 — Product Collaboration", competencies: "Product Thinking, Collaboration" },
    { stage: "Stage 4 — Values & Ownership", competencies: "Ownership, Communication (advanced)" }
  ]);
  const [scoreImpactRows, setScoreImpactRows] = useState<ScoreImpactRow[]>([
    {
      fix: "Add simple behavioural anchors",
      impact: "+0.2",
      tooltip: "Helps interviewers calibrate consistently.",
      talentPoolImpact: "+10% signal quality",
      riskReduction: "-12% misalignment"
    },
    {
      fix: "Standardise feedback format",
      impact: "+0.2",
      tooltip: "Speeds up decisions and reduces vague scoring.",
      talentPoolImpact: "+8% faster flow",
      riskReduction: "-10% churn"
    },
    {
      fix: "Weekly calibration (15 min)",
      impact: "+0.2",
      tooltip: "Keeps everyone aligned on what \"good\" is.",
      talentPoolImpact: "+12% accuracy",
      riskReduction: "-15% disagreement"
    }
  ]);

  useEffect(() => {
    const data = {
      competencies, rating1, rating2, rating3, rating4, brutalTruth, donts, fixes, evaluationMapping, scoreImpactRows
    };
    sessionStorage.setItem("editableScorecardCard", JSON.stringify(data));
  }, [competencies, rating1, rating2, rating3, rating4, brutalTruth, donts, fixes, evaluationMapping, scoreImpactRows]);

  useEffect(() => {
    const saved = sessionStorage.getItem("editableScorecardCard");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.competencies) setCompetencies(data.competencies);
        if (data.rating1) setRating1(data.rating1);
        if (data.rating2) setRating2(data.rating2);
        if (data.rating3) setRating3(data.rating3);
        if (data.rating4) setRating4(data.rating4);
        if (data.brutalTruth) setBrutalTruth(data.brutalTruth);
        if (data.donts) setDonts(data.donts);
        if (data.fixes) setFixes(data.fixes);
        if (data.evaluationMapping) setEvaluationMapping(data.evaluationMapping);
        if (data.scoreImpactRows) setScoreImpactRows(data.scoreImpactRows);
      } catch (e) {
        console.error("Failed to load saved data:", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <Section subtitle="A simple evaluation framework to keep the team aligned and reduce bias." Icon={ClipboardList} density="compact" collapsible={true} defaultExpanded={false}>
        <div className="space-y-4">
          {/* Competencies */}
          <div className="rounded-xl border border-blue-200 p-4 bg-gradient-to-br from-blue-50 to-white">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-blue-700 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-3" style={{ color: "#102a63" }}>
                  Competencies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {competencies.map((comp, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Rating Anchor */}
          <div className="rounded-xl border border-emerald-200 p-4 bg-gradient-to-br from-emerald-50 to-white">
            <div className="flex items-start gap-3">
              <ClipboardList className="w-5 h-5 text-emerald-700 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-3" style={{ color: "#102a63" }}>
                  Rating Anchor
                </h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <span className="text-[13px] leading-relaxed text-emerald-800">
                      = <EditableText
                        value={rating1}
                        onChange={setRating1}
                        className="inline"
                      />
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                    <span className="text-[13px] leading-relaxed text-emerald-800">
                      = <EditableText
                        value={rating2}
                        onChange={setRating2}
                        className="inline"
                      />
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">
                      3
                    </span>
                    <span className="text-[13px] leading-relaxed text-emerald-800">
                      = <EditableText
                        value={rating3}
                        onChange={setRating3}
                        className="inline"
                      />
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">
                      4
                    </span>
                    <span className="text-[13px] leading-relaxed text-emerald-800">
                      = <EditableText
                        value={rating4}
                        onChange={setRating4}
                        className="inline"
                      />
                    </span>
                  </div>
                </div>
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

          {/* Who Evaluates What */}
          <div className="rounded-xl border border-blue-200 p-4 bg-gradient-to-br from-blue-50 to-white">
            <h4 className="text-sm font-semibold mb-3" style={{ color: "#102a63" }}>
              Who Evaluates What (Mapped to Interview Loop)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-blue-100 border-b-2 border-blue-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-blue-900">Stage</th>
                    <th className="px-4 py-3 text-left font-semibold text-blue-900">Competencies</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {evaluationMapping.map((item, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{item.stage}</td>
                      <td className="px-4 py-3 text-gray-700">{item.competencies}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-600 mt-3 italic">No one evaluates everything — each stage has a purpose.</p>
          </div>

          {/* Fix This Now — Score Impact Table */}
          <ScoreImpactTable rows={scoreImpactRows} totalUplift="+0.6" />
        </div>
      </Section>

    </div>
  );
};
