"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Share2, LayoutDashboard, Briefcase, Code, TrendingUp, Map, DollarSign, Target, BarChart3, UserCheck, MessageSquare, Send, Mic, ClipboardList, CalendarCheck, Lock } from "lucide-react";
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

interface HireCardTabsProps {
  isSubscribed?: boolean;
}

// Helper function to get card descriptions for tooltips
const getCardDescription = (id: string): string => {
  const descriptions: Record<string, string> = {
    reality: "Feasibility score, market conditions, what helps or hurts your case, and the truth about making this hire.",
    role: "What this person will actually do and what success looks like in the first 6–12 months.",
    skill: "The must-have abilities, tools, and experience needed to perform the role.",
    market: "How big the talent pool is and how competitive the market is for this profile.",
    talentmap: "Where the strongest candidates come from — companies, locations, and common backgrounds.",
    pay: "What candidates expect to earn in this market and how your budget compares.",
    funnel: "The volume of outreach and interviews you'll need to fill the role.",
    fit: "What motivates this persona, what they care about, and what usually makes them say yes or no.",
    message: "How to pitch the role in a way that actually gets replies.",
    outreach: "Ready-to-send email and DM templates for reaching ideal candidates.",
    interview: "The recommended interview process and competencies to assess at each stage.",
    scorecard: "A simple evaluation framework to keep the team aligned and reduce bias.",
    plan: "Your next steps — the checklist, SLAs, and actions to kick off and run the hiring process well."
  };
  return descriptions[id] || "Card details";
};

export const HireCardTabs: React.FC<HireCardTabsProps> = ({ isSubscribed = false }) => {
  const [activeTab, setActiveTab] = useState("reality");
  const [tooltipTab, setTooltipTab] = useState<string | null>(null);

  const tabs = [
    { id: "reality", label: "Reality Card", Icon: Target },
    { id: "role", label: "Role Card", Icon: Briefcase },
    { id: "skill", label: "Skills Card", Icon: Code },
    { id: "market", label: "Market Card", Icon: TrendingUp },
    { id: "talentmap", label: "Talent Map Card", Icon: Map },
    { id: "pay", label: "Pay Card", Icon: DollarSign },
    { id: "funnel", label: "Funnel Card", Icon: BarChart3 },
    { id: "fit", label: "Fit Card", Icon: UserCheck },
    { id: "message", label: "Message Card", Icon: MessageSquare },
    { id: "outreach", label: "Outreach Card", Icon: Send },
    { id: "interview", label: "Interview Card", Icon: Mic },
    { id: "scorecard", label: "Scorecard Card", Icon: ClipboardList },
    { id: "plan", label: "Plan Card", Icon: CalendarCheck },
  ];

  const handleDownload = () => {
    // TODO: Implement PDF download
    alert("Download functionality coming soon!");
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: "HireCard Strategy",
        text: "Check out my hiring strategy from HireCard",
        url: window.location.href,
      }).catch(err => console.log("Share failed:", err));
    } else {
      // Fallback: Copy link
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const renderCardContent = () => {
    switch (activeTab) {
      case "reality":
        return <RealityCard />;
      case "role":
        return <RoleCard />;
      case "skill":
        return <SkillCard />;
      case "market":
        return <MarketCard />;
      case "talentmap":
        return <TalentMapCard />;
      case "pay":
        return <PayCard />;
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
            <p className="text-gray-500 mb-4">This card is under construction</p>
            <p className="text-sm text-gray-400">More detailed content coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mb-6">
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
          style={{ color: "#102a63" }}
        >
          <Share2 className="w-4 h-4" />
          <span className="text-sm font-medium">Share</span>
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-[#278f8c] text-white rounded-lg hover:bg-[#1a6764] transition-all"
        >
          <Download className="w-4 h-4" />
          <span className="text-sm font-medium">Download PDF</span>
        </button>
      </div>

      {/* Container with border */}
      <div className="bg-white rounded-lg shadow-lg overflow-visible">
        <div className="flex h-[800px] overflow-hidden">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0 border-r border-gray-200 h-full overflow-y-auto overflow-x-visible">
            <div className="p-2 space-y-1">
              {tabs.map((tab) => (
                <div key={tab.id} className="relative">
                  <button
                    data-tab-id={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setTooltipTab(null);
                    }}
                    onMouseEnter={() => setTooltipTab(tab.id)}
                    onMouseLeave={() => setTooltipTab(null)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all rounded-lg text-left
                      ${activeTab === tab.id
                        ? "bg-[#278f8c] text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-50"
                      }
                    `}
                  >
                    <tab.Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="flex-1">{tab.label}</span>
                  </button>

                  {/* Tooltip on Hover */}
                  <AnimatePresence>
                    {tooltipTab === tab.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed z-[9999] w-80 pointer-events-none"
                        style={{
                          left: `${(document.querySelector(`button[data-tab-id="${tab.id}"]`) as HTMLElement)?.getBoundingClientRect().right + 16 || 0}px`,
                          top: `${(document.querySelector(`button[data-tab-id="${tab.id}"]`) as HTMLElement)?.getBoundingClientRect().top || 0}px`,
                        }}
                      >
                        <div 
                          className="bg-white border-2 border-[#278f8c] rounded-xl shadow-2xl p-4 relative pointer-events-auto"
                          onMouseEnter={() => setTooltipTab(tab.id)}
                          onMouseLeave={() => setTooltipTab(null)}
                        >
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
                </div>
              ))}
            </div>
          </div>

          {/* Card Content */}
          <div className="flex-1 min-w-0 h-full overflow-y-auto">
            <div className="p-6 md:p-8">
              {renderCardContent()}
            </div>
          </div>
        </div>
      </div>
      
      {/* Hide scrollbar styling */}
      <style jsx global>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};
