"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Briefcase, Code, TrendingUp, Map, DollarSign, Target, BarChart3, UserCheck, MessageSquare, Send, Mic, ClipboardList, CalendarCheck } from "lucide-react";
import { OverviewCard } from "./cards/OverviewCard";
import { RoleCard } from "./cards/RoleCard";
import { SkillCard } from "./cards/SkillCard";
import { MarketCard } from "./cards/MarketCard";
import { TalentMapCard } from "./cards/TalentMapCard";
import { PayCard } from "./cards/PayCard";
import { RealityCard } from "./cards/RealityCard";
import { FunnelCard } from "./cards/FunnelCard";
import { FitCard } from "./cards/FitCard";
import { MessageCard } from "./cards/MessageCard";
import { OutreachCard } from "./cards/OutreachCard";
import { InterviewCard } from "./cards/InterviewCard";
import { ScorecardCard } from "./cards/ScorecardCard";
import { PlanCard } from "./cards/PlanCard";

// Helper function to get card descriptions for tooltips
const getCardDescription = (id: string): string => {
  const descriptions: Record<string, string> = {
    overview: "Feasibility score, market conditions, what helps or hurts your case, and the truth about making this hire.",
    role: "What this person will actually do and what success looks like in the first 6–12 months.",
    skill: "The must-have abilities, tools, and experience needed to perform the role.",
    market: "How big the talent pool is and how competitive the market is for this profile.",
    talentmap: "Where the strongest candidates come from, companies, locations, and common backgrounds.",
    pay: "What candidates expect to earn in this market and how your budget compares.",
    reality: "Feasibility score, market conditions, what helps or hurts your case, and the truth about making this hire.",
    funnel: "The volume of outreach and interviews you'll need to fill the role.",
    fit: "What motivates this persona, what they care about, and what usually makes them say yes or no.",
    message: "How to pitch the role in a way that actually gets replies.",
    outreach: "Ready-to-send email and DM templates for reaching ideal candidates.",
    interview: "The recommended interview process and competencies to assess at each stage.",
    scorecard: "A simple evaluation framework to keep the team aligned and reduce bias.",
    plan: "Your next steps, the checklist, SLAs, and actions to kick off and run the hiring process well."
  };
  return descriptions[id] || "Card details";
};

export const LandingPreviewTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [tooltipTab, setTooltipTab] = useState<string | null>(null);

  const tabs = [
    { id: "overview", label: "Overview Card", Icon: LayoutDashboard },
    { id: "role", label: "Role Card", Icon: Briefcase },
    { id: "skill", label: "Skills Card", Icon: Code },
    { id: "market", label: "Market Card", Icon: TrendingUp },
    { id: "talentmap", label: "Talent Map Card", Icon: Map },
    { id: "pay", label: "Pay Card", Icon: DollarSign },
    { id: "reality", label: "Reality Card", Icon: Target },
    { id: "funnel", label: "Funnel Card", Icon: BarChart3 },
    { id: "fit", label: "Fit Card", Icon: UserCheck },
    { id: "message", label: "Message Card", Icon: MessageSquare },
    { id: "outreach", label: "Outreach Card", Icon: Send },
    { id: "interview", label: "Interview Card", Icon: Mic },
    { id: "scorecard", label: "Scorecard Card", Icon: ClipboardList },
    { id: "plan", label: "Plan Card", Icon: CalendarCheck },
  ];

  const renderCardContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewCard isSubscribed={true} />;
      case "role":
        return <RoleCard />;
      case "skill":
        return <SkillCard />;
      case "market":
        return <MarketCard />;
      case "pay":
        return <PayCard />;
      case "reality":
        return <RealityCard />;
      case "talentmap":
        return <TalentMapCard />;
      case "funnel":
        return <FunnelCard />;
      case "fit":
        return <FitCard />;
      case "message":
        return <MessageCard />;
      case "outreach":
        return <OutreachCard />;
      case "interview":
        return <InterviewCard />;
      case "scorecard":
        return <ScorecardCard />;
      case "plan":
        return <PlanCard />;
      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-500">Card content loading...</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[800px]">
      {/* Compact Sidebar Navigation */}
      <div className="w-full md:w-48 flex flex-col gap-2">
        {tabs.map((tab, index) => (
          <motion.div
            key={tab.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.03 }}
            className="relative"
          >
            <motion.button
              onClick={() => {
                setActiveTab(tab.id);
                setTooltipTab(null);
              }}
              onMouseEnter={() => setTooltipTab(tab.id)}
              onMouseLeave={() => setTooltipTab(null)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2
                ${activeTab === tab.id 
                  ? 'bg-[#102a63] text-white shadow-md' 
                  : 'hover:bg-[#d7f4f2]/50 text-slate-600 hover:text-[#102a63]'
                }`}
            >
              <tab.Icon size={16} className={activeTab === tab.id ? 'text-[#278f8c]' : 'text-slate-400'} />
              {tab.label}
            </motion.button>

            {/* Tooltip on Hover */}
            <AnimatePresence>
              {tooltipTab === tab.id && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-full ml-4 top-0 z-50 w-80"
                  onMouseEnter={() => setTooltipTab(tab.id)}
                  onMouseLeave={() => setTooltipTab(null)}
                >
                  <div className="bg-white border-2 border-[#278f8c] rounded-xl shadow-2xl p-4 relative">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-[#d7f4f2] rounded-lg">
                        <tab.Icon size={18} className="text-[#278f8c]" />
                      </div>
                      <h4 className="font-bold text-[#102a63]">{tab.label}</h4>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {getCardDescription(tab.id)}
                    </p>
                    {/* Arrow pointer pointing left */}
                    <div className="absolute left-0 top-4 -ml-2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white"></div>
                    <div className="absolute left-0 top-4 -ml-3 w-0 h-0 border-t-[9px] border-t-transparent border-b-[9px] border-b-transparent border-r-[9px] border-r-[#278f8c]"></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>


      {/* Card Content Area */}
      <div className="flex-1 bg-slate-50 rounded-xl border border-slate-100 p-6 relative overflow-hidden h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative z-10 h-full overflow-y-auto pr-2"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            } as React.CSSProperties}
          >
            {renderCardContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Global style to hide scrollbar */}
      <style jsx global>{`
        .overflow-y-auto::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};
