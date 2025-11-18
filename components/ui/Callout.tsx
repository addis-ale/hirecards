"use client";

import React from "react";
import { AlertTriangle, Info, CheckCircle2, AlertCircle } from "lucide-react";

type Tone = "info" | "success" | "warning" | "danger" | "neutral";

const toneStyles: Record<Tone, { container: string; title: string; Icon: any }> = {
  info: {
    container: "bg-blue-50 border border-blue-200",
    title: "text-blue-800",
    Icon: Info,
  },
  success: {
    container: "bg-green-50 border border-green-200",
    title: "text-green-800",
    Icon: CheckCircle2,
  },
  warning: {
    container: "bg-yellow-50 border border-yellow-200",
    title: "text-yellow-800",
    Icon: AlertCircle,
  },
  danger: {
    container: "bg-red-50 border border-red-200",
    title: "text-red-800",
    Icon: AlertTriangle,
  },
  neutral: {
    container: "bg-gray-50 border border-gray-200",
    title: "text-gray-800",
    Icon: Info,
  },
};

export function Callout({
  tone = "info",
  title,
  children,
  compact = true,
}: {
  tone?: Tone;
  title: string;
  children: React.ReactNode;
  compact?: boolean;
}) {
  const { container, title: titleCls, Icon } = toneStyles[tone];
  return (
    <div className={`rounded-xl ${compact ? "p-3" : "p-4"} ${container}`}>
      <div className="flex items-start gap-2.5">
        <div className="flex-shrink-0 mt-0.5">
          <Icon className={`w-4 h-4 ${titleCls}`} />
        </div>
        <div className="space-y-0.5">
          <h4 className={`text-[13px] font-semibold ${titleCls}`}>{title}</h4>
          <div className="text-[13px] text-gray-700 leading-snug">{children}</div>
        </div>
      </div>
    </div>
  );
}
