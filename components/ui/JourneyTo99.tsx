"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, Target, ArrowRight } from "lucide-react";

interface JourneyCard {
  id: string;
  label: string;
  impact: string;
}

interface JourneyTo99Props {
  currentCardId?: string;
  onNavigateToCard?: (cardId: string) => void;
  startingScore?: number;
}

const journeyCards: JourneyCard[] = [
  { id: "reality", label: "Reality", impact: "+1.0" },
  { id: "role", label: "Role", impact: "+1.0" },
  { id: "skill", label: "Skill", impact: "+0.8" },
  { id: "market", label: "Market", impact: "+0.9" },
  { id: "talentmap", label: "Talent Map", impact: "+0.6" },
  { id: "pay", label: "Pay", impact: "+0.8" },
  { id: "funnel", label: "Funnel", impact: "+0.8" },
  { id: "fit", label: "Fit", impact: "+0.7" },
  { id: "message", label: "Message", impact: "+0.6" },
  { id: "interview", label: "Interview", impact: "+0.9" },
  { id: "scorecard", label: "Scorecard", impact: "+0.6" },
  { id: "plan", label: "Plan", impact: "+0.9" },
];

export const JourneyTo99: React.FC<JourneyTo99Props> = ({ 
  currentCardId, 
  onNavigateToCard,
  startingScore = 5.5 
}) => {
  const router = useRouter();
  const totalUplift = 9.0;
  const maxScore = Math.min(9.9, startingScore + totalUplift);
  const currentIndex = journeyCards.findIndex(card => card.id === currentCardId);
  const progressPercentage = ((currentIndex + 1) / journeyCards.length) * 100;

  const handleCardClick = (cardId: string) => {
    if (onNavigateToCard) {
      onNavigateToCard(cardId);
    } else {
      router.push(`/cards/${cardId}`);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      {/* Header with Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold" style={{ color: "#102a63" }}>
                Journey to 9.9
              </h3>
              <p className="text-xs text-gray-500">
                Complete all cards to maximize your hiring score
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 mb-1">Potential Score</div>
            <div className="text-lg font-bold text-emerald-600">{maxScore.toFixed(1)}</div>
            <div className="text-xs text-gray-400">+{totalUplift} from all fixes</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>Starting: {startingScore.toFixed(1)}</span>
          <span>Target: 9.9</span>
        </div>
      </div>

      {/* Cards Grid - 2 rows of 6 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {journeyCards.map((card, idx) => {
          const isCurrentCard = currentCardId === card.id;
          const isClickable = onNavigateToCard && !isCurrentCard;
          const isVisited = currentIndex > idx;
          
          return (
            <button
              key={card.id}
              onClick={() => isClickable && handleCardClick(card.id)}
              disabled={!isClickable}
              className={`
                relative group p-3 rounded-lg border-2 transition-all duration-200
                ${isCurrentCard 
                  ? "bg-gradient-to-br from-purple-600 to-indigo-600 border-purple-700 text-white shadow-lg scale-105" 
                  : isVisited
                    ? "bg-emerald-50 border-emerald-300 text-emerald-900 hover:border-emerald-400 hover:shadow-md"
                    : isClickable
                      ? "bg-white border-gray-200 text-gray-700 hover:border-purple-300 hover:shadow-md hover:bg-purple-50 cursor-pointer"
                      : "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              {/* Current Card Indicator */}
              {isCurrentCard && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center shadow-md">
                  <Target className="w-2.5 h-2.5 text-purple-700" />
                </div>
              )}

              {/* Visited Checkmark */}
              {isVisited && !isCurrentCard && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              <div className="flex flex-col items-center text-center space-y-1.5">
                <p className={`text-xs font-semibold leading-tight ${isCurrentCard ? "text-white" : ""}`}>
                  {card.label}
                </p>
                <span className={`
                  inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold
                  ${isCurrentCard 
                    ? "bg-white text-purple-600" 
                    : isVisited
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-purple-100 text-purple-700"
                  }
                `}>
                  {card.impact}
                </span>
              </div>

              {/* Hover Arrow */}
              {isClickable && (
                <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-3 h-3 text-purple-600" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-purple-600"></div>
              <span>Current</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-gray-200"></div>
              <span>Upcoming</span>
            </div>
          </div>
          {onNavigateToCard && (
            <span className="text-gray-400 italic">Click any card to navigate</span>
          )}
        </div>
      </div>
    </div>
  );
};

