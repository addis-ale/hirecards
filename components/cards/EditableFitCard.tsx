"use client";

import React, { useState, useEffect } from "react";
import { UserCheck, Target, ThumbsUp, ThumbsDown, AlertTriangle, Wrench, XCircle } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";
import { Pill } from "@/components/ui/Pill";
import { EditableList, EditableText } from "@/components/EditableCard";

export const EditableFitCard = () => {
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

  useEffect(() => {
    const data = {
      persona, motivatedBy, avoids, brutalTruth, redFlags, donts, fixes, candidateEvaluation
    };
    sessionStorage.setItem("editableFitCard", JSON.stringify(data));
  }, [persona, motivatedBy, avoids, brutalTruth, redFlags, donts, fixes, candidateEvaluation]);

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
      } catch (e) {
        console.error("Failed to load saved data:", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <Section title="Fit Card" subtitle="What motivates this persona, what they care about, and what usually makes them say yes or no." Icon={UserCheck} density="compact">
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
        </div>
      </Section>
    </div>
  );
};
