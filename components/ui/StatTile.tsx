"use client";

import React from "react";

export function StatTile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="bg-white/80 border border-gray-200 rounded-xl p-4 text-center shadow-sm">
      <div className="text-2xl font-bold" style={{ color: "#278f8c" }}>{value}</div>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}
