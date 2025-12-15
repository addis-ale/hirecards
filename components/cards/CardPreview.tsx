"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Target, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { CardVisual } from "./CardVisuals";

export interface CardPreviewData {
  id: string;
  label: string;
  shortLabel: string;
  impact: string;
  category: string;
  teaser: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  gradient: string;
}

interface CardPreviewProps {
  card: CardPreviewData;
  isCurrent?: boolean;
  isCompleted?: boolean;
  onClick?: () => void;
}

export const CardPreview: React.FC<CardPreviewProps> = ({
  card,
  isCurrent = false,
  isCompleted = false,
  onClick,
}) => {
  const router = useRouter();
  const Icon = card.icon;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/cards/${card.id}`);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={`
        relative group cursor-pointer rounded-xl border-2 p-5 transition-all duration-300 overflow-hidden
        ${isCurrent 
          ? `${card.gradient} border-purple-600 text-white shadow-xl` 
          : isCompleted
            ? "bg-emerald-50 border-emerald-300 hover:border-emerald-400 hover:shadow-lg"
            : "bg-white border-gray-200 hover:border-purple-300 hover:shadow-lg"
        }
      `}
    >
      {/* Status Indicators */}
      {isCurrent && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center shadow-md z-10">
          <Target className="w-3 h-3 text-purple-700" />
        </div>
      )}
      {isCompleted && !isCurrent && (
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-md z-10">
          <CheckCircle className="w-3 h-3 text-white" />
        </div>
      )}

      {/* Card-Specific Visual */}
      <div className="mb-3">
        <CardVisual cardId={card.id} isCurrent={isCurrent} />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className={`
            font-bold text-sm leading-tight tracking-tight flex-1
            ${isCurrent ? "text-white" : "text-gray-900"}
          `}>
            {card.shortLabel}
          </h3>
          <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
            <span className={`
              text-[9px] font-medium uppercase tracking-wider
              ${isCurrent ? "text-white/70" : "text-gray-500"}
            `}>
              Score Impact
            </span>
            <span className={`
              w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold
              ${isCurrent 
                ? "bg-white text-purple-600" 
                : isCompleted
                  ? "bg-emerald-100 text-emerald-700"
                  : card.color === "purple" ? "bg-purple-100 text-purple-700" :
                    card.color === "blue" ? "bg-blue-100 text-blue-700" :
                    card.color === "emerald" ? "bg-emerald-100 text-emerald-700" :
                    card.color === "amber" ? "bg-amber-100 text-amber-700" :
                    "bg-indigo-100 text-indigo-700"
              }
            `}>
              {card.impact}
            </span>
          </div>
        </div>

        {/* Teaser Text */}
        <p className={`
          text-sm leading-relaxed line-clamp-3
          ${isCurrent ? "text-white/90" : "text-gray-600"}
        `}>
          {card.teaser}
        </p>

        {/* CTA */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <span className={`
              text-xs font-semibold
              ${isCurrent ? "text-white/90" : 
                card.color === "purple" ? "text-purple-600" :
                card.color === "blue" ? "text-blue-600" :
                card.color === "emerald" ? "text-emerald-600" :
                card.color === "amber" ? "text-amber-600" :
                "text-indigo-600"}
            `}>
              View Details
            </span>
            <ArrowRight className={`
              w-4 h-4 transition-transform group-hover:translate-x-1
              ${isCurrent ? "text-white/90" : 
                card.color === "purple" ? "text-purple-600" :
                card.color === "blue" ? "text-blue-600" :
                card.color === "emerald" ? "text-emerald-600" :
                card.color === "amber" ? "text-amber-600" :
                "text-indigo-600"}
            `} />
          </div>
          {card.id === "reality" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              className={`
                text-xs font-medium px-3 py-1 rounded-lg transition-all
                ${isCurrent 
                  ? "bg-white/20 text-white hover:bg-white/30" 
                  : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"}
              `}
            >
              See more
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

