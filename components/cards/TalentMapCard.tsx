"use client";

import React from "react";
import { Map, Building2 } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Pill } from "@/components/ui/Pill";

interface TalentMapCardProps {
  primaryFeeders: string[];
  secondaryFeeders: string[];
  dataSource?: string;
}

export const TalentMapCard = ({
  primaryFeeders,
  secondaryFeeders,
  dataSource
}: TalentMapCardProps) => {
  
  console.log("🗺️ TalentMapCard received props:", { primaryFeeders, secondaryFeeders, dataSource });
  
  if (!primaryFeeders || primaryFeeders.length === 0) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-bold text-red-600 mb-2">No Dynamic Data Available</h3>
        <p className="text-sm text-red-700">LinkedIn data was not loaded. Generate cards again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Section title="Talent Map Card" subtitle="Where the best candidates come from based on LinkedIn hiring data." Icon={Map} density="compact">
        <div className="space-y-6">
          {dataSource && (
            <p className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-200">
              {dataSource}
            </p>
          )}

          {/* Primary Feeders */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-5 h-5 text-[#278f8c]" />
              <h3 className="font-bold text-base" style={{ color: "#102a63" }}>
                Primary Feeder Companies (Top Hiring)
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Companies actively hiring for similar roles on LinkedIn
            </p>
            <div className="flex flex-wrap gap-2">
              {primaryFeeders.length > 0 ? (
                primaryFeeders.map((company, idx) => (
                  <Pill key={idx} tone="green">{company}</Pill>
                ))
              ) : (
                <p className="text-sm text-gray-500">No primary feeders found in LinkedIn data</p>
              )}
            </div>
          </div>

          {/* Secondary Feeders */}
          {secondaryFeeders && secondaryFeeders.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base" style={{ color: "#102a63" }}>
                  Secondary Feeder Companies
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {secondaryFeeders.map((company, idx) => (
                  <Pill key={idx} tone="blue">{company}</Pill>
                ))}
              </div>
            </div>
          )}

          {/* Insights */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <h4 className="text-sm font-semibold mb-2" style={{ color: "#102a63" }}>
              Where to Source
            </h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Target candidates from these {primaryFeeders.length} companies currently hiring</li>
              <li>• Look for candidates with 2-5 years at these organizations</li>
              <li>• Check for similar job titles and responsibilities</li>
            </ul>
          </div>
        </div>
      </Section>
    </div>
  );
};
