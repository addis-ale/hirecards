"use client";

import React from "react";
import { TrendingUp } from "lucide-react";
import { Section } from "@/components/ui/Section";

export const MarketCard = () => {
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
            <div className="text-3xl font-bold mb-1" style={{ color: "#278f8c" }}>
              250-400
            </div>
            <p className="text-sm font-medium text-gray-600">Amsterdam</p>
            <p className="text-xs text-gray-500 mt-1">Strong fits</p>
          </div>
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold mb-1" style={{ color: "#278f8c" }}>
              ~1,500+
            </div>
            <p className="text-sm font-medium text-gray-600">EU Relocation</p>
            <p className="text-xs text-gray-500 mt-1">Willing to relocate</p>
          </div>
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold mb-1" style={{ color: "#278f8c" }}>
              ~3,000+
            </div>
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
        <ul className="space-y-2">
          {[
            "Top talent is employed",
            "High competition",
            "Outbound required"
          ].map((condition, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm" style={{ color: "#102a63" }}>
              <span className="text-blue-500 font-bold">•</span>
              <span>{condition}</span>
            </li>
          ))}
        </ul>
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
        <p className="text-sm font-medium text-red-900">
          Strict location + low comp = long search.
        </p>
      </div>
    </div>
  );
};
