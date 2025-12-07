"use client";

import React, { useState, useEffect } from "react";
import { UserCheck, Target, ThumbsUp, ThumbsDown, AlertTriangle, Wrench, XCircle, CheckCircle } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";
import { Pill } from "@/components/ui/Pill";
import { EditableList, EditableText } from "@/components/EditableCard";
import { ScoreImpactTable, ScoreImpactRow } from "@/components/ui/ScoreImpactTable";
import { Card, CardHeader } from "@/components/ui/card";
import { SectionModal } from "@/components/ui/SectionModal";

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

  const [openModal, setOpenModal] = useState<string | null>(null);

  const sections = [
    {
      id: "persona",
      title: "Persona",
      subtitle: "Target candidate profile",
      Icon: Target,
      tone: "info" as const,
      content: (
        <div>
          <h4 className="text-base font-bold mb-2" style={{ color: "#102a63" }}>
            Persona:
          </h4>
          <EditableText
            value={persona}
            onChange={setPersona}
            className="text-base"
          />
        </div>
      ),
    },
    {
      id: "motivated-by",
      title: "Motivated By",
      subtitle: "What drives this persona",
      Icon: ThumbsUp,
      tone: "success" as const,
      content: (
        <EditableList
          items={motivatedBy}
          onChange={setMotivatedBy}
          itemClassName="text-[13px] leading-snug text-emerald-800"
          markerColor="text-emerald-600"
        />
      ),
    },
    {
      id: "avoids",
      title: "Avoids",
      subtitle: "What this persona avoids",
      Icon: ThumbsDown,
      tone: "danger" as const,
      content: (
        <EditableList
          items={avoids}
          onChange={setAvoids}
          itemClassName="text-[13px] leading-snug text-red-700"
          markerColor="text-red-600"
        />
      ),
    },
    {
      id: "brutal-truth",
      title: "Brutal Truth",
      subtitle: "The hard truth about this persona",
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
      subtitle: "Warning signs in candidate profiles",
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
      subtitle: "Common mistakes to avoid",
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
      id: "fixes",
      title: "Fix This Now",
      subtitle: "Actions to improve fit",
      Icon: Wrench,
      tone: "success" as const,
      content: (
        <EditableList
          items={fixes}
          onChange={setFixes}
          itemClassName="text-[13px] leading-snug text-emerald-800"
          markerColor="text-emerald-600"
        />
      ),
    },
    {
      id: "decision-making",
      title: "Decision-Making Model",
      subtitle: "How they say yes or no",
      Icon: CheckCircle,
      tone: "info" as const,
      content: (
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
      ),
    },
    {
      id: "candidate-flip",
      title: "Candidate Flip Test",
      subtitle: "What candidates evaluate you on",
      Icon: UserCheck,
      tone: "warning" as const,
      content: (
        <div>
          <p className="text-sm mb-2 font-medium" style={{ color: "#102a63" }}>
            Candidates are evaluating YOU on:
          </p>
          <div className="flex flex-wrap gap-2">
            {candidateEvaluation.map((item, idx) => (
              <Pill key={idx} tone="orange">{item}</Pill>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "score-impact",
      title: "Score Impact Fixes",
      subtitle: "Actions to improve your hiring score",
      Icon: Target,
      tone: "success" as const,
      content: <ScoreImpactTable rows={scoreImpactRows} totalUplift="+0.7" />,
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
