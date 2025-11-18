"use client";

import React from "react";

export function Pill({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "green" | "blue" | "orange" | "purple" }) {
  const map: any = {
    default: "bg-white border-gray-200 text-gray-700",
    green: "bg-green-50 border-green-200 text-green-800",
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    orange: "bg-orange-50 border-orange-200 text-orange-800",
    purple: "bg-purple-50 border-purple-200 text-purple-800",
  };
  return (
    <span className={`text-[11px] px-2.5 py-0.5 border rounded-full ${map[tone]}`}>{children}</span>
  );
}
