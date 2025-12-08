import { NextRequest, NextResponse } from "next/server";
import { scrapeLinkedInJobsBulk, BulkLinkedInJobScraperInput } from "@/lib/apifyClient";
import {
  formatForApifyInput,
  analyzeAndFormatPayCard,
} from "@/lib/aiPayCardFormatter";

/**
 * API endpoint to enrich salary data using AI-bounded analysis
 * POST /api/enrich-salary
 * Body: { jobTitle: string, location: string, experienceLevel?: string }
 * OR
 * Body: { scrapedJobData: object } - if coming from initial scrape
 */
export async function POST(request: NextRequest) {
  try {
    console.log("🔵 ============================================");
    console.log("🔵 ENRICH-SALARY API CALLED");
    console.log("🔵 ============================================");
    
    const body = await request.json();
    console.log("📥 Request body:", JSON.stringify(body, null, 2));
    
    let jobData;
    
    // Check if we're receiving scraped job data or raw inputs
    if (body.scrapedJobData) {
      jobData = body.scrapedJobData;
      console.log("📥 Received scraped job data from initial scrape");
      console.log("   Job Title:", jobData.jobTitle || jobData.roleTitle);
      console.log("   Location:", jobData.location);
    } else {
      // Direct API call with job details
      const { jobTitle, location, experienceLevel } = body;
      console.log("📥 Received direct API call");
      console.log("   Job Title:", jobTitle);
      console.log("   Location:", location);

      if (!jobTitle || typeof jobTitle !== "string") {
        return NextResponse.json(
          { success: false, error: "Job title is required" },
          { status: 400 }
        );
      }

      if (!location || typeof location !== "string") {
        return NextResponse.json(
          { success: false, error: "Location is required" },
          { status: 400 }
        );
      }

      jobData = { jobTitle, location, experienceLevel };
    }

    console.log("🔍 Starting PayCard enrichment flow for:", {
      jobTitle: jobData.jobTitle || jobData.roleTitle,
      location: jobData.location,
    });

    // STEP 1: AI formats scraped data for Apify input
    console.log("🔵 ============================================");
    console.log("🔵 STEP 1: AI FORMATTING FOR APIFY");
    console.log("🔵 ============================================");
    const apifyInput = await formatForApifyInput(jobData);
    
    console.log("✅ Apify input formatted:");
    console.log("   Job Title:", apifyInput.jobTitle);
    console.log("   Location:", apifyInput.location);
    console.log("   Experience Level:", apifyInput.experienceLevel);

    // STEP 2: Call Apify LinkedIn Jobs Scraper (NEW BULK SCRAPER)
    console.log("🔵 ============================================");
    console.log("🔵 STEP 2: APIFY LINKEDIN JOBS BULK SCRAPER");
    console.log("🔵 ============================================");
    console.log("📊 Calling Apify Bulk Scraper with:");
    console.log("   Job Title:", apifyInput.jobTitle);
    console.log("   Location:", apifyInput.location);
    console.log("   Experience Level:", apifyInput.experienceLevel);
    console.log("   Max Jobs:", 50);
    
    // Build input for bulk scraper
    // Handle location intelligently
    const isValidLocation = (loc: string) => {
      if (!loc) return false;
      const normalized = loc.toLowerCase().trim();
      // Skip generic terms that aren't real locations
      const invalidLocations = ['remote', 'hybrid', 'on-site', 'onsite', 'anywhere', 'global', 'worldwide'];
      return !invalidLocations.includes(normalized);
    };

    const bulkScraperInput: BulkLinkedInJobScraperInput = {
      jobTitles: [apifyInput.jobTitle],
      maxItems: 50, // Get 50 jobs for analysis
      sortBy: 'relevance',
      postedLimit: 'month', // Recent jobs only (must use: "1h", "24h", "week", "month")
    };
    
    // Handle location and workplace type intelligently
    const locationLower = apifyInput.location?.toLowerCase().trim() || '';
    
    if (locationLower === 'remote' || locationLower === 'anywhere' || locationLower === 'global') {
      // User wants remote jobs globally - don't set location, just set workplaceType
      bulkScraperInput.workplaceType = ['remote'];
      console.log("🌍 Searching: Remote jobs globally (no location filter, workplaceType: remote)");
    } else if (isValidLocation(apifyInput.location)) {
      // Valid geographic location - use it
      bulkScraperInput.locations = [apifyInput.location];
      console.log("🌍 Searching: Jobs in", apifyInput.location);
    } else {
      // No valid location - search globally without filters
      console.log("🌍 Searching: Jobs globally (no location or workplace filter)");
    }

    // Map experience level if provided (must be array)
    if (apifyInput.experienceLevel) {
      const expLevelMap: Record<string, string> = {
        'Entry Level': 'entryLevel',
        'Junior': 'entryLevel',
        'Mid Level': 'associate',
        'Mid-Level': 'associate',
        'Senior': 'midSenior',
        'Lead': 'director',
        'Director': 'director',
        'Executive': 'executive',
        'Principal': 'executive',
      };
      const mappedLevel = expLevelMap[apifyInput.experienceLevel];
      if (mappedLevel) {
        bulkScraperInput.experienceLevel = [mappedLevel];
      }
    }
    
    const bulkJobs = await scrapeLinkedInJobsBulk(bulkScraperInput);
    
    // Convert bulk jobs to old format for compatibility with existing analysis
    const jobs = bulkJobs.map(job => ({
      title: job.title,
      company: job.company.name,
      location: job.location.linkedinText,
      salary: job.salary ? job.salary.text : '',
      url: job.linkedinUrl,
      postedDate: job.postedDate,
      description: job.descriptionText,
    }));

    console.log(`📊 Apify returned ${jobs.length} jobs`);
    
    if (jobs.length === 0) {
      console.log("❌ No jobs found - returning error");
      return NextResponse.json({
        success: false,
        error: "No jobs found for the given criteria",
        message:
          "Unable to find similar jobs on LinkedIn. Try a different location or job title.",
      });
    }

    console.log(`✅ Found ${jobs.length} jobs from LinkedIn`);
    console.log("   First 3 job titles:", jobs.slice(0, 3).map(j => j.title));

    // Store RAW jobs data for debugging
    if (typeof window !== 'undefined') {
      sessionStorage.setItem("apifyRawJobsData", JSON.stringify(jobs));
    }

    // STEP 3: AI analyzes Apify response and formats into PayCard
    console.log("🔵 ============================================");
    console.log("🔵 STEP 3: AI ANALYSIS & PAYCARD GENERATION");
    console.log("🔵 ============================================");
    const payCardData = await analyzeAndFormatPayCard(jobs, {
      jobTitle: apifyInput.jobTitle,
      location: apifyInput.location,
      experienceLevel: apifyInput.experienceLevel,
    });

    console.log("✅ PayCard generated successfully");
    console.log("📊 PayCard data structure:");
    console.log("   Market Compensation:", payCardData.marketCompensation);
    console.log("   Recommended Range:", payCardData.recommendedRange);
    console.log("   Has Metadata:", !!payCardData.metadata);
    console.log("   Jobs with Salary:", payCardData.metadata?.jobsWithSalary || 0);

    const response = {
      success: true,
      hasSalaryData: payCardData.metadata?.jobsWithSalary > 0,
      payCardData,
      rawJobs: jobs, // RAW Apify jobs array for debugging
      metadata: {
        jobsAnalyzed: jobs.length,
        jobsWithSalary: payCardData.metadata?.jobsWithSalary || 0,
        dataQuality: payCardData.metadata?.salaryDataQuality || "unknown",
        insights: payCardData.metadata?.insights || [],
        apifyInput: apifyInput, // Show what was sent to Apify
      },
    };

    console.log("🔵 ============================================");
    console.log("🔵 FINAL RESPONSE");
    console.log("🔵 ============================================");
    console.log("✅ Response prepared with:", {
      success: response.success,
      hasSalaryData: response.hasSalaryData,
      jobsAnalyzed: response.metadata.jobsAnalyzed,
      jobsWithSalary: response.metadata.jobsWithSalary,
      dataQuality: response.metadata.dataQuality
    });
    // Note: Not logging full response to avoid console spam with job descriptions

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in enrich-salary API:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to enrich salary data";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details:
          "Unable to fetch market salary data. The service may be temporarily unavailable.",
      },
      { status: 500 }
    );
  }
}

// All helper functions moved to lib/aiPayCardFormatter.ts
