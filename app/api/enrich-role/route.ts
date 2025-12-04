import { NextRequest, NextResponse } from "next/server";
import { formatRoleCardFromScrapedData } from "@/lib/aiRoleCardFormatter";

/**
 * API endpoint to enrich Role Card using scraped data + AI formatting
 * NO APIFY - just AI analysis of existing scraped data from ScrapingBee
 * POST /api/enrich-role
 * Body: { scrapedJobData: object }
 */
export async function POST(request: NextRequest) {
  try {
    console.log("📋 ============================================");
    console.log("📋 ENRICH-ROLE API CALLED");
    console.log("📋 ============================================");

    const body = await request.json();
    console.log("📥 Request body received");

    const { scrapedJobData } = body;

    if (!scrapedJobData) {
      return NextResponse.json(
        { success: false, error: "Scraped job data is required" },
        { status: 400 }
      );
    }

    console.log("📥 Scraped job data:", {
      jobTitle: scrapedJobData.jobTitle || scrapedJobData.roleTitle,
      company: scrapedJobData.company,
      location: scrapedJobData.location,
    });

    // Use AI to format scraped data into Role Card structure
    console.log("📋 ============================================");
    console.log("📋 AI FORMATTING ROLE CARD");
    console.log("📋 ============================================");
    console.log("📋 Using scraped data from ScrapingBee (NO Apify)");

    const roleCardData = await formatRoleCardFromScrapedData(scrapedJobData);

    console.log("✅ Role Card generated successfully");
    console.log("📋 Role Card data structure:");
    console.log("   Role Summary:", roleCardData.roleSummary);
    console.log("   Outcomes:", roleCardData.outcomes?.length || 0);
    console.log("   Red Flags:", roleCardData.redFlags?.length || 0);

    const response = {
      success: true,
      roleCardData,
      metadata: {
        source: "ScrapingBee + AI formatting",
        jobTitle: scrapedJobData.jobTitle || scrapedJobData.roleTitle,
        company: scrapedJobData.company,
      },
    };

    console.log("📋 ============================================");
    console.log("📋 FINAL RESPONSE");
    console.log("📋 ============================================");
    console.log(JSON.stringify(response, null, 2));

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in enrich-role API:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to enrich role data";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details:
          "Unable to format role card. AI service may be temporarily unavailable.",
      },
      { status: 500 }
    );
  }
}
