import { NextRequest, NextResponse } from "next/server";
import { scrapeLinkedInJobs } from "@/lib/apifyClient";
import { scrapeLinkedInProfiles } from "@/lib/linkedinProfileScraper";
import {
  formatForMarketAnalysis,
  analyzeAndFormatMarketCard,
} from "@/lib/aiMarketCardFormatter";

/**
 * API endpoint to enrich market data using both LinkedIn scrapers
 * POST /api/enrich-market
 * Body: { jobTitle: string, location: string, experienceLevel?: string, skills?: string[] }
 * OR
 * Body: { scrapedJobData: object } - if coming from initial scrape
 */
export async function POST(request: NextRequest) {
  try {
    console.log("🟢 ============================================");
    console.log("🟢 ENRICH-MARKET API CALLED");
    console.log("🟢 ============================================");
    
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
      const { jobTitle, location, experienceLevel, skills } = body;
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

      jobData = { jobTitle, location, experienceLevel, skills };
    }

    console.log("🔍 Starting Market Card enrichment flow for:", {
      jobTitle: jobData.jobTitle || jobData.roleTitle,
      location: jobData.location,
    });

    // STEP 1: AI formats data for BOTH Apify actors
    console.log("🟢 ============================================");
    console.log("🟢 STEP 1: AI FORMATTING FOR MARKET ANALYSIS");
    console.log("🟢 ============================================");
    const { jobsInput, profilesInput } = await formatForMarketAnalysis(jobData);

    console.log("✅ Jobs Input:");
    console.log("   Job Title:", jobsInput.jobTitle);
    console.log("   Location:", jobsInput.location);
    console.log("   Experience Level:", jobsInput.experienceLevel);
    console.log("✅ Profiles Input:");
    console.log("   Search Query:", profilesInput.searchQuery);
    console.log("   Location:", profilesInput.location);
    console.log("   Max Profiles:", profilesInput.maxProfiles);

    // STEP 2: Run BOTH Apify scrapers in parallel
    console.log("🟢 ============================================");
    console.log("🟢 STEP 2: PARALLEL APIFY SCRAPING");
    console.log("🟢 ============================================");
    console.log("📊 Starting BOTH scrapers in parallel...");
    console.log("   Jobs Scraper: 50 jobs");
    console.log("   Profile Scraper: 100 profiles");

    const [jobs, profiles] = await Promise.all([
      scrapeLinkedInJobs(
        jobsInput.jobTitle,
        jobsInput.location,
        jobsInput.experienceLevel,
        50 // Get 50 jobs
      ),
      scrapeLinkedInProfiles(
        profilesInput.searchQuery,
        profilesInput.location,
        profilesInput.maxProfiles
      ),
    ]);

    console.log(`✅ Apify returned:`);
    console.log(`   Jobs: ${jobs.length}`);
    console.log(`   Profiles: ${profiles.length}`);
    
    if (jobs.length > 0) {
      console.log("   First 3 job titles:", jobs.slice(0, 3).map(j => j.title));
    }
    if (profiles.length > 0) {
      console.log("   First 3 profile headlines:", profiles.slice(0, 3).map(p => p.headline));
    }

    // Store RAW Apify data for debugging (not available in API routes)
    // Will be stored from client-side instead

    if (jobs.length === 0 && profiles.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No data found",
        message:
          "Unable to find jobs or profiles. Try a different location or job title.",
      });
    }

    // STEP 3: AI analyzes BOTH responses and formats into Market Card
    console.log("🟢 ============================================");
    console.log("🟢 STEP 3: AI ANALYSIS & MARKET CARD GENERATION");
    console.log("🟢 ============================================");
    const marketCardData = await analyzeAndFormatMarketCard(jobs, profiles, {
      jobTitle: jobsInput.jobTitle,
      location: jobsInput.location,
      experienceLevel: jobsInput.experienceLevel,
    });

    console.log("✅ Market Card generated successfully");
    console.log("📊 Market Card data structure:");
    console.log("   Talent Availability:", marketCardData.talentAvailability);
    console.log("   Supply/Demand:", marketCardData.supplyDemand);
    console.log("   Has Metadata:", !!marketCardData.metadata);

    const response = {
      success: true,
      hasMarketData: jobs.length > 0 || profiles.length > 0,
      marketCardData,
      rawJobs: jobs, // RAW Apify jobs array for debugging
      rawProfiles: profiles, // RAW Apify profiles array for debugging
      metadata: {
        jobsAnalyzed: jobs.length,
        profilesAnalyzed: profiles.length,
        dataQuality: marketCardData.metadata?.dataQuality || "unknown",
        confidence: marketCardData.metadata?.confidence || 0,
        inputs: {
          jobsInput,
          profilesInput,
        },
      },
    };

    console.log("🟢 ============================================");
    console.log("🟢 FINAL RESPONSE");
    console.log("🟢 ============================================");
    console.log(JSON.stringify(response, null, 2));

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in enrich-market API:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to enrich market data";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details:
          "Unable to fetch market data. The service may be temporarily unavailable.",
      },
      { status: 500 }
    );
  }
}
