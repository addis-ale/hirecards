"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Briefcase, Code, TrendingUp, Map, DollarSign, Target, BarChart3, UserCheck, MessageSquare, Send, Mic, ClipboardList, CalendarCheck } from "lucide-react";
import { OverviewCard } from "./cards/OverviewCard";
import { RoleCard } from "./cards/RoleCard";
import { SkillCard } from "./cards/SkillCard";
import { MarketCard } from "./cards/MarketCard";
import { PayCard } from "./cards/PayCard";
import { RealityCard } from "./cards/RealityCard";

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
      // Placeholder cards for the rest
      case "talentmap":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#278f8c] to-[#1a6764] flex items-center justify-center">
                <Map className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: "#102a63" }}>
                  Talent Map
                </h2>
                <p className="text-sm text-gray-600">Where to find candidates</p>
              </div>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
              <h3 className="font-bold text-lg mb-3" style={{ color: "#102a63" }}>
                Top Talent Sources
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span className="text-sm" style={{ color: "#102a63" }}>LinkedIn Outbound</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span className="text-sm" style={{ color: "#102a63" }}>GitHub Activity</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span className="text-sm" style={{ color: "#102a63" }}>Community Channels</span>
                </li>
              </ul>
            </div>
          </div>
        );
      case "funnel":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#278f8c] to-[#1a6764] flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: "#102a63" }}>
                  Funnel Strategy
                </h2>
                <p className="text-sm text-gray-600">Conversion rates & planning</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white border-2 border-blue-200 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold mb-1" style={{ color: "#278f8c" }}>100</div>
                <p className="text-xs font-medium text-gray-600">Outreach</p>
              </div>
              <div className="bg-white border-2 border-blue-200 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold mb-1" style={{ color: "#278f8c" }}>15</div>
                <p className="text-xs font-medium text-gray-600">Responses</p>
              </div>
              <div className="bg-white border-2 border-blue-200 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold mb-1" style={{ color: "#278f8c" }}>5</div>
                <p className="text-xs font-medium text-gray-600">Interviews</p>
              </div>
              <div className="bg-white border-2 border-green-200 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold mb-1" style={{ color: "#278f8c" }}>1-2</div>
                <p className="text-xs font-medium text-gray-600">Offers</p>
              </div>
            </div>
          </div>
        );
      case "fit":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#278f8c] to-[#1a6764] flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: "#102a63" }}>
                  Fit Assessment
                </h2>
                <p className="text-sm text-gray-600">Candidate scoring framework</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-3" style={{ color: "#102a63" }}>
                Must-Have Criteria
              </h3>
              <ul className="space-y-2">
                {[
                  "3+ years experience",
                  "Proven ownership",
                  "Product-minded approach",
                  "Strong communication"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm" style={{ color: "#102a63" }}>
                    <span className="text-green-500 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      case "message":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#278f8c] to-[#1a6764] flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: "#102a63" }}>
                  Messaging Strategy
                </h2>
                <p className="text-sm text-gray-600">Positioning to attract talent</p>
              </div>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
              <h3 className="font-bold text-lg mb-3" style={{ color: "#102a63" }}>
                Key Message Points
              </h3>
              <ul className="space-y-2">
                <li className="text-sm" style={{ color: "#102a63" }}>
                  <strong>Lead with impact</strong>
                </li>
                <li className="text-sm" style={{ color: "#102a63" }}>
                  <strong>Highlight autonomy</strong>
                </li>
                <li className="text-sm" style={{ color: "#102a63" }}>
                  <strong>Show the tech stack</strong>
                </li>
              </ul>
            </div>
          </div>
        );
      case "outreach":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#278f8c] to-[#1a6764] flex items-center justify-center">
                <Send className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: "#102a63" }}>
                  Outreach Playbook
                </h2>
                <p className="text-sm text-gray-600">Templates that convert</p>
              </div>
            </div>
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-3" style={{ color: "#102a63" }}>
                Sample Template Preview
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
                <p className="mb-2 text-gray-700">Hi [Name],</p>
                <p className="mb-2 text-gray-700">
                  Saw your work on [project]...
                </p>
                <p className="text-blue-600 font-medium">[View full template]</p>
              </div>
            </div>
          </div>
        );
      case "interview":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#278f8c] to-[#1a6764] flex items-center justify-center">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: "#102a63" }}>
                  Interview Guide
                </h2>
                <p className="text-sm text-gray-600">Structured interview process</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-bold text-sm mb-1" style={{ color: "#102a63" }}>Stage 1: Technical Screen</h4>
                <p className="text-xs text-gray-600">45 min - SQL & modelling</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <h4 className="font-bold text-sm mb-1" style={{ color: "#102a63" }}>Stage 2: System Design</h4>
                <p className="text-xs text-gray-600">60 min - Analytics system</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <h4 className="font-bold text-sm mb-1" style={{ color: "#102a63" }}>Stage 3: Culture Fit</h4>
                <p className="text-xs text-gray-600">30 min - Team alignment</p>
              </div>
            </div>
          </div>
        );
      case "scorecard":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#278f8c] to-[#1a6764] flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: "#102a63" }}>
                  Scorecard Template
                </h2>
                <p className="text-sm text-gray-600">Evaluation rubric</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-3" style={{ color: "#102a63" }}>
                Scoring Dimensions
              </h3>
              <div className="space-y-2">
                {[
                  { name: "Technical Skills", weight: "40%" },
                  { name: "Product Thinking", weight: "25%" },
                  { name: "Communication", weight: "20%" },
                  { name: "Culture Fit", weight: "15%" }
                ].map((dim, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white rounded-lg p-2 border border-gray-200">
                    <span className="text-sm font-medium" style={{ color: "#102a63" }}>{dim.name}</span>
                    <span className="text-sm font-bold" style={{ color: "#278f8c" }}>{dim.weight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "plan":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#278f8c] to-[#1a6764] flex items-center justify-center">
                <CalendarCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: "#102a63" }}>
                  30-Day Action Plan
                </h2>
                <p className="text-sm text-gray-600">Execution roadmap</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { week: "Week 1", tasks: "Align & prep" },
                { week: "Week 2", tasks: "Launch outreach" },
                { week: "Week 3", tasks: "Screen candidates" },
                { week: "Week 4", tasks: "Interview & offer" }
              ].map((item, idx) => (
                <div key={idx} className="bg-white border-l-4 border-blue-500 rounded-r-lg p-3">
                  <h4 className="font-bold text-sm mb-1" style={{ color: "#102a63" }}>{item.week}</h4>
                  <p className="text-xs text-gray-600">{item.tasks}</p>
                </div>
              ))}
            </div>
          </div>
        );
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
            className="relative z-10 h-full overflow-y-auto custom-scrollbar pr-2"
          >
            {renderCardContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #278f8c;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #1a6764;
        }
      `}</style>
    </div>
  );
};
