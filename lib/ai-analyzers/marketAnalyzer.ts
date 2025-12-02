/**
 * Market Intelligence Analyzer - Analyze market trends from LinkedIn jobs
 */

import { LinkedInJobResult } from "../apify/linkedin-scraper";

export interface MarketAnalysis {
  totalOpenPositions: number;
  companiesHiring: number;
  averageApplicants: number;
  competitionLevel: "Low" | "Medium" | "High" | "Very High";
  demandTrend: "Growing" | "Stable" | "Declining";
  topCompanies: { company: string; openings: number }[];
  insights: string[];
}

/**
 * Analyze market intelligence from LinkedIn jobs
 */
export function analyzeMarket(jobs: LinkedInJobResult[]): MarketAnalysis {
  const totalOpenPositions = jobs.length;
  const companies = new Map<string, number>();
  const applicantCounts: number[] = [];

  // Analyze companies and applicants
  jobs.forEach((job) => {
    if (job.company) {
      companies.set(job.company, (companies.get(job.company) || 0) + 1);
    }

    if (job.applicants && typeof job.applicants === "number") {
      applicantCounts.push(job.applicants);
    }
  });

  const companiesHiring = companies.size;

  // Calculate average applicants
  const averageApplicants =
    applicantCounts.length > 0
      ? Math.round(applicantCounts.reduce((a, b) => a + b, 0) / applicantCounts.length)
      : 0;

  // Determine competition level based on average applicants
  let competitionLevel: "Low" | "Medium" | "High" | "Very High" = "Medium";
  if (averageApplicants === 0) {
    competitionLevel = "Medium"; // Unknown
  } else if (averageApplicants < 50) {
    competitionLevel = "Low";
  } else if (averageApplicants < 100) {
    competitionLevel = "Medium";
  } else if (averageApplicants < 200) {
    competitionLevel = "High";
  } else {
    competitionLevel = "Very High";
  }

  // Analyze posting dates for trend
  const recentPostings = jobs.filter((job) => {
    if (!job.postedDate) return false;
    const postedText = job.postedDate.toLowerCase();
    return (
      postedText.includes("hour") ||
      postedText.includes("day") ||
      postedText.includes("1 week") ||
      postedText.includes("2 week")
    );
  });

  const recentPercentage = (recentPostings.length / totalOpenPositions) * 100;

  let demandTrend: "Growing" | "Stable" | "Declining" = "Stable";
  if (recentPercentage > 60) {
    demandTrend = "Growing";
  } else if (recentPercentage < 30) {
    demandTrend = "Declining";
  }

  // Top companies hiring
  const topCompanies = Array.from(companies.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([company, openings]) => ({ company, openings }));

  // Generate insights
  const insights: string[] = [];
  insights.push(`${totalOpenPositions} open positions found on LinkedIn`);
  insights.push(`${companiesHiring} companies actively hiring for this role`);

  if (averageApplicants > 0) {
    insights.push(`Average of ${averageApplicants} applicants per posting (${competitionLevel} competition)`);
  }

  insights.push(`Market demand is ${demandTrend.toLowerCase()}`);

  if (recentPercentage > 50) {
    insights.push(`${Math.round(recentPercentage)}% of postings are less than 2 weeks old`);
  }

  if (topCompanies.length > 0) {
    const topHirer = topCompanies[0];
    insights.push(`${topHirer.company} has the most openings with ${topHirer.openings} positions`);
  }

  return {
    totalOpenPositions,
    companiesHiring,
    averageApplicants,
    competitionLevel,
    demandTrend,
    topCompanies,
    insights,
  };
}
