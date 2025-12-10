"use client";

import React, { useState, useEffect } from "react";
import {
  Code,
  AlertTriangle,
  Hammer,
  Brain,
  Users,
  TrendingUp,
  XCircle,
  Target,
  BookOpen,
} from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";
import { EditableList, EditableText } from "@/components/EditableCard";
import {
  ScoreImpactTable,
  ScoreImpactRow,
} from "@/components/ui/ScoreImpactTable";
import { Card, CardHeader } from "@/components/ui/card";
import { SectionModal } from "@/components/ui/SectionModal";
import { shouldShowInline, renderContentPreview } from "@/lib/sectionContentHelper";

interface SkillCardProps {
  data?: {
    technicalSkills?: string[];
    productSkills?: string[];
    behaviouralSkills?: string[];
    brutalTruth?: string;
    redFlags?: string[];
    donts?: string[];
    upskillableSkills?: string[];
    mustHaveSkills?: string[];
  };
  onNavigateToCard?: (cardId: string) => void;
  currentCardId?: string;
}

export const EditableSkillCard = ({
  data,
  onNavigateToCard,
  currentCardId,
}: SkillCardProps = {}) => {
  // Initialize from data prop, fallback to static example data
  const [technicalSkills, setTechnicalSkills] = useState(
    data?.technicalSkills ?? [
      "Advanced SQL + testing discipline",
      "Strong dbt (macros, tests, structure, ref patterns)",
      "Dimensional modelling & semantic layer design",
      "Pipeline design + data reliability engineering",
      "BI familiarity (Looker ideal)",
    ]
  );
  const [productSkills, setProductSkills] = useState(
    data?.productSkills ?? [
      "Translate messy business logic → clean models",
      "Define metrics with Product",
      "Reason through tradeoffs",
      "Influence analytics UX",
    ]
  );
  const [behaviouralSkills, setBehaviouralSkills] = useState(
    data?.behaviouralSkills ?? [
      "Ownership mindset",
      "Writes clear reasoning",
      "Thrives in ambiguity",
      "Protects modelling quality",
    ]
  );
  const [brutalTruth, setBrutalTruth] = useState(
    data?.brutalTruth ?? 'Most "analytics engineers" are BI developers. Find system designers.'
  );
  const [redFlags, setRedFlags] = useState(
    data?.redFlags ?? [
      "Only built dashboards",
      "Avoids documentation",
      "Weak testing discipline",
      "No ownership vocabulary",
    ]
  );
  const [donts, setDonts] = useState(
    data?.donts ?? [
      "Hire BI devs mislabelled as AEs",
      "Skip modelling exercises",
      "Over-index on domain experience",
      "Confuse \"good with dashboards\" = \"strong AE\"",
    ]
  );
  const [upskillableSkills, setUpskillableSkills] = useState(
    data?.upskillableSkills ?? [
      "Looker",
      "Metric layers",
      "Domain-specific metrics",
      "Airflow DAG writing",
    ]
  );
  const [mustHaveSkills, setMustHaveSkills] = useState(
    data?.mustHaveSkills ?? [
      "Modelling fundamentals",
      "dbt proficiency",
      "SQL testing discipline",
      "Ownership mindset",
    ]
  );

  // Update when data prop changes - check for !== undefined and !== null to handle empty arrays/strings
  useEffect(() => {
    if (data !== undefined && data !== null) {
      if (data.technicalSkills !== undefined) setTechnicalSkills(data.technicalSkills);
      if (data.productSkills !== undefined) setProductSkills(data.productSkills);
      if (data.behaviouralSkills !== undefined) setBehaviouralSkills(data.behaviouralSkills);
      if (data.brutalTruth !== undefined) setBrutalTruth(data.brutalTruth);
      if (data.redFlags !== undefined) setRedFlags(data.redFlags);
      if (data.donts !== undefined) setDonts(data.donts);
      if (data.upskillableSkills !== undefined) setUpskillableSkills(data.upskillableSkills);
      if (data.mustHaveSkills !== undefined) setMustHaveSkills(data.mustHaveSkills);
    }
  }, [data]);
  const [scoreImpactRows, setScoreImpactRows] = useState<ScoreImpactRow[]>([
    {
      fix: "Remove non-essential skills",
      impact: "+0.3",
      tooltip: "Why it matters: Removes blockers without lowering quality.",
      talentPoolImpact: "+25% pool expansion",
      riskReduction: "-15% false negatives",
    },
    {
      fix: "Prioritise top 5 must-haves",
      impact: "+0.2",
      tooltip: "Why it matters: AEs choose clarity.",
      talentPoolImpact: "+15% persona match",
      riskReduction: "-10% interview waste",
    },
    {
      fix: "Clarify upskillable skills",
      impact: "+0.1",
      tooltip: "Why it matters: Prevents needless rejections.",
      talentPoolImpact: "+10% more candidates",
      riskReduction: "-5% HM conflict",
    },
    {
      fix: "Add modelling evaluation",
      impact: "+0.2",
      tooltip:
        "Why it matters: Filters accurately without over-indexing CV buzzwords.",
      talentPoolImpact: "+12% signal quality",
      riskReduction: "-15% bad hires",
    },
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
      scoreImpactRows,
    };
    sessionStorage.setItem("editableSkillCard", JSON.stringify(data));
  }, [
    technicalSkills,
    productSkills,
    behaviouralSkills,
    brutalTruth,
    redFlags,
    donts,
    upskillableSkills,
    mustHaveSkills,
    scoreImpactRows,
  ]);

  // Load from sessionStorage ONLY if no data prop is provided (fallback)
  useEffect(() => {
    if (data === undefined || data === null) {
      const saved = sessionStorage.getItem("editableSkillCard");
      if (saved) {
        try {
          const savedData = JSON.parse(saved);
          if (savedData.technicalSkills !== undefined) setTechnicalSkills(savedData.technicalSkills);
          if (savedData.productSkills !== undefined) setProductSkills(savedData.productSkills);
          if (savedData.behaviouralSkills !== undefined)
            setBehaviouralSkills(savedData.behaviouralSkills);
          if (savedData.brutalTruth !== undefined) setBrutalTruth(savedData.brutalTruth);
          if (savedData.redFlags !== undefined) setRedFlags(savedData.redFlags);
          if (savedData.donts !== undefined) setDonts(savedData.donts);
          if (savedData.upskillableSkills !== undefined)
            setUpskillableSkills(savedData.upskillableSkills);
          if (savedData.mustHaveSkills !== undefined) setMustHaveSkills(savedData.mustHaveSkills);
          if (savedData.scoreImpactRows !== undefined) setScoreImpactRows(savedData.scoreImpactRows);
        } catch (e) {
          console.error("Failed to load saved data:", e);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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
            <p className="text-xs font-bold text-emerald-700 mb-2">
              Can be trained quickly (shouldn&apos;t block seniors):
            </p>
            <EditableList
              items={upskillableSkills}
              onChange={setUpskillableSkills}
              itemClassName="text-[13px] leading-snug text-emerald-800"
              markerColor="text-emerald-600"
            />
          </div>
          <div>
            <p className="text-xs font-bold text-red-700 mb-2">
              Cannot be trained fast enough (must-have at entry):
            </p>
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
      title: "Fix Me Now",
      subtitle: "Actions to improve your hiring score",
      Icon: Target,
      tone: "success" as const,
      content: <ScoreImpactTable rows={scoreImpactRows} totalUplift="+0.8" cardId="skill" />,
    },
  ];

  return (
    <>
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
          const isSmall = shouldShowInline(section.content, section.id);

          return (
            <Card
              key={section.id}
              className={`w-full border-2 border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ${isSmall ? '' : 'cursor-pointer'} border-t-4`}
              style={{
                borderTopColor: colors.accent,
                backgroundColor: colors.bg,
              }}
              onClick={isSmall ? undefined : () => setOpenModal(section.id)}
            >
              {/* Show content with title and edit button */}
              {renderContentPreview(
                section.content,
                isSmall,
                section.title,
                () => setOpenModal(section.id),
                section.tone,
                section.id
              )}
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
            allowEdit={true}
          >
            {section.content}
          </SectionModal>
        );
      })}
    </>
  );
};
