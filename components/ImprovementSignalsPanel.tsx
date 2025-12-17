"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Lightbulb, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Target,
  DollarSign,
  Clock,
  Users,
  MapPin,
  MessageSquare
} from "lucide-react";
import { ImprovementChatbot } from "./ImprovementChatbot";
import { calculateRealityScore } from "@/components/RealityScoreCalculator";
import { useAcceptedFixes } from "@/contexts/AcceptedFixesContext";

interface ImprovementSignalsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentScore: number;
  cardData?: {
    feasibilityScore?: string;
    helpsCase?: string[];
    hurtsCase?: string[];
    keyInsights?: string[];
    [key: string]: any;
  };
  onApplySuggestion?: (signalId: string, targetTab?: string, scoreIncrease?: number) => void;
  onNavigateToTab?: (tabId: string) => void;
}

interface ImprovementSignal {
  id: string;
  type: "improvement" | "warning" | "success" | "info";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  category: "compensation" | "timeline" | "location" | "skills" | "process" | "other";
  action?: string;
  estimatedScoreIncrease?: number;
  targetTab?: string; // Tab ID to navigate to when clicked
  // Additional data for chatbot
  cardId?: string;
  cardName?: string;
  talentPoolImpact?: string;
  riskReduction?: string;
  cardContent?: any; // Full card content for chatbot context
}

// Card storage keys mapping (constant, defined outside component)
const cardStorageKeys: Record<string, string> = {
  reality: "editableRealityCard",
  role: "editableRoleCard",
  skill: "editableSkillCard",
  market: "editableMarketCard",
  talentmap: "editableTalentMapCard",
  pay: "editablePayCard",
  funnel: "editableFunnelCard",
  fit: "editableFitCard",
  message: "editableMessageCard",
  outreach: "editableOutreachCard",
  interview: "editableInterviewCard",
  scorecard: "editableScorecardCard",
  plan: "editablePlanCard",
};

// Card name mapping for display (constant, defined outside component)
const cardNames: Record<string, string> = {
  reality: "Reality",
  role: "Role",
  skill: "Skills",
  market: "Market",
  talentmap: "Talent Map",
  pay: "Pay",
  funnel: "Funnel",
  fit: "Fit",
  message: "Message",
  outreach: "Outreach",
  interview: "Interview",
  scorecard: "Scorecard",
  plan: "Plan",
};

