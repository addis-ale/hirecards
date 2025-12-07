"use client";

import React, { useState, useEffect } from "react";
import { Code, AlertTriangle, Hammer, Brain, Users, TrendingUp, XCircle, Target, BookOpen } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";
import { EditableList, EditableText } from "@/components/EditableCard";
import { ScoreImpactTable, ScoreImpactRow } from "@/components/ui/ScoreImpactTable";
import { Card, CardHeader } from "@/components/ui/card";
import { SectionModal } from "@/components/ui/SectionModal";

export const EditableSkillCard = ({
  onNavigateToCard,
  currentCardId
}: {
  onNavigateToCard?: (cardId: string) => void;
  currentCardId?: string;
} = {}) => {
  const [technicalSkills, setTechnicalSkills] = useState([
    "Advanced SQL",
    "dbt modelling",
    "Dimensional modelling",
    "BI tools",
    "Pipeline building",
  ]);
  const [productSkills, setProductSkills] = useState([
    "Define clear metrics",
    "Shape analytics UX",
    "Model business logic",
  ]);
  const [behaviouralSkills, setBehaviouralSkills] = useState([
    "Ownership mindset",
    "Handles ambiguity",
    "Clear communication",
    "Quality focused",
  ]);
  const [brutalTruth, setBrutalTruth] = useState(
    'Most "analytics engineers" are BI developers. Find system designers.'
  );
  const [redFlags, setRedFlags] = useState([
    "Dashboard-focused only",
    "No testing opinions",
    "Avoids documentation",
    "Dismisses governance",
  ]);
  const [donts, setDonts] = useState([
    "Hire without dbt experience",
    "Skip modelling exercises",
    "Confuse data/analytics engineers",
  ]);
  const [upskillableSkills, setUpskillableSkills] = useState([
    "Looker",
    "Metric layers",
    "Domain-specific metrics",
    "Airflow DAG writing"
  ]);
  const [mustHaveSkills, setMustHaveSkills] = useState([
    "Modelling fundamentals",
    "dbt proficiency",
    "SQL testing discipline",
    "Ownership mindset"
  ]);
  const [scoreImpactRows, setScoreImpactRows] = useState<ScoreImpactRow[]>([
    {
      fix: "Remove non-essential skills",
      impact: "+0.3",
      tooltip: "Why it matters: Removes blockers without lowering quality.",
      talentPoolImpact: "+25% pool expansion",
      riskReduction: "-15% false negatives"
    },
    {
      fix: "Prioritise top 5 must-haves",
      impact: "+0.2",
      tooltip: "Why it matters: AEs choose clarity.",
      talentPoolImpact: "+15% persona match",
      riskReduction: "-10% interview waste"
    },
    {
      fix: "Clarify upskillable skills",
      impact: "+0.1",
      tooltip: "Why it matters: Prevents needless rejections.",
      talentPoolImpact: "+10% more candidates",
      riskReduction: "-5% HM conflict"
    },
    {
      fix: "Add modelling evaluation",
      impact: "+0.2",
      tooltip: "Why it matters: Filters accurately without over-indexing CV buzzwords.",
      talentPoolImpact: "+12% signal quality",
      riskReduction: "-15% bad hires"
    }
  ]);

  // Save to sessionStorage
  useEffect(() => {
    const data = {
      technicalSkills,
      productSkills,
      behaviouralSkills,
      brutalTruth,
      redFlags,
      donts,
      upskillableSkills,
      mustHaveSkills,
      scoreImpactRows
    };
    sessionStorage.setItem("editableSkillCard", JSON.stringify(data));
  }, [technicalSkills, productSkills, behaviouralSkills, brutalTruth, redFlags, donts, upskillableSkills, mustHaveSkills, scoreImpactRows]);

  // Load from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem("editableSkillCard");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.technicalSkills) setTechnicalSkills(data.technicalSkills);
        if (data.productSkills) setProductSkills(data.productSkills);
        if (data.behaviouralSkills) setBehaviouralSkills(data.behaviouralSkills);
        if (data.brutalTruth) setBrutalTruth(data.brutalTruth);
        if (data.redFlags) setRedFlags(data.redFlags);
        if (data.donts) setDonts(data.donts);
        if (data.upskillableSkills) setUpskillableSkills(data.upskillableSkills);
        if (data.mustHaveSkills) setMustHaveSkills(data.mustHaveSkills);
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
      id: "technical-skills",
      title: "Core Technical Skills",
      subtitle: "Essential technical abilities and tools",
      Icon: Code,
      tone: "info" as const,
      content: (
        <EditableList
          items={technicalSkills}
          onChange={setTechnicalSkills}
          itemClassName="text-[13px] leading-snug"
          markerColor="text-blue-600"
        />
      ),
    },
    {
      id: "product-skills",
      title: "Product Skills",
      subtitle: "Product-focused abilities and mindset",
      Icon: Brain,
      tone: "purple" as const,
      content: (
        <EditableList
          items={productSkills}
          onChange={setProductSkills}
          itemClassName="text-[13px] leading-snug"
          markerColor="text-purple-600"
        />
      ),
    },
    {
      id: "behavioural-skills",
      title: "Behavioural Skills",
      subtitle: "Soft skills and work approach",
      Icon: Users,
      tone: "success" as const,
      content: (
        <EditableList
          items={behaviouralSkills}
          onChange={setBehaviouralSkills}
          itemClassName="text-[13px] leading-snug"
          markerColor="text-green-600"
        />
      ),
    },
    {
      id: "brutal-truth",
      title: "Brutal Truth",
      subtitle: "The hard truth about skills for this role",
      Icon: AlertTriangle,
      tone: "danger" as const,
      content: (
        <EditableText
          value={brutalTruth}
          onChange={setBrutalTruth}
          multiline
          placeholder="What's the hard truth about skills for this role?"
        />
      ),
    },
    {
      id: "red-flags",
      title: "Red Flags",
      subtitle: "Warning signs in skill requirements",
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
      Icon: Hammer,
      tone: "warning" as const,
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
      id: "upskillability",
      title: "Upskillability Guide",
      subtitle: "What can be trained vs must-have skills",
      Icon: BookOpen,
      tone: "info" as const,
      content: (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-bold text-emerald-700 mb-2">Can be trained quickly (shouldn't block seniors):</p>
            <EditableList
              items={upskillableSkills}
              onChange={setUpskillableSkills}
              itemClassName="text-[13px] leading-snug text-emerald-800"
              markerColor="text-emerald-600"
            />
          </div>
          <div>
            <p className="text-xs font-bold text-red-700 mb-2">Cannot be trained fast enough (must-have at entry):</p>
            <EditableList
              items={mustHaveSkills}
              onChange={setMustHaveSkills}
              itemClassName="text-[13px] leading-snug text-red-800"
              markerColor="text-red-600"
            />
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
      content: <ScoreImpactTable rows={scoreImpactRows} totalUplift="+0.8" />,
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
