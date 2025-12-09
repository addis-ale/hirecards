"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, BarChart3, Users, DollarSign, Target, Code, Briefcase, UserCheck, MessageSquare, Mic, ClipboardList, CalendarCheck } from "lucide-react";

interface CardVisualProps {
  cardId: string;
  isCurrent?: boolean;
}

// Reality Card - Score Display
const RealityScoreVisual: React.FC<{ isCurrent?: boolean }> = ({ isCurrent }) => {
  // Try to get score from sessionStorage
  const [score, setScore] = React.useState(5.5);
  
  React.useEffect(() => {
    const saved = sessionStorage.getItem("editableRealityCard");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.feasibilityScore) {
          const match = data.feasibilityScore.match(/(\d+\.?\d*)/);
          if (match) {
            setScore(Math.min(9.9, parseFloat(match[1])));
          }
        }
      } catch (e) {
        // Use default
      }
    }
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-emerald-600";
    if (score >= 6) return "text-blue-600";
    if (score >= 4) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="flex items-center justify-center h-32 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg">
      <div className="text-center">
        <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
          {score.toFixed(1)}
        </div>
        <div className="text-xs text-gray-500 mt-1">/ 9.9</div>
        <div className="text-xs font-semibold text-purple-600 mt-1">Feasibility Score</div>
      </div>
    </div>
  );
};

// Market Card - Graph Visual
const MarketGraphVisual: React.FC<{ isCurrent?: boolean }> = ({ isCurrent }) => {
  const data = [65, 45, 80, 60, 75, 55]; // Sample market data
  
  return (
    <div className="h-32 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3 flex items-end justify-center gap-1">
      {data.map((value, index) => (
        <motion.div
          key={index}
          initial={{ height: 0 }}
          animate={{ height: `${value}%` }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="flex-1 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t"
          style={{ maxWidth: "30px" }}
        />
      ))}
    </div>
  );
};

// Talent Map - Map Visual
const TalentMapVisual: React.FC<{ isCurrent?: boolean }> = ({ isCurrent }) => {
  return (
    <div className="h-32 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 flex items-center justify-center">
      <div className="relative w-full h-full">
        <div className="absolute inset-0 flex items-center justify-center">
          <Users className="w-12 h-12 text-blue-400 opacity-50" />
        </div>
        <div className="absolute top-2 left-2 w-3 h-3 bg-blue-500 rounded-full"></div>
        <div className="absolute top-6 right-4 w-2 h-2 bg-cyan-500 rounded-full"></div>
        <div className="absolute bottom-4 left-6 w-2.5 h-2.5 bg-blue-400 rounded-full"></div>
        <div className="absolute bottom-2 right-2 w-3 h-3 bg-cyan-400 rounded-full"></div>
      </div>
    </div>
  );
};

// Pay Card - Money Visual
const PayVisual: React.FC<{ isCurrent?: boolean }> = ({ isCurrent }) => {
  return (
    <div className="h-32 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 flex items-center justify-center">
      <div className="text-center">
        <DollarSign className="w-10 h-10 text-blue-600 mx-auto mb-2" />
        <div className="text-lg font-bold text-blue-700">$120K</div>
        <div className="text-xs text-gray-500">Market Rate</div>
      </div>
    </div>
  );
};

// Funnel Card - Funnel Visual
const FunnelVisual: React.FC<{ isCurrent?: boolean }> = ({ isCurrent }) => {
  return (
    <div className="h-32 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-4 flex items-center justify-center">
      <div className="w-full space-y-1">
        <div className="h-3 bg-emerald-400 rounded-full" style={{ width: "100%" }}></div>
        <div className="h-3 bg-emerald-500 rounded-full" style={{ width: "75%" }}></div>
        <div className="h-3 bg-emerald-600 rounded-full" style={{ width: "50%" }}></div>
        <div className="h-3 bg-teal-600 rounded-full" style={{ width: "25%" }}></div>
      </div>
    </div>
  );
};

// Fit Card - Persona Visual
const FitVisual: React.FC<{ isCurrent?: boolean }> = ({ isCurrent }) => {
  return (
    <div className="h-32 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-4 flex items-center justify-center">
      <div className="text-center">
        <UserCheck className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
        <div className="text-sm font-semibold text-emerald-700">Persona Match</div>
        <div className="text-xs text-gray-500 mt-1">Decision Drivers</div>
      </div>
    </div>
  );
};

// Message Card - Message Visual
const MessageVisual: React.FC<{ isCurrent?: boolean }> = ({ isCurrent }) => {
  return (
    <div className="h-32 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-4 flex items-center justify-center">
      <div className="w-full space-y-2">
        <div className="h-2 bg-emerald-300 rounded-full"></div>
        <div className="h-2 bg-emerald-400 rounded-full" style={{ width: "80%" }}></div>
        <div className="h-2 bg-emerald-500 rounded-full" style={{ width: "60%" }}></div>
        <MessageSquare className="w-6 h-6 text-emerald-600 mx-auto mt-2" />
      </div>
    </div>
  );
};

// Interview Card - Interview Visual
const InterviewVisual: React.FC<{ isCurrent?: boolean }> = ({ isCurrent }) => {
  return (
    <div className="h-32 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 flex items-center justify-center">
      <div className="text-center">
        <Mic className="w-10 h-10 text-amber-600 mx-auto mb-2" />
        <div className="flex gap-1 justify-center">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-2 h-2 bg-amber-500 rounded-full"></div>
          ))}
        </div>
        <div className="text-xs font-semibold text-amber-700 mt-2">Interview Loop</div>
      </div>
    </div>
  );
};

