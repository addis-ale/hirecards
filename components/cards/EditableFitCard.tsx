"use client";

import React, { useState, useEffect } from "react";
import { UserCheck, Target, ThumbsUp, ThumbsDown, AlertTriangle, Wrench, XCircle, CheckCircle } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";
import { Pill } from "@/components/ui/Pill";
import { EditableList, EditableText } from "@/components/EditableCard";
import { ScoreImpactTable, ScoreImpactRow } from "@/components/ui/ScoreImpactTable";

export const EditableFitCard = ({
  onNavigateToCard,
  currentCardId
}: {
  onNavigateToCard?: (cardId: string) => void;
  currentCardId?: string;
} = {}) => {
  const [persona, setPersona] = useState("Product-Minded AE");
  const [motivatedBy, setMotivatedBy] = useState([
    "Ownership",
    "Impact",
    "Modern modelling standards",
    "Clean data and clear interfaces",
    "Tight PM partnership"
  ]);
  const [avoids, setAvoids] = useState([
    "Unclear ownership",
    "Legacy BI environments",
    "Slow decision-making",
    "Chaotic business stakeholders"
  ]);
  const [brutalTruth, setBrutalTruth] = useState(
    "Your strongest candidates aren't job hunting. You need to make the role sound energizing, not \"stable.\""
  );
  const [redFlags, setRedFlags] = useState([
    "Wants pure DS/ML work",
    "Wants minimal stakeholder interaction",
    "Wants only dashboards"
  ]);
  const [donts, setDonts] = useState([
    "Pitch the role as \"modern stack, impact, ownership\", every company says this",
    "Oversell AI elements",
    "Pretend data quality is perfect"
  ]);
  const [fixes, setFixes] = useState([
    "Show \"the messy truth\" early, AEs love honesty",
    "Position the role as product-building, not \"reporting\""
  ]);
  const [candidateEvaluation, setCandidateEvaluation] = useState([
    "Team competence",
    "Modelling standards",
    "Data quality",
    "PM alignment",
    "Product roadmap clarity",
    "Transparency about challenges"
  ]);
  const [decisionMakingYes, setDecisionMakingYes] = useState([
    "They can shape modelling foundations",
    "They see real technical challenges",
    "They see high-quality peers",
    "The interview loop feels structured",
    "Comp is aligned early",
    "Product impact is clear"
  ]);
  const [decisionMakingNo, setDecisionMakingNo] = useState([
    "They detect BI-heavy responsibilities",
    "Ownership is unclear",
    "Interviewers contradict each other",
    "The team cannot articulate a modelling philosophy",
    "They feel the role is actually mid-level disguised as senior"
  ]);
  const [scoreImpactRows, setScoreImpactRows] = useState<ScoreImpactRow[]>([
    {
      fix: "Tailor outreach to persona",
      impact: "+0.3",
      tooltip: "Relevance is the #1 driver of replies; generic messages get ignored.",
      talentPoolImpact: "+20% response",
      riskReduction: "-12% sourcing waste"
    },
    {
      fix: "Highlight modelling ownership",
      impact: "+0.2",
      tooltip: "This is the strongest motivator for product-minded AEs.",
      talentPoolImpact: "+15% interest",
      riskReduction: "-10% dropout"
    },
    {
      fix: "Show messy truth early",
      impact: "+0.2",
      tooltip: "Honesty builds instant credibility and differentiates you from fintech competitors.",
      talentPoolImpact: "+10% credibility",
      riskReduction: "-8% expectation mismatch"
    }
  ]);

  useEffect(() => {
    const data = {
      persona, motivatedBy, avoids, brutalTruth, redFlags, donts, fixes, candidateEvaluation, decisionMakingYes, decisionMakingNo, scoreImpactRows
    };
    sessionStorage.setItem("editableFitCard", JSON.stringify(data));
  }, [persona, motivatedBy, avoids, brutalTruth, redFlags, donts, fixes, candidateEvaluation, decisionMakingYes, decisionMakingNo, scoreImpactRows]);

  useEffect(() => {
    const saved = sessionStorage.getItem("editableFitCard");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.persona) setPersona(data.persona);
        if (data.motivatedBy) setMotivatedBy(data.motivatedBy);
        if (data.avoids) setAvoids(data.avoids);
        if (data.brutalTruth) setBrutalTruth(data.brutalTruth);
        if (data.redFlags) setRedFlags(data.redFlags);
        if (data.donts) setDonts(data.donts);
        if (data.fixes) setFixes(data.fixes);
        if (data.candidateEvaluation) setCandidateEvaluation(data.candidateEvaluation);
        if (data.decisionMakingYes) setDecisionMakingYes(data.decisionMakingYes);
        if (data.decisionMakingNo) setDecisionMakingNo(data.decisionMakingNo);
        if (data.scoreImpactRows) setScoreImpactRows(data.scoreImpactRows);
      } catch (e) {
        console.error("Failed to load saved data:", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <Section subtitle="What motivates this persona, what they care about, and what usually makes them say yes or no." Icon={UserCheck} density="compact" collapsible={true} defaultExpanded={false}>
        <div className="space-y-4">
          {/* Persona */}
          <div className="rounded-xl border-2 p-4 bg-gradient-to-br from-blue-50 to-white" style={{ borderColor: "#278f8c" }}>
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 mt-0.5" style={{ color: "#278f8c" }} />
              <div className="flex-1">
                <h4 className="text-base font-bold mb-1" style={{ color: "#102a63" }}>
                  Persona: <EditableText
                    value={persona}
                    onChange={setPersona}
                    className="inline"
                  />
                </h4>
              </div>
            </div>
          </div>

          {/* Motivated By */}
          <div className="rounded-xl border border-emerald-200 p-4 bg-gradient-to-br from-emerald-50 to-white">
            <div className="flex items-start gap-3">
              <ThumbsUp className="w-5 h-5 text-emerald-700 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-2" style={{ color: "#102a63" }}>
                  Motivated by:
                </h4>
                <EditableList
                  items={motivatedBy}
                  onChange={setMotivatedBy}
                  itemClassName="text-[13px] leading-snug text-emerald-800"
                  markerColor="text-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Avoids */}
          <div className="rounded-xl border border-red-200 p-4 bg-gradient-to-br from-red-50 to-white">
            <div className="flex items-start gap-3">
              <ThumbsDown className="w-5 h-5 text-red-700 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-2" style={{ color: "#102a63" }}>
                  Avoids:
                </h4>
                <EditableList
                  items={avoids}
                  onChange={setAvoids}
                  itemClassName="text-[13px] leading-snug text-red-700"
                  markerColor="text-red-600"
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

          {/* Decision-Making Model */}
          <div className="rounded-xl border border-blue-200 p-4 bg-gradient-to-br from-blue-50 to-white">
            <h4 className="text-sm font-semibold mb-3" style={{ color: "#102a63" }}>Decision-Making Model — How They Say Yes / No</h4>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-emerald-700 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  They say YES when:
                </p>
                <EditableList
                  items={decisionMakingYes}
                  onChange={setDecisionMakingYes}
                  itemClassName="text-[13px] leading-snug text-emerald-800"
                  markerColor="text-emerald-600"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-red-700 mb-2 flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  They say NO when:
                </p>
                <EditableList
                  items={decisionMakingNo}
                  onChange={setDecisionMakingNo}
                  itemClassName="text-[13px] leading-snug text-red-800"
                  markerColor="text-red-600"
                />
              </div>
            </div>
          </div>

          {/* Candidate Flip Test */}
          <Callout tone="warning" title="🔍 Candidate Flip Test">
            <p className="text-sm mb-2 font-medium" style={{ color: "#102a63" }}>
              Candidates are evaluating YOU on:
            </p>
            <div className="flex flex-wrap gap-2">
              {candidateEvaluation.map((item, idx) => (
                <Pill key={idx} tone="orange">{item}</Pill>
              ))}
            </div>
          </Callout>

          {/* Fix This Now — Score Impact Table */}
          <ScoreImpactTable rows={scoreImpactRows} totalUplift="+0.7" />
        </div>
      </Section>

    </div>
  );
};
