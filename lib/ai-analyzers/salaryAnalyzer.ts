/**
 * Salary Analyzer - Analyze salary data from LinkedIn jobs
 */

import { LinkedInJobResult } from "../apify/linkedin-scraper";

export interface SalaryAnalysis {
  minSalary: string | null;
  maxSalary: string | null;
  averageSalary: string | null;
  medianSalary: string | null;
  salaryCount: number;
  totalJobs: number;
  percentile25: string | null;
  percentile75: string | null;
  insights: string[];
}

/**
 * Extract salary number from string
 */
function extractSalaryNumber(salaryString: string): number | null {
  if (!salaryString) return null;

  // Remove currency symbols and commas
  const cleaned = salaryString.replace(/[$,€£k]/gi, "");

  // Handle "k" notation (e.g., "120k" -> 120000)
  if (salaryString.toLowerCase().includes("k")) {
    const num = parseFloat(cleaned);
    return num * 1000;
  }

  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

/**
 * Parse salary range from LinkedIn data
 */
function parseSalaryRange(job: LinkedInJobResult): { min: number; max: number } | null {
  if (!job.salary) return null;

  const salaryString = job.salary;

  // Handle range format: "$100k - $150k" or "$100,000 - $150,000"
  const rangeMatch = salaryString.match(/(\d+[k,\d]*)\s*[-–]\s*(\d+[k,\d]*)/i);

  if (rangeMatch) {
    const min = extractSalaryNumber(rangeMatch[1]);
    const max = extractSalaryNumber(rangeMatch[2]);

    if (min && max) {
      return { min, max };
    }
  }

  // Handle single value: "$120k" or "$120,000"
  const singleMatch = salaryString.match(/(\d+[k,\d]*)/i);
  if (singleMatch) {
    const value = extractSalaryNumber(singleMatch[1]);
    if (value) {
      return { min: value, max: value };
    }
  }

  return null;
}

/**
 * Analyze salary data from LinkedIn jobs
 */
export async function analyzeSalaryData(
  jobs: LinkedInJobResult[], 
  jobData?: any
): Promise<SalaryAnalysis> {
  const salaries: number[] = [];

  // Extract all salary data points
  jobs.forEach((job) => {
    const range = parseSalaryRange(job);
    if (range) {
      // Add both min and max to dataset for better analysis
      salaries.push(range.min);
      if (range.max !== range.min) {
        salaries.push(range.max);
      }
    }
  });

  // If no salary data found, use AI estimation as fallback
  if (salaries.length === 0 && jobData) {
    console.log("⚠️ No salary data in LinkedIn, using AI estimation fallback");
    return await estimateSalaryWithAI(jobData, jobs);
  }

  if (salaries.length === 0) {
    return {
      minSalary: null,
      maxSalary: null,
      averageSalary: null,
      medianSalary: null,
      salaryCount: 0,
      totalJobs: jobs.length,
      percentile25: null,
      percentile75: null,
      insights: ["No salary data available in scraped jobs"],
    };
  }

  // Sort salaries for percentile calculations
  salaries.sort((a, b) => a - b);

  const min = Math.min(...salaries);
  const max = Math.max(...salaries);
  const average = Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length);
  const median = salaries[Math.floor(salaries.length / 2)];
  const p25 = salaries[Math.floor(salaries.length * 0.25)];
  const p75 = salaries[Math.floor(salaries.length * 0.75)];

  // Format as currency
  const format = (num: number) => `$${Math.round(num / 1000)}k`;

  // Generate insights
  const insights: string[] = [];
  insights.push(`Based on ${salaries.length} salary data points from ${jobs.length} job postings`);
  insights.push(`Salary range: ${format(min)} - ${format(max)}`);
  insights.push(`Median salary: ${format(median)}`);
  insights.push(`25th percentile: ${format(p25)}, 75th percentile: ${format(p75)}`);

  const coverage = Math.round((salaries.length / jobs.length / 2) * 100);
  insights.push(`${coverage}% of job postings included salary information`);

  return {
    minSalary: format(min),
    maxSalary: format(max),
    averageSalary: format(average),
    medianSalary: format(median),
    salaryCount: salaries.length,
    totalJobs: jobs.length,
    percentile25: format(p25),
    percentile75: format(p75),
    insights,
  };
}

/**
 * AI-powered salary estimation fallback
 */
async function estimateSalaryWithAI(jobData: any, linkedInJobs: LinkedInJobResult[]): Promise<SalaryAnalysis> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      minSalary: null,
      maxSalary: null,
      averageSalary: null,
      medianSalary: null,
      salaryCount: 0,
      totalJobs: linkedInJobs.length,
      percentile25: null,
      percentile75: null,
      insights: ["No salary data available and OpenAI API key not configured"],
    };
  }

  try {
    const prompt = `Estimate the market salary range for this role based on LinkedIn job market data:

Job Title: ${jobData.jobTitle}
Experience Level: ${jobData.experienceLevel}
Location: ${jobData.location}
Department: ${jobData.department}

I analyzed ${linkedInJobs.length} similar LinkedIn job postings. None included explicit salary data, but based on:
- Job titles
- Experience requirements
- Company sizes
- Market demand

Provide a realistic salary estimate in USD (even if location is non-US, estimate USD equivalent).

Return ONLY a JSON object:
{
  "minSalary": "120000",
  "maxSalary": "180000",
  "median": "150000",
  "confidence": "medium",
  "reasoning": "Based on typical market rates for senior roles in this location"
}`;

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
            content: "You are a salary data analyst. Provide realistic salary estimates.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    const result = await response.json();
    const content = result.choices[0]?.message?.content?.trim() || "{}";
    const cleanedContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const estimation = JSON.parse(cleanedContent);

    const min = parseInt(estimation.minSalary);
    const max = parseInt(estimation.maxSalary);
    const median = parseInt(estimation.median);

    const format = (num: number) => `$${Math.round(num / 1000)}k`;

    return {
      minSalary: format(min),
      maxSalary: format(max),
      averageSalary: format(median),
      medianSalary: format(median),
      salaryCount: 0,
      totalJobs: linkedInJobs.length,
      percentile25: format(min),
      percentile75: format(max),
      insights: [
        `AI-estimated based on ${linkedInJobs.length} LinkedIn job postings`,
        estimation.reasoning || "Estimated from market data",
        `Confidence: ${estimation.confidence || "medium"}`,
      ],
    };
  } catch (error) {
    console.error("AI salary estimation failed:", error);
    return {
      minSalary: null,
      maxSalary: null,
      averageSalary: null,
      medianSalary: null,
      salaryCount: 0,
      totalJobs: linkedInJobs.length,
      percentile25: null,
      percentile75: null,
      insights: ["Unable to estimate salary - no data available"],
    };
  }
}
