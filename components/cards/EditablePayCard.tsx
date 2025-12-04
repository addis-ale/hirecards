"use client";

import React, { useState, useEffect } from "react";
import { DollarSign, TrendingUp, AlertTriangle, Wrench, XCircle } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";
import { EditableKeyValue, EditableList, EditableText } from "@/components/EditableCard";

interface PayCardProps {
  data?: {
    marketCompensation?: Array<{ label: string; value: string }>;
    recommendedRange?: string;
    location?: string;
    currency?: string;
    brutalTruth?: string;
    redFlags?: string[];
    donts?: string[];
    fixes?: string[];
    hiddenBottleneck?: string;
    timelineToFailure?: string;
  };
}

export const EditablePayCard: React.FC<PayCardProps> = ({ data }) => {
  console.log("💳 ============================================");
  console.log("💳 EDITABLE PAY CARD RENDER");
  console.log("💳 ============================================");
  console.log("💳 Received data prop:", data ? "YES" : "NO");
  if (data) {
    console.log("💳 Data content:", JSON.stringify(data, null, 2));
  }
  
  // Initialize from data or use defaults
  const [marketComp, setMarketComp] = useState(
    data?.marketCompensation || [
      { label: "Base", value: "€85k–€100k" },
      { label: "Total comp", value: "€95k–€115k" },
      { label: "Published range", value: "€6,100–€7,900/month" },
    ]
  );
  const [recommendedRange, setRecommendedRange] = useState(
    data?.recommendedRange || "€90k–€105k for top-tier senior"
  );
  const [brutalTruth, setBrutalTruth] = useState(
    data?.brutalTruth || "If you offer €80k, you will not hire a senior. You will hire someone who thinks they're senior."
  );
  const [redFlags, setRedFlags] = useState(
    data?.redFlags || [
      "Candidate wants >20% above internal band",
      "Company refuses to budge on comp",
      "Internal equity blocks competitive offers",
    ]
  );
  const [donts, setDonts] = useState(
    data?.donts || [
      "Hide comp until final stage",
      "Use equity as compensation if it's not meaningful",
      "Expect senior technical talent at mid-level pay",
    ]
  );
  const [fixes, setFixes] = useState(
    data?.fixes || [
      "Align comp band before launching the search",
      "Offer clarity upfront",
      "Highlight ownership + product impact as value drivers",
    ]
  );
  const [hiddenBottleneck, setHiddenBottleneck] = useState(
    data?.hiddenBottleneck || "Your comp is competing with remote US employers you can't see."
  );
  const [timelineToFailure, setTimelineToFailure] = useState(
    data?.timelineToFailure || "If comp approval takes >5 days → expect candidate rejection."
  );

  // Update when data prop changes
  useEffect(() => {
    console.log("💳 useEffect triggered - data changed");
    if (data?.marketCompensation) {
      console.log("💳 Updating marketComp from data:", data.marketCompensation);
      setMarketComp(data.marketCompensation);
    }
    if (data?.recommendedRange) {
      console.log("💳 Updating recommendedRange from data:", data.recommendedRange);
      setRecommendedRange(data.recommendedRange);
    }
    if (data?.brutalTruth) {
      console.log("💳 Updating brutalTruth from data:", data.brutalTruth);
      setBrutalTruth(data.brutalTruth);
    }
    if (data?.redFlags) {
      console.log("💳 Updating redFlags from data:", data.redFlags.length, "items");
      setRedFlags(data.redFlags);
    }
    if (data?.donts) {
      console.log("💳 Updating donts from data:", data.donts.length, "items");
      setDonts(data.donts);
    }
    if (data?.fixes) {
      console.log("💳 Updating fixes from data:", data.fixes.length, "items");
      setFixes(data.fixes);
    }
    if (data?.hiddenBottleneck) setHiddenBottleneck(data.hiddenBottleneck);
    if (data?.timelineToFailure) setTimelineToFailure(data.timelineToFailure);
  }, [data]);

  // Save to sessionStorage
  useEffect(() => {
    const data = {
      marketComp,
      recommendedRange,
      brutalTruth,
      redFlags,
      donts,
      fixes,
      hiddenBottleneck,
      timelineToFailure,
    };
    sessionStorage.setItem("editablePayCard", JSON.stringify(data));
  }, [marketComp, recommendedRange, brutalTruth, redFlags, donts, fixes, hiddenBottleneck, timelineToFailure]);

  // Load from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem("editablePayCard");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.marketComp) setMarketComp(data.marketComp);
        if (data.recommendedRange) setRecommendedRange(data.recommendedRange);
        if (data.brutalTruth) setBrutalTruth(data.brutalTruth);
        if (data.redFlags) setRedFlags(data.redFlags);
        if (data.donts) setDonts(data.donts);
        if (data.fixes) setFixes(data.fixes);
        if (data.hiddenBottleneck) setHiddenBottleneck(data.hiddenBottleneck);
        if (data.timelineToFailure) setTimelineToFailure(data.timelineToFailure);
      } catch (e) {
        console.error("Failed to load saved data:", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <Section title="Pay Card" subtitle="What candidates expect to earn in this market and how your budget compares." Icon={DollarSign} density="compact">
        <div className="space-y-4">
          {/* Market Compensation */}
          <div className="rounded-xl border border-emerald-200 p-4 bg-gradient-to-br from-emerald-50 to-white">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-emerald-700 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-3" style={{ color: "#102a63" }}>
                  Market Compensation ({data?.location || "Amsterdam"})
                </h4>
                <EditableKeyValue
                  data={marketComp}
                  onChange={setMarketComp}
                />
              </div>
            </div>
          </div>

          {/* Recommended Hire Range */}
          <div className="rounded-xl border-2 p-4 bg-gradient-to-br from-blue-50 to-white" style={{ borderColor: "#278f8c" }}>
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#278f8c" }} />
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-1" style={{ color: "#102a63" }}>
                  Recommended Hire Range
                </h4>
                <EditableText
                  value={recommendedRange}
                  onChange={setRecommendedRange}
                  className="text-lg font-bold"
                  placeholder="Enter recommended range..."
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
              placeholder="What's the hard truth about compensation?"
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
              placeholder="What hidden factor affects compensation?"
            />
          </Callout>

          {/* Timeline to Failure */}
          <Callout tone="danger" title="⏳ Timeline to Failure">
            <EditableText
              value={timelineToFailure}
              onChange={setTimelineToFailure}
              multiline
              placeholder="What timeline issue should we be aware of?"
            />
          </Callout>
        </div>
      </Section>
    </div>
  );
};