// Scorecard Card - Checklist Visual
const ScorecardVisual: React.FC<{ isCurrent?: boolean }> = ({ isCurrent }) => {
  return (
    <div className="h-32 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 flex items-center justify-center">
      <div className="w-full space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-amber-500 rounded"></div>
            <div className="h-1.5 bg-amber-300 rounded flex-1"></div>
          </div>
        ))}
        <ClipboardList className="w-6 h-6 text-amber-600 mx-auto mt-1" />
      </div>
    </div>
  );
};

// Plan Card - Calendar Visual
const PlanVisual: React.FC<{ isCurrent?: boolean }> = ({ isCurrent }) => {
  return (
    <div className="h-32 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 flex items-center justify-center">
      <div className="text-center">
        <CalendarCheck className="w-10 h-10 text-indigo-600 mx-auto mb-2" />
        <div className="grid grid-cols-7 gap-1 mt-2">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${i <= 3 ? "bg-indigo-500" : "bg-indigo-200"}`}></div>
          ))}
        </div>
        <div className="text-xs font-semibold text-indigo-700 mt-1">7-Day Plan</div>
      </div>
    </div>
  );
};

// Role Card - Briefcase Visual
const RoleVisual: React.FC<{ isCurrent?: boolean }> = ({ isCurrent }) => {
  return (
    <div className="h-32 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 flex items-center justify-center">
      <div className="text-center">
        <Briefcase className="w-10 h-10 text-purple-600 mx-auto mb-2" />
        <div className="text-sm font-semibold text-purple-700">Role Definition</div>
        <div className="text-xs text-gray-500 mt-1">6-12 Month Success</div>
      </div>
    </div>
  );
};

// Skill Card - Skills Visual
const SkillVisual: React.FC<{ isCurrent?: boolean }> = ({ isCurrent }) => {
  return (
    <div className="h-32 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 flex items-center justify-center">
      <div className="w-full space-y-2">
        <div className="flex gap-1 justify-center">
          {["React", "Node", "TS"].map((skill, i) => (
            <div key={i} className="px-2 py-1 bg-purple-200 text-purple-700 text-xs rounded font-semibold">
              {skill}
            </div>
          ))}
        </div>
        <Code className="w-8 h-8 text-purple-600 mx-auto" />
      </div>
    </div>
  );
};

export const CardVisual: React.FC<CardVisualProps> = ({ cardId, isCurrent }) => {
  switch (cardId) {
    case "reality":
      return <RealityScoreVisual isCurrent={isCurrent} />;
    case "market":
      return <MarketGraphVisual isCurrent={isCurrent} />;
    case "talentmap":
      return <TalentMapVisual isCurrent={isCurrent} />;
    case "pay":
      return <PayVisual isCurrent={isCurrent} />;
    case "funnel":
      return <FunnelVisual isCurrent={isCurrent} />;
    case "fit":
      return <FitVisual isCurrent={isCurrent} />;
    case "message":
      return <MessageVisual isCurrent={isCurrent} />;
    case "interview":
      return <InterviewVisual isCurrent={isCurrent} />;
    case "scorecard":
      return <ScorecardVisual isCurrent={isCurrent} />;
    case "plan":
      return <PlanVisual isCurrent={isCurrent} />;
    case "role":
      return <RoleVisual isCurrent={isCurrent} />;
    case "skill":
      return <SkillVisual isCurrent={isCurrent} />;
    default:
      return null;
  }
};

