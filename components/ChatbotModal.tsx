"use client";

import { useEffect } from "react";
import ConversationalChatbot from "./ConversationalChatbot";
import { Sparkles } from "lucide-react";

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  shouldClearData?: boolean;
}

export default function ChatbotModal({ isOpen, onClose }: ChatbotModalProps) {
  // Prevent body scroll and hide navbar when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      document.body.classList.add("modal-open");

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.classList.remove("modal-open");
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col"
        style={{ height: "85vh", maxHeight: "700px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ backgroundColor: "#f5f5f5" }}
        >
          <div className="flex items-center space-x-3">
            <Sparkles
              className="w-5 h-5 flex-shrink-0"
              style={{ color: "#278f8c" }}
            />
            <div>
              <h2
                className="text-lg font-bold leading-tight"
                style={{ color: "#102a63" }}
              >
                Complete Your Hiring Strategy
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Paste a job URL below or build from scratch with our AI chatbot
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
              style={{ color: "#102a63" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Chatbot */}
        <div className="flex-1 overflow-y-auto">
          <ConversationalChatbot />
        </div>
      </div>
    </div>
  );
}
