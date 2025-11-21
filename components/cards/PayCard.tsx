"use client";

import React from "react";
import { DollarSign } from "lucide-react";
import { Section } from "@/components/ui/Section";

export const PayCard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#278f8c] to-[#1a6764] flex items-center justify-center">
          <DollarSign className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "#102a63" }}>
            Pay & Compensation
          </h2>
          <p className="text-sm text-gray-600">Compensation Analysis</p>
        </div>
      </div>

      {/* Market Compensation */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-lg mb-4" style={{ color: "#102a63" }}>
          Market Compensation (Amsterdam)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Base Salary</p>
            <p className="text-2xl font-bold" style={{ color: "#278f8c" }}>€85k–€100k</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1">Total Compensation</p>
            <p className="text-2xl font-bold" style={{ color: "#278f8c" }}>€95k–€115k</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 md:col-span-2">
            <p className="text-xs text-gray-600 mb-1">Published Range (Monthly)</p>
            <p className="text-2xl font-bold" style={{ color: "#278f8c" }}>€6,100–€7,900/month</p>
          </div>
        </div>
      </div>

      {/* Recommended Hire Range */}
      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
        <h3 className="font-bold text-lg mb-2" style={{ color: "#102a63" }}>
          Recommended Hire Range
        </h3>
        <p className="text-3xl font-bold mb-2" style={{ color: "#278f8c" }}>€90k–€105k</p>
        <p className="text-sm" style={{ color: "#102a63", opacity: 0.9 }}>
          for top-tier senior candidates
        </p>
      </div>

      {/* Brutal Truth */}
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
        <h3 className="font-bold text-lg mb-2 text-red-700">
          Brutal Truth
        </h3>
        <p className="text-sm font-medium text-red-900">
          Low pay = wrong hire level.
        </p>
      </div>
    </div>
  );
};
