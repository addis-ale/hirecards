"use client";

import React, { useState, useEffect } from "react";
import { CalendarCheck, Calendar, TrendingUp, AlertTriangle, Wrench, XCircle, Zap } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";
import { EditableList, EditableText } from "@/components/EditableCard";

export const EditablePlanCard = () => {
  const [first7Days, setFirst7Days] = useState([
    "Finalize RoleCard",
    "Align scorecard",
    "Approve comp",
    "Build outbound list",
    "Schedule weekly sync",
    "Launch sourcing"
  ]);
  const [weeklyRhythm, setWeeklyRhythm] = useState([
    "Pipeline review",
    "Blockers removed",
    "Calibration maintained",
    "Messaging updated",
    "Time-to-align tracked"
  ]);
  const [brutalTruth, setBrutalTruth] = useState(
    "Hiring delays come from internal blockers, not market scarcity."
  );
  const [redFlags, setRedFlags] = useState([
    "Hiring manager unavailable",
    "TA chasing stakeholders",
    "Comp approval delays",
    "Slow feedback loops"
  ]);
  const [donts, setDonts] = useState([
    "Start sourcing before alignment",
    "Launch job without scorecard",
    "Build funnel without messaging"
  ]);
  const [fixes, setFixes] = useState([
    "Enforce 24-hour feedback",
    "Use shared hiring dashboard",
    "Pre-book interview slots"
  ]);
  const [fastestPath, setFastestPath] = useState([
    "Broaden geo → EU-friendly remote/relocation",
    "Raise comp slightly or pre-align offer flexibility",
    "Simplify interview loop to 3 steps",
    "Use strong product-oriented messaging",
    "Run 2 outbound waves per week",
    "Calibrate early → avoid sourcing the wrong persona",
    "Keep stakeholders aligned weekly"
  ]);

  useEffect(() => {
    const data = {
      first7Days, weeklyRhythm, brutalTruth, redFlags, donts, fixes, fastestPath
    };
    sessionStorage.setItem("editablePlanCard", JSON.stringify(data));
  }, [first7Days, weeklyRhythm, brutalTruth, redFlags, donts, fixes, fastestPath]);

  useEffect(() => {
    const saved = sessionStorage.getItem("editablePlanCard");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.first7Days) setFirst7Days(data.first7Days);
        if (data.weeklyRhythm) setWeeklyRhythm(data.weeklyRhythm);
        if (data.brutalTruth) setBrutalTruth(data.brutalTruth);
        if (data.redFlags) setRedFlags(data.redFlags);
        if (data.donts) setDonts(data.donts);
        if (data.fixes) setFixes(data.fixes);
        if (data.fastestPath) setFastestPath(data.fastestPath);
      } catch (e) {
        console.error("Failed to load saved data:", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <Section title="Plan Card" subtitle="Your next steps, the checklist, SLAs, and actions to kick off and run the hiring process well." Icon={CalendarCheck} density="compact">
        <div className="space-y-4">
          {/* First 7 Days */}
          <div className="rounded-xl border border-blue-200 p-4 bg-gradient-to-br from-blue-50 to-white">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-700 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-3" style={{ color: "#102a63" }}>
                  First 7 Days
                </h4>
                <EditableList
                  items={first7Days}
                  onChange={setFirst7Days}
                  itemClassName="text-[13px] leading-snug"
                  markerColor="text-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Weekly Rhythm */}
          <div className="rounded-xl border border-emerald-200 p-4 bg-gradient-to-br from-emerald-50 to-white">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-emerald-700 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-3" style={{ color: "#102a63" }}>
                  Weekly Rhythm
                </h4>
                <EditableList
                  items={weeklyRhythm}
                  onChange={setWeeklyRhythm}
                  itemClassName="text-[13px] leading-snug text-emerald-800"
                  markerColor="text-emerald-600"
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

          {/* Bonus: Fastest Path to Hire */}
          <div className="rounded-xl border-2 p-5 bg-gradient-to-br from-amber-50 to-white" style={{ borderColor: "#f59e0b" }}>
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-base font-bold mb-3 text-amber-900">
                  Bonus: Fastest Path to Hire (for this role)
                </h4>
                <EditableList
                  items={fastestPath}
                  onChange={setFastestPath}
                  itemClassName="text-[13px] leading-snug text-amber-900"
                  markerColor="text-amber-600"
                />
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};
