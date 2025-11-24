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
    { id: "role", label: "Role", Icon: Briefcase, locked: !isSubscribed },
    { id: "skill", label: "Skills", Icon: Code, locked: !isSubscribed },
    { id: "market", label: "Market", Icon: TrendingUp, locked: !isSubscribed },
    { id: "talentmap", label: "Talent Map", Icon: Map, locked: !isSubscribed },
    { id: "pay", label: "Pay", Icon: DollarSign, locked: !isSubscribed },
    { id: "reality", label: "Reality", Icon: Target, locked: !isSubscribed },
    { id: "funnel", label: "Funnel", Icon: BarChart3, locked: !isSubscribed },
    { id: "fit", label: "Fit", Icon: UserCheck, locked: !isSubscribed },
    { id: "message", label: "Message", Icon: MessageSquare, locked: !isSubscribed },
    { id: "outreach", label: "Outreach", Icon: Send, locked: !isSubscribed },
    { id: "interview", label: "Interview", Icon: Mic, locked: !isSubscribed },
    { id: "scorecard", label: "Scorecard", Icon: ClipboardList, locked: !isSubscribed },
    { id: "plan", label: "Plan", Icon: CalendarCheck, locked: !isSubscribed },
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
    // Check if current tab is locked (not subscribed and not overview)
    const isCurrentTabLocked = !isSubscribed && activeTab !== "overview";
    
    let content;
    switch (activeTab) {
      case "overview":
        content = <OverviewCard isSubscribed={isSubscribed} />;
        break;
      case "role":
        content = <RoleCard />;
        break;
      case "skill":
        content = <SkillCard />;
        break;
      case "market":
        content = <MarketCard />;
        break;
      case "talentmap":
        content = <TalentMapCard />;
        break;
      case "pay":
        content = <PayCard />;
        break;
      case "reality":
        content = <RealityCard />;
        break;
      case "funnel":
        content = <FunnelCard />;
        break;
      case "fit":
        content = <FitCard />;
        break;
      case "message":
        content = <MessageCard />;
        break;
      case "outreach":
        content = <OutreachCard />;
        break;
      case "interview":
        content = <InterviewCard />;
        break;
      case "scorecard":
        content = <ScorecardCard />;
        break;
      case "plan":
        content = <PlanCard />;
        break;
      // Add other cards here as we build them
      default:
        content = (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">This card is under construction</p>
            <p className="text-sm text-gray-400">More detailed content coming soon...</p>
          </div>
        );
    }

    // If locked, wrap content in blur overlay
    if (isCurrentTabLocked) {
      return (
        <div className="relative min-h-[400px]">
          {/* Blurred content in background */}
          <div className="blur-sm pointer-events-none select-none opacity-30">
            {content}
          </div>
          
          {/* Lock overlay in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center bg-white/95 backdrop-blur-sm rounded-3xl p-12 md:p-16 shadow-2xl max-w-2xl mx-4">
              <Lock className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 text-gray-400" />
              <h3 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#102a63" }}>
                This Card is Locked
              </h3>
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                Subscribe to unlock all 13 strategic hiring cards with detailed analysis, 
                market insights, and actionable strategies.
              </p>
              <a
                href="/pricing"
                className="inline-flex items-center gap-3 px-8 py-4 text-lg md:text-xl bg-[#278f8c] text-white rounded-xl hover:bg-[#1a6764] transition-all font-semibold shadow-lg hover:shadow-xl"
              >
                <Lock className="w-6 h-6" />
                <span>Unlock All Cards</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return content;
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

      {/* Tabs Navigation */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative flex-shrink-0 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all
                ${activeTab === tab.id
                  ? "bg-[#278f8c] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
                }
              `}
            >
              <div className="flex items-center gap-2">
                <tab.Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.locked && (
                  <Lock className="w-3 h-3" aria-label="locked" />
                )}
              </div>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Card Content */}
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        {renderCardContent()}
      </div>
    </div>
  );
};
