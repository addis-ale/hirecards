"use client";

import React from "react";
import { Briefcase, Target, Trophy } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Pill } from "@/components/ui/Pill";

interface RoleCardProps {
  roleSummary: string;
  outcomes: string[];
  dataSource?: string;
}

export const RoleCard = ({
  roleSummary,
  outcomes,
  dataSource
}: RoleCardProps) => {
  
  console.log("💼 RoleCard received props:", { roleSummary, outcomes, dataSource });
  
  if (!roleSummary || !outcomes || outcomes.length === 0) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-bold text-red-600 mb-2">No Dynamic Data Available</h3>
        <p className="text-sm text-red-700">LinkedIn data was not loaded. Generate cards again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Section title="Role Card" subtitle="What this person will actually do based on real job descriptions from LinkedIn." Icon={Briefcase} density="compact">
        <div className="space-y-4">
          {/* Role Summary */}
          <div className="rounded-xl border border-gray-200 p-4 bg-gradient-to-br from-blue-50 to-white">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-blue-700 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold mb-1" style={{ color: "#102a63" }}>Role Summary</h4>
                <p className="text-[13px] leading-snug" style={{ color: "#102a63", opacity: 0.9 }}>
                  {roleSummary}
                </p>
                {dataSource && (
                  <p className="text-xs text-gray-500 mt-2">
                    {dataSource}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Top Outcomes */}
          <div className="rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-5 h-5 text-emerald-700" />
              <h4 className="text-base font-semibold" style={{ color: "#102a63" }}>
                Common Responsibilities (from LinkedIn)
              </h4>
            </div>
            <ol className="list-decimal pl-5 space-y-2 marker:text-emerald-700 marker:font-semibold">
              {outcomes.map((outcome, idx) => (
                <li key={idx} className="text-[13px] leading-snug" style={{ color: "#102a63" }}>
                  {outcome}
                </li>
              ))}
            </ol>
          </div>

          {/* What Great Looks Like */}
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
            <h4 className="text-sm font-semibold mb-2 text-green-900">
              What Great Looks Like
            </h4>
            <div className="flex flex-wrap gap-2">
              <Pill tone="green">Clear ownership</Pill>
              <Pill tone="green">Strong execution</Pill>
              <Pill tone="green">Tight feedback loops</Pill>
              <Pill tone="green">Results-driven</Pill>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};
