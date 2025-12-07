"use client";

import React from "react";
import { Info } from "lucide-react";

export interface ScoreImpactRow {
  fix: string;
  impact: string;
  tooltip: string;
  talentPoolImpact: string;
  riskReduction: string;
}

interface ScoreImpactTableProps {
  rows: ScoreImpactRow[];
  totalUplift?: string;
}

export const ScoreImpactTable: React.FC<ScoreImpactTableProps> = ({ rows, totalUplift }) => {
  return (
    <div className="rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white overflow-hidden">
      <div className="bg-emerald-600 px-4 py-3">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <span>⭐ Fix This Now — Score Impact Table</span>
        </h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-emerald-100 border-b-2 border-emerald-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-emerald-900">Fix</th>
              <th className="px-4 py-3 text-center font-semibold text-emerald-900">Impact</th>
              <th className="px-4 py-3 text-left font-semibold text-emerald-900">Tooltip</th>
              <th className="px-4 py-3 text-center font-semibold text-emerald-900">Talent Pool Impact</th>
              <th className="px-4 py-3 text-center font-semibold text-emerald-900">Risk Reduction</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-100">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-emerald-50/50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{row.fix}</td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold">
                    {row.impact}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-xs">{row.tooltip}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-emerald-800 font-medium">{row.talentPoolImpact}</td>
                <td className="px-4 py-3 text-center text-emerald-800 font-medium">{row.riskReduction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalUplift && (
        <div className="bg-emerald-100 px-4 py-3 border-t-2 border-emerald-200">
          <p className="text-sm font-bold text-emerald-900">
            Total uplift potential: {totalUplift}
          </p>
        </div>
      )}
    </div>
  );
};

