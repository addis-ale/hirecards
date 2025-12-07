"use client";

import React, { useState, useEffect } from "react";
import { Mic, CheckCircle, AlertTriangle, Wrench, XCircle } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";
import { EditableList, EditableText } from "@/components/EditableCard";
import { ScoreImpactTable, ScoreImpactRow } from "@/components/ui/ScoreImpactTable";

export const EditableInterviewCard = ({
  onNavigateToCard,
  currentCardId
}: {
  onNavigateToCard?: (cardId: string) => void;
  currentCardId?: string;
} = {}) => {
  const [optimalLoop, setOptimalLoop] = useState([
    "Recruiter screen",
    "Modelling + SQL deep dive",
    "Product/PM collaboration session",
    "Final cultural alignment"
  ]);
  const [brutalTruth, setBrutalTruth] = useState(
    "If the interviewers aren't trained, you're not evaluating candidates, you're filtering them at random."
  );
  const [redFlags, setRedFlags] = useState([
    "Interviewers \"wing it\"",
    "Vague questions",
    "\"Tell me about a time...\" with no follow-ups",
    "No scorecard → chaos"
  ]);
  const [donts, setDonts] = useState([
    "Add extra rounds",
    "Leave feedback to the end of the week",
    "Use take-homes >3h"
  ]);
  const [fixes, setFixes] = useState([
    "Standardize questions",
    "Train panel in probing, bias avoidance",
    "24-hour feedback SLA"
  ]);
  const [signalQuestions, setSignalQuestions] = useState([
    "Walk me through a modelling problem you owned end-to-end.",
    "How do you test and validate your models?",
    "Tell me about a metric you defined and how you ensured its correctness.",
    "What type of work do you not want to do?",
    "How do you work with PM/Engineering?"
  ]);
  const [scoreImpactRows, setScoreImpactRows] = useState<ScoreImpactRow[]>([
    {
      fix: "Standardise questions across interviewers",
      impact: "+0.3",
      tooltip: "Prevents random evaluation and improves fairness.",
      talentPoolImpact: "+15% signal quality",
      riskReduction: "-18% bias & inconsistency"
    },
    {
      fix: "Remove unnecessary rounds",
      impact: "+0.2",
      tooltip: "Seniors abandon long loops — fintech competitors move faster.",
      talentPoolImpact: "+20% offer acceptance",
      riskReduction: "-15% funnel dropout"
    },
    {
      fix: "Train interviewers (probing, bias avoidance)",
      impact: "+0.2",
      tooltip: "Bad interviews lose top candidates faster than bad sourcing.",
      talentPoolImpact: "+10% conversion",
      riskReduction: "-12% false negatives"
    },
    {
      fix: "Enforce 24h feedback SLA",
      impact: "+0.2",
      tooltip: "Fast feedback signals seriousness and keeps seniors engaged.",
      talentPoolImpact: "+12% acceptance",
      riskReduction: "-10% churn / ghosting"
    }
  ]);

  useEffect(() => {
    const data = {
      optimalLoop, brutalTruth, redFlags, donts, fixes, signalQuestions, scoreImpactRows
    };
    sessionStorage.setItem("editableInterviewCard", JSON.stringify(data));
  }, [optimalLoop, brutalTruth, redFlags, donts, fixes, signalQuestions, scoreImpactRows]);

  useEffect(() => {
    const saved = sessionStorage.getItem("editableInterviewCard");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.optimalLoop) setOptimalLoop(data.optimalLoop);
        if (data.brutalTruth) setBrutalTruth(data.brutalTruth);
        if (data.redFlags) setRedFlags(data.redFlags);
        if (data.donts) setDonts(data.donts);
        if (data.fixes) setFixes(data.fixes);
        if (data.signalQuestions) setSignalQuestions(data.signalQuestions);
        if (data.scoreImpactRows) setScoreImpactRows(data.scoreImpactRows);
      } catch (e) {
        console.error("Failed to load saved data:", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <Section subtitle="The recommended interview process and competencies to assess at each stage." Icon={Mic} density="compact" collapsible={true} defaultExpanded={false}>
        <div className="space-y-4">
          {/* Recommended Interview Loop */}
          <div className="rounded-xl border border-emerald-200 p-4 bg-gradient-to-br from-emerald-50 to-white">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-700 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-3" style={{ color: "#102a63" }}>
                  Recommended Interview Loop (3–4 Steps Max)
                </h4>
                <ol className="list-decimal pl-5 space-y-2 marker:text-emerald-700 marker:font-semibold">
                  {optimalLoop.map((step, idx) => (
                    <li key={idx} className="text-[13px] leading-snug text-emerald-800">
                      <EditableText
                        value={step}
                        onChange={(value) => {
                          const newLoop = [...optimalLoop];
                          newLoop[idx] = value;
                          setOptimalLoop(newLoop);
                        }}
                        className="inline"
                      />
                    </li>
                  ))}
                </ol>
                <p className="text-xs text-gray-600 mt-3 italic">Do not add more rounds. Every extra step increases senior dropout.</p>
              </div>
            </div>
          </div>

          {/* Signal Questions */}
          <div className="rounded-xl border border-blue-200 p-4 bg-gradient-to-br from-blue-50 to-white">
            <h4 className="text-sm font-semibold mb-3" style={{ color: "#102a63" }}>
              1️⃣ RECRUITER SCREEN — "Filter Out the Wrong Personas Fast"
            </h4>
            <p className="text-xs text-gray-600 mb-3">Ask these 5 signal questions:</p>
            <EditableList
              items={signalQuestions}
              onChange={setSignalQuestions}
              itemClassName="text-[13px] leading-snug"
              markerColor="text-blue-600"
            />
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

          {/* Fix This Now — Score Impact Table */}
          <ScoreImpactTable rows={scoreImpactRows} totalUplift="+0.9" />
        </div>
      </Section>

    </div>
  );
};
