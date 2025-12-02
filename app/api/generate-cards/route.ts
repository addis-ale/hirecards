import { NextRequest, NextResponse } from "next/server";
import { validateAuth } from "@/lib/auth-helpers";
import { scrapeLinkedInFromJobData } from "@/lib/apify/linkedin-scraper";
import { getCachedResults, setCachedResults } from "@/lib/apify/cache";
import { generateDynamicCards } from "@/lib/card-generators/dynamicCardGenerator";
import { generateStaticCards } from "@/lib/card-generators/staticCardGenerator";

export async function POST(request: NextRequest) {
  // Validate authentication
  const auth = await validateAuth();
  if (!auth.authenticated) {
    return auth.response;
  }

  try {
    const data = await request.json();
    console.log("📋 Received job data:", data.jobTitle, data.location);

    let linkedInJobs = [];
    let usedCache = false;

    // Step 1: Try to get LinkedIn data from cache
    try {
      const cached = getCachedResults(data.jobTitle, data.location);
      
      if (cached && cached.length > 0) {
        linkedInJobs = cached;
        usedCache = true;
        console.log("✅ Using cached LinkedIn data");
      } else {
        // Step 2: Scrape fresh LinkedIn data
        console.log("🔍 Scraping LinkedIn jobs...");
        linkedInJobs = await scrapeLinkedInFromJobData(data);
        
        // Cache the results
        if (linkedInJobs.length > 0) {
          setCachedResults(data.jobTitle, data.location, linkedInJobs);
        }
        console.log(`✅ Scraped ${linkedInJobs.length} LinkedIn jobs`);
      }
    } catch (linkedInError) {
      console.error("⚠️ LinkedIn scraping failed, falling back to static generation:", linkedInError);
      linkedInJobs = [];
    }

    let cardsData = null;

    // Step 3: Generate cards
    if (linkedInJobs.length > 0) {
      // Generate first 7 cards dynamically with LinkedIn data
      console.log("🎨 Generating dynamic cards with LinkedIn data...");
      cardsData = await generateDynamicCards(data, linkedInJobs);
      
      console.log(`✅ Generated 7 dynamic cards with real LinkedIn data`);
    } else {
      // Fallback: No LinkedIn data, cards will use default static data
      console.log("⚠️ No LinkedIn data, cards will use default values");
      cardsData = {};
    }

    return NextResponse.json({
      success: true,
      cards: cardsData,
      sessionId: generateSessionId(),
      dataSource: linkedInJobs.length > 0 ? "LinkedIn + AI" : "Static",
      linkedInJobsCount: linkedInJobs.length,
      usedCache,
    });
  } catch (error) {
    console.error("Error generating cards:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate cards" },
      { status: 500 }
    );
  }
}

// Original static card generation (fallback)
function generateBattleCardsStatic(formData: any) {
  const {
    jobTitle,
    department,
    experienceLevel,
    location,
    salaryRange,
    keyResponsibilities,
    requiredSkills,
    companySize,
    hiringTimeline,
  } = formData;

  return [
    {
      id: 1,
      type: "Role Definition",
      title: "Role Definition",
      icon: "Briefcase",
      content: {
        jobTitle,
        department,
        experienceLevel,
        location,
        description: `This is a ${experienceLevel} level position in the ${department} department.`,
      },
    },
    {
      id: 2,
      type: "Compensation",
      title: "Compensation Strategy",
      icon: "DollarSign",
      content: {
        salaryRange,
        strategy: "Competitive market rate",
      },
    },
    {
      id: 3,
      type: "Market Intelligence",
      title: "Market Intelligence",
      icon: "TrendingUp",
      content: {
        keyInsights: ["Market demand is growing", "Competitive landscape"],
      },
    },
    {
      id: 4,
      type: "Requirements",
      title: "Required Skills",
      icon: "Target",
      content: {
        required: requiredSkills || "Various technical skills",
      },
    },
    {
      id: 5,
      type: "Responsibilities",
      title: "Key Responsibilities",
      icon: "CheckSquare",
      content: {
        keyResponsibilities: keyResponsibilities ? [keyResponsibilities] : [],
      },
    },
    {
      id: 6,
      type: "Culture Fit",
      title: "Culture Fit",
      icon: "Users",
      content: {
        cultureFit: "Team-oriented environment",
      },
    },
    {
      id: 7,
      type: "Recruiting Strategy",
      title: "Recruiting Strategy",
      icon: "Target",
      content: {
        strategy: "Standard recruiting process",
      },
    },
    {
      id: 8,
      type: "Messaging",
      title: "Recruiting Messaging",
      icon: "MessageSquare",
      content: {
        elevatorPitch: `Exciting ${jobTitle} opportunity`,
      },
    },
    {
      id: 9,
      type: "Interview Guide",
      title: "Interview Guide",
      icon: "ClipboardList",
      content: {
        stages: ["Phone Screen", "Technical", "Team", "Final"],
      },
    },
    {
      id: 10,
      type: "Onboarding",
      title: "Onboarding Plan",
      icon: "BookOpen",
      content: {
        week1: "Orientation",
      },
    },
    {
      id: 11,
      type: "Success Metrics",
      title: "Success Metrics",
      icon: "Target",
      content: {
        metrics: ["30-day", "60-day", "90-day goals"],
      },
    },
    {
      id: 12,
      type: "Career Growth",
      title: "Career Growth",
      icon: "TrendingUp",
      content: {
        nextRole: "Senior progression",
      },
    },
    {
      id: 13,
      type: "Benefits",
      title: "Benefits",
      icon: "Gift",
      content: {
        benefits: ["Health", "401k", "PTO"],
      },
    },
  ];
}

function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
