/**
 * LinkedIn Jobs Scraper using Apify
 * Uses actor: BHzefUZlZRKWxkTck
 */

import { runActorAndWait } from "./client";

const LINKEDIN_ACTOR_ID = "BHzefUZlZRKWxkTck";

export interface LinkedInSearchInput {
  keywords: string;
  location: string;
  maxItems?: number;
  experienceLevel?: string[];
  jobType?: string[];
}

export interface LinkedInJobResult {
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  experienceLevel?: string;
  employmentType?: string;
  postedDate?: string;
  applicants?: number;
  url: string;
  skills?: string[];
  seniority?: string;
  industries?: string[];
}

/**
 * Transform job data into LinkedIn search query
 */
export function buildLinkedInQuery(jobData: any): LinkedInSearchInput {
  const keywords = jobData.jobTitle || jobData.roleTitle || "";
  const location = jobData.location || "";

  // Map experience levels
  const experienceLevelMap: Record<string, string[]> = {
    "Entry Level (0-2 years)": ["Entry level"],
    "Mid Level (3-5 years)": ["Mid-Senior level"],
    "Senior (6-10 years)": ["Mid-Senior level"],
    "Lead/Staff (10+ years)": ["Director", "Executive"],
    Executive: ["Executive"],
  };

  const experienceLevel = experienceLevelMap[jobData.experienceLevel] || [];

  // Map work model to job type
  const jobTypeMap: Record<string, string[]> = {
    Remote: ["Remote"],
    Hybrid: ["Hybrid"],
    "On-site": ["On-site"],
  };

  const jobType = jobTypeMap[jobData.workModel] || [];

  return {
    keywords,
    location,
    maxItems: 25, // Scrape 25 jobs for good data
    experienceLevel: experienceLevel.length > 0 ? experienceLevel : undefined,
    jobType: jobType.length > 0 ? jobType : undefined,
  };
}

/**
 * Scrape LinkedIn jobs using Apify actor
 */
export async function scrapeLinkedInJobs(
  searchInput: LinkedInSearchInput
): Promise<LinkedInJobResult[]> {
  try {
    console.log("🔍 Scraping LinkedIn with query:", searchInput);

    // FIX: Convert experienceLevel array to a comma-separated string
    // to satisfy the actor's input requirement "Field input.experienceLevel must be string".
    const experienceLevelString =
      (searchInput.experienceLevel || []).join(",") || undefined;

    // FIX: Convert jobType array to a comma-separated string for consistency,
    // as it is likely expected to be a string as well.
    const jobTypeString = (searchInput.jobType || []).join(",") || undefined;


    // Optimized input for LinkedIn Jobs Scraper actor
    const actorInput = {
      keywords: searchInput.keywords,
      location: searchInput.location,
      maxItems: searchInput.maxItems || 25,
      // Enable salary extraction
      extractSalary: true,
      // Get detailed job information
      includeFullDescription: true,
      // Filter by experience level - NOW A STRING
      experienceLevel: experienceLevelString,
      // Filter by job type - NOW A STRING
      jobType: jobTypeString,
    };

    const results = await runActorAndWait(
      {
        actorId: LINKEDIN_ACTOR_ID,
        input: actorInput,
        timeout: 300, // 5 minutes
      },
      120000 // 2 minutes max wait
    );

    console.log(`✅ Scraped ${results.length} LinkedIn jobs`);
    console.log("####################################################")
    console.log(results)
    console.log("####################################################")

    return results as LinkedInJobResult[];
  } catch (error) {
    console.error("❌ LinkedIn scraping error:", error);
    throw new Error(
      `Failed to scrape LinkedIn jobs: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Scrape LinkedIn jobs from job data
 */
export async function scrapeLinkedInFromJobData(
  jobData: any
): Promise<LinkedInJobResult[]> {
  const query = buildLinkedInQuery(jobData);
  return await scrapeLinkedInJobs(query);
}