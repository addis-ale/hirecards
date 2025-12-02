import { NextRequest, NextResponse } from "next/server";
import { scrapeJobURL, parseScrapedJobData } from "@/lib/jobScraper";
import { validateAuth } from "@/lib/auth-helpers";

/**
 * API endpoint to scrape job description from URL
 * POST /api/scrape-job
 * Body: { url: string }
 */
export async function POST(request: NextRequest) {
  // Validate authentication
  const auth = await validateAuth();
  if (!auth.authenticated) {
    return auth.response;
  }

  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid URL provided" },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Step 1: Scrape the job posting
    console.log("Scraping job URL:", url);
    const scrapedData = await scrapeJobURL(url);

    // Step 2: Parse with AI
    console.log("Parsing scraped data with AI...");
    const parsedData = await parseScrapedJobData(scrapedData);

    // Step 3: Return comprehensive data
    return NextResponse.json({
      success: true,
      data: {
        // Basic fields
        roleTitle: parsedData.jobTitle || null,
        company: parsedData.company || null,
        location: parsedData.location || null,
        
        // Job details
        workModel: parsedData.workModel || null,
        experienceLevel: parsedData.experienceLevel || null,
        department: parsedData.department || null,
        
        // Compensation
        minSalary: parsedData.minSalary || null,
        maxSalary: parsedData.maxSalary || null,
        
        // Skills and requirements
        skills: parsedData.skills || [],
        requirements: parsedData.requirements || [],
        criticalSkills: parsedData.skills || [],
        criticalSkill: parsedData.skills?.[0] || null, // For backwards compatibility
        nonNegotiables: parsedData.requirements?.slice(0, 3).join(", ") || null,
        
        // Timeline
        timeline: parsedData.timeline || null,
        
        // Metadata
        source: parsedData.source || "Unknown",
        confidence: parsedData.confidence || 0.7,
        isURL: true,
      },
      message: `Successfully scraped job posting from ${parsedData.source || "job board"}`,
    });
  } catch (error) {
    console.error("Error in scrape-job API:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Failed to scrape job URL";
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: "The URL might be inaccessible or the job board might be blocking scraping. Try copying the job description text instead."
      },
      { status: 500 }
    );
  }
}
