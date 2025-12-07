/**
 * Calculates feasibility score based on Reality Card data
 * Score ranges from 0-10
 */

export interface RealityCardData {
  feasibilityScore?: string;
  helpsCase?: string[];
  hurtsCase?: string[];
  keyInsights?: string[];
  realityCheck1?: string;
  realityCheck2?: string;
  hiddenBottleneck?: string;
  timelineToFailure?: string;
  bottomLine1?: string;
  bottomLine2?: string;
}

export const calculateRealityScore = (data: RealityCardData): number => {
  let baseScore = 5.0; // Start with neutral score

  // Extract numeric score from feasibilityScore string (e.g., "5.5/10" -> 5.5)
  if (data.feasibilityScore) {
    const match = data.feasibilityScore.match(/(\d+\.?\d*)/);
    if (match) {
      baseScore = parseFloat(match[1]);
    }
  }

  // Adjust based on helpsCase (positive factors)
  const helpsCount = data.helpsCase?.length || 0;
  if (helpsCount >= 4) baseScore += 0.5;
  else if (helpsCount >= 3) baseScore += 0.3;
  else if (helpsCount >= 2) baseScore += 0.1;

  // Adjust based on hurtsCase (negative factors)
  const hurtsCount = data.hurtsCase?.length || 0;
  if (hurtsCount >= 4) baseScore -= 1.0;
  else if (hurtsCount >= 3) baseScore -= 0.7;
  else if (hurtsCount >= 2) baseScore -= 0.4;
  else if (hurtsCount >= 1) baseScore -= 0.2;

  // Analyze content for specific keywords
  const allText = [
    data.realityCheck1,
    data.realityCheck2,
    data.hiddenBottleneck,
    data.timelineToFailure,
    data.bottomLine1,
    data.bottomLine2,
    ...(data.keyInsights || []),
    ...(data.helpsCase || []),
    ...(data.hurtsCase || []),
  ].join(" ").toLowerCase();

  // Positive indicators
  if (allText.includes("feasible") || allText.includes("achievable")) baseScore += 0.3;
  if (allText.includes("competitive") || allText.includes("market rate")) baseScore += 0.2;
  if (allText.includes("fast") || allText.includes("speed") || allText.includes("quick")) baseScore += 0.2;
  if (allText.includes("strong") || allText.includes("good")) baseScore += 0.1;

  // Negative indicators
  if (allText.includes("challenging") || allText.includes("difficult")) baseScore -= 0.3;
  if (allText.includes("slow") || allText.includes("delay")) baseScore -= 0.4;
  if (allText.includes("below market") || allText.includes("lowball")) baseScore -= 0.5;
  if (allText.includes("impossible") || allText.includes("won't work")) baseScore -= 0.6;
  if (allText.includes("failure") || allText.includes("stall")) baseScore -= 0.3;

  // Ensure score stays within bounds
  return Math.max(0, Math.min(10, Math.round(baseScore * 10) / 10));
};

export const getScoreLabel = (score: number): string => {
  if (score >= 8) return "Highly Feasible";
  if (score >= 6.5) return "Feasible with Effort";
  if (score >= 5) return "Possible with Alignment";
  if (score >= 3.5) return "Challenging";
  return "Very Difficult";
};

export const getScoreSubtext = (score: number): string => {
  if (score >= 8) return "Strong position to make this hire successfully";
  if (score >= 6.5) return "Good chances with competitive approach";
  if (score >= 5) return "Possible with alignment and speed";
  if (score >= 3.5) return "Not possible with slow process or strict constraints";
  return "Significant challenges ahead";
};

