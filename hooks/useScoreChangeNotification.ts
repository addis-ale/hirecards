"use client";

import { useEffect, useRef } from "react";
import { useAcceptedFixes } from "@/contexts/AcceptedFixesContext";
import { useToast } from "@/components/Toast";
import { calculateRealityScore } from "@/components/RealityScoreCalculator";

// Default base score - can be overridden
const DEFAULT_BASE_SCORE = 5.5;

export function useScoreChangeNotification() {
  const { getTotalImpact } = useAcceptedFixes();
  const { showToast } = useToast();
  const previousTotalImpactRef = useRef<number>(0);
  const previousScoreRef = useRef<number | null>(null);
  const isInitialMount = useRef(true);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastToastMessageRef = useRef<string | null>(null);

  useEffect(() => {
    // Get base score from sessionStorage or use default
    const getBaseScore = (): number => {
      try {
        const realityCardData = sessionStorage.getItem("editableRealityCard");
        if (realityCardData) {
          const data = JSON.parse(realityCardData);
          // Try to calculate base score from card data
          if (data.helpsCase && data.hurtsCase) {
            const calculated = calculateRealityScore({
              feasibilityScore: data.feasibilityScore || "5.5/10",
              helpsCase: data.helpsCase || [],
              hurtsCase: data.hurtsCase || [],
              keyInsights: data.keyInsights || [],
              realityCheck1: data.realityCheck1 || "",
              realityCheck2: data.realityCheck2 || "",
              hiddenBottleneck: data.hiddenBottleneck || "",
              timelineToFailure: data.timelineToFailure || "",
              bottomLine1: data.bottomLine1 || "",
              bottomLine2: data.bottomLine2 || "",
            });
            return calculated;
          }
          // Fallback: try to parse from feasibilityScore string
          if (data.feasibilityScore) {
            const match = data.feasibilityScore.match(/(\d+\.?\d*)/);
            if (match) {
              return parseFloat(match[1]);
            }
          }
        }
      } catch (e) {
        console.error("Failed to get base score:", e);
      }
      return DEFAULT_BASE_SCORE;
    };

    const currentTotalImpact = getTotalImpact();
    const previousTotalImpact = previousTotalImpactRef.current;

    // Only show notification if impact changed (not on initial mount)
    if (!isInitialMount.current && currentTotalImpact !== previousTotalImpact) {
      const baseScore = getBaseScore();
      const previousScore = previousScoreRef.current ?? (baseScore + previousTotalImpact);
      const newScore = Math.min(9.9, baseScore + currentTotalImpact);
      
      // Only show toast if score actually changed
      if (Math.abs(newScore - previousScore) > 0.01) {
        const toastMessage = newScore > previousScore
          ? `Well done! Your score has improved from ${previousScore.toFixed(1)} to ${newScore.toFixed(1)}`
          : `Your score decreased from ${previousScore.toFixed(1)} to ${newScore.toFixed(1)}`;
        
        // Prevent duplicate toasts by checking if the same message was just shown
        if (lastToastMessageRef.current !== toastMessage) {
          // Clear any pending toast timeout
          if (toastTimeoutRef.current) {
            clearTimeout(toastTimeoutRef.current);
          }
          
          // Show toast
          showToast(toastMessage, newScore > previousScore ? "success" : "info");
          lastToastMessageRef.current = toastMessage;
          
          // Clear the last message ref after a delay to allow same message again if needed
          toastTimeoutRef.current = setTimeout(() => {
            lastToastMessageRef.current = null;
          }, 1000);
          
          previousScoreRef.current = newScore;
        }
      }
    }

    previousTotalImpactRef.current = currentTotalImpact;
    
    // Set initial score on mount
    if (isInitialMount.current) {
      const baseScore = getBaseScore();
      const initialScore = Math.min(9.9, baseScore + currentTotalImpact);
      previousScoreRef.current = initialScore;
      isInitialMount.current = false;
    }

    // Cleanup timeout on unmount
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, [getTotalImpact, showToast]);
}

