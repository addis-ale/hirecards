import { NextRequest, NextResponse } from "next/server";
import { 
  scrapeLinkedInJobsBulk, 
  BulkLinkedInJobScraperInput,
  searchLinkedInProfiles,
  LinkedInProfileSearchInput
} from "@/lib/apifyClient";
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

    // STEP 2: Run BOTH Apify scrapers in parallel (USING NEW BULK SCRAPER)
    console.log("🟢 ============================================");
    console.log("🟢 STEP 2: PARALLEL APIFY SCRAPING");
    console.log("🟢 ============================================");
    console.log("📊 Starting BOTH scrapers in parallel...");
    console.log("   Jobs Bulk Scraper: 50 jobs");
    console.log("   Profile Scraper: 100 profiles");

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
      jobTitles: [jobsInput.jobTitle],
      maxItems: 50, // Get 50 jobs
      sortBy: 'relevance',
      postedLimit: 'month', // Recent jobs only (must use: "1h", "24h", "week", "month")
    };
    
    // Handle location and workplace type intelligently
    const locationLower = jobsInput.location?.toLowerCase().trim() || '';
    
    if (locationLower === 'remote' || locationLower === 'anywhere' || locationLower === 'global') {
      // User wants remote jobs globally - don't set location, just set workplaceType
      bulkScraperInput.workplaceType = ['remote'];
      console.log("🌍 Searching: Remote jobs globally (no location filter, workplaceType: remote)");
    } else if (isValidLocation(jobsInput.location)) {
      // Valid geographic location - use it
      bulkScraperInput.locations = [jobsInput.location];
      console.log("🌍 Searching: Jobs in", jobsInput.location);
    } else {
      // No valid location - search globally without filters
      console.log("🌍 Searching: Jobs globally (no location or workplace filter)");
    }

    // Map experience level if provided (must be array)
    if (jobsInput.experienceLevel) {
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
      const mappedLevel = expLevelMap[jobsInput.experienceLevel];
      if (mappedLevel) {
        bulkScraperInput.experienceLevel = [mappedLevel];
      }
    }

    // Build profile search input
    const profileSearchInput: LinkedInProfileSearchInput = {
      searchQuery: profilesInput.searchQuery,
      locations: profilesInput.location && isValidLocation(profilesInput.location) 
        ? [profilesInput.location] 
        : undefined,
      maxItems: profilesInput.maxProfiles || 100,
      profileScraperMode: 'Full', // Get full profile data with skills
    };

    console.log("🔍 Profile search input:", profileSearchInput);

    const [bulkJobs, profiles] = await Promise.all([
      scrapeLinkedInJobsBulk(bulkScraperInput),
      searchLinkedInProfiles(profileSearchInput),
    ]);
    
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
    console.log("✅ Response prepared with:", {
      success: response.success,
      hasMarketData: response.hasMarketData,
      jobsAnalyzed: response.metadata.jobsAnalyzed,
      profilesAnalyzed: response.metadata.profilesAnalyzed,
      dataQuality: response.metadata.dataQuality,
      confidence: response.metadata.confidence
    });
    // Note: Not logging full response to avoid console spam with job descriptions

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
