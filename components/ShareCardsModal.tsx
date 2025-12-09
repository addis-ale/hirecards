"use client";

import React, { useState, useEffect } from "react";
import { X, Share2, Check, Copy, Mail, Twitter, Linkedin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { allCards } from "@/lib/cardCategories";

interface ShareCardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareCardsModal: React.FC<ShareCardsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [jobTitle, setJobTitle] = useState<string>("Senior Analytics Engineer");

  // Load job title from sessionStorage
  useEffect(() => {
    if (isOpen) {
      const formData = sessionStorage.getItem("formData") || sessionStorage.getItem("heroAnalysisData");
      if (formData) {
        try {
          const parsed = JSON.parse(formData);
          if (parsed.roleTitle) {
            setJobTitle(parsed.roleTitle);
          }
        } catch (e) {
          console.error("Failed to parse form data:", e);
        }
      }
    }
  }, [isOpen]);

  const toggleCard = (cardId: string) => {
    setSelectedCards((prev) =>
      prev.includes(cardId)
        ? prev.filter((id) => id !== cardId)
        : [...prev, cardId]
    );
  };

  const selectAll = () => {
    if (selectedCards.length === allCards.length) {
      setSelectedCards([]);
    } else {
      setSelectedCards(allCards.map((card) => card.id));
    }
  };

  const getShareUrl = () => {
    if (selectedCards.length === 0) return "";
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const cardsParam = selectedCards.join(",");
    const titleParam = encodeURIComponent(jobTitle);
    return `${baseUrl}/shared-card-preview?cards=${cardsParam}&title=${titleParam}`;
  };

  const handleCopyLink = async () => {
    const url = getShareUrl();
    if (!url) return;
    
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShareEmail = () => {
    const url = getShareUrl();
    if (!url) return;
    
    const subject = encodeURIComponent(`Hiring Strategy: ${jobTitle}`);
    const body = encodeURIComponent(
      `I wanted to share these hiring strategy cards with you:\n\n${url}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleShareTwitter = () => {
    const url = getShareUrl();
    if (!url) return;
    
    const text = encodeURIComponent(`Check out this hiring strategy for ${jobTitle}`);
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}`,
      "_blank"
    );
  };

  const handleShareLinkedIn = () => {
    const url = getShareUrl();
    if (!url) return;
    
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const handleNativeShare = async () => {
    const url = getShareUrl();
    if (!url) return;
    
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `Hiring Strategy: ${jobTitle}`,
          text: `Check out these hiring strategy cards`,
          url: url,
        });
      } catch (err) {
        // User cancelled or error occurred
        console.error("Share failed:", err);
      }
    } else {
      // Fallback to copy if native share not available
      handleCopyLink();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#278f8c] to-[#1a6764] flex items-center justify-center">
                <Share2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Share Cards</h3>
                <p className="text-sm text-gray-600">
                  Select the cards you want to share
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Job Title Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#278f8c] focus:border-transparent"
                placeholder="Enter job title"
              />
            </div>

            {/* Select All Button */}
            <div className="mb-4">
              <button
                onClick={selectAll}
                className="text-sm font-medium text-[#278f8c] hover:text-[#1a6764] transition-colors"
              >
                {selectedCards.length === allCards.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
              <span className="text-sm text-gray-600 ml-2">
                ({selectedCards.length} of {allCards.length} selected)
              </span>
            </div>

            {/* Cards List */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {allCards.map((card) => {
                const isSelected = selectedCards.includes(card.id);
                const Icon = card.icon;

                return (
                  <motion.button
                    key={card.id}
                    onClick={() => toggleCard(card.id)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`
                      w-full p-4 rounded-lg border-2 transition-all text-left
                      ${
                        isSelected
                          ? "border-[#278f8c] bg-[#d7f4f2]"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`
                          w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                          ${isSelected ? card.gradient : "bg-gray-100"}
                        `}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            isSelected ? "text-white" : "text-gray-600"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4
                            className={`font-bold text-sm ${
                              isSelected ? "text-gray-900" : "text-gray-700"
                            }`}
                          >
                            {card.label}
                          </h4>
                          <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                            {card.impact}
                          </span>
                        </div>
                        <p
                          className={`text-xs mt-1 line-clamp-1 ${
                            isSelected ? "text-gray-700" : "text-gray-500"
                          }`}
                        >
                          {card.teaser}
                        </p>
                      </div>
                      <div
                        className={`
                          w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                          ${
                            isSelected
                              ? "border-[#278f8c] bg-[#278f8c]"
                              : "border-gray-300"
                          }
                        `}
                      >
                        {isSelected && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Footer with Share Actions */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            {selectedCards.length === 0 ? (
              <p className="text-sm text-gray-500 text-center">
                Select at least one card to share
              </p>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{selectedCards.length}</span> card
                  {selectedCards.length !== 1 ? "s" : ""} selected
                </div>
                <div className="flex items-center gap-2">
                  {/* Native Share (if available) */}
                  {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
                    <button
                      onClick={handleNativeShare}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  )}

                  {/* Copy Link */}
                  <button
                    onClick={handleCopyLink}
                    className={`
                      px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium
                      ${
                        copied
                          ? "bg-emerald-600 text-white"
                          : "bg-[#278f8c] text-white hover:bg-[#1a6764]"
                      }
                    `}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Link
                      </>
                    )}
                  </button>

                  {/* Email */}
                  <button
                    onClick={handleShareEmail}
                    className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    title="Share via Email"
                  >
                    <Mail className="w-4 h-4" />
                  </button>

                  {/* Twitter */}
                  <button
                    onClick={handleShareTwitter}
                    className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    title="Share on Twitter"
                  >
                    <Twitter className="w-4 h-4" />
                  </button>

                  {/* LinkedIn */}
                  <button
                    onClick={handleShareLinkedIn}
                    className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    title="Share on LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

