/**
 * Responsibilities Analyzer - Extract common responsibilities from LinkedIn jobs
 */

import { LinkedInJobResult } from "../apify/linkedin-scraper";

export interface ResponsibilitiesAnalysis {
  commonResponsibilities: { responsibility: string; count: number; percentage: number }[];
  totalJobs: number;
  insights: string[];
}

/**
 * Common responsibility keywords and patterns
 */
const RESPONSIBILITY_PATTERNS = [
  // Leadership & Management
  "lead team",
  "manage team",
  "mentor",
  "coach",
  "hiring",
  "recruit",

  // Strategy & Planning
  "develop strategy",
  "define roadmap",
  "prioritize",
  "plan",
  "set goals",
  "create vision",

  // Execution & Delivery
  "build",
  "implement",
  "develop",
  "design",
  "create",
  "deliver",
  "ship",
  "launch",

  // Collaboration & Communication
  "collaborate",
  "work with",
  "partner with",
  "communicate",
  "present",
  "stakeholder",

  // Analysis & Research
  "analyze",
  "research",
  "gather requirements",
  "user research",
  "data analysis",
  "metrics",

  // Product-specific
  "define features",
  "write specifications",
  "user stories",
  "backlog",
  "sprint planning",

  // Technical
  "code review",
  "architecture",
  "technical design",
  "API design",
  "database design",

  // Process & Improvement
  "improve process",
  "optimize",
  "automate",
  "scale",
  "maintain",
];

/**
 * Extract responsibilities from job description
 */
function extractResponsibilities(description: string): string[] {
  const responsibilities: string[] = [];
  const lowerDescription = description.toLowerCase();

  // Look for "Responsibilities" section
  const responsibilitiesSection = description.match(
    /responsibilities:?([\s\S]*?)(?:requirements|qualifications|skills|$)/i
  );

  const searchText = responsibilitiesSection
    ? responsibilitiesSection[1]
    : description;

  RESPONSIBILITY_PATTERNS.forEach((pattern) => {
    if (searchText.toLowerCase().includes(pattern)) {
      responsibilities.push(pattern);
    }
  });

  return responsibilities;
}

/**
 * Analyze responsibilities from LinkedIn jobs using AI
 */
export async function analyzeResponsibilities(
  jobs: LinkedInJobResult[]
): Promise<ResponsibilitiesAnalysis> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    // Fallback to pattern matching
    return analyzeResponsibilitiesBasic(jobs);
  }

  try {
    // Collect all job descriptions
    const descriptions = jobs.map((job) => job.description).join("\n\n---\n\n");

    const prompt = `Analyze these ${jobs.length} job descriptions and extract the 10 most common responsibilities.

Job Descriptions:
${descriptions.substring(0, 10000)} // Limit to avoid token limits

Return ONLY a JSON array of responsibilities, each with "responsibility" (string) and "count" (number).
Example: [{"responsibility": "Lead cross-functional teams", "count": 15}, ...]`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a job description analyzer. Extract common responsibilities.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    const result = await response.json();
    const content = result.choices[0]?.message?.content?.trim() || "";
    const cleanedContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const responsibilities = JSON.parse(cleanedContent);

    const totalJobs = jobs.length;
    const commonResponsibilities = responsibilities.map((r: any) => ({
      responsibility: r.responsibility,
      count: r.count,
      percentage: Math.round((r.count / totalJobs) * 100),
    }));

    const insights = [
      `Analyzed ${totalJobs} job descriptions for common responsibilities`,
      `Identified ${commonResponsibilities.length} key responsibility areas`,
      `Top responsibility: "${commonResponsibilities[0]?.responsibility}" (${commonResponsibilities[0]?.percentage}% of jobs)`,
    ];

    return {
      commonResponsibilities,
      totalJobs,
      insights,
    };
  } catch (error) {
    console.error("AI analysis failed, falling back to basic:", error);
    return analyzeResponsibilitiesBasic(jobs);
  }
}

/**
 * Basic pattern-matching fallback
 */
function analyzeResponsibilitiesBasic(jobs: LinkedInJobResult[]): ResponsibilitiesAnalysis {
  const responsibilityCounts = new Map<string, number>();
  const totalJobs = jobs.length;

  jobs.forEach((job) => {
    const responsibilities = extractResponsibilities(job.description || "");
    const uniqueResponsibilities = new Set(responsibilities);

    uniqueResponsibilities.forEach((resp) => {
      responsibilityCounts.set(resp, (responsibilityCounts.get(resp) || 0) + 1);
    });
  });

  const commonResponsibilities = Array.from(responsibilityCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([responsibility, count]) => ({
      responsibility,
      count,
      percentage: Math.round((count / totalJobs) * 100),
    }));

  const insights = [
    `Analyzed ${totalJobs} job descriptions`,
    `Found ${responsibilityCounts.size} unique responsibility types`,
    `Most common: "${commonResponsibilities[0]?.responsibility}" in ${commonResponsibilities[0]?.percentage}% of jobs`,
  ];

  return {
    commonResponsibilities,
    totalJobs,
    insights,
  };
}
