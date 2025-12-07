"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { EditableText, EditableList } from "@/components/EditableCard";
import { ScoreImpactTable, ScoreImpactRow } from "@/components/ui/ScoreImpactTable";

interface MarketCardProps {
  onNavigateToCard?: (cardId: string) => void;
  currentCardId?: string;
  data?: {
    talentAvailability?: {
      total: number;
      qualified: number;
      currentlyEmployed: number;
      openToWork: number;
    };
    supplyDemand?: {
      openJobs: number;
      availableCandidates: number;
      ratio: string;
      marketTightness: string;
    };
    insights?: string[];
    redFlags?: string[];
    opportunities?: string[];
    geographic?: {
      primaryLocations: string[];
      remoteAvailability: number;
    };
  };
}

export const EditableMarketCard: React.FC<MarketCardProps> = ({ data, onNavigateToCard, currentCardId }) => {
  console.log("📊 ============================================");
  console.log("📊 EDITABLE MARKET CARD RENDER");
  console.log("📊 ============================================");
  console.log("📊 Received data prop:", data ? "YES" : "NO");
  if (data) {
    console.log("📊 Data content:", JSON.stringify(data, null, 2));
  }
  
  // Initialize from data or use defaults
  const [amsterdamCount, setAmsterdamCount] = useState(
    data?.talentAvailability?.total 
      ? `${data.talentAvailability.total}` 
      : "250-400"
  );
  const [euRelocationCount, setEuRelocationCount] = useState(
    data?.supplyDemand?.availableCandidates 
      ? `~${Math.round(data.supplyDemand.availableCandidates * 0.3)}+` 
      : "~1,500+"
  );
  const [remoteFlexCount, setRemoteFlexCount] = useState(
    data?.supplyDemand?.availableCandidates 
      ? `~${Math.round(data.supplyDemand.availableCandidates * 0.6)}+` 
      : "~3,000+"
  );
  const [marketConditions, setMarketConditions] = useState(
    data?.redFlags && data.redFlags.length > 0
      ? data.redFlags
      : [
          "Top talent is employed",
          "High competition",
          "Outbound required"
        ]
  );
  const [brutalTruth, setBrutalTruth] = useState(
    data?.insights && data.insights.length > 0
      ? data.insights[0]
      : "Strict location + low comp = long search."
  );
  const [marketExpansionLevers, setMarketExpansionLevers] = useState([
    { lever: "Allow EU relocation", why: "Removes biggest constraint", poolImpact: "+35%" },
    { lever: "Hybrid vs Amsterdam-only", why: "Expands to broader EU", poolImpact: "+20%" },
    { lever: "Outcome-focused JD", why: "Filters the right persona", poolImpact: "+10%" },
    { lever: "Modelling-specific messaging", why: "Seniors respond to clarity", poolImpact: "+20% replies" },
    { lever: "3-step interview loop", why: "Matches fintech speed", poolImpact: "+12–18% conversion" }
  ]);
  const [scoreImpactRows, setScoreImpactRows] = useState<ScoreImpactRow[]>([
    {
      fix: "Allow EU relocation",
      impact: "+0.4",
      tooltip: "Biggest lever; instantly expands supply",
      talentPoolImpact: "+35%",
      riskReduction: "-20%"
    },
    {
      fix: "Simplify interview loop",
      impact: "+0.2",
      tooltip: "Seniors drop out if loops drag",
      talentPoolImpact: "+15%",
      riskReduction: "-10%"
    },
    {
      fix: "Tighten JD to outcomes",
      impact: "+0.1",
      tooltip: "Removes BI noise & attracts AEs",
      talentPoolImpact: "+10%",
      riskReduction: "-5%"
    },
    {
      fix: "Improve messaging clarity",
      impact: "+0.2",
      tooltip: "Specificity increases replies",
      talentPoolImpact: "+20%",
      riskReduction: "-10%"
    }
  ]);

  // Update when data changes
  useEffect(() => {
    console.log("📊 useEffect triggered - data changed");
    if (data?.talentAvailability?.total) {
      console.log("📊 Updating amsterdamCount from data:", data.talentAvailability.total);
      setAmsterdamCount(`${data.talentAvailability.total}`);
    }
    if (data?.supplyDemand?.availableCandidates) {
      console.log("📊 Updating counts from availableCandidates:", data.supplyDemand.availableCandidates);
      setEuRelocationCount(`~${Math.round(data.supplyDemand.availableCandidates * 0.3)}+`);
      setRemoteFlexCount(`~${Math.round(data.supplyDemand.availableCandidates * 0.6)}+`);
    }
    if (data?.redFlags && data.redFlags.length > 0) {
      console.log("📊 Updating marketConditions from data:", data.redFlags.length, "items");
      setMarketConditions(data.redFlags);
    }
    if (data?.insights && data.insights.length > 0) {
      console.log("📊 Updating brutalTruth from insights:", data.insights[0]);
      setBrutalTruth(data.insights[0]);
    }
  }, [data]);

  useEffect(() => {
    const data = {
      amsterdamCount, euRelocationCount, remoteFlexCount,
      marketConditions, brutalTruth, marketExpansionLevers, scoreImpactRows
    };
    sessionStorage.setItem("editableMarketCard", JSON.stringify(data));
  }, [amsterdamCount, euRelocationCount, remoteFlexCount, marketConditions, brutalTruth, marketExpansionLevers, scoreImpactRows]);

  useEffect(() => {
    const saved = sessionStorage.getItem("editableMarketCard");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.amsterdamCount) setAmsterdamCount(data.amsterdamCount);
        if (data.euRelocationCount) setEuRelocationCount(data.euRelocationCount);
        if (data.remoteFlexCount) setRemoteFlexCount(data.remoteFlexCount);
        if (data.marketConditions) setMarketConditions(data.marketConditions);
        if (data.brutalTruth) setBrutalTruth(data.brutalTruth);
        if (data.marketExpansionLevers) setMarketExpansionLevers(data.marketExpansionLevers);
        if (data.scoreImpactRows) setScoreImpactRows(data.scoreImpactRows);
      } catch (e) {
        console.error("Failed to load saved data:", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">

      {/* Talent Pool Estimate */}
      <div>
        <h3 className="font-bold text-lg mb-3" style={{ color: "#102a63" }}>
          Talent Pool Estimate
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
            <EditableText
              value={amsterdamCount}
              onChange={setAmsterdamCount}
              className="text-3xl font-bold mb-1"
              style={{ color: "#278f8c" }}
            />
            <p className="text-sm font-medium text-gray-600">Amsterdam</p>
            <p className="text-xs text-gray-500 mt-1">Strong fits</p>
          </div>
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 text-center">
            <EditableText
              value={euRelocationCount}
              onChange={setEuRelocationCount}
              className="text-3xl font-bold mb-1"
              style={{ color: "#278f8c" }}
            />
            <p className="text-sm font-medium text-gray-600">EU Relocation</p>
            <p className="text-xs text-gray-500 mt-1">Willing to relocate</p>
          </div>
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
            <EditableText
              value={remoteFlexCount}
              onChange={setRemoteFlexCount}
              className="text-3xl font-bold mb-1"
              style={{ color: "#278f8c" }}
            />
            <p className="text-sm font-medium text-gray-600">Remote-flex EU</p>
            <p className="text-xs text-gray-500 mt-1">Full remote</p>
          </div>
        </div>
      </div>

      {/* Market Conditions */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <h3 className="font-bold text-lg mb-3" style={{ color: "#102a63" }}>
          Market Conditions
        </h3>
        <EditableList
          items={marketConditions}
          onChange={setMarketConditions}
          itemClassName="text-sm"
          markerColor="text-blue-500"
        />
      </div>

      {/* Talent Supply */}
      <div>
        <h3 className="font-bold text-lg mb-3" style={{ color: "#102a63" }}>
          Talent Supply
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-2 bg-green-50 border border-green-200 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <div className="flex-1">
              <p className="text-xs font-bold" style={{ color: "#102a63" }}>High for mid-level</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="flex-1">
              <p className="text-xs font-bold" style={{ color: "#102a63" }}>Low for senior</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2 bg-red-50 border border-red-200 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="flex-1">
              <p className="text-xs font-bold" style={{ color: "#102a63" }}>Very low for product-minded</p>
            </div>
          </div>
        </div>
      </div>

      {/* Market Expansion Levers */}
      <div className="rounded-xl border border-purple-200 p-4 bg-gradient-to-br from-purple-50 to-white">
        <h3 className="font-bold text-lg mb-3" style={{ color: "#102a63" }}>
          Market Expansion Levers (What Actually Moves the Needle)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-purple-100 border-b-2 border-purple-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-purple-900">Lever</th>
                <th className="px-4 py-3 text-left font-semibold text-purple-900">Why it matters</th>
                <th className="px-4 py-3 text-center font-semibold text-purple-900">Pool Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100">
              {marketExpansionLevers.map((item, idx) => (
                <tr key={idx} className="hover:bg-purple-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{item.lever}</td>
                  <td className="px-4 py-3 text-gray-700">{item.why}</td>
                  <td className="px-4 py-3 text-center text-purple-800 font-medium">{item.poolImpact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fix This Now — Score Impact Table */}
      <ScoreImpactTable rows={scoreImpactRows} totalUplift="+0.9" />

      {/* Brutal Truth */}
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
        <h3 className="font-bold text-lg mb-2 text-red-700">
          Bottom Line
        </h3>
        <EditableText
          value={brutalTruth}
          onChange={setBrutalTruth}
          className="text-sm font-medium text-red-900"
          multiline
        />
      </div>

    </div>
  );
};
