"use client";

import React, { useState, useEffect } from "react";
import { Users, Target, AlertTriangle, Wrench, XCircle } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";
import { EditableList, EditableText } from "@/components/EditableCard";

export const EditableTalentMapCard = () => {
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

  useEffect(() => {
    const data = {
      primaryFeeders, secondaryFeeders, avoidList, brutalTruth, redFlags, donts, fixes, hiddenBottleneck
    };
    sessionStorage.setItem("editableTalentMapCard", JSON.stringify(data));
  }, [primaryFeeders, secondaryFeeders, avoidList, brutalTruth, redFlags, donts, fixes, hiddenBottleneck]);

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
      } catch (e) {
        console.error("Failed to load saved data:", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <Section title="Talent Map Card" subtitle="Where the strongest candidates come from, companies, locations, and common backgrounds." Icon={Users} density="compact">
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

          {/* Fix This Now */}
          <Section title="🔧 Fix This Now" Icon={Wrench} tone="success">
            <EditableList
              items={fixes}
              onChange={setFixes}
              itemClassName="text-[13px] leading-snug text-emerald-800"
              markerColor="text-emerald-600"
            />
          </Section>

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
