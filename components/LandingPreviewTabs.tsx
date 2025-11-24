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

export const LandingPreviewTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", Icon: LayoutDashboard },
    { id: "role", label: "Role", Icon: Briefcase },
    { id: "skill", label: "Skills", Icon: Code },
    { id: "market", label: "Market", Icon: TrendingUp },
    { id: "talentmap", label: "Talent Map", Icon: Map },
    { id: "pay", label: "Pay", Icon: DollarSign },
    { id: "reality", label: "Reality", Icon: Target },
    { id: "funnel", label: "Funnel", Icon: BarChart3 },
    { id: "fit", label: "Fit", Icon: UserCheck },
    { id: "message", label: "Message", Icon: MessageSquare },
    { id: "outreach", label: "Outreach", Icon: Send },
    { id: "interview", label: "Interview", Icon: Mic },
    { id: "scorecard", label: "Scorecard", Icon: ClipboardList },
    { id: "plan", label: "Plan", Icon: CalendarCheck },
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
      {/* Sidebar Navigation */}
      <div className="w-full md:w-1/3 flex flex-col gap-2 h-full">
        {tabs.map((tab, index) => (
          <motion.button
            key={tab.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.03 }}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-3 flex-shrink-0
              ${activeTab === tab.id 
                ? 'bg-[#102a63] text-white shadow-md' 
                : 'hover:bg-[#d7f4f2]/50 text-slate-600 hover:text-[#102a63]'
              }`}
          >
            <tab.Icon size={16} className={activeTab === tab.id ? 'text-[#278f8c]' : 'text-slate-400'} />
            {tab.label}
          </motion.button>
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
