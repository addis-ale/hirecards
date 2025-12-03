"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Share2, LayoutDashboard, Briefcase, Code, TrendingUp, Map, DollarSign, Target, BarChart3, UserCheck, MessageSquare, Send, Mic, ClipboardList, CalendarCheck, Lock, Edit2, Save } from "lucide-react";
import { EditModeProvider } from "./EditModeContext";
import { OverviewCard } from "./cards/OverviewCard";
import { EditableRealityCard } from "./cards/EditableRealityCard";
import { EditableRoleCard } from "./cards/EditableRoleCard";
import { EditableSkillCard } from "./cards/EditableSkillCard";
import { EditableMarketCard } from "./cards/EditableMarketCard";
import { EditableTalentMapCard } from "./cards/EditableTalentMapCard";
import { EditablePayCard } from "./cards/EditablePayCard";
import { EditableFunnelCard } from "./cards/EditableFunnelCard";
import { EditableFitCard } from "./cards/EditableFitCard";
import { EditableMessageCard } from "./cards/EditableMessageCard";
import { EditableOutreachCard } from "./cards/EditableOutreachCard";
import { EditableInterviewCard } from "./cards/EditableInterviewCard";
import { EditableScorecardCard } from "./cards/EditableScorecardCard";
import { EditablePlanCard } from "./cards/EditablePlanCard";

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
    talentmap: "Where the strongest candidates come from, companies, locations, and common backgrounds.",
    pay: "What candidates expect to earn in this market and how your budget compares.",
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

