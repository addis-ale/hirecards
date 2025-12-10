"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, Target, Info } from "lucide-react";
import { ScoreImpactRow } from "./ScoreImpactTable";
import { useAcceptedFixes } from "@/contexts/AcceptedFixesContext";

interface FixMeNowBoxesProps {
  rows: ScoreImpactRow[];
  totalUplift?: string;
  cardId: string; // Unique identifier for the card (e.g., "reality", "role", "skill")
}

export const FixMeNowBoxes: React.FC<FixMeNowBoxesProps> = ({
  rows,
  totalUplift,
  cardId,
}) => {
  const { acceptFix, rejectFix, isFixAccepted } = useAcceptedFixes();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Parse impact string to number (e.g., "+0.2" -> 0.2)
  const parseImpact = (impactStr: string): number => {
    const match = impactStr.match(/[+-]?(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  };

  // Generate a unique fix ID from the fix text
  const getFixId = (fix: string): string => {
    return fix
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleToggleFix = (row: ScoreImpactRow) => {
    const fixId = getFixId(row.fix);
    const impact = parseImpact(row.impact);
    
    if (isFixAccepted(cardId, fixId)) {
      rejectFix(cardId, fixId);
    } else {
      acceptFix(cardId, fixId, impact);
    }
  };

  if (rows.length === 0) {
    return (
      <div className="text-sm text-gray-500 text-center py-4">
        No fixes available
      </div>
    );
  }

  return (
    <div>
      {/* Description explaining what Fix Me Now is */}
      <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-800 leading-relaxed">
            <span className="font-semibold">Fix Me Now:</span> Click on any fix below to accept it and boost your hiring score. Each fix shows its potential impact and can be toggled on or off.
          </p>
        </div>
      </div>

      <div className="relative overflow-visible">
        <div className="flex gap-3 overflow-y-visible pb-8">
          {rows.map((row, index) => {
            const fixId = getFixId(row.fix);
            const accepted = isFixAccepted(cardId, fixId);

            return (
              <div
                key={index}
                className="relative flex-1 z-10"
                onMouseEnter={(e) => {
                  setHoveredIndex(index);
                  const button = buttonRefs.current[index];
                  if (button) {
                    const rect = button.getBoundingClientRect();
                    setTooltipPosition({
                      top: rect.top - 10, // Position above the button
                      left: rect.left + rect.width / 2, // Center horizontally
                    });
                  }
                }}
                onMouseLeave={() => {
                  setHoveredIndex(null);
                  setTooltipPosition(null);
                }}
              >
                <button
                  ref={(el) => { buttonRefs.current[index] = el; }}
                  onClick={() => handleToggleFix(row)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md group h-full ${
                    accepted
                      ? "bg-emerald-100 border-2 border-emerald-400"
                      : "bg-white border-2 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50"
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      {accepted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <Target className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      )}
                      <span className="text-sm font-semibold text-gray-900 line-clamp-2">
                        {row.fix}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium text-xs ${
                        accepted
                          ? "bg-emerald-600 text-white"
                          : "bg-emerald-100 text-emerald-700"
                      }`}>
                        {row.impact}
                      </span>
                      {row.talentPoolImpact && (
                        <span className="text-xs text-gray-600 truncate">{row.talentPoolImpact}</span>
                      )}
                    </div>
                    {accepted && (
                      <span className="text-xs text-emerald-700 font-medium mt-1">✓ Accepted</span>
                    )}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Tooltip rendered via portal to escape overflow containers */}
      {hoveredIndex !== null && tooltipPosition && rows[hoveredIndex]?.tooltip && typeof window !== 'undefined' && createPortal(
        <div
          className="fixed z-[99999] pointer-events-none"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            transform: 'translate(-50%, -100%)',
            marginBottom: '8px',
          }}
        >
          <div className="w-72 p-4 bg-white border-2 border-emerald-200 rounded-lg shadow-2xl">
            {/* Tooltip content matching table format */}
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-700 leading-relaxed">{rows[hoveredIndex].tooltip}</p>
              </div>
              {rows[hoveredIndex].talentPoolImpact && (
                <div className="pt-2 border-t border-emerald-100">
                  <span className="text-xs font-medium text-emerald-800">Talent Pool Impact: </span>
                  <span className="text-xs text-gray-700">{rows[hoveredIndex].talentPoolImpact}</span>
                </div>
              )}
              {rows[hoveredIndex].riskReduction && (
                <div className="pt-2 border-t border-emerald-100">
                  <span className="text-xs font-medium text-emerald-800">Risk Reduction: </span>
                  <span className="text-xs text-gray-700">{rows[hoveredIndex].riskReduction}</span>
                </div>
              )}
            </div>
            {/* Tooltip arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
              <div className="w-3 h-3 bg-white border-r-2 border-b-2 border-emerald-200 transform rotate-45"></div>
            </div>
          </div>
        </div>,
        document.body
      )}
      
      {totalUplift && (
        <div className="mt-3 pt-3 border-t border-emerald-200 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-emerald-700">Total uplift potential:</span>
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-600 text-white text-base font-bold shadow-lg">
              {totalUplift}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

