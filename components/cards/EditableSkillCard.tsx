"use client";

import React, { useState, useEffect } from "react";
import { Code, AlertTriangle, Hammer, Brain, Users, TrendingUp, XCircle } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";
import { EditableList, EditableText } from "@/components/EditableCard";
import { ScoreImpactTable, ScoreImpactRow } from "@/components/ui/ScoreImpactTable";

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

  return (
    <div className="space-y-6">
      <Section subtitle="The must-have abilities, tools, and experience needed to perform the role." Icon={Code} density="compact" collapsible={true} defaultExpanded={false}>
        <div className="space-y-4">
          {/* Core Technical Skills */}
          <div>
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2" style={{ color: "#102a63" }}>
              <Code className="w-4 h-4 text-blue-600" />
              <span>Core Technical Skills</span>
            </h3>
            <EditableList
              items={technicalSkills}
              onChange={setTechnicalSkills}
              itemClassName="text-[13px] leading-snug"
              markerColor="text-blue-600"
            />
          </div>

          {/* Product Skills */}
          <div>
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2" style={{ color: "#102a63" }}>
              <Brain className="w-4 h-4 text-purple-600" />
              <span>Product Skills</span>
            </h3>
            <EditableList
              items={productSkills}
              onChange={setProductSkills}
              itemClassName="text-[13px] leading-snug"
              markerColor="text-purple-600"
            />
          </div>

          {/* Behavioural Skills */}
          <div>
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2" style={{ color: "#102a63" }}>
              <Users className="w-4 h-4 text-green-600" />
              <span>Behavioural Skills</span>
            </h3>
            <EditableList
              items={behaviouralSkills}
              onChange={setBehaviouralSkills}
              itemClassName="text-[13px] leading-snug"
              markerColor="text-green-600"
            />
          </div>

          {/* Brutal Truth */}
          <Callout tone="danger" title="Brutal Truth">
            <EditableText
              value={brutalTruth}
              onChange={setBrutalTruth}
              multiline
              placeholder="What's the hard truth about skills for this role?"
            />
          </Callout>

          {/* Red Flags */}
          <Section title="Red Flags" Icon={AlertTriangle} tone="danger">
            <EditableList
              items={redFlags}
              onChange={setRedFlags}
              itemClassName="text-[13px] leading-snug text-red-700"
              markerColor="text-red-600"
            />
          </Section>

          {/* Don't Do This */}
          <Section title="Don't Do This" Icon={Hammer} tone="danger">
            <EditableList
              items={donts}
              onChange={setDonts}
              itemClassName="text-[13px] leading-snug text-red-700"
              markerColor="text-red-600"
            />
          </Section>

          {/* Upskillability Guide */}
          <div className="rounded-xl border border-blue-200 p-4 bg-gradient-to-br from-blue-50 to-white">
            <h4 className="text-sm font-semibold mb-3" style={{ color: "#102a63" }}>Upskillability Guide</h4>
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
          </div>

          {/* Fix This Now — Score Impact Table */}
          <ScoreImpactTable rows={scoreImpactRows} totalUplift="+0.8" />
        </div>
      </Section>

    </div>
  );
};
