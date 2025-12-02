"use client";

import React from "react";
import { RealityCard } from "./RealityCard";

interface OverviewCardProps {
  isSubscribed?: boolean;
}

export const OverviewCard: React.FC<OverviewCardProps> = ({ isSubscribed = false }) => {
  // Overview and Reality cards are now merged into Reality Card
  return <RealityCard />;
};
