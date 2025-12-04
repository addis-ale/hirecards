/**
 * AI PayCard Formatter
 * Uses AI to format data and analyze within bounded scope
 */

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * Step 1: Format scraped job data for Apify actor input
 */
export async function formatForApifyInput(scrapedData: any): Promise<{
  jobTitle: string;
  location: string;
  experienceLevel: string;
}> {
  if (!OPENAI_API_KEY) {
    console.warn("⚠️ OPENAI_API_KEY not configured, using basic formatting");
    return basicFormatForApify(scrapedData);
  }

  try {
    console.log("🤖 AI formatting data for Apify input...");

    const prompt = `You are a data formatter. Transform this job data into the exact format needed for LinkedIn Jobs Scraper.

Job Data:
${JSON.stringify(scrapedData, null, 2)}

Required Output Format:
{
  "jobTitle": "normalized job title (e.g., 'Software Engineer' not 'Rockstar Dev')",
  "location": "city name (e.g., 'Amsterdam' not 'Amsterdam, Netherlands')",
  "experienceLevel": "1" for Entry/Junior, "2" for Mid-Level, "3" for Senior, "4" for Lead, "5" for Principal/Executive
}

Rules:
- Normalize job title to standard format
- Extract city name only for location
- Map experience level to number string
- Return ONLY valid JSON

Output:`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a data formatter. Always return valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.1,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const formatted = JSON.parse(data.choices[0].message.content);

    console.log("✅ AI formatted for Apify:", formatted);

    return {
      jobTitle: formatted.jobTitle,
      location: formatted.location,
      experienceLevel: formatted.experienceLevel,
    };
  } catch (error) {
    console.error("❌ AI formatting error:", error);
    return basicFormatForApify(scrapedData);
  }
}

/**
 * Fallback: Basic formatting without AI
 */
function basicFormatForApify(scrapedData: any): {
  jobTitle: string;
  location: string;
  experienceLevel: string;
} {
  const mapExperienceLevel = (level: string | null): string => {
    if (!level) return "3";
    const normalized = level.toLowerCase();
    if (normalized.includes("entry") || normalized.includes("junior"))
      return "1";
    if (normalized.includes("mid")) return "2";
    if (normalized.includes("senior") || normalized.includes("sr")) return "3";
    if (normalized.includes("lead") || normalized.includes("staff")) return "4";
    if (
      normalized.includes("principal") ||
      normalized.includes("executive") ||
      normalized.includes("director")
    )
      return "5";
    return "3";
  };

  return {
    jobTitle: scrapedData.jobTitle || scrapedData.roleTitle || "Software Engineer",
    location: scrapedData.location || "Amsterdam",
    experienceLevel: mapExperienceLevel(scrapedData.experienceLevel),
  };
}

/**
 * Step 2: Analyze Apify response and format into PayCard structure
 * AI is BOUNDED to analyzing only the data from Apify response
 */
export async function analyzeAndFormatPayCard(
  apifyJobs: any[],
  originalJobData: any
): Promise<any> {
  if (!OPENAI_API_KEY) {
    console.warn("⚠️ OPENAI_API_KEY not configured, using basic analysis");
    return basicAnalyzePayCard(apifyJobs, originalJobData);
  }

  try {
    console.log(`🤖 AI analyzing ${apifyJobs.length} jobs from Apify...`);

    // Prepare job data for AI (limit to essential fields to reduce tokens)
    const jobSummaries = apifyJobs.slice(0, 50).map((job, idx) => ({
      index: idx + 1,
      title: job.title,
      company: job.companyName,
      location: job.location,
      salary: job.salary || "Not disclosed",
      description: job.description?.substring(0, 500) || "", // First 500 chars
      experienceLevel: job.experienceLevel,
      contractType: job.contractType,
    }));

    const prompt = `You are a salary market analyst. Analyze ONLY the following ${apifyJobs.length} job postings and generate a PayCard structure.

ORIGINAL JOB:
- Title: ${originalJobData.jobTitle}
- Location: ${originalJobData.location}
- Experience Level: ${originalJobData.experienceLevel}

SCRAPED JOBS FROM LINKEDIN (${apifyJobs.length} jobs):
${JSON.stringify(jobSummaries, null, 2)}

YOUR TASK:
Analyze ONLY these ${apifyJobs.length} jobs. Do NOT use external knowledge or make assumptions beyond this data.

1. Extract ALL salary mentions (explicit and implicit in descriptions)
2. Calculate market compensation ranges
3. Generate insights based ONLY on patterns you see in these jobs
4. Create contextual recommendations

Required Output Format:
{
  "marketCompensation": [
    { "label": "Base", "value": "€XX–€XX" },
    { "label": "Total comp", "value": "€XX–€XX" },
    { "label": "Sample range", "value": "actual salary from data" }
  ],
  "recommendedRange": "recommended hiring range based on data",
  "location": "${originalJobData.location}",
  "currency": "EUR or USD or GBP based on location",
  "brutalTruth": "harsh reality based on salary data found",
  "redFlags": ["red flag 1", "red flag 2", "red flag 3"],
  "donts": ["dont 1", "dont 2", "dont 3"],
  "fixes": ["fix 1", "fix 2", "fix 3"],
  "hiddenBottleneck": "insight from analyzing these jobs",
  "timelineToFailure": "timeline-related insight",
  "metadata": {
    "jobsAnalyzed": ${apifyJobs.length},
    "jobsWithSalary": number of jobs with salary info,
    "salaryDataQuality": "high/medium/low based on data found",
    "insights": ["key insight 1", "key insight 2"]
  }
}

CRITICAL RULES:
- Base everything on the ${apifyJobs.length} jobs provided
- If only 2 jobs have salary, say "Based on 2 salary data points"
- Extract salary from descriptions like "competitive salary", "€80k-100k", etc.
- Be honest about data quality
- Generate brutal truths based on actual patterns seen
- Return ONLY valid JSON

Output:`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a salary market analyst. Analyze only the provided data. Do not make assumptions beyond what is given. Always return valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const payCardData = JSON.parse(data.choices[0].message.content);

    console.log("✅ AI generated PayCard:", {
      jobsAnalyzed: payCardData.metadata?.jobsAnalyzed,
      salaryQuality: payCardData.metadata?.salaryDataQuality,
    });

    return payCardData;
  } catch (error) {
    console.error("❌ AI analysis error:", error);
    return basicAnalyzePayCard(apifyJobs, originalJobData);
  }
}

