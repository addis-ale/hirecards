"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Target, Briefcase, Code, TrendingUp, Map, DollarSign, 
  BarChart3, UserCheck, MessageSquare, Send, Mic, ClipboardList, CalendarCheck 
} from "lucide-react";
import { allCards, getCardById } from "@/lib/cardCategories";

interface CardNavigatorProps {
  currentCardId: string;
  onNavigateToCard: (cardId: string) => void;
}

export const CardNavigator: React.FC<CardNavigatorProps> = ({
  currentCardId,
  onNavigateToCard,
}) => {
  const router = useRouter();

  const handleCardClick = (cardId: string) => {
    if (onNavigateToCard) {
      onNavigateToCard(cardId);
    } else {
      router.push(`/cards/${cardId}`);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="w-full">
        <div className="bg-white border-t border-gray-200 shadow-2xl py-2 px-2">
          <div className="flex items-center justify-center gap-2 overflow-x-auto scrollbar-hide">
            {allCards.map((card) => {
              const isCurrent = currentCardId === card.id;
              const Icon = card.icon;
              
              return (
                <motion.button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    relative flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-lg transition-all min-w-[70px] flex-shrink-0
                    ${isCurrent
                      ? `${card.gradient} text-white shadow-md`
                      : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                    }
                  `}
                >
                  <Icon className={`
                    w-4 h-4
                    ${isCurrent ? "text-white" : 
                      card.color === "purple" ? "text-purple-600" :
                      card.color === "blue" ? "text-blue-600" :
                      card.color === "emerald" ? "text-emerald-600" :
                      card.color === "amber" ? "text-amber-600" :
                      "text-indigo-600"}
                  `} />
                  <span className={`text-[10px] font-medium text-center leading-tight ${isCurrent ? "text-white" : "text-gray-700"}`}>
                    {card.shortLabel}
                  </span>
                  <span className={`
                    text-[9px] font-bold
                    ${isCurrent ? "text-white/90" : "text-emerald-600"}
                  `}>
                    {card.impact}
                  </span>
                  {isCurrent && (
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-400 rounded-full border border-white"></div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

