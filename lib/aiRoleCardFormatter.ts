/**
 * AI Role Card Formatter
 * Uses scraped job data (from ScrapingBee) and formats it for RoleCard UI
 * NO APIFY - just AI analysis of existing scraped data
 */

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export interface RoleCardData {
  roleSummary: string;
  outcomes: string[];
  redFlags: string[];
  donts: string[];
  fixes: string[];
  brutalTruth: string;
  whatGreatLooksLike?: string[];
}

/**
 * Format scraped job data for Role Card using AI
 * Uses only the data already scraped from ScrapingBee
 */
export async function formatRoleCardFromScrapedData(
  scrapedJobData: any
): Promise<RoleCardData> {
  if (!OPENAI_API_KEY) {
    console.warn("⚠️ OPENAI_API_KEY not configured, using basic formatting");
    return basicFormatRoleCard(scrapedJobData);
  }

  try {
    console.log("🤖 AI formatting Role Card from scraped data...");
    console.log("📥 Job Title:", scrapedJobData.jobTitle || scrapedJobData.roleTitle);
    console.log("📥 Company:", scrapedJobData.company);

    const prompt = `You are a hiring expert. Analyze this job posting data and create a Role Card.

JOB DATA (from scraped job posting):
${JSON.stringify(scrapedJobData, null, 2)}

YOUR TASK:
Create a clear, actionable Role Card based ONLY on this job data.

Required Output Format:
{
  "roleSummary": "One sentence summary of what this person actually does (be specific, not generic)",
  "outcomes": [
    "5 specific outcomes expected in first 12 months",
    "Focus on deliverables not activities",
    "Each should be measurable",
    "Each 3-8 words"
  ],
  "redFlags": [
    "3 red flags in this job description",
    "Things that would concern a senior candidate",
    "Be brutally honest"
  ],
  "donts": [
    "3 things NOT to do when hiring for this",
    "Common mistakes to avoid",
    "Practical advice"
  ],
  "fixes": [
    "3 actionable fixes to improve hiring",
    "Specific and tactical",
    "Based on the role requirements"
  ],
  "brutalTruth": "One harsh reality about this role (be honest and direct)",
  "whatGreatLooksLike": [
    "4 traits of a great hire for this role",
    "Each 2-5 words",
    "Specific to this job"
  ]
}

RULES:
- Base everything on the scraped job data
- Be specific, not generic
- Focus on OUTCOMES not tasks
- Be brutally honest about red flags
- Make it actionable
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
              "You are a hiring expert. Create actionable Role Cards from job postings. Always return valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.4,
        response_format: { type: "json_object" },
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const roleCardData = JSON.parse(data.choices[0].message.content);

    console.log("✅ AI generated Role Card");
    console.log("   Role Summary:", roleCardData.roleSummary);
    console.log("   Outcomes:", roleCardData.outcomes?.length || 0);
    console.log("   Red Flags:", roleCardData.redFlags?.length || 0);

    return roleCardData;
  } catch (error) {
    console.error("❌ AI Role Card formatting error:", error);
    return basicFormatRoleCard(scrapedJobData);
  }
}

/**
 * Fallback: Basic formatting without AI
 */
function basicFormatRoleCard(scrapedJobData: any): RoleCardData {
  const jobTitle = scrapedJobData.jobTitle || scrapedJobData.roleTitle || "Unknown Role";
  const company = scrapedJobData.company || "Company";
  
  return {
    roleSummary: `${jobTitle} at ${company} responsible for key deliverables and outcomes.`,
    outcomes: [
      "Deliver on key responsibilities",
      "Collaborate with cross-functional teams",
      "Drive results in assigned area",
      "Meet performance objectives",
      "Contribute to team success",
    ],
    redFlags: [
      "Generic job description",
      "Unclear success metrics",
      "Vague responsibilities",
    ],
    donts: [
      "Copy competitor job descriptions",
      "Hide complexity of the role",
      "List too many responsibilities",
    ],
    fixes: [
      "Define clear success metrics",
      "Focus on outcomes not tasks",
      "Be transparent about challenges",
    ],
    brutalTruth:
      "Without clear outcomes, you'll hire based on gut feel, not fit.",
    whatGreatLooksLike: [
      "Clear ownership",
      "Strong execution",
      "Team collaboration",
      "Results-driven",
    ],
  };
}
