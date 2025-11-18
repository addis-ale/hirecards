"use client";

import React from "react";
import { Lock, Sparkles } from "lucide-react";
import Link from "next/link";

export const OverviewCard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3" style={{ color: "#102a63" }}>
          Your HireCard Strategy Overview
        </h2>
        <p className="text-lg text-gray-600">
          Here&apos;s a snapshot of your hiring feasibility analysis
        </p>
      </div>

      {/* Feasibility Score */}
      <div className="bg-gradient-to-br from-[#278f8c] to-[#1a6764] text-white rounded-xl p-8 text-center">
        <p className="text-sm font-medium mb-2 opacity-90">Feasibility Score</p>
        <div className="text-6xl font-bold mb-3">5.5/10</div>
        <p className="text-lg font-medium">Possible with alignment and speed</p>
        <p className="text-sm mt-2 opacity-80">
          Not possible with slow process or strict constraints
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold mb-1" style={{ color: "#278f8c" }}>
            13
          </div>
          <p className="text-sm font-medium text-gray-600">Strategy Cards</p>
        </div>
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold mb-1" style={{ color: "#278f8c" }}>
            €90k-€105k
          </div>
          <p className="text-sm font-medium text-gray-600">Recommended Range</p>
        </div>
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold mb-1" style={{ color: "#278f8c" }}>
            10-14 days
          </div>
          <p className="text-sm font-medium text-gray-600">Max Interview Loop</p>
        </div>
      </div>

      {/* Key Insights Preview */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-xl mb-4" style={{ color: "#102a63" }}>
          Key Insights
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-blue-500 font-bold">•</span>
            <span className="text-sm" style={{ color: "#102a63" }}>
              <strong>Market is tight:</strong> Top-tier Analytics Engineers are fully employed. 
              Outbound sourcing is mandatory.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-500 font-bold">•</span>
            <span className="text-sm" style={{ color: "#102a63" }}>
              <strong>Speed wins:</strong> If your loop is slower than 10-14 days, 
              every top-tier candidate evaporates.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-500 font-bold">•</span>
            <span className="text-sm" style={{ color: "#102a63" }}>
              <strong>Compensation reality:</strong> If you offer €80k, you won&apos;t hire a senior. 
              You&apos;ll hire someone who thinks they&apos;re senior.
            </span>
          </li>
        </ul>
      </div>

      {/* Locked Cards Preview */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-8">
        <div className="text-center mb-6">
          <Lock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <h3 className="font-bold text-xl mb-2" style={{ color: "#102a63" }}>
            Unlock Full Strategy (13 Cards)
          </h3>
          <p className="text-sm text-gray-600">
            Get detailed insights on Role, Skills, Market, Talent Mapping, Compensation, 
            and 8 more critical cards
          </p>
        </div>

        {/* Cards Grid Preview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            "Role Card",
            "Skill Card",
            "Market Card",
            "Talent Map",
            "Pay Card",
            "Reality Card",
            "Funnel",
            "Fit"
          ].map((card, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-lg p-3 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-gray-200 to-transparent opacity-50" />
              <div className="relative blur-sm">
                <p className="text-xs font-bold text-gray-500">{card}</p>
              </div>
              <Lock className="w-4 h-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link
            href="/pricing"
            className="btn-primary inline-flex items-center justify-center space-x-2 px-8 py-4 text-base"
          >
            <Sparkles className="w-5 h-5" />
            <span>Unlock Full HireCard Strategy</span>
          </Link>
          <p className="text-xs text-gray-500 mt-3">
            Complete feasibility analysis, sourcing strategy, and actionable playbook
          </p>
        </div>
      </div>
    </div>
  );
};
