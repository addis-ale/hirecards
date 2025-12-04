"use client";

import React from "react";
import { TrendingUp, Users, Briefcase, Target, AlertTriangle } from "lucide-react";
import { Section } from "@/components/ui/Section";

export interface MarketCardData {
  talentAvailability: {
    total: number;
    qualified: number;
    currentlyEmployed: number;
    openToWork: number;
  };
  supplyDemand: {
    openJobs: number;
    availableCandidates: number;
    ratio: string;
    marketTightness: "tight" | "balanced" | "loose";
  };
  competition: {
    activeCompanies: number;
    topCompetitors: string[];
    averageApplications: number | null;
  };
  hiringVelocity: {
    averageTimeToFill: string;
    marketActivity: "high" | "medium" | "low";
  };
  skillLandscape: {
    mostCommon: string[];
    scarcity: { [skill: string]: string };
  };
  geographic: {
    primaryLocations: string[];
    remoteAvailability: number;
  };
  insights: string[];
  redFlags: string[];
  opportunities: string[];
  metadata?: {
    jobsAnalyzed: number;
    profilesAnalyzed: number;
    dataQuality: string;
    confidence: number;
  };
}

interface DynamicMarketCardProps {
  data?: MarketCardData;
  loading?: boolean;
}

export const DynamicMarketCard: React.FC<DynamicMarketCardProps> = ({
  data,
  loading = false,
}) => {
  // Default fallback data
  const defaultData: MarketCardData = {
    talentAvailability: {
      total: 350,
      qualified: 245,
      currentlyEmployed: 85,
      openToWork: 25,
    },
    supplyDemand: {
      openJobs: 45,
      availableCandidates: 350,
      ratio: "8:1",
      marketTightness: "balanced",
    },
    competition: {
      activeCompanies: 12,
      topCompetitors: ["Booking.com", "Adyen", "Mollie"],
      averageApplications: 87,
    },
    hiringVelocity: {
      averageTimeToFill: "45 days",
      marketActivity: "medium",
    },
    skillLandscape: {
      mostCommon: ["Python", "React", "AWS"],
      scarcity: {},
    },
    geographic: {
      primaryLocations: ["Amsterdam"],
      remoteAvailability: 20,
    },
    insights: [
      "Strong local talent pool in Amsterdam",
      "High competition for senior profiles",
      "Most candidates currently employed",
    ],
    redFlags: [
      "Top talent is employed",
      "High competition",
      "Outbound required",
    ],
    opportunities: [
      "Good pool of mid-level candidates",
      "Remote flexibility attracts EU talent",
    ],
  };

  const cardData = data || defaultData;

  if (loading) {
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
            <p className="text-sm text-gray-600">Loading market data...</p>
          </div>
        </div>
        <div className="space-y-4 animate-pulse">
          <div className="rounded-xl border border-gray-200 p-4 bg-gray-50 h-32" />
          <div className="rounded-xl border border-gray-200 p-4 bg-gray-50 h-24" />
          <div className="rounded-xl border border-gray-200 p-4 bg-gray-50 h-20" />
        </div>
      </div>
    );
  }

  // Determine market tightness color
  const getTightnessColor = (tightness: string) => {
    switch (tightness) {
      case "tight":
        return { bg: "bg-red-50", border: "border-red-200", text: "text-red-700" };
      case "loose":
        return { bg: "bg-green-50", border: "border-green-200", text: "text-green-700" };
      default:
        return { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" };
    }
  };

  const tightnessColors = getTightnessColor(cardData.supplyDemand.marketTightness);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#278f8c] to-[#1a6764] flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "#102a63" }}>
            Market Card
          </h2>
          <p className="text-sm text-gray-600">
            Talent pool size and market competitiveness for this profile
            {cardData.metadata && (
              <span className="ml-2 text-xs text-gray-500">
                (Based on {cardData.metadata.jobsAnalyzed} jobs + {cardData.metadata.profilesAnalyzed} profiles)
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Supply & Demand Overview */}
      <div className={`rounded-xl border-2 p-4 ${tightnessColors.bg} ${tightnessColors.border}`}>
        <div className="flex items-start gap-3">
          <Target className={`w-5 h-5 mt-0.5 ${tightnessColors.text}`} />
          <div className="flex-1">
            <h4 className="text-sm font-semibold mb-3" style={{ color: "#102a63" }}>
              Supply & Demand ({cardData.supplyDemand.marketTightness.toUpperCase()} Market)
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Available Candidates</p>
                <p className="text-2xl font-bold" style={{ color: "#278f8c" }}>
                  {cardData.supplyDemand.availableCandidates}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Open Jobs</p>
                <p className="text-2xl font-bold" style={{ color: "#278f8c" }}>
                  {cardData.supplyDemand.openJobs}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Ratio</p>
                <p className="text-2xl font-bold" style={{ color: "#278f8c" }}>
                  {cardData.supplyDemand.ratio}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Talent Availability */}
      <div className="rounded-xl border border-emerald-200 p-4 bg-gradient-to-br from-emerald-50 to-white">
        <div className="flex items-start gap-3">
          <Users className="w-5 h-5 text-emerald-700 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold mb-3" style={{ color: "#102a63" }}>
              Talent Availability
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b border-emerald-100">
                <span className="text-[13px] font-medium" style={{ color: "#102a63", opacity: 0.8 }}>
                  Total Profiles Found
                </span>
                <span className="text-sm font-bold text-emerald-700">
                  {cardData.talentAvailability.total}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-emerald-100">
                <span className="text-[13px] font-medium" style={{ color: "#102a63", opacity: 0.8 }}>
                  Qualified Candidates
                </span>
                <span className="text-sm font-bold text-emerald-700">
                  ~{cardData.talentAvailability.qualified}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-emerald-100">
                <span className="text-[13px] font-medium" style={{ color: "#102a63", opacity: 0.8 }}>
                  Currently Employed
                </span>
                <span className="text-sm font-bold text-emerald-700">
                  {cardData.talentAvailability.currentlyEmployed}%
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-[13px] font-medium" style={{ color: "#102a63", opacity: 0.8 }}>
                  Actively Looking
                </span>
                <span className="text-sm font-bold text-emerald-700">
                  {cardData.talentAvailability.openToWork}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Competition */}
      <div className="rounded-xl border border-purple-200 p-4 bg-gradient-to-br from-purple-50 to-white">
        <div className="flex items-start gap-3">
          <Briefcase className="w-5 h-5 text-purple-700 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold mb-3" style={{ color: "#102a63" }}>
              Competition Landscape
            </h4>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600 mb-2">
                  {cardData.competition.activeCompanies} companies actively hiring
                </p>
                <div className="flex flex-wrap gap-2">
                  {cardData.competition.topCompetitors.slice(0, 5).map((company, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                    >
                      {company}
                    </span>
                  ))}
                </div>
              </div>
              {cardData.competition.averageApplications && (
                <p className="text-xs text-gray-600">
                  Average applications per job: <span className="font-bold">{cardData.competition.averageApplications}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hiring Velocity & Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Hiring Velocity */}
        <div className="rounded-xl border border-blue-200 p-4 bg-blue-50">
          <h4 className="text-sm font-semibold mb-2" style={{ color: "#102a63" }}>
            Hiring Velocity
          </h4>
          <p className="text-xs text-gray-600 mb-1">Average Time to Fill</p>
          <p className="text-xl font-bold" style={{ color: "#278f8c" }}>
            {cardData.hiringVelocity.averageTimeToFill}
          </p>
          <p className="text-xs text-gray-600 mt-2">
            Market Activity:{" "}
            <span className="font-semibold capitalize">{cardData.hiringVelocity.marketActivity}</span>
          </p>
        </div>

        {/* Top Skills */}
        <div className="rounded-xl border border-blue-200 p-4 bg-blue-50">
          <h4 className="text-sm font-semibold mb-2" style={{ color: "#102a63" }}>
            Most Common Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {cardData.skillLandscape.mostCommon.slice(0, 5).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-white border border-blue-300 text-blue-700 rounded text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Key Insights */}
      {cardData.insights.length > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <h3 className="font-bold text-sm mb-3" style={{ color: "#102a63" }}>
            📊 Key Insights
          </h3>
          <ul className="space-y-2">
            {cardData.insights.map((insight, idx) => (
              <li key={idx} className="flex items-start gap-2 text-[13px]" style={{ color: "#102a63" }}>
                <span className="text-blue-500 font-bold">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Red Flags */}
      {cardData.redFlags.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-red-700 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-bold text-sm mb-3 text-red-700">Market Challenges</h3>
              <ul className="space-y-2">
                {cardData.redFlags.map((flag, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[13px] text-red-900">
                    <span className="text-red-500 font-bold">•</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Opportunities */}
      {cardData.opportunities.length > 0 && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
          <h3 className="font-bold text-sm mb-3 text-green-700">✨ Opportunities</h3>
          <ul className="space-y-2">
            {cardData.opportunities.map((opportunity, idx) => (
              <li key={idx} className="flex items-start gap-2 text-[13px] text-green-900">
                <span className="text-green-500 font-bold">•</span>
                <span>{opportunity}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Data Quality Indicator */}
      {cardData.metadata && (
        <div className="text-xs text-gray-500 text-center pt-2 border-t">
          Data Quality: <span className="font-semibold capitalize">{cardData.metadata.dataQuality}</span>
          {" • "}
          Confidence: <span className="font-semibold">{Math.round(cardData.metadata.confidence * 100)}%</span>
          {" • "}
          Based on {cardData.metadata.jobsAnalyzed} jobs + {cardData.metadata.profilesAnalyzed} profiles
        </div>
      )}
    </div>
  );
};
