"use client";

import React from "react";
import { Filter, TrendingDown, Target, Clock } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Callout } from "@/components/ui/Callout";

interface FunnelCardProps {
  funnelStages: Array<{ stage: string; count: string }>;
  benchmarks: Array<{ label: string; value: string }>;
  insights: string[];
  dataSource?: string;
}

export const FunnelCard = ({
  funnelStages,
  benchmarks,
  insights,
  dataSource
}: FunnelCardProps) => {
  
  console.log("📊 FunnelCard received props:", { funnelStages, benchmarks, insights, dataSource });
  
  if (!funnelStages || !benchmarks) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-bold text-red-600 mb-2">No Dynamic Data Available</h3>
        <p className="text-sm text-red-700">LinkedIn data was not loaded. Generate cards again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Section title="Funnel Card" subtitle="Expected hiring funnel based on LinkedIn market data." Icon={Filter} density="compact">
        <div className="space-y-6">
          {dataSource && (
            <p className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-200">
              {dataSource}
            </p>
          )}

          {/* Funnel Visualization */}
          <div className="space-y-2">
            {funnelStages.map((stage, idx) => {
              const width = 100 - (idx * 12); // Decrease width for funnel effect
              return (
                <div key={idx} className="flex items-center gap-3">
                  <div 
                    className="h-12 rounded-lg flex items-center justify-between px-4 transition-all"
                    style={{
                      width: `${width}%`,
                      background: `linear-gradient(135deg, #278f8c ${100 - idx * 10}%, #1a6764 100%)`,
                    }}
                  >
                    <span className="text-white font-medium text-sm">{stage.stage}</span>
                    <span className="text-white font-bold">{stage.count}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Benchmarks */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-blue-700" />
              <h4 className="font-semibold text-sm" style={{ color: "#102a63" }}>
                Conversion Benchmarks
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {benchmarks.map((benchmark, idx) => (
                <div key={idx} className="bg-white p-3 rounded-lg border border-blue-200">
                  <p className="text-xs text-gray-600 mb-1">{benchmark.label}</p>
                  <p className="text-lg font-bold text-[#278f8c]">{benchmark.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* LinkedIn Insights */}
          {insights && insights.length > 0 && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
              <h4 className="text-sm font-semibold mb-2 text-amber-900">
                Market Insights
              </h4>
              <ul className="space-y-1">
                {insights.map((insight, idx) => (
                  <li key={idx} className="text-xs text-amber-900 flex items-start gap-2">
                    <span className="text-amber-500">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Timeline Callout */}
          <Callout tone="warning" title="⏰ Expected Timeline">
            Based on the funnel above, expect 2-3 months from outreach to hire for this competitive market.
          </Callout>
        </div>
      </Section>
    </div>
  );
};
