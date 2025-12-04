"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { EditableText, EditableList } from "@/components/EditableCard";

interface MarketCardProps {
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

export const EditableMarketCard: React.FC<MarketCardProps> = ({ data }) => {
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
      marketConditions, brutalTruth
    };
    sessionStorage.setItem("editableMarketCard", JSON.stringify(data));
  }, [amsterdamCount, euRelocationCount, remoteFlexCount, marketConditions, brutalTruth]);

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
      } catch (e) {
        console.error("Failed to load saved data:", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#278f8c] to-[#1a6764] flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "#102a63" }}>
            Market Card
          </h2>
          <p className="text-sm text-gray-600">How big the talent pool is and how competitive the market is for this profile.</p>
        </div>
      </div>

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

      {/* Brutal Truth */}
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
        <h3 className="font-bold text-lg mb-2 text-red-700">
          Brutal Truth
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
