"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

export function Section({
  title,
  subtitle,
  Icon,
  children,
  accent = "#278f8c",
  density = "normal",
}: {
  title: string;
  subtitle?: string;
  Icon?: LucideIcon;
  children: React.ReactNode;
  accent?: string;
  density?: "normal" | "compact";
}) {
  const headerPad = density === "compact" ? "p-4" : "p-5";
  const bodyPad = density === "compact" ? "p-4" : "p-5 md:p-6";
  const iconSize = density === "compact" ? "w-9 h-9" : "w-10 h-10";
  const titleSize = density === "compact" ? "text-base md:text-lg" : "text-lg md:text-xl";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white/80 shadow-sm">
      <div className={`flex items-center gap-3 ${headerPad} border-b border-gray-100`} style={{ background: "linear-gradient(180deg, rgba(39,143,140,0.05) 0%, rgba(255,255,255,0) 100%)" }}>
        {Icon && (
          <div className={`${iconSize} rounded-lg flex items-center justify-center`} style={{ background: `linear-gradient(135deg, ${accent} 0%, #1a6764 100%)` }}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        )}
        <div>
          <h3 className={`${titleSize} font-bold`} style={{ color: "#102a63" }}>{title}</h3>
          {subtitle && (
            <p className="text-[12px] md:text-sm text-gray-600 mt-0.5 leading-snug">{subtitle}</p>
          )}
        </div>
      </div>
      <div className={bodyPad}>{children}</div>
    </div>
  );
}
