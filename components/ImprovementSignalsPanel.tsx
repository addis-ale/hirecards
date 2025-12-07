"use client";

import React, { useState, useEffect } from "react";
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
}

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

  useEffect(() => {
    // Generate improvement signals based on card data
    const generatedSignals: ImprovementSignal[] = [];

    // Safety check: ensure cardData exists
    if (!cardData) {
      setSignals([]);
      return;
    }

    // Analyze hurtsCase for improvement opportunities
    const hurtsCase = cardData.hurtsCase || [];
    hurtsCase.forEach((hurt, index) => {
      if (hurt.toLowerCase().includes("salary") || hurt.toLowerCase().includes("comp")) {
        generatedSignals.push({
          id: `comp-${index}`,
          type: "improvement",
          title: "Increase Compensation Range",
          description: "Your current compensation is below market. Increasing by 10-15% could improve your score significantly.",
          impact: "high",
          category: "compensation",
          action: "Update salary range in Pay Card",
          estimatedScoreIncrease: 1.5,
          targetTab: "pay",
        });
      }
      if (hurt.toLowerCase().includes("slow") || hurt.toLowerCase().includes("timeline")) {
        generatedSignals.push({
          id: `timeline-${index}`,
          type: "improvement",
          title: "Accelerate Hiring Timeline",
          description: "A faster hiring process (10-14 days) significantly improves your chances of landing top candidates.",
          impact: "high",
          category: "timeline",
          action: "Set aggressive timeline in Role Card",
          estimatedScoreIncrease: 1.2,
          targetTab: "role",
        });
      }
      if (hurt.toLowerCase().includes("location") || hurt.toLowerCase().includes("remote")) {
        generatedSignals.push({
          id: `location-${index}`,
          type: "improvement",
          title: "Consider Remote or Hybrid",
          description: "Expanding location requirements can dramatically increase your talent pool and improve feasibility.",
          impact: "medium",
          category: "location",
          action: "Update work model in Role Card",
          estimatedScoreIncrease: 0.8,
          targetTab: "role",
        });
      }
    });

    // Analyze helpsCase for reinforcement
    const helpsCase = (cardData && cardData.helpsCase) || [];
    if (helpsCase.length > 0) {
      generatedSignals.push({
        id: "strengths",
        type: "success",
        title: "Leverage Your Strengths",
        description: `You have ${helpsCase.length} strong advantages. Make sure these are highlighted in your job postings and outreach.`,
        impact: "medium",
        category: "other",
        action: "Emphasize in Message Card",
        estimatedScoreIncrease: 0.5,
        targetTab: "message",
      });
    }

    // Add general improvement suggestions
    if (currentScore < 7) {
      generatedSignals.push({
        id: "general-1",
        type: "info",
        title: "Focus on High-Impact Changes",
        description: "Prioritize compensation and timeline improvements for maximum score impact.",
        impact: "high",
        category: "other",
      });
    }

    setSignals(generatedSignals);
  }, [cardData, currentScore]);

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
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40"
          />
          
          {/* Panel */}
          <motion.div
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
                    key={currentScore}
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                    className="text-2xl font-bold"
                  >
                    {currentScore.toFixed(1)}/10
                  </motion.div>
                </div>
                <div className="flex-1 bg-white/10 rounded-lg p-3">
                  <div className="text-xs opacity-90 mb-1">Potential</div>
                  <div className="text-2xl font-bold">
                    {(currentScore + signals
                      .filter(s => !acceptedSignals.has(s.id))
                      .reduce((sum, s) => sum + (s.estimatedScoreIncrease || 0), 0)).toFixed(1)}/10
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
        </>
      )}

      {/* Improvement Chatbot */}
      <ImprovementChatbot
        isOpen={showChatbot}
        onClose={() => {
          setShowChatbot(false);
          setSelectedSignal(null);
        }}
        signal={selectedSignal}
        onAcceptChanges={(signalId, targetTab) => {
          // Find the signal to get its score increase
          const signal = signals.find(s => s.id === signalId);
          const scoreIncrease = signal?.estimatedScoreIncrease || 0;
          
          // Mark signal as accepted
          setAcceptedSignals(prev => new Set([...prev, signalId]));
          // Notify parent with score increase
          onApplySuggestion?.(signalId, targetTab, scoreIncrease);
          // Close chatbot but keep panel open
          setShowChatbot(false);
          setSelectedSignal(null);
        }}
        onNavigateToTab={onNavigateToTab}
      />
    </AnimatePresence>
  );
};

