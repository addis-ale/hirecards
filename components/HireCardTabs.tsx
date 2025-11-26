"use client";

import React, { useState } from "react";
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

export const HireCardTabs: React.FC<HireCardTabsProps> = ({ isSubscribed = false }) => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", Icon: LayoutDashboard },
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
      case "overview":
        return <OverviewCard isSubscribed={isSubscribed} />;
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
      case "reality":
        return <RealityCard />;
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
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex h-[800px]">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0 border-r border-gray-200 h-full overflow-y-auto">
            <div className="p-2 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
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
