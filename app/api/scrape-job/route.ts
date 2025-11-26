import { NextRequest, NextResponse } from "next/server";
import { scrapeJobURL, parseScrapedJobData } from "@/lib/jobScraper";

/**
 * API endpoint to scrape job description from URL
 * POST /api/scrape-job
 * Body: { url: string }
 */
export async function POST(request: NextRequest) {
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
  } catch (error: any) {
    console.error("Error in scrape-job API:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Failed to scrape job URL";
    
    // Detailed error information for debugging
    const errorDetails: any = {
      message: errorMessage,
      type: error?.name || "UnknownError",
      timestamp: new Date().toISOString(),
      environment: {
        isVercel: !!process.env.VERCEL,
        nodeEnv: process.env.NODE_ENV,
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
      },
    };

    // Include stack trace in development or Vercel preview
    if (process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'preview') {
      errorDetails.stack = error?.stack;
      errorDetails.cause = error?.cause;
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        errorDetails: errorDetails,
        hint: "Check the browser console and debug UI at /debug-scraper for detailed logs.",
        suggestions: [
          "The URL might be inaccessible or blocked",
          "Puppeteer/Chrome might not be installed correctly",
          "The serverless function might have timed out",
          "Try copying the job description text instead"
        ]
      },
      { status: 500 }
    );
  }
}
