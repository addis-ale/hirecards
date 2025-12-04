import { NextRequest, NextResponse } from "next/server";
import { scrapeLinkedInJobs } from "@/lib/apifyClient";
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

    // STEP 2: Call Apify LinkedIn Jobs Scraper
    console.log("🔵 ============================================");
    console.log("🔵 STEP 2: APIFY LINKEDIN JOBS SCRAPER");
    console.log("🔵 ============================================");
    console.log("📊 Calling Apify with:");
    console.log("   Job Title:", apifyInput.jobTitle);
    console.log("   Location:", apifyInput.location);
    console.log("   Experience Level:", apifyInput.experienceLevel);
    console.log("   Max Jobs:", 50);
    
    const jobs = await scrapeLinkedInJobs(
      apifyInput.jobTitle,
      apifyInput.location,
      apifyInput.experienceLevel,
      50 // Get 50 jobs for analysis
    );

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
    console.log(JSON.stringify(response, null, 2));

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
