import { useState, useCallback } from "react";
import { AnalysisResult, ParsedData } from "@/types/hero";

export function useRoleAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  const analyzeRole = useCallback(async (roleDescription: string) => {
    if (!roleDescription.trim()) {
      return { success: false, error: "Please enter a role description" };
    }

    setIsAnalyzing(true);

    try {
      // Step 1: Parse the role description
      const parseResponse = await fetch("/api/parse-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roleInput: roleDescription }),
      });

      const parseResult = await parseResponse.json();

      if (!parseResult.success) {
        throw new Error(parseResult.error || "Failed to parse role");
      }

      setParsedData(parseResult.data);

      // Step 2: Analyze clarity
      const roastResponse = await fetch("/api/roast-hiring", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roleDescription,
          parsedData: parseResult.data,
        }),
      });

      const roastResult = await roastResponse.json();

      if (roastResult.success) {
        setAnalysisResult(roastResult.analysis);
        setMissingFields(roastResult.analysis.missingFields || []);
        return { success: true, data: roastResult.analysis };
      } else {
        throw new Error(roastResult.error || "Failed to analyze");
      }
    } catch (error) {
      console.error("Analysis error:", error);
      return { success: false, error: "Failed to analyze role. Please try again." };
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setAnalysisResult(null);
    setParsedData(null);
    setMissingFields([]);
    setIsAnalyzing(false);
  }, []);

  return {
    isAnalyzing,
    analysisResult,
    parsedData,
    missingFields,
    analyzeRole,
    reset,
  };
}
