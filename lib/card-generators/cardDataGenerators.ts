/**
 * Generate data for each card type from LinkedIn analysis
 */

import { LinkedInJobResult } from "../apify/linkedin-scraper";
import { SalaryAnalysis } from "../ai-analyzers/salaryAnalyzer";
import { SkillAnalysis } from "../ai-analyzers/skillsAnalyzer";
import { MarketAnalysis } from "../ai-analyzers/marketAnalyzer";
import { ResponsibilitiesAnalysis } from "../ai-analyzers/responsibilitiesAnalyzer";

/**
 * Generate Pay Card data
 */
export function generatePayCardData(
  salaryAnalysis: SalaryAnalysis,
  linkedInJobs: LinkedInJobResult[]
) {
  return {
    marketComp: [
      { label: "Minimum", value: salaryAnalysis.minSalary || "N/A" },
      { label: "Median", value: salaryAnalysis.medianSalary || "N/A" },
      { label: "Maximum", value: salaryAnalysis.maxSalary || "N/A" },
      { label: "75th percentile", value: salaryAnalysis.percentile75 || "N/A" },
    ],
    recommendedRange: salaryAnalysis.minSalary && salaryAnalysis.maxSalary
      ? `${salaryAnalysis.minSalary}–${salaryAnalysis.maxSalary} (market rate)`
      : "Competitive market rate",
    insights: salaryAnalysis.insights || [],
    dataSource: `Based on ${salaryAnalysis.salaryCount} salary data points from ${linkedInJobs.length} LinkedIn postings`,
  };
}

/**
 * Generate Market Card data
 */
export function generateMarketCardData(
  marketAnalysis: MarketAnalysis,
  linkedInJobs: LinkedInJobResult[]
) {
  return {
    talentPool: {
      local: marketAnalysis.totalOpenPositions,
      relocation: Math.round(marketAnalysis.totalOpenPositions * 3),
      remote: Math.round(marketAnalysis.totalOpenPositions * 5),
    },
    marketConditions: [
      `${marketAnalysis.totalOpenPositions} open positions currently`,
      `${marketAnalysis.companiesHiring} companies hiring`,
      `Competition level: ${marketAnalysis.competitionLevel}`,
      `Average ${marketAnalysis.averageApplicants} applicants per posting`,
    ],
    talentSupply: [
      { 
        level: marketAnalysis.demandTrend === "Growing" ? "High demand" : "Moderate demand", 
        status: marketAnalysis.demandTrend === "Growing" ? "low" as const : "high" as const 
      },
      { 
        level: `${marketAnalysis.competitionLevel} competition`, 
        status: marketAnalysis.competitionLevel === "High" || marketAnalysis.competitionLevel === "Very High" ? "low" as const : "high" as const 
      },
    ],
    insights: marketAnalysis.insights || [],
    dataSource: `Real-time data from ${linkedInJobs.length} LinkedIn job postings`,
  };
}

/**
 * Generate Skills Card data
 */
export function generateSkillCardData(
  skillsAnalysis: SkillAnalysis,
  linkedInJobs: LinkedInJobResult[]
) {
  // Core skills: >70% frequency
  const coreSkills = skillsAnalysis.topSkills
    .filter(s => s.percentage >= 70)
    .map(s => `${s.skill} (${s.percentage}% of jobs)`);

  // Product skills: 40-70% frequency  
  const productSkills = skillsAnalysis.topSkills
    .filter(s => s.percentage >= 40 && s.percentage < 70)
    .map(s => `${s.skill} (${s.percentage}% of jobs)`);

  // Behavioral skills: If no data, use defaults
  const behavioralSkills = coreSkills.length > 0
    ? ["Ownership mindset", "Handles ambiguity", "Clear communication", "Quality focused"]
    : ["Ownership mindset", "Handles ambiguity", "Clear communication", "Quality focused"];

  return {
    coreSkills: coreSkills.length > 0 ? coreSkills : ["Advanced SQL", "dbt modelling", "Dimensional modelling"],
    productSkills: productSkills.length > 0 ? productSkills : ["Define clear metrics", "Shape analytics UX"],
    behavioralSkills,
    insights: skillsAnalysis.insights || [],
    dataSource: `Analyzed ${linkedInJobs.length} job postings for skill requirements`,
  };
}

/**
 * Generate Talent Map Card data  
 */
