"use client";

import React, { useEffect, useState } from "react";
import { X, LucideIcon, Edit2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { EditModeProvider } from "@/components/EditModeContext";

interface SectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  Icon?: LucideIcon;
  children: React.ReactNode;
  tone?: "default" | "success" | "danger" | "warning" | "info" | "purple";
  allowEdit?: boolean; // New prop to enable editing
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
  allowEdit = false,
}: SectionModalProps) {
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    } else {
      // Reset edit mode when modal closes
      setIsEditMode(false);
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
            <div className="flex items-center gap-2">
              {allowEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditMode(!isEditMode);
                  }}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    isEditMode
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  title={isEditMode ? "Save changes" : "Edit content"}
                >
                  {isEditMode ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-medium">Done</span>
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Edit</span>
                    </>
                  )}
                </button>
              )}
              <button
                onClick={onClose}
                className="flex-shrink-0 p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <EditModeProvider isEditMode={isEditMode}>
              {children}
            </EditModeProvider>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