/**
 * Fallback: Basic analysis without AI
 */
function basicAnalyzePayCard(apifyJobs: any[], originalJobData: any): any {
  // Extract salaries
  const jobsWithSalary = apifyJobs.filter(
    (job) => job.salary && job.salary.trim() !== ""
  );

  console.log(
    `💰 ${jobsWithSalary.length}/${apifyJobs.length} jobs have salary data`
  );

  // Basic salary parsing
  const salaries: number[] = [];
  jobsWithSalary.forEach((job) => {
    const match = job.salary.match(/(\d+[,.]?\d*)\s*k?/gi);
    if (match) {
      match.forEach((m: string) => {
        let val = parseFloat(m.replace(/,/g, ""));
        if (m.toLowerCase().includes("k") && val < 1000) val *= 1000;
        if (val > 10000 && val < 500000) salaries.push(val);
      });
    }
  });

  if (salaries.length === 0) {
    return {
      marketCompensation: [
        { label: "Base", value: "Data not available" },
        { label: "Total comp", value: "Data not available" },
        { label: "Note", value: "No salary data in scraped jobs" },
      ],
      recommendedRange: "Unable to determine - no salary data found",
      location: originalJobData.location,
      currency: "EUR",
      brutalTruth: `We scraped ${apifyJobs.length} jobs but none listed salaries. This is the harsh reality of the market.`,
      redFlags: [
        "No transparency in job market for this role",
        "Companies hiding compensation",
        "Difficult to benchmark without data",
      ],
      donts: [
        "Don't hide comp when competitors are too",
        "Don't assume market rate without data",
        "Don't lose candidates to transparent companies",
      ],
      fixes: [
        "Be the transparent employer in this market",
        "Post salary range to stand out",
        "Survey candidates about their expectations",
      ],
      hiddenBottleneck: "Salary transparency is rare in this market",
      timelineToFailure: "Without clear comp, expect 40% higher dropout rate",
      metadata: {
        jobsAnalyzed: apifyJobs.length,
        jobsWithSalary: 0,
        salaryDataQuality: "none",
        insights: ["No salary data found in market"],
      },
    };
  }

  // Calculate ranges
  salaries.sort((a, b) => a - b);
  const min = salaries[0];
  const max = salaries[salaries.length - 1];
  const avg = salaries.reduce((a, b) => a + b, 0) / salaries.length;

  const formatCurrency = (amount: number) =>
    `€${Math.round(amount / 1000)}k`;

  return {
    marketCompensation: [
      { label: "Base", value: `${formatCurrency(min)}–${formatCurrency(max)}` },
      {
        label: "Total comp",
        value: `${formatCurrency(min * 1.1)}–${formatCurrency(max * 1.15)}`,
      },
      {
        label: "Sample",
        value: jobsWithSalary[0]?.salary || "N/A",
      },
    ],
    recommendedRange: `${formatCurrency(avg * 0.95)}–${formatCurrency(avg * 1.1)} for competitive offer`,
    location: originalJobData.location,
    currency: "EUR",
    brutalTruth: `Based on ${salaries.length} salary data points from ${apifyJobs.length} jobs. If you offer below ${formatCurrency(min)}, you're not competitive.`,
    redFlags: [
      `Only ${jobsWithSalary.length} out of ${apifyJobs.length} jobs disclosed salary`,
      "Low transparency in this market",
      "Candidates comparing across multiple offers",
    ],
    donts: [
      "Don't offer below market minimum",
      "Don't hide comp in this competitive market",
      `Don't expect ${originalJobData.experienceLevel || "senior"} talent at junior rates`,
    ],
    fixes: [
      "Align budget with market data",
      "Be transparent about compensation",
      "Move fast - market is competitive",
    ],
    hiddenBottleneck: "Salary transparency is limited in this market",
    timelineToFailure:
      "Delayed comp discussions = 50% candidate dropout risk",
    metadata: {
      jobsAnalyzed: apifyJobs.length,
      jobsWithSalary: jobsWithSalary.length,
      salaryDataQuality:
        salaries.length >= 10 ? "high" : salaries.length >= 5 ? "medium" : "low",
      insights: [
        `${jobsWithSalary.length} jobs had salary data`,
        `Range: ${formatCurrency(min)} to ${formatCurrency(max)}`,
      ],
    },
  };
}