export function generateTalentMapCardData(
  marketAnalysis: MarketAnalysis,
  linkedInJobs: LinkedInJobResult[]
) {
  const topCompanies = marketAnalysis.topCompanies || [];

  // If no companies found, extract unique companies from job listings
  if (topCompanies.length === 0) {
    const companySet = new Set<string>();
    linkedInJobs.forEach(job => {
      if (job.company) {
        companySet.add(job.company);
      }
    });
    
    const allCompanies = Array.from(companySet);
    
    return {
      primaryFeeders: allCompanies.slice(0, 9),
      secondaryFeeders: allCompanies.slice(9, 15),
      dataSource: `Based on ${allCompanies.length} companies from LinkedIn data`,
    };
  }

  return {
    primaryFeeders: topCompanies.slice(0, 9).map(c => c.company),
    secondaryFeeders: topCompanies.slice(9, 15).map(c => c.company),
    dataSource: `Based on ${marketAnalysis.companiesHiring} companies hiring from LinkedIn data`,
  };
}

/**
 * Generate Funnel Card data
 */
export function generateFunnelCardData(
  marketAnalysis: MarketAnalysis,
  linkedInJobs: LinkedInJobResult[]
) {
  const avgApplicants = marketAnalysis.averageApplicants || 100;
  
  // Calculate funnel based on competition
  const outreach = Math.round(avgApplicants * 1.5);
  const replies = Math.round(outreach * 0.25);
  const screens = Math.round(replies * 0.5);
  const techRounds = Math.round(screens * 0.7);
  const finalists = Math.round(techRounds * 0.4);

  return {
    funnelStages: [
      { stage: "Outreach", count: `${outreach}` },
      { stage: "Positive replies", count: `${replies}` },
      { stage: "Screens", count: `${screens}` },
      { stage: "Tech rounds", count: `${techRounds}` },
      { stage: "Finalists", count: `${finalists}` },
      { stage: "Offers", count: "1-2" },
      { stage: "Hire", count: "1" },
    ],
    benchmarks: [
      { label: "Outbound reply rate", value: "20–30%" },
      { label: "Tech pass rate", value: "40–60%" },
      { label: "Offer acceptance", value: "70–85%" },
    ],
    insights: [
      `Average ${avgApplicants} applicants per posting`,
      `Competition is ${marketAnalysis.competitionLevel}`,
      `${marketAnalysis.demandTrend} demand trend`,
    ],
    dataSource: `Based on ${linkedInJobs.length} LinkedIn job postings`,
  };
}

/**
 * Generate Role Card data
 */
export function generateRoleCardData(
  responsibilitiesAnalysis: ResponsibilitiesAnalysis,
  linkedInJobs: LinkedInJobResult[]
) {
  const topResponsibilities = responsibilitiesAnalysis.commonResponsibilities.slice(0, 5);

  return {
    roleSummary: "Build production-grade solutions, own standards, and partner with teams to deliver.",
    outcomes: topResponsibilities.map(r => r.responsibility),
    dataSource: `Analyzed ${linkedInJobs.length} job descriptions`,
  };
}

/**
 * Generate Reality Card data
 */
export function generateRealityCardData(
  marketAnalysis: MarketAnalysis,
  salaryAnalysis: SalaryAnalysis,
  jobData: any
) {
  // Calculate feasibility score based on multiple factors
  let feasibilityScore = 7; // Start at 7/10

  // Adjust based on competition
  if (marketAnalysis.competitionLevel === "Very High") feasibilityScore -= 2;
  else if (marketAnalysis.competitionLevel === "High") feasibilityScore -= 1;
  else if (marketAnalysis.competitionLevel === "Low") feasibilityScore += 1;

  // Adjust based on salary alignment (if we have user's budget)
  // For now, keep it neutral

  // Ensure score is between 1-10
  feasibilityScore = Math.max(1, Math.min(10, feasibilityScore));

  const keyInsights = [
    `${marketAnalysis.totalOpenPositions} open positions, ${marketAnalysis.companiesHiring} companies hiring`,
    `Competition level: ${marketAnalysis.competitionLevel}`,
    `Average ${marketAnalysis.averageApplicants} applicants per posting`,
    `Market demand is ${marketAnalysis.demandTrend}`,
  ];

  return {
    feasibilityScore: `${feasibilityScore}/10`,
    feasibilityMessage: feasibilityScore >= 7 
      ? "Achievable with right strategy and speed"
      : feasibilityScore >= 5
      ? "Possible with alignment and speed"
      : "Challenging, requires competitive edge",
    keyInsights,
    marketConditions: marketAnalysis.insights || [],
    dataSource: `Based on ${marketAnalysis.totalOpenPositions} LinkedIn job postings`,
  };
}
