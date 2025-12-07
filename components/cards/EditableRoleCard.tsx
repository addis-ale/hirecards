"use client";

import React, { useState, useEffect } from "react";
import { Briefcase, Target, Trophy, AlertTriangle, Wrench, FlagTriangleRight, FileText, XCircle } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";
import { Pill } from "@/components/ui/Pill";
import { EditableText, EditableList } from "@/components/EditableCard";
import { ScoreImpactTable, ScoreImpactRow } from "@/components/ui/ScoreImpactTable";

interface RoleCardProps {
  data?: {
    roleSummary?: string;
    outcomes?: string[];
    redFlags?: string[];
    donts?: string[];
    fixes?: string[];
    brutalTruth?: string;
    whatGreatLooksLike?: string[];
  };
  onNavigateToCard?: (cardId: string) => void;
  currentCardId?: string;
}

export const EditableRoleCard: React.FC<RoleCardProps> = ({ data, onNavigateToCard, currentCardId }) => {
  console.log("📋 ============================================");
  console.log("📋 EDITABLE ROLE CARD RENDER");
  console.log("📋 ============================================");
  console.log("📋 Received data prop:", data ? "YES" : "NO");
  if (data) {
    console.log("📋 Data content:", JSON.stringify(data, null, 2));
  }

  const [roleSummary, setRoleSummary] = useState(
    data?.roleSummary || "Build production-grade analytics models, own modelling standards, and partner with teams to ship features."
  );
  const [outcomes, setOutcomes] = useState(
    data?.outcomes || [
      "Deliver stable dbt models",
      "Replace legacy pipelines",
      "Ship analytics features",
      "Improve data quality",
      "Mentor team members",
    ]
  );
  const [redFlags, setRedFlags] = useState(
    data?.redFlags || [
      "Generic job description",
      "Buzzwords over outcomes",
      "No clear ownership",
    ]
  );
  const [donts, setDonts] = useState(
    data?.donts || [
      "Copy competitor JDs",
      "Hide data complexity",
      "List 20+ responsibilities",
    ]
  );
  const [fixes, setFixes] = useState(
    data?.fixes || [
      "Show real challenges upfront",
      "Focus on outcomes not tasks",
      "Align stakeholders early",
    ]
  );
  const [brutalTruth, setBrutalTruth] = useState(
    data?.brutalTruth || "Be honest about the data debt. Seniors will discover it anyway."
  );
  const [roleMission, setRoleMission] = useState(
    "Analytics engineering at Mollie is not BI maintenance — it is product-building. Your work becomes a live, customer-facing feature, not an internal dashboard. You own the modelling layer behind merchant analytics. You design stable, production-grade dbt models that shape the Insights product and directly influence thousands of merchants every day."
  );
  const [whatGreatLooksLike, setWhatGreatLooksLike] = useState([
    "Thinks in systems, not dashboards",
    "Writes clean, maintainable, tested models",
    "Communicates modelling choices clearly",
    "Works tightly with PM & Engineering",
    "Handles ambiguity through structure",
    "Defines modelling patterns others adopt"
  ]);
  const [whatYoullWorkWith, setWhatYoullWorkWith] = useState([
    "dbt, Snowflake, Looker, Git, Airflow",
    "Cross-functional squads",
    "Short iteration loops"
  ]);
  const [whatYouWontDo, setWhatYouWontDo] = useState([
    "Dashboard maintenance",
    "Ad-hoc requests",
    "Glue-code pipelines",
    "\"Do-everything\" data roles"
  ]);
  const [jdBefore, setJdBefore] = useState(
    "Responsible for building dashboards, maintaining pipelines, and supporting analytics requests."
  );
  const [jdAfter, setJdAfter] = useState(
    "Own the modelling layer powering Mollie's merchant-facing analytics. Design stable, well-tested dbt models, replace fragile pipelines, define core metrics, and shape the analytics experience used by thousands of merchants."
  );
  const [fullJdSnippet, setFullJdSnippet] = useState(
    "Senior Analytics Engineer — Mollie\n\nWe're hiring a Senior Analytics Engineer to own the modelling layer behind Mollie's merchant-facing analytics. This isn't BI or dashboard maintenance — it's product-focused analytics engineering where the models you build become part of the customer experience.\n\nYou'll design reliable, well-tested dbt models, replace fragile pipelines, define key business metrics, and partner with Product & Engineering to ship analytics features used by thousands of merchants.\n\nWhat we're looking for:\n• Strong dbt and SQL ability\n• Excellent modelling fundamentals\n• Data quality & testing discipline\n• Ability to translate messy business logic into clean models\n• Clear communication and ownership mindset\n\nWhat this role is not:\nBI reporting, ad-hoc requests, dashboarding, or \"do everything\" data work.\n\nWhy this role matters:\nYour modelling decisions directly shape merchant insights, influence product strategy, and establish modelling standards across Mollie."
  );
  const [commonFailureModes, setCommonFailureModes] = useState([
    "JD too generic → wrong applicants",
    "Undefined ownership → seniors lose interest",
    "No modelling examples → unclear expectations",
    "Data debt hidden → interviews collapse"
  ]);
  const [scoreImpactRows, setScoreImpactRows] = useState<ScoreImpactRow[]>([
    {
      fix: "Rewrite JD into outcomes",
      impact: "+0.3",
      tooltip: "Why it matters: Seniors select roles based on outcomes, not tasks.",
      talentPoolImpact: "+20% persona relevance",
      riskReduction: "-15% misalignment"
    },
    {
      fix: "Add ownership clarity",
      impact: "+0.2",
      tooltip: "Why it matters: Removes ambiguity — biggest conversion killer.",
      talentPoolImpact: "+18% engagement",
      riskReduction: "-10% rejection risk"
    },
    {
      fix: "Remove BI/support tasks",
      impact: "+0.1",
      tooltip: "Why it matters: Immediately filters out non-AE profiles.",
      talentPoolImpact: "+10% accuracy",
      riskReduction: "-5% interview waste"
    },
    {
      fix: "Highlight product impact",
      impact: "+0.2",
      tooltip: "Why it matters: Strongest motivator for this persona.",
      talentPoolImpact: "+22% reply rate",
      riskReduction: "-12% dropout"
    },
    {
      fix: "Define success clearly",
      impact: "+0.2",
      tooltip: "Why it matters: Enables alignment & cleaner interviews.",
      talentPoolImpact: "+15% conversion",
      riskReduction: "-20% restart risk"
    }
  ]);

  // Save to sessionStorage whenever data changes
  useEffect(() => {
    const data = {
      roleSummary,
      outcomes,
      redFlags,
      donts,
      fixes,
      brutalTruth,
      roleMission,
      whatGreatLooksLike,
      whatYoullWorkWith,
      whatYouWontDo,
      jdBefore,
      jdAfter,
      fullJdSnippet,
      commonFailureModes,
      scoreImpactRows
    };
    sessionStorage.setItem("editableRoleCard", JSON.stringify(data));
  }, [roleSummary, outcomes, redFlags, donts, fixes, brutalTruth, roleMission, whatGreatLooksLike, whatYoullWorkWith, whatYouWontDo, jdBefore, jdAfter, fullJdSnippet, commonFailureModes, scoreImpactRows]);

  // Update when data prop changes
  useEffect(() => {
    console.log("📋 useEffect triggered - data changed");
    if (data?.roleSummary) {
      console.log("📋 Updating roleSummary from data");
      setRoleSummary(data.roleSummary);
    }
    if (data?.outcomes) {
      console.log("📋 Updating outcomes from data:", data.outcomes.length, "items");
      setOutcomes(data.outcomes);
    }
    if (data?.redFlags) {
      console.log("📋 Updating redFlags from data:", data.redFlags.length, "items");
      setRedFlags(data.redFlags);
    }
    if (data?.donts) {
      console.log("📋 Updating donts from data:", data.donts.length, "items");
      setDonts(data.donts);
    }
    if (data?.fixes) {
      console.log("📋 Updating fixes from data:", data.fixes.length, "items");
      setFixes(data.fixes);
    }
    if (data?.brutalTruth) {
      console.log("📋 Updating brutalTruth from data");
      setBrutalTruth(data.brutalTruth);
    }
  }, [data]);

  // Load from sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem("editableRoleCard");
    if (saved) {
      try {
        const savedData = JSON.parse(saved);
        if (savedData.roleSummary) setRoleSummary(savedData.roleSummary);
        if (savedData.outcomes) setOutcomes(savedData.outcomes);
        if (savedData.redFlags) setRedFlags(savedData.redFlags);
        if (savedData.donts) setDonts(savedData.donts);
        if (savedData.fixes) setFixes(savedData.fixes);
        if (savedData.brutalTruth) setBrutalTruth(savedData.brutalTruth);
        if (savedData.roleMission) setRoleMission(savedData.roleMission);
        if (savedData.whatGreatLooksLike) setWhatGreatLooksLike(savedData.whatGreatLooksLike);
        if (savedData.whatYoullWorkWith) setWhatYoullWorkWith(savedData.whatYoullWorkWith);
        if (savedData.whatYouWontDo) setWhatYouWontDo(savedData.whatYouWontDo);
        if (savedData.jdBefore) setJdBefore(savedData.jdBefore);
        if (savedData.jdAfter) setJdAfter(savedData.jdAfter);
        if (savedData.fullJdSnippet) setFullJdSnippet(savedData.fullJdSnippet);
        if (savedData.commonFailureModes) setCommonFailureModes(savedData.commonFailureModes);
        if (savedData.scoreImpactRows) setScoreImpactRows(savedData.scoreImpactRows);
      } catch (e) {
        console.error("Failed to load saved data:", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-3">
      <Section subtitle="What this person will actually do and what success looks like in the first 6–12 months." Icon={Briefcase} density="compact" collapsible={true} defaultExpanded={false}>
        <div className="space-y-3">
          {/* Role Mission */}
          <div className="rounded-xl border border-gray-200 p-4 bg-gradient-to-br from-blue-50 to-white">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-blue-700 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-2" style={{ color: "#102a63" }}>Role Mission (Narrative)</h4>
                <EditableText
                  value={roleMission}
                  onChange={setRoleMission}
                  className="text-[13px] leading-relaxed"
                  multiline
                  placeholder="Describe the role mission..."
                />
              </div>
            </div>
          </div>

          {/* Top Outcomes */}
          <div className="rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-5 h-5 text-emerald-700" />
              <h4 className="text-base font-semibold" style={{ color: "#102a63" }}>Top Outcomes (6–12 Months)</h4>
            </div>
            <EditableList
              items={outcomes}
              onChange={setOutcomes}
              itemClassName="text-[13px] leading-snug"
              markerColor="text-emerald-700"
            />
          </div>

          {/* What Great Looks Like */}
          <div className="rounded-xl border border-emerald-200 p-4 bg-gradient-to-br from-emerald-50 to-white">
            <h4 className="text-sm font-semibold mb-3" style={{ color: "#102a63" }}>What Great Looks Like</h4>
            <EditableList
              items={whatGreatLooksLike}
              onChange={setWhatGreatLooksLike}
              itemClassName="text-[13px] leading-snug"
              markerColor="text-emerald-700"
            />
          </div>

          {/* What You'll Work With */}
          <div className="rounded-xl border border-blue-200 p-4 bg-gradient-to-br from-blue-50 to-white">
            <h4 className="text-sm font-semibold mb-3" style={{ color: "#102a63" }}>What You'll Work With</h4>
            <EditableList
              items={whatYoullWorkWith}
              onChange={setWhatYoullWorkWith}
              itemClassName="text-[13px] leading-snug"
              markerColor="text-blue-600"
            />
          </div>

          {/* What You Won't Do */}
          <div className="rounded-xl border border-red-200 p-4 bg-gradient-to-br from-red-50 to-white">
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="w-5 h-5 text-red-700" />
              <h4 className="text-sm font-semibold" style={{ color: "#102a63" }}>What You Won't Do</h4>
            </div>
            <EditableList
              items={whatYouWontDo}
              onChange={setWhatYouWontDo}
              itemClassName="text-[13px] leading-snug text-red-700"
              markerColor="text-red-600"
            />
          </div>

          {/* JD Rewrite: Before → After */}
          <div className="rounded-xl border-2 border-gray-300 p-4 bg-gradient-to-br from-gray-50 to-white">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "#102a63" }}>
              <FileText className="w-5 h-5" />
              JD Rewrite: Before → After
            </h4>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-bold text-red-700 mb-1">❌ BEFORE (Guaranteed to attract the wrong crowd)</p>
                <EditableText
                  value={jdBefore}
                  onChange={setJdBefore}
                  className="text-[13px] leading-relaxed text-red-800"
                  multiline
                />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-700 mb-1">✔ AFTER (Market-fitting, persona-aligned)</p>
                <EditableText
                  value={jdAfter}
                  onChange={setJdAfter}
                  className="text-[13px] leading-relaxed text-emerald-800"
                  multiline
                />
              </div>
            </div>
          </div>

          {/* Full JD Snippet */}
          <div className="rounded-xl border border-blue-200 p-4 bg-gradient-to-br from-blue-50 to-white">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "#102a63" }}>
              <FileText className="w-5 h-5" />
              Full JD Snippet (Ready to Copy)
            </h4>
            <EditableText
              value={fullJdSnippet}
              onChange={setFullJdSnippet}
              className="text-[13px] leading-relaxed whitespace-pre-line font-mono bg-white p-3 rounded border border-gray-200"
              multiline
            />
          </div>

          {/* Common Failure Modes */}
          <div className="rounded-xl border border-orange-200 p-4 bg-gradient-to-br from-orange-50 to-white">
            <h4 className="text-sm font-semibold mb-3" style={{ color: "#102a63" }}>Common Failure Modes</h4>
            <EditableList
              items={commonFailureModes}
              onChange={setCommonFailureModes}
              itemClassName="text-[13px] leading-snug text-orange-800"
              markerColor="text-orange-600"
            />
          </div>

          {/* Brutal Truth */}
          <Callout tone="danger" title="Brutal Truth">
            <EditableText
              value={brutalTruth}
              onChange={setBrutalTruth}
              multiline
              placeholder="What's the hard truth about this role?"
            />
          </Callout>

          {/* Red Flags */}
          <Section title="Red Flags" Icon={FlagTriangleRight} tone="danger" collapsible={true} defaultExpanded={false}>
            <EditableList
              items={redFlags}
              onChange={setRedFlags}
              itemClassName="text-[13px] leading-snug text-red-700"
              markerColor="text-red-600"
            />
          </Section>

          {/* Don't Do This */}
          <Section title="Don't Do This" Icon={AlertTriangle} tone="danger" collapsible={true} defaultExpanded={false}>
            <EditableList
              items={donts}
              onChange={setDonts}
              itemClassName="text-[13px] leading-snug text-red-700"
              markerColor="text-red-600"
            />
          </Section>

          {/* Fix This Now — Score Impact Table */}
          <ScoreImpactTable rows={scoreImpactRows} totalUplift="+1.0" />
        </div>
      </Section>

    </div>
  );
};
