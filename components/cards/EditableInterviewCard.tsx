"use client";

import React, { useState, useEffect } from "react";
import { Mic, CheckCircle, AlertTriangle, Wrench, XCircle } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";
import { EditableList, EditableText } from "@/components/EditableCard";

export const EditableInterviewCard = () => {
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

  useEffect(() => {
    const data = {
      optimalLoop, brutalTruth, redFlags, donts, fixes
    };
    sessionStorage.setItem("editableInterviewCard", JSON.stringify(data));
  }, [optimalLoop, brutalTruth, redFlags, donts, fixes]);

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
      } catch (e) {
        console.error("Failed to load saved data:", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <Section title="Interview Card" subtitle="The recommended interview process and competencies to assess at each stage." Icon={Mic} density="compact">
        <div className="space-y-4">
          {/* Optimal Loop */}
          <div className="rounded-xl border border-emerald-200 p-4 bg-gradient-to-br from-emerald-50 to-white">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-700 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-3" style={{ color: "#102a63" }}>
                  Optimal Loop
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
        </div>
      </Section>
    </div>
  );
};
