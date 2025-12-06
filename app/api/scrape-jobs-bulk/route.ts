import { NextRequest, NextResponse } from "next/server";
import { 
  scrapeLinkedInJobsBulk, 
  validateBulkScraperInput,
  BulkLinkedInJobScraperInput 
} from "@/lib/apifyClient";

/**
 * API endpoint to scrape LinkedIn jobs in bulk using the advanced scraper
 * POST /api/scrape-jobs-bulk
 * Body: { roleTitle, location, company, workModel, experienceLevel, etc. }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("📥 Bulk scraping request received:", body);

    // Extract data from scraped job or chatbot
    const {
      roleTitle,
      location,
      company,
      workModel,
      experienceLevel,
      minSalary,
      maxSalary,
    } = body;

    // Validate we have minimum required data
    const validation = validateBulkScraperInput({
      roleTitle,
      location,
      company,
    });

    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: "Insufficient data for bulk scraping",
          missingFields: validation.missingFields,
          suggestions: validation.suggestions,
          needsChatbot: true,
        },
        { status: 400 }
      );
    }

    // Build input for bulk scraper
    // Handle location intelligently
    const isValidLocation = (loc: string) => {
      if (!loc) return false;
      const normalized = loc.toLowerCase().trim();
      // Skip generic terms that aren't real locations
      const invalidLocations = ['remote', 'hybrid', 'on-site', 'onsite', 'anywhere', 'global', 'worldwide'];
      return !invalidLocations.includes(normalized);
    };

    const scraperInput: BulkLinkedInJobScraperInput = {
      jobTitles: [roleTitle],
      companies: company ? [company] : undefined,
      maxItems: 100, // Scrape up to 100 jobs
    };
    
    // Determine if original location was "Remote" or similar
    const locationLower = location?.toLowerCase().trim() || '';
    const originalLocationWasRemote = locationLower === 'remote' || locationLower === 'anywhere' || locationLower === 'global';
    
    if (originalLocationWasRemote) {
      // User wants remote jobs - will be handled via workplaceType filter below
      console.log("🌍 Searching: Remote jobs globally (will set workplaceType: remote)");
    } else if (isValidLocation(location)) {
      // Valid geographic location - use it
      scraperInput.locations = [location];
      console.log("🌍 Searching: Jobs in", location);
    } else {
      // No valid location - search globally
      console.log("🌍 Searching: Jobs globally (no location or workplace filter)");
    }

    // Map work model if provided (must be array)
    // Also handle case where location was "Remote"
    if (workModel || originalLocationWasRemote) {
      const workModelMap: Record<string, string> = {
        'Remote': 'remote',
        'Hybrid': 'hybrid',
        'On-site': 'onsite',
        'Onsite': 'onsite',
      };
      
      if (originalLocationWasRemote) {
        scraperInput.workplaceType = ['remote'];
      } else if (workModel) {
        const mappedWorkModel = workModelMap[workModel];
        if (mappedWorkModel) {
          scraperInput.workplaceType = [mappedWorkModel];
        }
      }
    }

    // Map experience level if provided (must be array)
    if (experienceLevel) {
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
      const mappedLevel = expLevelMap[experienceLevel];
      if (mappedLevel) {
        scraperInput.experienceLevel = [mappedLevel];
      }
    }

    // Add salary filter if provided
    if (minSalary || maxSalary) {
      // Parse salary strings (e.g., "80000" or "80k")
      const parseNumber = (val: string | null) => {
        if (!val) return undefined;
        const num = parseFloat(val.toString().replace(/[^0-9.]/g, ''));
        return isNaN(num) ? undefined : num;
      };

      scraperInput.salaryMin = parseNumber(minSalary);
      scraperInput.salaryMax = parseNumber(maxSalary);
    }

    // Add time filter - prefer recent postings (must use: "1h", "24h", "week", "month")
    scraperInput.postedLimit = 'month';
    scraperInput.sortBy = 'relevance';

    console.log("🚀 Starting bulk LinkedIn scraping with input:", scraperInput);

    // Execute bulk scraping
    const jobs = await scrapeLinkedInJobsBulk(scraperInput);

    console.log(`✅ Scraped ${jobs.length} jobs successfully`);

    // Return success with job data
    return NextResponse.json({
      success: true,
      data: jobs,
      metadata: {
        totalJobs: jobs.length,
        jobsWithSalary: jobs.filter(j => j.salary).length,
        searchParams: {
          jobTitles: scraperInput.jobTitles,
          locations: scraperInput.locations,
          companies: scraperInput.companies,
          workplaceType: scraperInput.workplaceType,
          experienceLevel: scraperInput.experienceLevel,
        },
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("❌ Error in bulk scraping API:", error);

    const errorMessage = error instanceof Error ? error.message : "Failed to scrape jobs";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: "Failed to scrape LinkedIn jobs. This might be due to API rate limits or network issues.",
      },
      { status: 500 }
    );
  }
}
