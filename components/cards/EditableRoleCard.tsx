"use client";

import React, { useState, useEffect } from "react";
import { Briefcase, Target, Trophy, AlertTriangle, Wrench, FlagTriangleRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";
import { Pill } from "@/components/ui/Pill";
import { EditableText, EditableList } from "@/components/EditableCard";

export const EditableRoleCard = () => {
  const [roleSummary, setRoleSummary] = useState(
    "Build production-grade analytics models, own modelling standards, and partner with teams to ship features."
  );
  const [outcomes, setOutcomes] = useState([
    "Deliver stable dbt models",
    "Replace legacy pipelines",
    "Ship analytics features",
    "Improve data quality",
    "Mentor team members",
  ]);
  const [redFlags, setRedFlags] = useState([
    "Generic job description",
    "Buzzwords over outcomes",
    "No clear ownership",
  ]);
  const [donts, setDonts] = useState([
    "Copy competitor JDs",
    "Hide data complexity",
    "List 20+ responsibilities",
  ]);
  const [fixes, setFixes] = useState([
    "Show real challenges upfront",
    "Focus on outcomes not tasks",
    "Align stakeholders early",
  ]);
  const [brutalTruth, setBrutalTruth] = useState(
    "Be honest about the data debt. Seniors will discover it anyway."
  );

  // Save to sessionStorage whenever data changes
  useEffect(() => {
    const data = {
      roleSummary,
      outcomes,
      redFlags,
      donts,
      fixes,
      brutalTruth,
    };
    sessionStorage.setItem("editableRoleCard", JSON.stringify(data));
  }, [roleSummary, outcomes, redFlags, donts, fixes, brutalTruth]);

  // Load from sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem("editableRoleCard");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.roleSummary) setRoleSummary(data.roleSummary);
        if (data.outcomes) setOutcomes(data.outcomes);
        if (data.redFlags) setRedFlags(data.redFlags);
        if (data.donts) setDonts(data.donts);
        if (data.fixes) setFixes(data.fixes);
        if (data.brutalTruth) setBrutalTruth(data.brutalTruth);
      } catch (e) {
        console.error("Failed to load saved data:", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <Section title="Role Card" subtitle="What this person will actually do and what success looks like in the first 6–12 months." Icon={Briefcase} density="compact">
        <div className="space-y-4">
          {/* Role Summary */}
          <div className="rounded-xl border border-gray-200 p-4 bg-gradient-to-br from-blue-50 to-white">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-blue-700 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-1" style={{ color: "#102a63" }}>Role Summary</h4>
                <EditableText
                  value={roleSummary}
                  onChange={setRoleSummary}
                  className="text-[13px] leading-snug"
                  multiline
                  placeholder="Describe what this role is about..."
                />
              </div>
            </div>
          </div>

          {/* Top Outcomes */}
          <div className="rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-5 h-5 text-emerald-700" />
              <h4 className="text-base font-semibold" style={{ color: "#102a63" }}>Top 5 Outcomes (12 months)</h4>
            </div>
            <EditableList
              items={outcomes}
              onChange={setOutcomes}
              itemClassName="text-[13px] leading-snug"
              markerColor="text-emerald-700"
            />
          </div>

          {/* What Great Looks Like */}
          <Callout tone="success" title="What Great Looks Like">
            <div className="flex flex-wrap gap-2">
              <Pill tone="green">Clear ownership</Pill>
              <Pill tone="green">Strong modelling taste</Pill>
              <Pill tone="green">Tight feedback loops</Pill>
              <Pill tone="green">High trust from PM & Engineering</Pill>
            </div>
          </Callout>

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
          <Section title="Red Flags" Icon={FlagTriangleRight} tone="danger">
            <EditableList
              items={redFlags}
              onChange={setRedFlags}
              itemClassName="text-[13px] leading-snug text-red-700"
              markerColor="text-red-600"
            />
          </Section>

          {/* Don't Do This */}
          <Section title="Don't Do This" Icon={AlertTriangle} tone="danger">
            <EditableList
              items={donts}
              onChange={setDonts}
              itemClassName="text-[13px] leading-snug text-red-700"
              markerColor="text-red-600"
            />
          </Section>

          {/* Fix This Now */}
          <Section title="Fix This Now" Icon={Wrench} tone="success">
            <EditableList
              items={fixes}
              onChange={setFixes}
              itemClassName="text-[13px] leading-snug text-emerald-800"
              markerColor="text-emerald-600"
            />
          </Section>
        </div>
      </Section>
    </div>
  );
};