export const ImprovementSignalsPanel: React.FC<ImprovementSignalsPanelProps> = ({
  isOpen,
  onClose,
  currentScore,
  cardData = {},
  onApplySuggestion,
  onNavigateToTab,
}) => {
  const [signals, setSignals] = useState<ImprovementSignal[]>([]);
  const [selectedSignal, setSelectedSignal] = useState<ImprovementSignal | null>(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const [acceptedSignals, setAcceptedSignals] = useState<Set<string>>(new Set());
  const [realityCardData, setRealityCardData] = useState<any>(null);
  const { getTotalImpact } = useAcceptedFixes();

  // Load Reality Card data and calculate score
  useEffect(() => {
    const loadRealityCardData = () => {
      try {
        const saved = sessionStorage.getItem("editableRealityCard");
        if (saved) {
          const data = JSON.parse(saved);
          setRealityCardData(data);
        }
      } catch (e) {
        console.error("Failed to load reality card data:", e);
      }
    };

    loadRealityCardData();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadRealityCardData();
    };

    window.addEventListener("storage", handleStorageChange);
    // Also poll for changes
    const interval = setInterval(loadRealityCardData, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Calculate the Reality Card score the same way as RealityCardBanner
  const calculatedRealityScore = useMemo(() => {
    if (!realityCardData) return currentScore; // Fallback to prop if no data
    
    const baseScore = calculateRealityScore({
      feasibilityScore: realityCardData.feasibilityScore || "5.5/10",
      helpsCase: realityCardData.helpsCase || [],
      hurtsCase: realityCardData.hurtsCase || [],
      keyInsights: realityCardData.keyInsights || [],
      realityCheck1: realityCardData.realityCheck1 || "",
      realityCheck2: realityCardData.realityCheck2 || "",
      hiddenBottleneck: realityCardData.hiddenBottleneck || "",
      timelineToFailure: realityCardData.timelineToFailure || "",
      bottomLine1: realityCardData.bottomLine1 || "",
      bottomLine2: realityCardData.bottomLine2 || "",
    });
    // Add accepted improvements boost from all cards (capped at 9.9)
    const totalAcceptedImpact = getTotalImpact();
    return Math.min(9.9, baseScore + totalAcceptedImpact);
  }, [realityCardData, getTotalImpact, currentScore]);

  // Function to load and generate signals from all cards
  const loadSignalsFromCards = useCallback(() => {
    const generatedSignals: ImprovementSignal[] = [];

    // Load Fix Me Now data from all cards
    Object.entries(cardStorageKeys).forEach(([cardId, storageKey]) => {
      try {
        const saved = sessionStorage.getItem(storageKey);
        if (saved) {
          const cardData = JSON.parse(saved);
          const scoreImpactRows = cardData.scoreImpactRows || [];

          // Convert each Fix Me Now suggestion to an improvement signal
          scoreImpactRows.forEach((row: any, index: number) => {
            // Parse impact string (e.g., "+0.2" -> 0.2)
            const impactMatch = row.impact?.match(/[+-]?(\d+\.?\d*)/);
            const impactValue = impactMatch ? parseFloat(impactMatch[1]) : 0;

            // Determine impact level
            let impactLevel: "high" | "medium" | "low" = "medium";
            if (impactValue >= 0.3) impactLevel = "high";
            else if (impactValue < 0.2) impactLevel = "low";

            // Determine category based on fix text
            let category: "compensation" | "timeline" | "location" | "skills" | "process" | "other" = "other";
            const fixLower = row.fix?.toLowerCase() || "";
            if (fixLower.includes("comp") || fixLower.includes("salary") || fixLower.includes("pay")) {
              category = "compensation";
            } else if (fixLower.includes("timeline") || fixLower.includes("speed") || fixLower.includes("fast")) {
              category = "timeline";
            } else if (fixLower.includes("location") || fixLower.includes("remote")) {
              category = "location";
            } else if (fixLower.includes("skill") || fixLower.includes("ability")) {
              category = "skills";
            } else if (fixLower.includes("process") || fixLower.includes("interview") || fixLower.includes("loop")) {
              category = "process";
            }

            generatedSignals.push({
              id: `${cardId}-${index}-${row.fix?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || index}`,
              type: "improvement",
              title: row.fix || "Improve this area",
              description: row.tooltip || row.fix || "This improvement can help boost your feasibility score.",
              impact: impactLevel,
              category: category,
              action: `Check Fix Me Now in ${cardNames[cardId]} Card`,
              estimatedScoreIncrease: impactValue,
              targetTab: cardId,
              // Store additional data for chatbot
              cardId: cardId,
              cardName: cardNames[cardId],
              talentPoolImpact: row.talentPoolImpact,
              riskReduction: row.riskReduction,
              cardContent: cardData, // Store full card content for chatbot
            });
          });
        }
      } catch (e) {
        console.error(`Failed to load ${cardId} card data:`, e);
      }
    });

    // Sort by impact (high impact first, then by score increase)
    generatedSignals.sort((a, b) => {
      const impactOrder = { high: 3, medium: 2, low: 1 };
      const impactDiff = (impactOrder[b.impact] || 0) - (impactOrder[a.impact] || 0);
      if (impactDiff !== 0) return impactDiff;
      return (b.estimatedScoreIncrease || 0) - (a.estimatedScoreIncrease || 0);
    });

    setSignals(generatedSignals);
  }, []); // Empty deps: cardStorageKeys and cardNames are constants defined outside component

  useEffect(() => {
    // Load signals on mount and when cardData/currentScore changes
    loadSignalsFromCards();

    // Listen for storage changes to update signals when cards are edited
    const handleStorageChange = () => {
      loadSignalsFromCards();
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Also poll for changes (since storage event only fires in other tabs)
    const interval = setInterval(loadSignalsFromCards, 2000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [cardData, currentScore, loadSignalsFromCards]);

  const getIcon = (type: string, category: string) => {
    if (type === "success") return <CheckCircle2 className="w-5 h-5" />;
    if (type === "warning") return <AlertCircle className="w-5 h-5" />;
    
    switch (category) {
      case "compensation": return <DollarSign className="w-5 h-5" />;
      case "timeline": return <Clock className="w-5 h-5" />;
      case "location": return <MapPin className="w-5 h-5" />;
      case "skills": return <Users className="w-5 h-5" />;
      default: return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getColorClasses = (type: string, impact: string) => {
    const baseColors = {
      improvement: "bg-blue-50 border-blue-200 text-blue-900",
      warning: "bg-yellow-50 border-yellow-200 text-yellow-900",
      success: "bg-green-50 border-green-200 text-green-900",
      info: "bg-purple-50 border-purple-200 text-purple-900",
    };

    const impactColors = {
      high: "border-l-4",
      medium: "border-l-2",
      low: "border-l",
    };

    return `${baseColors[type as keyof typeof baseColors]} ${impactColors[impact as keyof typeof impactColors]}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment key="improvement-panel">
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40"
          />
          
          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#278f8c] to-[#1a6764] text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Improvement Signals</h2>
                    <p className="text-sm opacity-90">Boost your feasibility score</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Current Score Display */}
              <div className="flex items-center gap-4 mt-4 relative">
                <div className="flex-1 bg-white/10 rounded-lg p-3">
                  <div className="text-xs opacity-90 mb-1">Current Score</div>
                  <motion.div 
                    key={calculatedRealityScore}
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                    className="text-2xl font-bold"
                  >
                    {calculatedRealityScore.toFixed(1)}/10
                  </motion.div>
                </div>
                <div className="flex-1 bg-white/10 rounded-lg p-3">
                  <div className="text-xs opacity-90 mb-1">Potential</div>
                  <div className="text-2xl font-bold">
                    9.9/10
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {signals.filter(s => !acceptedSignals.has(s.id)).length === 0 ? (
                <div className="text-center py-12">
                  <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  {signals.length === 0 ? (
                    <>
                      <p className="text-gray-600">No improvement signals available yet.</p>
                      <p className="text-sm text-gray-500 mt-2">Edit your cards to see suggestions.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-600 font-semibold">All improvements accepted! 🎉</p>
                      <p className="text-sm text-gray-500 mt-2">Great job! Your score should improve as you implement these changes.</p>
                    </>
                  )}
                </div>
              ) : (
                signals
                  .filter(s => !acceptedSignals.has(s.id))
                  .map((signal) => (
                  <motion.div
                    key={signal.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg border ${getColorClasses(signal.type, signal.impact)} hover:shadow-lg transition-all cursor-pointer group`}
                    onClick={() => {
                      setSelectedSignal(signal);
                      setShowChatbot(true);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {getIcon(signal.type, signal.category)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-sm">{signal.title}</h3>
                          {signal.estimatedScoreIncrease && (
                            <div className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">
                              <TrendingUp className="w-3 h-3" />
                              +{signal.estimatedScoreIncrease.toFixed(1)}
                            </div>
                          )}
                        </div>
                        <p className="text-xs mb-3 opacity-90 leading-relaxed">
                          {signal.description}
                        </p>
                        {signal.action && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSignal(signal);
                              setShowChatbot(true);
                            }}
                            className="flex items-center gap-2 text-xs font-semibold hover:opacity-90 transition-all cursor-pointer group/btn mt-2 px-3 py-1.5 rounded-md bg-white/50 hover:bg-white/80 border border-current/20"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span className="group-hover/btn:underline">{signal.action}</span>
                            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                          </button>
                        )}
                        <div className="mt-2 flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            signal.impact === "high" 
                              ? "bg-red-100 text-red-700" 
                              : signal.impact === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}>
                            {signal.impact.toUpperCase()} IMPACT
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-xs text-gray-600 text-center">
                <p className="mb-2">💡 <strong>Tip:</strong> Click any suggestion to chat with our AI assistant about implementing it.</p>
                <p>Score updates automatically as you edit your cards.</p>
              </div>
            </div>
          </motion.div>
        </React.Fragment>
      )}

      {/* Improvement Chatbot */}
      {showChatbot && (
        <ImprovementChatbot
          key="improvement-chatbot"
          isOpen={showChatbot}
          onClose={() => {
            setShowChatbot(false);
            setSelectedSignal(null);
          }}
          signal={selectedSignal}
          onAcceptChanges={(signalId, targetTab) => {
            // Mark signal as accepted in UI (for panel state only)
            // Note: The actual fix acceptance and toast notification is handled by acceptFix in the chatbot
            setAcceptedSignals(prev => new Set([...prev, signalId]));
            // Don't call onApplySuggestion here to avoid duplicate toast
            // The chatbot's acceptFix already handles the score change and triggers the toast
            // Close chatbot but keep panel open
            setShowChatbot(false);
            setSelectedSignal(null);
          }}
          onNavigateToTab={onNavigateToTab}
        />
      )}
    </AnimatePresence>
  );
};

