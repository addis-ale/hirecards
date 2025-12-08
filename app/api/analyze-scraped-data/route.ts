import { NextRequest, NextResponse } from "next/server";
import { transformScrapedDataToCards } from "@/lib/dataTransformers";

/**
 * API endpoint to analyze scraped LinkedIn data and transform into card structures
 * POST /api/analyze-scraped-data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobsPayCard, jobsMarketCard, profiles, originalJobData } = body;

    console.log("🔄 Analyzing scraped data...");
    console.log(`📊 Jobs (PayCard): ${jobsPayCard?.length || 0}`);
    console.log(`📊 Jobs (MarketCard): ${jobsMarketCard?.length || 0}`);
    console.log(`👥 Profiles: ${profiles?.length || 0}`);

    // Transform scraped data into card structures
    const cardData = await transformScrapedDataToCards({
      jobsPayCard: jobsPayCard || [],
      jobsMarketCard: jobsMarketCard || [],
      profiles: profiles || [],
      originalJobData: originalJobData || {},
    });

    console.log("✅ Analysis complete:", Object.keys(cardData));

    return NextResponse.json({
      success: true,
      data: cardData,
      metadata: {
        timestamp: new Date().toISOString(),
        jobsAnalyzed: {
          payCard: jobsPayCard?.length || 0,
          marketCard: jobsMarketCard?.length || 0,
        },
        profilesAnalyzed: profiles?.length || 0,
        cardsGenerated: Object.keys(cardData).length,
      },
    });
  } catch (error: any) {
    console.error("❌ Analysis error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to analyze scraped data",
      },
      { status: 500 }
    );
  }
}
