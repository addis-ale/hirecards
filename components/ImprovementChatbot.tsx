"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Send, 
  Bot, 
  User, 
  CheckCircle2, 
  XCircle,
  Sparkles,
  Loader2
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "bot" | "user";
  content: string;
  timestamp: Date;
  suggestion?: {
    title: string;
    description: string;
    estimatedScoreIncrease: number;
    targetTab?: string;
    changes?: Record<string, any>;
  };
}

interface ImprovementChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  signal: {
    id: string;
    title: string;
    description: string;
    impact: "high" | "medium" | "low";
    category: string;
    action?: string;
    estimatedScoreIncrease?: number;
    targetTab?: string;
  } | null;
  onAcceptChanges?: (signalId: string, targetTab?: string) => void;
  onNavigateToTab?: (tabId: string) => void;
}

export const ImprovementChatbot: React.FC<ImprovementChatbotProps> = ({
  isOpen,
  onClose,
  signal,
  onAcceptChanges,
  onNavigateToTab,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Initialize conversation when signal changes
  useEffect(() => {
    if (isOpen && signal) {
      setMessages([]);
      setIsTyping(true);
      
      // Simulate bot typing delay
      setTimeout(() => {
        const welcomeMessage: ChatMessage = {
          id: "1",
          role: "bot",
          content: `Hi! I noticed you want to improve your feasibility score. Let me help you with "${signal.title}".`,
          timestamp: new Date(),
        };
        
        setMessages([welcomeMessage]);
        setIsTyping(false);
        
        // Add suggestion message after a short delay
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            const suggestionMessage: ChatMessage = {
              id: "2",
              role: "bot",
              content: `Here's what I recommend:\n\n**${signal.title}**\n\n${signal.description}\n\nThis could improve your score by **+${signal.estimatedScoreIncrease?.toFixed(1) || 0}** points.`,
              timestamp: new Date(),
              suggestion: {
                title: signal.title,
                description: signal.description,
                estimatedScoreIncrease: signal.estimatedScoreIncrease || 0,
                targetTab: signal.targetTab,
              },
            };
            
            setMessages((prev) => [...prev, suggestionMessage]);
            setIsTyping(false);
            
            // Add action message
            if (signal.action) {
              setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => {
                  const actionMessage: ChatMessage = {
                    id: "3",
                    role: "bot",
                    content: `Would you like me to take you to ${signal.action?.toLowerCase() || "the relevant section"} so you can make this change?`,
                    timestamp: new Date(),
                  };
                  setMessages((prev) => [...prev, actionMessage]);
                  setIsTyping(false);
                }, 1000);
              }, 1500);
            }
          }, 1000);
        }, 2000);
      }, 500);
    }
  }, [isOpen, signal]);

  const handleAccept = () => {
    if (signal) {
      const acceptMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: "Yes, let's do it!",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, acceptMessage]);
      setIsTyping(true);
      
      setTimeout(() => {
        const botResponse: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: "bot",
          content: "Perfect! I've noted this improvement. You can review the remaining suggestions in the panel.",
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, botResponse]);
        setIsTyping(false);
        
        // Close chatbot and notify parent after a short delay
        setTimeout(() => {
          onAcceptChanges?.(signal.id, signal.targetTab);
          onClose();
        }, 1500);
      }, 800);
    }
  };

  const handleReject = () => {
    if (signal) {
      const rejectMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: "Not right now, thanks.",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, rejectMessage]);
      setIsTyping(true);
      
      setTimeout(() => {
        const botResponse: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: "bot",
          content: "No problem! You can always come back to this suggestion later. Is there anything else I can help you with?",
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, botResponse]);
        setIsTyping(false);
      }, 800);
    }
  };

  if (!signal) return null;

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
            className="fixed inset-0 bg-black/30 z-50"
          />
          
          {/* Chatbot Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border-2 border-[#278f8c]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#278f8c] to-[#1a6764] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold">Improvement Assistant</h3>
                  <p className="text-xs opacity-90">Helping you boost your score</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Container */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
            >
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "bot" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#278f8c] to-[#1a6764] flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div className={`max-w-[75%] ${message.role === "user" ? "order-2" : ""}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-[#278f8c] text-white"
                          : "bg-white text-gray-800 shadow-sm border border-gray-200"
                      }`}
                    >
                      {message.suggestion ? (
                        <div className="space-y-3">
                          <div className="font-bold text-sm mb-2">{message.suggestion.title}</div>
                          <div className="text-sm whitespace-pre-line">{message.content.split("\n\n")[1]}</div>
                          <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                            <Sparkles className="w-4 h-4 text-[#278f8c]" />
                            <span className="text-xs font-semibold text-[#278f8c]">
                              +{message.suggestion.estimatedScoreIncrease.toFixed(1)} score boost
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm whitespace-pre-line">{message.content}</div>
                      )}
                    </div>
                    
                    {message.suggestion && (
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={handleAccept}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Accept
                        </button>
                        <button
                          onClick={handleReject}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#278f8c] to-[#1a6764] flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

