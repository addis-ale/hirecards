"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export interface AcceptedFix {
  cardId: string;
  fixId: string;
  impact: number;
}

interface AcceptedFixesContextType {
  acceptedFixes: AcceptedFix[];
  acceptFix: (cardId: string, fixId: string, impact: number) => void;
  rejectFix: (cardId: string, fixId: string) => void;
  isFixAccepted: (cardId: string, fixId: string) => boolean;
  getTotalImpact: () => number;
  getCardImpact: (cardId: string) => number;
}

const AcceptedFixesContext = createContext<AcceptedFixesContextType | undefined>(undefined);

const STORAGE_KEY = "acceptedFixes";

export function AcceptedFixesProvider({ children }: { children: ReactNode }) {
  const [acceptedFixes, setAcceptedFixes] = useState<AcceptedFix[]>([]);

  // Load from sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAcceptedFixes(parsed);
      } catch (e) {
        console.error("Failed to load accepted fixes:", e);
      }
    }
  }, []);

  // Save to sessionStorage whenever acceptedFixes changes
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(acceptedFixes));
  }, [acceptedFixes]);

  const acceptFix = useCallback((cardId: string, fixId: string, impact: number) => {
    setAcceptedFixes((prev) => {
      // Check if already accepted
      if (prev.some((f) => f.cardId === cardId && f.fixId === fixId)) {
        return prev;
      }
      return [...prev, { cardId, fixId, impact }];
    });
  }, []);

  const rejectFix = useCallback((cardId: string, fixId: string) => {
    setAcceptedFixes((prev) =>
      prev.filter((f) => !(f.cardId === cardId && f.fixId === fixId))
    );
  }, []);

  const isFixAccepted = useCallback(
    (cardId: string, fixId: string) => {
      return acceptedFixes.some(
        (f) => f.cardId === cardId && f.fixId === fixId
      );
    },
    [acceptedFixes]
  );

  const getTotalImpact = useCallback(() => {
    return acceptedFixes.reduce((sum, fix) => sum + fix.impact, 0);
  }, [acceptedFixes]);

  const getCardImpact = useCallback(
    (cardId: string) => {
      return acceptedFixes
        .filter((f) => f.cardId === cardId)
        .reduce((sum, fix) => sum + fix.impact, 0);
    },
    [acceptedFixes]
  );

  return (
    <AcceptedFixesContext.Provider
      value={{
        acceptedFixes,
        acceptFix,
        rejectFix,
        isFixAccepted,
        getTotalImpact,
        getCardImpact,
      }}
    >
      {children}
    </AcceptedFixesContext.Provider>
  );
}

export function useAcceptedFixes() {
  const context = useContext(AcceptedFixesContext);
  if (context === undefined) {
    throw new Error("useAcceptedFixes must be used within AcceptedFixesProvider");
  }
  return context;
}