export const HireCardTabs: React.FC<HireCardTabsProps> = ({ isSubscribed = false }) => {
  const [activeTab, setActiveTab] = useState("reality");
  const [tooltipTab, setTooltipTab] = useState<string | null>(null);
  const [selectedCards, setSelectedCards] = useState<string[]>(["reality"]); // Default: Reality card selected
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [showSelectionHint, setShowSelectionHint] = useState(false);
  const [showShareHint, setShowShareHint] = useState(false);
  const [showDownloadHint, setShowDownloadHint] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

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

  const toggleCardSelection = (cardId: string) => {
    setSelectedCards(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const selectAllCards = () => {
    setSelectedCards(tabs.map(tab => tab.id));
  };

  const deselectAllCards = () => {
    setSelectedCards([]);
  };

  const handleDownload = () => {
    if (selectedCards.length === 0) {
      alert("👈 Select cards first!\n\nCheck the circles next to the cards in the sidebar to choose what you want to download.");
      return;
    }
    // TODO: Implement PDF download with selected cards
    alert(`Download functionality coming soon!\nSelected cards: ${selectedCards.join(", ")}`);
  };

  const handleShare = () => {
    if (selectedCards.length === 0) {
      alert("👈 Select cards first!\n\nCheck the circles next to the cards in the sidebar to choose what you want to share.");
      return;
    }
    
    const selectedCardNames = selectedCards
      .map(id => tabs.find(tab => tab.id === id)?.label)
      .join(", ");
    
    // TODO: Implement share functionality with selected cards
    if (navigator.share) {
      navigator.share({
        title: "HireCard Strategy",
        text: `Check out my hiring strategy: ${selectedCardNames}`,
        url: window.location.href,
      }).catch(err => console.log("Share failed:", err));
    } else {
      // Fallback: Copy link
      navigator.clipboard.writeText(window.location.href);
      alert(`Link copied to clipboard!\nSharing: ${selectedCardNames}`);
    }
  };

  const renderCardContent = () => {
    switch (activeTab) {
      case "reality":
        return <EditableRealityCard />;
      case "role":
        return <EditableRoleCard />;
      case "skill":
        return <EditableSkillCard />;
      case "market":
        return <EditableMarketCard />;
      case "talentmap":
        return <EditableTalentMapCard />;
      case "pay":
        return <EditablePayCard />;
      case "funnel":
        return <EditableFunnelCard />;
      case "fit":
        return <EditableFitCard />;
      case "message":
        return <EditableMessageCard />;
      case "outreach":
        return <EditableOutreachCard />;
      case "interview":
        return <EditableInterviewCard />;
      case "scorecard":
        return <EditableScorecardCard />;
      case "plan":
        return <EditablePlanCard />;
      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">This card is under construction</p>
            <p className="text-sm text-gray-400">More detailed content coming soon...</p>
          </div>
        );
    }
  };

  const handleToggleEdit = () => {
    if (isEditMode) {
      // Saving - trigger save to sessionStorage (already automatic in each card)
      setIsEditMode(false);
    } else {
      // Enter edit mode
      setIsEditMode(true);
    }
  };

  return (
    <div className="w-full">
      {/* Action Buttons */}
      <div className="flex justify-between items-center gap-3 mb-6">
        {/* Selection Controls */}
        <div 
          className="flex items-center gap-3 relative"
          onMouseEnter={() => setShowSelectionHint(true)}
          onMouseLeave={() => setShowSelectionHint(false)}
        >
          <span className="text-sm font-medium" style={{ color: "#102a63" }}>
            {selectedCards.length} card{selectedCards.length !== 1 ? 's' : ''} selected
          </span>
          <button
            onClick={selectAllCards}
            className="text-sm text-[#278f8c] hover:underline font-medium"
          >
            Select All
          </button>
          <button
            onClick={deselectAllCards}
            className="text-sm text-gray-500 hover:underline font-medium"
          >
            Clear
          </button>
          
          {/* Hint Tooltip */}
          {showSelectionHint && (
            <div className="absolute top-full left-0 mt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div 
                className="bg-[#102a63] text-white text-xs rounded-lg px-4 py-2 shadow-lg max-w-xs"
              >
                <p className="font-medium mb-1">💡 Select cards to share or download</p>
                <p className="text-gray-300">Check the circles next to each card in the sidebar to customize what you want to export.</p>
              </div>
            </div>
          )}
        </div>

        {/* Edit/Save & Share & Download Buttons */}
        <div className="flex gap-3">
          {/* Edit/Save Button */}
          <button
            onClick={handleToggleEdit}
            className={`flex items-center gap-2 px-4 py-2 border-2 rounded-lg transition-all font-medium ${
              isEditMode
                ? "bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-600"
                : "border-[#278f8c] text-[#278f8c] hover:bg-[#278f8c] hover:text-white"
            }`}
          >
            {isEditMode ? (
              <>
                <Save className="w-4 h-4" />
                <span className="text-sm">Save Changes</span>
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4" />
                <span className="text-sm">Edit Cards</span>
              </>
            )}
          </button>

          {/* Share Button */}
          <div 
            className="relative"
            onMouseEnter={() => selectedCards.length === 0 && setShowShareHint(true)}
            onMouseLeave={() => setShowShareHint(false)}
          >
            <button
              onClick={handleShare}
              disabled={selectedCards.length === 0}
              className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ color: "#102a63" }}
            >
              <Share2 className="w-4 h-4" />
              <span className="text-sm font-medium">
                Share {selectedCards.length > 0 && `(${selectedCards.length})`}
              </span>
            </button>
            
            {/* Tooltip for disabled state */}
            {showShareHint && selectedCards.length === 0 && (
              <div className="absolute bottom-full right-0 mb-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="bg-[#102a63] text-white text-xs rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
                  ← Select cards from the sidebar first
                </div>
              </div>
            )}
          </div>

          {/* Download Button */}
          <div 
            className="relative"
            onMouseEnter={() => selectedCards.length === 0 && setShowDownloadHint(true)}
            onMouseLeave={() => setShowDownloadHint(false)}
          >
            <button
              onClick={handleDownload}
              disabled={selectedCards.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-[#278f8c] text-white rounded-lg hover:bg-[#1a6764] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">
                Download PDF {selectedCards.length > 0 && `(${selectedCards.length})`}
              </span>
            </button>
            
            {/* Tooltip for disabled state */}
            {showDownloadHint && selectedCards.length === 0 && (
              <div className="absolute bottom-full right-0 mb-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="bg-[#102a63] text-white text-xs rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
                  ← Select cards from the sidebar first
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Container with border */}
      <div className="bg-white rounded-lg shadow-lg overflow-visible">
        <div className="flex h-[800px] overflow-hidden">
          {/* Sidebar Navigation */}
          <div 
            className="w-64 flex-shrink-0 border-r border-gray-200 h-full overflow-y-auto overflow-x-visible relative"
            onMouseEnter={() => setIsSelectionMode(true)}
            onMouseLeave={() => setIsSelectionMode(false)}
          >
            <div className="p-2 space-y-1">
              {tabs.map((tab) => (
                <div key={tab.id} className="relative">
                  <button
                    data-tab-id={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setTooltipTab(null);
                    }}
                    onMouseEnter={() => {
                      setTooltipTab(tab.id);
                      setHoveredTab(tab.id);
                    }}
                    onMouseLeave={() => {
                      setTooltipTab(null);
                      setHoveredTab(null);
                    }}
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
                    
                    {/* Custom circular checkbox with checkmark - shows on hover or when selected */}
                    {(hoveredTab === tab.id || selectedCards.includes(tab.id)) && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCardSelection(tab.id);
                        }}
                        className={`w-5 h-5 rounded-full border-2 cursor-pointer flex-shrink-0 flex items-center justify-center transition-all ${
                          selectedCards.includes(tab.id)
                            ? activeTab === tab.id 
                              ? "bg-white border-white" 
                              : "bg-[#278f8c] border-[#278f8c]"
                            : activeTab === tab.id 
                              ? "border-white" 
                              : "border-gray-400"
                        } animate-in fade-in zoom-in duration-200`}
                      >
                        {selectedCards.includes(tab.id) && (
                          <svg 
                            className="w-3 h-3" 
                            viewBox="0 0 12 12" 
                            fill="none"
                            style={{ 
                              stroke: activeTab === tab.id ? "#278f8c" : "#ffffff"
                            }}
                          >
                            <path 
                              d="M2 6L4.5 8.5L10 3" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    )}
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
              <EditModeProvider isEditMode={isEditMode}>
                {renderCardContent()}
              </EditModeProvider>
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
