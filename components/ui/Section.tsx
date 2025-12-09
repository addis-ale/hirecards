"use client";

import React, { useState } from "react";
import { LucideIcon, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardContent } from "./card";

type Tone = "default" | "success" | "danger" | "warning" | "info" | "purple";

const toneConfig: Record<Tone, { accent: string; titleClass: string; headerBg: string }> = {
  default: { accent: "#278f8c", titleClass: "text-[#102a63]", headerBg: "rgba(39,143,140,0.05)" },
  success: { accent: "#16a34a", titleClass: "text-emerald-800", headerBg: "rgba(22,163,74,0.06)" },
  danger: { accent: "#dc2626", titleClass: "text-red-800", headerBg: "rgba(220,38,38,0.06)" },
  warning: { accent: "#d97706", titleClass: "text-amber-800", headerBg: "rgba(217,119,6,0.08)" },
  info: { accent: "#2563eb", titleClass: "text-blue-800", headerBg: "rgba(37,99,235,0.06)" },
  purple: { accent: "#7c3aed", titleClass: "text-purple-800", headerBg: "rgba(124,58,237,0.06)" },
};

export function Section({
  title,
  subtitle,
  Icon,
  children,
  accent,
  density = "normal",
  tone = "default",
  collapsible = true,
  defaultExpanded = false,
}: {
  title?: string;
  subtitle?: string;
  Icon?: LucideIcon;
  children: React.ReactNode;
  accent?: string;
  density?: "normal" | "compact";
  tone?: Tone;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const headerPad = density === "compact" ? "p-3" : "p-4";
  const bodyPad = density === "compact" ? "p-3" : "p-4 md:p-5";
  const iconSize = density === "compact" ? "w-9 h-9" : "w-10 h-10";
  const titleSize = density === "compact" ? "text-base md:text-lg" : "text-lg md:text-xl";

  const cfg = toneConfig[tone];
  const resolvedAccent = accent ?? cfg.accent;

  // If no title and no icon, don't show header
  const showHeader = title || Icon || subtitle;

  const toggleExpanded = () => {
    if (collapsible) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <Card className={`${collapsible && !isExpanded ? '' : ''}`}>
      {showHeader && (
        <CardHeader
          className={`${headerPad} ${isExpanded || !collapsible ? 'border-b border-gray-100 pb-3' : 'pb-3'} ${
            collapsible ? "cursor-pointer hover:bg-gray-50/50 transition-colors" : ""
          }`}
          style={{ background: `linear-gradient(180deg, ${cfg.headerBg} 0%, rgba(255,255,255,0) 100%)` }}
          onClick={toggleExpanded}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              {Icon && (
                <div
                  className={`${iconSize} rounded-lg flex items-center justify-center flex-shrink-0`}
                  style={{ background: `linear-gradient(135deg, ${resolvedAccent} 0%, #1a6764 100%)` }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
              )}
              {(title || subtitle) && (
                <div className="flex-1 min-w-0">
                  {title && (
                    <h3 className={`${titleSize} font-bold ${cfg.titleClass}`}>{title}</h3>
                  )}
                  {subtitle && (
                    <p className="text-[12px] md:text-sm text-gray-600 mt-0.5 leading-snug">{subtitle}</p>
                  )}
                </div>
              )}
            </div>
            {collapsible && (
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0"
              >
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </motion.div>
            )}
          </div>
        </CardHeader>
      )}
      <AnimatePresence>
        {(!collapsible || isExpanded) && (
          <motion.div
            initial={collapsible ? { height: 0, opacity: 0 } : false}
            animate={collapsible ? { height: "auto", opacity: 1 } : false}
            exit={collapsible ? { height: 0, opacity: 0 } : undefined}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={collapsible ? "overflow-hidden" : ""}
          >
            <CardContent className={bodyPad}>{children}</CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
