"use client";

import React, { useEffect } from "react";
import { X, LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  Icon?: LucideIcon;
  children: React.ReactNode;
  tone?: "default" | "success" | "danger" | "warning" | "info" | "purple";
}

const toneConfig: Record<string, { accent: string; titleClass: string }> = {
  default: { accent: "#278f8c", titleClass: "text-[#102a63]" },
  success: { accent: "#16a34a", titleClass: "text-emerald-800" },
  danger: { accent: "#dc2626", titleClass: "text-red-800" },
  warning: { accent: "#d97706", titleClass: "text-amber-800" },
  info: { accent: "#2563eb", titleClass: "text-blue-800" },
  purple: { accent: "#7c3aed", titleClass: "text-purple-800" },
};

export function SectionModal({
  isOpen,
  onClose,
  title,
  subtitle,
  Icon,
  children,
  tone = "default",
}: SectionModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const cfg = toneConfig[tone] || toneConfig.default;
  const resolvedAccent = cfg.accent;

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
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3 flex-1">
              {Icon && (
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${resolvedAccent} 0%, #1a6764 100%)` }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className={`text-xl font-bold ${cfg.titleClass}`}>{title}</h3>
                {subtitle && (
                  <p className="text-sm text-gray-600 mt-0.5">{subtitle}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

