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
          If you offer €80k, you will not hire a senior. You will hire someone who thinks they&apos;re senior.
        </p>
      </div>

      {/* Red Flags */}
      <Section title="Red Flags" Icon={DollarSign} tone="danger">
        <ul className="list-disc pl-5 space-y-1 md:columns-2 md:gap-8 marker:text-red-600">
          {[
            "Candidate wants &gt;20% above internal band",
            "Company refuses to budge on comp",
            "Internal equity blocks competitive offers"
          ].map((flag, idx) => (
            <li key={idx} className="text-[13px] leading-snug text-red-700">
              {flag}
            </li>
          ))}
        </ul>
      </Section>

      {/* Don't Do This */}
      <Section title="Don&apos;t Do This" Icon={DollarSign} tone="danger">
        <ul className="list-disc pl-5 space-y-1 md:columns-2 md:gap-8 marker:text-red-600">
          {[
            "Hide comp until final stage",
            "Use equity as compensation if it&apos;s not meaningful",
            "Expect senior technical talent at mid-level pay"
          ].map((dont, idx) => (
            <li key={idx} className="text-[13px] leading-snug text-red-700">
              {dont}
            </li>
          ))}
        </ul>
      </Section>

      {/* Fix This Now */}
      <Section title="Fix This Now" Icon={DollarSign} tone="success">
        <ul className="list-disc pl-5 space-y-1 md:columns-2 md:gap-8 marker:text-emerald-600">
          {[
            "Align comp band before launching the search",
            "Offer clarity upfront",
            "Highlight ownership + product impact as value drivers"
          ].map((fix, idx) => (
            <li key={idx} className="text-[13px] leading-snug text-emerald-800">
              {fix}
            </li>
          ))}
        </ul>
      </Section>

      {/* Hidden Bottleneck */}
      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
        <h3 className="font-bold text-lg mb-2 text-purple-700">
          Hidden Bottleneck
        </h3>
        <p className="text-sm font-medium text-purple-900">
          Your comp is competing with remote US employers you can&apos;t see.
        </p>
      </div>

      {/* Timeline to Failure */}
      <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-lg">
        <h3 className="font-bold text-lg mb-2 text-yellow-700">
          Timeline to Failure
        </h3>
        <p className="text-sm font-medium text-yellow-900">
          If comp approval takes &gt;5 days → expect candidate rejection.
        </p>
      </div>
    </div>
  );
};
