"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  DollarSign,
  TrendingUp,
  CheckCircle,
  List,
  Users,
  MessageSquare,
  Clipboard,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface BattleCardProps {
  card: {
    id: number;
    type: string;
    title: string;
    icon: string;
    content: any;
  };
  index: number;
}

const iconMap: { [key: string]: any } = {
  briefcase: Briefcase,
  "dollar-sign": DollarSign,
  "trending-up": TrendingUp,
  "check-circle": CheckCircle,
  list: List,
  users: Users,
  "message-square": MessageSquare,
  clipboard: Clipboard,
};

const colorMap: { [key: string]: { bg: string; accent: string } } = {
  "Role Definition": { bg: "#102a63", accent: "#278f8c" },
  Compensation: { bg: "#0f4c5c", accent: "#5da9a2" },
  "Market Intelligence": { bg: "#1b3a4f", accent: "#6ba3b8" },
  Requirements: { bg: "#1e3a5f", accent: "#6495a8" },
  Responsibilities: { bg: "#0d2f47", accent: "#4a8fa0" },
  "Culture Fit": { bg: "#163850", accent: "#5b9aa6" },
  Messaging: { bg: "#1a4d5c", accent: "#66b2b2" },
  "Interview Guide": { bg: "#0e3348", accent: "#5499a3" },
  "Reality Check": { bg: "#1a3d52", accent: "#66b7b7" },
};

export default function BattleCard({ card, index }: BattleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = iconMap[card.icon] || Briefcase;
  const colors = colorMap[card.type] || { bg: "#102a63", accent: "#278f8c" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group"
    >
      <div
        className="relative h-full rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-200"
        style={{
          background: `linear-gradient(135deg, ${colors.bg} 0%, ${colors.accent} 100%)`,
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Card Header */}
        <div className="p-5 text-white">
          <div className="flex items-start justify-between mb-3">
            <div
              className="p-2.5 rounded-lg"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
            >
              <Icon className="w-6 h-6" />
            </div>
            <button
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>
          <h3 className="text-xl font-bold mb-1">{card.title}</h3>
          <p className="text-sm opacity-90">{card.type}</p>
        </div>

        {/* Card Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white text-gray-900"
            >
              <div className="p-5 space-y-4">
                {Object.entries(card.content).map(([key, value]) => (
                  <div
                    key={key}
                    className="border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                  >
                    <div
                      className="text-xs font-bold uppercase tracking-wide mb-2"
                      style={{ color: colors.bg }}
                    >
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </div>
                    {Array.isArray(value) ? (
                      <ul className="space-y-2">
                        {value.map((item: string, i: number) => (
                          <li
                            key={i}
                            className="flex items-start space-x-2 text-sm"
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                              style={{ backgroundColor: colors.accent }}
                            ></span>
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-sm font-medium text-gray-800">
                        {String(value)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed Preview */}
        {!isExpanded && (
          <div
            className="p-5 text-white"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
          >
            <div className="space-y-2">
              {Object.entries(card.content)
                .slice(0, 2)
                .map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <span className="opacity-80 font-medium">
                      {key.replace(/([A-Z])/g, " $1").trim()}:{" "}
                    </span>
                    <span className="font-semibold">
                      {Array.isArray(value)
                        ? value.length + " items"
                        : String(value).substring(0, 35) + "..."}
                    </span>
                  </div>
                ))}
            </div>
            <div className="mt-3 text-xs opacity-80 flex items-center gap-1">
              <span>Click to expand</span>
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>
        )}

        {/* Decorative Icon */}
        <div className="absolute bottom-3 right-3 opacity-5 pointer-events-none">
          <Icon className="w-20 h-20" />
        </div>
      </div>
    </motion.div>
  );
}
