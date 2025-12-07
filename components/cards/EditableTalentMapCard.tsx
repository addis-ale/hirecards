"use client";

import React, { useState, useEffect } from "react";
import { Users, Target, AlertTriangle, Wrench, XCircle, ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";
import { EditableList, EditableText } from "@/components/EditableCard";
import { ScoreImpactTable, ScoreImpactRow } from "@/components/ui/ScoreImpactTable";

export const EditableTalentMapCard = ({
  onNavigateToCard,
  currentCardId
}: {
  onNavigateToCard?: (cardId: string) => void;
  currentCardId?: string;
} = {}) => {
  const [primaryFeeders, setPrimaryFeeders] = useState([
    "Adyen",
    "bunq",
    "Booking",
    "bol",
    "Picnic",
    "PayPal",
    "Klarna",
    "Revolut",
    "Mollie-like scaleups"
  ]);
  const [secondaryFeeders, setSecondaryFeeders] = useState([
    "ING",
    "Rabobank",
    "ABN AMRO",
    "Modern data consultancies"
  ]);
  const [avoidList, setAvoidList] = useState([
    "Legacy BI teams",
    "Excel-heavy organizations",
    "Candidates with no ownership experience",
    "Pure analysts dressed as engineers"
  ]);
  const [brutalTruth, setBrutalTruth] = useState(
    "Everyone is chasing the same top 10 companies. You won't win them on comp. You must win them on scope and shipping velocity."
  );
  const [redFlags, setRedFlags] = useState([
    "Candidates who \"maintained dashboards\" rather than built modelling ecosystems",
    "Builders of internal-only tools who never shipped product-facing analytics"
  ]);
  const [donts, setDonts] = useState([
    "Target early-stage startups, modelling maturity tends to be low",
    "Target banking analytics teams without validating modelling experience"
  ]);
  const [fixes, setFixes] = useState([
    "Prioritize candidates frustrated by data chaos or slow product cycles",
    "Target people who own domains, not maintain pipelines"
  ]);
  const [hiddenBottleneck, setHiddenBottleneck] = useState(
    "You're not just fighting for attention, you're fighting for credibility."
  );
  const [talentFlowMap, setTalentFlowMap] = useState([
    { flow: "Fintech Flow", path: "Adyen → bunq → Mollie → bunq → Revolut", note: "(Fintechs trade the same AE persona; they move fast.)" },
    { flow: "Scale-Up Flow", path: "Booking → bol → mid-sized SaaS → fintech", note: "(AEs seek more ownership + product impact.)" },
    { flow: "Consultancy Flow", path: "Consultancies → fintech & SaaS (entry to mid-level AEs)", note: "(Solid fundamentals, validate depth.)" }
  ]);
  const [personaInsights, setPersonaInsights] = useState([
    { type: "Fintech AEs", motivated: "ownership, pace, clear product impact", needs: "modelling challenges, clean architecture", hates: "slow loops, vague JD, BI tasks" },
    { type: "Scale-Up AEs", motivated: "system design, problem-solving, shaping standards", needs: "engineering collaboration, autonomy", hates: "legacy systems with no investment" },
    { type: "Consultancy AEs", motivated: "solving interesting problems", needs: "stability + ownership they never get in consulting", hates: "unclear product vision" }
  ]);
  const [scoreImpactRows, setScoreImpactRows] = useState<ScoreImpactRow[]>([
    {
      fix: "Target frustration-driven candidates",
      impact: "+0.2",
      tooltip: "These candidates actively seek better modelling ownership and convert faster.",
      talentPoolImpact: "+12% reply rate",
      riskReduction: "-10% negotiation drag"
    },
    {
      fix: "Prioritise domain owners",
      impact: "+0.2",
      tooltip: "True AEs own modelling domains; removes dashboard-only profiles.",
      talentPoolImpact: "+10% stronger pipeline",
      riskReduction: "-15% late-stage failure"
    },
    {
      fix: "Use frustration-based messaging",
      impact: "+0.2",
      tooltip: "Speaking to real pain points outperforms generic \"modern stack\" claims.",
      talentPoolImpact: "+18% reply uplift",
      riskReduction: "-5% ghosting"
    }
  ]);

  useEffect(() => {
    const data = {
      primaryFeeders, secondaryFeeders, avoidList, brutalTruth, redFlags, donts, fixes, hiddenBottleneck, talentFlowMap, personaInsights, scoreImpactRows
    };
    sessionStorage.setItem("editableTalentMapCard", JSON.stringify(data));
  }, [primaryFeeders, secondaryFeeders, avoidList, brutalTruth, redFlags, donts, fixes, hiddenBottleneck, talentFlowMap, personaInsights, scoreImpactRows]);

  useEffect(() => {
    const saved = sessionStorage.getItem("editableTalentMapCard");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.primaryFeeders) setPrimaryFeeders(data.primaryFeeders);
        if (data.secondaryFeeders) setSecondaryFeeders(data.secondaryFeeders);
        if (data.avoidList) setAvoidList(data.avoidList);
        if (data.brutalTruth) setBrutalTruth(data.brutalTruth);
        if (data.redFlags) setRedFlags(data.redFlags);
        if (data.donts) setDonts(data.donts);
        if (data.fixes) setFixes(data.fixes);
        if (data.hiddenBottleneck) setHiddenBottleneck(data.hiddenBottleneck);
        if (data.talentFlowMap) setTalentFlowMap(data.talentFlowMap);
        if (data.personaInsights) setPersonaInsights(data.personaInsights);
        if (data.scoreImpactRows) setScoreImpactRows(data.scoreImpactRows);
      } catch (e) {
        console.error("Failed to load saved data:", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <Section subtitle="Where the strongest candidates come from, companies, locations, and common backgrounds." Icon={Users} density="compact" collapsible={true} defaultExpanded={false}>
        <div className="space-y-4">
          {/* Primary Feeder Companies */}
          <div className="rounded-xl border border-emerald-200 p-4 bg-gradient-to-br from-emerald-50 to-white">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-emerald-700 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-2" style={{ color: "#102a63" }}>
                  Primary Feeder Companies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {primaryFeeders.map((company, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200"
                    >
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Feeder Companies */}
          <div className="rounded-xl border border-blue-200 p-4 bg-gradient-to-br from-blue-50 to-white">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-blue-700 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-2" style={{ color: "#102a63" }}>
                  Secondary Feeder Companies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {secondaryFeeders.map((company, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                    >
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Avoid */}
          <div className="rounded-xl border border-gray-300 p-4 bg-gradient-to-br from-gray-50 to-white">
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-gray-700 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-2" style={{ color: "#102a63" }}>
                  Avoid
                </h4>
                <EditableList
                  items={avoidList}
                  onChange={setAvoidList}
                  itemClassName="text-[13px] leading-snug text-gray-700"
                  markerColor="text-gray-600"
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

          {/* Talent Flow Map */}
          <div className="rounded-xl border border-blue-200 p-4 bg-gradient-to-br from-blue-50 to-white">
            <h4 className="text-sm font-semibold mb-3" style={{ color: "#102a63" }}>Talent Flow Map — Who Hires From Whom</h4>
            <p className="text-xs text-gray-600 mb-3">Understanding flow patterns helps predict competitiveness and candidate expectations.</p>
            <div className="space-y-3">
              {talentFlowMap.map((item, idx) => (
                <div key={idx} className="border border-blue-200 rounded-lg p-3 bg-white">
                  <p className="text-xs font-bold text-blue-900 mb-1">{item.flow}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span>{item.path}</span>
                    <ArrowRight className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-xs text-gray-600 mt-1 italic">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Persona Insights by Source Type */}
          <div className="rounded-xl border border-purple-200 p-4 bg-gradient-to-br from-purple-50 to-white">
            <h4 className="text-sm font-semibold mb-3" style={{ color: "#102a63" }}>Persona Insights by Source Type</h4>
            <div className="space-y-3">
              {personaInsights.map((item, idx) => (
                <div key={idx} className="border border-purple-200 rounded-lg p-3 bg-white">
                  <p className="text-xs font-bold text-purple-900 mb-2">{item.type}</p>
                  <div className="space-y-1 text-xs">
                    <p><span className="font-semibold text-emerald-700">Motivated by:</span> {item.motivated}</p>
                    <p><span className="font-semibold text-blue-700">Needs:</span> {item.needs}</p>
                    <p><span className="font-semibold text-red-700">Hates:</span> {item.hates}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fix This Now — Score Impact Table */}
          <ScoreImpactTable rows={scoreImpactRows} totalUplift="+0.6" />

          {/* Hidden Bottleneck */}
          <Callout tone="warning" title="🔍 Hidden Bottleneck">
            <EditableText
              value={hiddenBottleneck}
              onChange={setHiddenBottleneck}
              multiline
            />
          </Callout>
        </div>
      </Section>

    </div>
  );
};
