"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

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
}: {
  title: string;
  subtitle?: string;
  Icon?: LucideIcon;
  children: React.ReactNode;
  accent?: string;
  density?: "normal" | "compact";
  tone?: Tone;
}) {
  const headerPad = density === "compact" ? "p-4" : "p-5";
  const bodyPad = density === "compact" ? "p-4" : "p-5 md:p-6";
  const iconSize = density === "compact" ? "w-9 h-9" : "w-10 h-10";
  const titleSize = density === "compact" ? "text-base md:text-lg" : "text-lg md:text-xl";

  const cfg = toneConfig[tone];
  const resolvedAccent = accent ?? cfg.accent;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white/80 shadow-sm">
      <div
        className={`flex items-center gap-3 ${headerPad} border-b border-gray-100`}
        style={{ background: `linear-gradient(180deg, ${cfg.headerBg} 0%, rgba(255,255,255,0) 100%)` }}
      >
        {Icon && (
          <div
            className={`${iconSize} rounded-lg flex items-center justify-center`}
            style={{ background: `linear-gradient(135deg, ${resolvedAccent} 0%, #1a6764 100%)` }}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
        )}
        <div>
          <h3 className={`${titleSize} font-bold ${cfg.titleClass}`}>{title}</h3>
          {subtitle && (
            <p className="text-[12px] md:text-sm text-gray-600 mt-0.5 leading-snug">{subtitle}</p>
          )}
        </div>
      </div>
      <div className={bodyPad}>{children}</div>
    </div>
  );
}
