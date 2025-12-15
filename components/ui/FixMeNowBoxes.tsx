"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Target, Info, TrendingUp, LineChart } from "lucide-react";
import { ScoreImpactRow } from "./ScoreImpactTable";
import { useAcceptedFixes } from "@/contexts/AcceptedFixesContext";
import { allCards } from "@/lib/cardCategories";

interface FixMeNowBoxesProps {
  rows: ScoreImpactRow[];
  totalUplift?: string;
  cardId: string; // Unique identifier for the card (e.g., "reality", "role", "skill")
  onNavigateToCard?: (cardId: string) => void;
  currentCardId?: string;
  feasibilityScore?: string;
}

export const FixMeNowBoxes: React.FC<FixMeNowBoxesProps> = ({
  rows,
  totalUplift,
  cardId,
  onNavigateToCard,
  currentCardId,
  feasibilityScore,
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

  // Get other cards (excluding current card)
  const otherCards = allCards.filter(card => card.id !== (currentCardId || cardId));

  return (
    <div>
      {/* Description explaining what Fix Me Now is */}
      <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-800 leading-relaxed">
            {cardId === "reality" ? (
              <>
                <span className="font-semibold">This is the reason your feasibility is small.</span> Check these and fix them to increase your feasibility.
              </>
            ) : (
              <>
                <span className="font-semibold">Fix Me Now:</span> Click on any fix below to accept it and boost your hiring score. Each fix shows its potential impact and can be toggled on or off.
              </>
            )}
          </p>
        </div>
      </div>

      {/* Navigation boxes for other cards - only show for reality card */}
      {cardId === "reality" && otherCards.length > 0 && onNavigateToCard && (
        <div className="mb-4">
          {/* Feasibility Score Banner */}
          {feasibilityScore && (
            <div className="mb-4 bg-gradient-to-r from-[#278f8c] to-[#1a6764] text-white rounded-xl p-6 py-8 shadow-lg min-h-[100px]">
              <div className="flex items-center justify-between h-full">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/90 uppercase tracking-wide">Feasibility Score</p>
                    <p className="text-3xl font-bold text-white mt-1">{feasibilityScore}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/90 font-medium">Check cards below</p>
                  <p className="text-sm text-white/90 font-medium">to improve score</p>
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <p className="text-sm font-semibold text-gray-800">Navigate to other cards to increase feasibility and check the Fix Me section for each:</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {otherCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative"
                >
                  <motion.button
                    onClick={() => onNavigateToCard(card.id)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      relative w-full flex flex-col items-center justify-center gap-2 p-5 rounded-xl transition-all
                      bg-white border-2 border-gray-200 hover:border-gray-300 shadow-md hover:shadow-xl
                      group overflow-hidden
                    `}
                    title={card.label}
                  >
                    {/* Gradient background overlay on hover */}
                    <div className={`absolute inset-0 ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    
                    {/* Card icon with gradient background */}
                    <div className={`relative z-10 w-14 h-14 ${card.gradient} rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white animate-pulse"></div>
                    </div>
                    
                    {/* Card label */}
                    <span className="relative z-10 text-sm font-bold text-center leading-tight text-gray-800 group-hover:text-white transition-colors">
                      {card.shortLabel} Card
                    </span>
                    
                    {/* Boost representation with graph icon */}
                    <div className="relative z-10 flex items-center gap-1.5 mt-1">
                      <LineChart className="w-4 h-4 text-emerald-600 group-hover:text-white/90 transition-colors" />
                      <span className="text-xs font-bold text-emerald-600 group-hover:text-white transition-colors">
                        {card.impact}
                      </span>
                      <span className="text-[10px] text-gray-500 group-hover:text-white/80 transition-colors">
                        boost
                      </span>
                    </div>
                    
                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Hide fixes list for reality card, show for other cards */}
      {cardId !== "reality" && (
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
      )}
      
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
      
      {/* Hide total uplift for reality card */}
      {totalUplift && cardId !== "reality" && (
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

