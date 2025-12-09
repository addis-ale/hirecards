/**
 * Data Transformers
 * Transforms scraped LinkedIn jobs and profiles into card-specific data structures
 */

import { BulkLinkedInJob } from "./apifyClient";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * Main function to transform all scraped data into card structures
 */
export async function transformScrapedDataToCards(data: {
  jobsPayCard?: any[];
  jobsMarketCard?: any[];
  profiles?: any[];
  originalJobData?: any;
}): Promise<{
  marketCard?: any;
  payCard?: any;
  skillCard?: any;
  talentMapCard?: any;
  roleCard?: any;
  realityCard?: any;
  funnelCard?: any;
  fitCard?: any;
  messageCard?: any;
  outreachCard?: any;
  interviewCard?: any;
  scorecardCard?: any;
  planCard?: any;
}> {
  console.log("🔄 Transforming scraped data to card structures...");

  const results: any = {};

  // Transform Market Card
  if (data.jobsMarketCard && data.profiles) {
    try {
      results.marketCard = await transformToMarketCard(
        data.jobsMarketCard,
        data.profiles,
        data.originalJobData
      );
    } catch (e) {
      console.error("❌ Market Card transformation error:", e);
    }
  }

  // Transform Pay Card
  if (data.jobsPayCard) {
    try {
      results.payCard = await transformToPayCard(
        data.jobsPayCard,
        data.originalJobData
      );
    } catch (e) {
      console.error("❌ Pay Card transformation error:", e);
    }
  }

  // Transform Skill Card - prioritize original JD data
  if (data.originalJobData || data.profiles || data.jobsMarketCard) {
    try {
      results.skillCard = await transformToSkillCard(
        data.profiles || [],
        data.jobsMarketCard || [],
        data.originalJobData
      );
    } catch (e) {
      console.error("❌ Skill Card transformation error:", e);
    }
  }

  // Transform Talent Map Card
  if (data.profiles) {
    try {
      results.talentMapCard = await transformToTalentMapCard(data.profiles);
    } catch (e) {
      console.error("❌ Talent Map Card transformation error:", e);
    }
  }

  // Transform Role Card
  if (data.jobsMarketCard || data.jobsPayCard) {
    try {
      results.roleCard = await transformToRoleCard(
        data.jobsMarketCard || data.jobsPayCard || [],
        data.originalJobData
      );
    } catch (e) {
      console.error("❌ Role Card transformation error:", e);
    }
  }

  // Transform Reality Card
  if (data.jobsMarketCard && data.profiles) {
    try {
      results.realityCard = await transformToRealityCard(
        data.jobsMarketCard,
        data.profiles,
        data.originalJobData
      );
    } catch (e) {
      console.error("❌ Reality Card transformation error:", e);
    }
  }

  // Transform Funnel Card
  if (data.jobsMarketCard && data.profiles) {
    try {
      results.funnelCard = await transformToFunnelCard(
        data.jobsMarketCard,
        data.profiles
      );
    } catch (e) {
      console.error("❌ Funnel Card transformation error:", e);
    }
  }

  // Transform Fit Card
  if (data.profiles) {
    try {
      results.fitCard = await transformToFitCard(data.profiles);
    } catch (e) {
      console.error("❌ Fit Card transformation error:", e);
    }
  }

  // Transform Message Card
  if (data.jobsMarketCard && data.profiles) {
    try {
      results.messageCard = await transformToMessageCard(
        data.jobsMarketCard,
        data.profiles,
        data.originalJobData
      );
    } catch (e) {
      console.error("❌ Message Card transformation error:", e);
    }
  }

  // Transform Outreach Card
  if (data.profiles) {
    try {
      results.outreachCard = await transformToOutreachCard(data.profiles);
    } catch (e) {
      console.error("❌ Outreach Card transformation error:", e);
    }
  }

  // Transform Interview Card
  if (data.jobsMarketCard) {
    try {
      results.interviewCard = await transformToInterviewCard(
        data.jobsMarketCard
      );
    } catch (e) {
      console.error("❌ Interview Card transformation error:", e);
    }
  }

  // Transform Scorecard Card
  if (data.jobsMarketCard && data.profiles) {
    try {
      results.scorecardCard = await transformToScorecardCard(
        data.jobsMarketCard,
        data.profiles
      );
    } catch (e) {
      console.error("❌ Scorecard Card transformation error:", e);
    }
  }

  // Transform Plan Card
  if (data.jobsMarketCard && data.profiles) {
    try {
      results.planCard = await transformToPlanCard(
        data.jobsMarketCard,
        data.profiles
      );
    } catch (e) {
      console.error("❌ Plan Card transformation error:", e);
    }
  }

  console.log("✅ Transformation complete:", Object.keys(results));
  return results;
}

/**
 * Transform to Market Card structure
 */
async function transformToMarketCard(
  jobs: any[],
  profiles: any[],
  originalJobData?: any
): Promise<any> {
  if (OPENAI_API_KEY) {
    return await aiTransformMarketCard(jobs, profiles, originalJobData);
  }
  return basicTransformMarketCard(jobs, profiles, originalJobData);
}

/**
 * Transform to Pay Card structure
 */
async function transformToPayCard(
  jobs: any[],
  originalJobData?: any
): Promise<any> {
  if (OPENAI_API_KEY) {
    return await aiTransformPayCard(jobs, originalJobData);
  }
  return basicTransformPayCard(jobs, originalJobData);
}

/**
 * Transform to Skill Card structure
 */
async function transformToSkillCard(
  profiles: any[],
  jobs: any[],
  originalJobData?: any
): Promise<any> {
  if (OPENAI_API_KEY) {
    return await aiTransformSkillCard(profiles, jobs, originalJobData);
  }
  return basicTransformSkillCard(profiles, jobs);
}

/**
 * Transform to Talent Map Card structure
 */
async function transformToTalentMapCard(profiles: any[]): Promise<any> {
  if (OPENAI_API_KEY) {
    return await aiTransformTalentMapCard(profiles);
  }
  return basicTransformTalentMapCard(profiles);
}

/**
 * Transform to Role Card structure
 */
async function transformToRoleCard(
  jobs: any[],
  originalJobData?: any
): Promise<any> {
  if (OPENAI_API_KEY) {
    return await aiTransformRoleCard(jobs, originalJobData);
  }
  return basicTransformRoleCard(jobs, originalJobData);
}

/**
 * Transform to Reality Card structure
 */
async function transformToRealityCard(
  jobs: any[],
  profiles: any[],
  originalJobData?: any
): Promise<any> {
  if (OPENAI_API_KEY) {
    return await aiTransformRealityCard(jobs, profiles, originalJobData);
  }
  return basicTransformRealityCard(jobs, profiles, originalJobData);
}

/**
 * Transform to Funnel Card structure
 */
async function transformToFunnelCard(
  jobs: any[],
  profiles: any[]
): Promise<any> {
  if (OPENAI_API_KEY) {
    return await aiTransformFunnelCard(jobs, profiles);
  }
  return basicTransformFunnelCard(jobs, profiles);
}

/**
 * Transform to Fit Card structure
 */
async function transformToFitCard(profiles: any[]): Promise<any> {
  if (OPENAI_API_KEY) {
    return await aiTransformFitCard(profiles);
  }
  return basicTransformFitCard(profiles);
}

/**
 * Transform to Message Card structure
 */
async function transformToMessageCard(
  jobs: any[],
  profiles: any[],
  originalJobData?: any
): Promise<any> {
  if (OPENAI_API_KEY) {
    return await aiTransformMessageCard(jobs, profiles, originalJobData);
  }
  return basicTransformMessageCard(jobs, profiles, originalJobData);
}

/**
 * Transform to Outreach Card structure
 */
async function transformToOutreachCard(profiles: any[]): Promise<any> {
  if (OPENAI_API_KEY) {
    return await aiTransformOutreachCard(profiles);
  }
  return basicTransformOutreachCard(profiles);
}

/**
 * Transform to Interview Card structure
 */
async function transformToInterviewCard(jobs: any[]): Promise<any> {
  if (OPENAI_API_KEY) {
    return await aiTransformInterviewCard(jobs);
  }
  return basicTransformInterviewCard(jobs);
}

/**
 * Transform to Scorecard Card structure
 */
async function transformToScorecardCard(
  jobs: any[],
  profiles: any[]
): Promise<any> {
  if (OPENAI_API_KEY) {
    return await aiTransformScorecardCard(jobs, profiles);
  }
  return basicTransformScorecardCard(jobs, profiles);
}

/**
 * Transform to Plan Card structure
 */
async function transformToPlanCard(jobs: any[], profiles: any[]): Promise<any> {
  if (OPENAI_API_KEY) {
    return await aiTransformPlanCard(jobs, profiles);
  }
  return basicTransformPlanCard(jobs, profiles);
}

// ============================================================================
// AI TRANSFORMATION FUNCTIONS
// ============================================================================

async function aiTransformMarketCard(
  jobs: any[],
  profiles: any[],
  originalJobData?: any
): Promise<any> {
  try {
    const jobsSummary = {
      total: jobs.length,
      titles: jobs.slice(0, 10).map((j) => j.title || j.jobTitle),
      companies: jobs.slice(0, 20).map((j) => j.company?.name || j.companyName),
      locations: jobs.map((j) => j.location?.parsed?.city || j.location),
      applicants: jobs.map((j) => j.applicants || 0),
    };

    const profilesSummary = {
      total: profiles.length,
      locations: profiles.map((p) => p.location?.parsed?.city || p.location),
      currentCompanies: profiles
        .filter((p) => p.currentPosition?.[0]?.companyName)
        .map((p) => p.currentPosition[0].companyName),
      openToWork: profiles.filter((p) => p.openToWork).length,
      skills: profiles
        .filter((p) => p.skills)
        .flatMap((p) => p.skills.map((s: any) => s.name || s))
        .slice(0, 30),
    };

    const prompt = `Analyze this market data and generate a Market Card structure.

JOBS DATA (${jobs.length} jobs):
${JSON.stringify(jobsSummary, null, 2)}

PROFILES DATA (${profiles.length} profiles):
${JSON.stringify(profilesSummary, null, 2)}

ORIGINAL JOB:
${JSON.stringify(originalJobData || {}, null, 2)}

Generate this EXACT structure:
{
  "talentAvailability": {
    "total": number,
    "qualified": number,
    "currentlyEmployed": number,
    "openToWork": number
  },
  "supplyDemand": {
    "openJobs": number,
    "availableCandidates": number,
    "ratio": "X:Y",
    "marketTightness": "tight|balanced|loose"
  },
  "insights": ["insight1", "insight2", "insight3"],
  "redFlags": ["flag1", "flag2"],
  "opportunities": ["opp1", "opp2"],
  "geographic": {
    "primaryLocations": ["loc1", "loc2"],
    "remoteAvailability": number
  },
  "primaryLocation": "${
    originalJobData?.location ||
    originalJobData?.jobLocation ||
    "Primary Location"
  }",
  "talentSupply": {
    "midLevel": "High|Medium|Low|Very low (based on actual profile data)",
    "senior": "High|Medium|Low|Very low (based on actual profile data)",
    "productMinded": "High|Medium|Low|Very low (based on actual profile data and role requirements)"
  }
}

IMPORTANT: Calculate talentSupply levels based on:
- Number of profiles matching each experience level (mid-level, senior)
- Number of profiles with product/ownership experience vs pure technical
- Market tightness and supply/demand ratios
- Use actual data from profiles, not assumptions

Return ONLY valid JSON.`;

    const response = await callOpenAI(prompt);
    return response;
  } catch (e) {
    console.error("AI Market Card error:", e);
    return basicTransformMarketCard(jobs, profiles, originalJobData);
  }
}

async function aiTransformPayCard(
  jobs: any[],
  originalJobData?: any
): Promise<any> {
  try {
    const salaries = jobs
      .filter((j) => j.salary)
      .map((j) => ({
        min: j.salary.min,
        max: j.salary.max,
        currency: j.salary.currency,
        text: j.salary.text,
      }));

    const prompt = `Analyze salary data from ${
      jobs.length
    } jobs and generate Pay Card structure.

SALARY DATA:
${JSON.stringify(salaries.slice(0, 20), null, 2)}

ORIGINAL JOB:
${JSON.stringify(originalJobData || {}, null, 2)}

Generate:
{
  "marketCompensation": [
    {"label": "Base", "value": "€XX–€XX"},
    {"label": "Total comp", "value": "€XX–€XX"},
    {"label": "Published range", "value": "€XX–€XX/month"}
  ],
  "recommendedRange": "€XX–€XX for top-tier senior",
  "location": "city name",
  "currency": "EUR|USD|GBP",
  "brutalTruth": "harsh reality",
  "redFlags": ["flag1", "flag2", "flag3"],
  "donts": ["dont1", "dont2", "dont3"],
  "fixes": ["fix1", "fix2", "fix3"],
  "hiddenBottleneck": "bottleneck",
  "timelineToFailure": "timeline issue"
}

Return ONLY valid JSON.`;

    const response = await callOpenAI(prompt);
    return response;
  } catch (e) {
    console.error("AI Pay Card error:", e);
    return basicTransformPayCard(jobs, originalJobData);
  }
}

async function aiTransformSkillCard(
  profiles: any[],
  jobs: any[],
  originalJobData?: any
): Promise<any> {
  try {
    // Prioritize original JD data - if available, use it primarily
    const hasOriginalJD = originalJobData && (
      originalJobData.description || 
      originalJobData.descriptionText || 
      originalJobData.jobDescription ||
      originalJobData.requirements ||
      originalJobData.skills
    );

    let prompt = "";

    if (hasOriginalJD) {
      // PRIMARY: Use original JD data
      const jdText = originalJobData.description || 
                     originalJobData.descriptionText || 
                     originalJobData.jobDescription || 
                     "";
      const jdRequirements = originalJobData.requirements || 
                             originalJobData.skills || 
                             originalJobData.requiredSkills || 
                             [];
      const jdTitle = originalJobData.jobTitle || 
                      originalJobData.title || 
                      originalJobData.role || 
                      "";

      prompt = `Analyze the USER'S JOB DESCRIPTION to generate a Skill Card. This is the PRIMARY source - base everything on this JD.

USER'S JOB DESCRIPTION:
Title: ${jdTitle}
Description: ${jdText.substring(0, 2000)}
Requirements/Skills: ${Array.isArray(jdRequirements) ? JSON.stringify(jdRequirements) : jdRequirements}

${jobs.length > 0 ? `\nADDITIONAL CONTEXT (LinkedIn similar jobs - use only for reference, not primary source):\n${JSON.stringify(jobs.slice(0, 3).map((j: any) => ({
  title: j.title,
  description: (j.descriptionText || j.description || "").substring(0, 500)
})), null, 2)}` : ""}

YOUR TASK:
Generate a comprehensive Skill Card based PRIMARILY on the user's job description above. 
- Extract technical skills directly from the JD requirements and description
- Identify product-focused skills mentioned in the JD
- Determine behavioural skills needed based on the role description
- Distinguish between skills that can be trained quickly vs must-haves at entry
- Provide honest insights about skill requirements based on the JD

Generate a complete JSON object with ALL fields (arrays should have at least 3-5 items, strings should be meaningful):
{
  "technicalSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "productSkills": ["skill1", "skill2", "skill3"],
  "behaviouralSkills": ["skill1", "skill2", "skill3", "skill4"],
  "brutalTruth": "truth about skills based on the job description",
  "redFlags": ["flag1", "flag2", "flag3", "flag4"],
  "donts": ["dont1", "dont2", "dont3"],
  "upskillableSkills": ["skill1", "skill2", "skill3", "skill4"],
  "mustHaveSkills": ["skill1", "skill2", "skill3", "skill4"]
}

IMPORTANT: 
- Base ALL content on the user's job description (PRIMARY source)
- Only use LinkedIn jobs as reference/context, not as primary source
- ALL fields are required - do not leave any empty
- Arrays must have at least 3 items each
- Be specific and actionable based on the JD

Return ONLY valid JSON.`;
    } else {
      // FALLBACK: If no JD, generate from AI knowledge (not LinkedIn profiles)
      prompt = `Generate a Skill Card based on general hiring best practices. Do NOT use LinkedIn profile data.

YOUR TASK:
Generate a comprehensive Skill Card for a hiring role. Since no specific job description was provided, create a well-structured skill framework that can be customized.

Generate a complete JSON object with ALL fields (arrays should have at least 3-5 items, strings should be meaningful):
{
  "technicalSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "productSkills": ["skill1", "skill2", "skill3"],
  "behaviouralSkills": ["skill1", "skill2", "skill3", "skill4"],
  "brutalTruth": "truth about skills for this type of role",
  "redFlags": ["flag1", "flag2", "flag3", "flag4"],
  "donts": ["dont1", "dont2", "dont3"],
  "upskillableSkills": ["skill1", "skill2", "skill3", "skill4"],
  "mustHaveSkills": ["skill1", "skill2", "skill3", "skill4"]
}

IMPORTANT: 
- ALL fields are required - do not leave any empty
- Arrays must have at least 3 items each
- Base on hiring best practices, not LinkedIn data
- Be specific and actionable

Return ONLY valid JSON.`;
    }

    const response = await callOpenAI(prompt);
    return response;
  } catch (e) {
    console.error("AI Skill Card error:", e);
    return basicTransformSkillCard(profiles, jobs);
  }
}

async function aiTransformTalentMapCard(profiles: any[]): Promise<any> {
  try {
    // Get current companies
    const currentCompanies = profiles
      .filter((p) => p.currentPosition?.[0]?.companyName)
      .map((p) => p.currentPosition[0].companyName);

    // Get all companies from career history
    const allCompaniesFromHistory: string[] = [];
    profiles.forEach((p) => {
      if (p.experience && Array.isArray(p.experience)) {
        p.experience.forEach((e: any) => {
          if (e.companyName) {
            allCompaniesFromHistory.push(e.companyName);
          }
        });
      }
    });

    // Count company frequency (current + history)
    const companyFrequency: { [key: string]: number } = {};
    currentCompanies.forEach((c) => {
      companyFrequency[c] = (companyFrequency[c] || 0) + 2; // Weight current companies more
    });
    allCompaniesFromHistory.forEach((c) => {
      companyFrequency[c] = (companyFrequency[c] || 0) + 1;
    });

    // Get top companies by frequency
    const topCompaniesByFreq = Object.entries(companyFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([company]) => company);

    // Get career paths (sequences of companies)
    const careerPaths = profiles
      .filter(
        (p) =>
          p.experience && Array.isArray(p.experience) && p.experience.length > 1
      )
      .map((p) => {
        const companies = p.experience
          .map((e: any) => e.companyName)
          .filter(Boolean)
          .slice(-3); // Last 3 companies
        return companies.join(" → ");
      })
      .filter((path) => path.includes("→"))
      .slice(0, 30);

    const prompt = `Analyze talent sources from ${
      profiles.length
    } LinkedIn profiles.

CURRENT COMPANIES (where candidates work now):
${JSON.stringify(currentCompanies.slice(0, 15), null, 2)}

TOP COMPANIES BY FREQUENCY (current + career history):
${JSON.stringify(topCompaniesByFreq, null, 2)}

CAREER PATHS (company transitions):
${JSON.stringify(careerPaths.slice(0, 20), null, 2)}

YOUR TASK:
Identify where the best talent for this role comes from based on:
1. Companies where most candidates currently work (primary sources)
2. Companies in their career history (secondary sources)
3. Common career transitions (talent flow patterns)

Generate:
{
  "primaryFeeders": ["company1", "company2", "company3", "company4", "company5", "company6", "company7", "company8"],
  "secondaryFeeders": ["company1", "company2", "company3", "company4"],
  "avoidList": ["type1", "type2", "type3", "type4"],
  "brutalTruth": "truth about talent sourcing based on actual data",
  "redFlags": ["flag1", "flag2"],
  "donts": ["dont1", "dont2"],
  "fixes": ["fix1", "fix2"],
  "hiddenBottleneck": "bottleneck",
  "talentFlowMap": [
    {"flow": "Flow Name", "path": "Company1 → Company2 → Company3", "note": "insight based on actual career paths"}
  ],
  "personaInsights": [
    {"type": "Persona Type", "motivated": "what", "needs": "what", "hates": "what"}
  ]
}

IMPORTANT: Base primaryFeeders on companies with highest frequency (current + history). Base secondaryFeeders on companies that appear frequently but less than primary. Identify talentFlowMap from actual career path patterns you see.

Return ONLY valid JSON.`;

    const response = await callOpenAI(prompt);
    return response;
  } catch (e) {
    console.error("AI Talent Map Card error:", e);
    return basicTransformTalentMapCard(profiles);
  }
}

async function aiTransformRoleCard(
  jobs: any[],
  originalJobData?: any
): Promise<any> {
  try {
    // Prioritize original JD data - if available, use it primarily
    const hasOriginalJD = originalJobData && (
      originalJobData.description || 
      originalJobData.descriptionText || 
      originalJobData.jobDescription ||
      originalJobData.responsibilities ||
      originalJobData.requirements
    );

    let prompt = "";

    if (hasOriginalJD) {
      // PRIMARY: Use original JD data
      const jdText = originalJobData.description || 
                     originalJobData.descriptionText || 
                     originalJobData.jobDescription || 
                     "";
      const jdResponsibilities = originalJobData.responsibilities || 
                                 originalJobData.keyResponsibilities || 
                                 [];
      const jdTitle = originalJobData.jobTitle || 
                      originalJobData.title || 
                      originalJobData.role || 
                      "";
      const jdRequirements = originalJobData.requirements || 
                             originalJobData.requiredSkills || 
                             [];

      prompt = `Analyze the USER'S JOB DESCRIPTION to generate a Role Card. This is the PRIMARY source - base everything on this JD.

USER'S JOB DESCRIPTION:
Title: ${jdTitle}
Description: ${jdText.substring(0, 2000)}
Responsibilities: ${Array.isArray(jdResponsibilities) ? JSON.stringify(jdResponsibilities) : jdResponsibilities}
Requirements: ${Array.isArray(jdRequirements) ? JSON.stringify(jdRequirements) : jdRequirements}

${jobs.length > 0 ? `\nADDITIONAL CONTEXT (LinkedIn similar jobs - use only for reference, not primary source):\n${JSON.stringify(jobs.slice(0, 2).map((j: any) => ({
  title: j.title,
  description: (j.descriptionText || j.description || "").substring(0, 500)
})), null, 2)}` : ""}

YOUR TASK:
Generate a Role Card based PRIMARILY on the user's job description above.
- Extract role summary from the JD title and description
- Identify key outcomes/results expected from the role description
- Determine what great performance looks like based on the JD
- Provide honest insights about the role based on the JD
- List warning signs and common mistakes related to this role

Generate:
{
  "roleSummary": "brief summary based on the JD",
  "outcomes": ["outcome1", "outcome2", "outcome3", "outcome4", "outcome5"],
  "redFlags": ["flag1", "flag2", "flag3"],
  "donts": ["dont1", "dont2", "dont3"],
  "fixes": ["fix1", "fix2", "fix3"],
  "brutalTruth": "truth about this role based on the JD",
  "whatGreatLooksLike": ["trait1", "trait2", "trait3", "trait4", "trait5", "trait6"],
  "roleMission": "mission statement based on JD",
  "jdBefore": "original JD text (first 500 chars)",
  "jdAfter": "improved/refined JD suggestion",
  "commonFailureModes": ["failure1", "failure2", "failure3"]
}

IMPORTANT: 
- Base ALL content on the user's job description (PRIMARY source)
- Only use LinkedIn jobs as reference/context, not as primary source
- ALL fields are required - do not leave any empty
- Arrays must have at least 3-5 items each
- Be specific and actionable based on the JD

Return ONLY valid JSON.`;
    } else {
      // FALLBACK: If no JD, generate from AI knowledge (not LinkedIn jobs)
      prompt = `Generate a Role Card based on general hiring best practices. Do NOT use LinkedIn job data.

YOUR TASK:
Generate a Role Card for a hiring role. Since no specific job description was provided, create a well-structured role framework that can be customized.

Generate:
{
  "roleSummary": "brief summary",
  "outcomes": ["outcome1", "outcome2", "outcome3", "outcome4", "outcome5"],
  "redFlags": ["flag1", "flag2", "flag3"],
  "donts": ["dont1", "dont2", "dont3"],
  "fixes": ["fix1", "fix2", "fix3"],
  "brutalTruth": "truth about role clarity",
  "whatGreatLooksLike": ["trait1", "trait2", "trait3", "trait4", "trait5", "trait6"],
  "roleMission": "mission statement",
  "jdBefore": "placeholder for original JD",
  "jdAfter": "improved JD suggestion",
  "commonFailureModes": ["failure1", "failure2", "failure3"]
}

IMPORTANT: 
- Base on hiring best practices, not LinkedIn data
- ALL fields are required - do not leave any empty
- Arrays must have at least 3-5 items each

Return ONLY valid JSON.`;
    }

    const response = await callOpenAI(prompt);
    return response;
  } catch (e) {
    console.error("AI Role Card error:", e);
    return basicTransformRoleCard(jobs, originalJobData);
  }
}

async function aiTransformRealityCard(
  jobs: any[],
  profiles: any[],
  originalJobData?: any
): Promise<any> {
  try {
    const prompt = `Analyze market reality from ${jobs.length} jobs and ${profiles.length} profiles.

Generate:
{
  "keyInsights": ["insight1", "insight2", "insight3"],
  "helpsCase": ["help1", "help2", "help3", "help4"],
  "hurtsCase": ["hurt1", "hurt2", "hurt3", "hurt4"],
  "hiddenBottleneck": "bottleneck",
  "timelineToFailure": "timeline",
  "bottomLine1": "positive outcome",
  "bottomLine2": "negative outcome",
  "whatsReallyGoingOn": "assessment",
  "redFlags": ["flag1", "flag2", "flag3", "flag4"],
  "donts": ["dont1", "dont2", "dont3", "dont4"]
}

Return ONLY valid JSON.`;

    const response = await callOpenAI(prompt);
    return response;
  } catch (e) {
    console.error("AI Reality Card error:", e);
    return basicTransformRealityCard(jobs, profiles, originalJobData);
  }
}

async function aiTransformFunnelCard(
  jobs: any[],
  profiles: any[]
): Promise<any> {
  try {
    const prompt = `Calculate funnel metrics from ${jobs.length} jobs and ${profiles.length} profiles.

Generate:
{
  "funnelStages": [
    {"label": "Outreach", "value": "XX–XX"},
    {"label": "Positive replies", "value": "XX–XX"},
    {"label": "Screens", "value": "XX–XX"},
    {"label": "Tech rounds", "value": "XX–XX"},
    {"label": "Finalists", "value": "XX–XX"},
    {"label": "Offers", "value": "XX–XX"},
    {"label": "Hire", "value": "1"}
  ],
  "benchmarks": [
    {"label": "Outbound reply rate", "value": "XX–XX%"},
    {"label": "Tech pass rate", "value": "XX–XX%"},
    {"label": "Offer acceptance", "value": "XX–XX%"}
  ],
  "brutalTruth": "truth",
  "redFlags": ["flag1", "flag2", "flag3", "flag4"],
  "donts": ["dont1", "dont2", "dont3"],
  "fixes": ["fix1", "fix2", "fix3", "fix4"],
  "hiddenBottleneck": "bottleneck",
  "funnelHealthComparison": [
    {"type": "Healthy", "outcome": "Hire in XX–XX days"},
    {"type": "Typical", "outcome": "Hire in XX–XX days"},
    {"type": "Broken", "outcome": "Restart at week X"}
  ]
}

Return ONLY valid JSON.`;

    const response = await callOpenAI(prompt);
    return response;
  } catch (e) {
    console.error("AI Funnel Card error:", e);
    return basicTransformFunnelCard(jobs, profiles);
  }
}

async function aiTransformFitCard(profiles: any[]): Promise<any> {
  try {
    const prompt = `Analyze persona from ${profiles.length} profiles.

Generate:
{
  "persona": "Persona Name",
  "motivatedBy": ["motivation1", "motivation2", "motivation3", "motivation4", "motivation5"],
  "avoids": ["avoid1", "avoid2", "avoid3", "avoid4"],
  "brutalTruth": "truth",
  "redFlags": ["flag1", "flag2", "flag3"],
  "donts": ["dont1", "dont2", "dont3"],
  "fixes": ["fix1", "fix2"],
  "candidateEvaluation": ["criteria1", "criteria2", "criteria3", "criteria4", "criteria5", "criteria6"],
  "decisionMakingYes": ["yes1", "yes2", "yes3", "yes4", "yes5", "yes6"],
  "decisionMakingNo": ["no1", "no2", "no3", "no4", "no5", "no6", "no7"]
}

Return ONLY valid JSON.`;

    const response = await callOpenAI(prompt);
    return response;
  } catch (e) {
    console.error("AI Fit Card error:", e);
    return basicTransformFitCard(profiles);
  }
}

async function aiTransformMessageCard(
  jobs: any[],
  profiles: any[],
  originalJobData?: any
): Promise<any> {
  try {
    const prompt = `Generate messaging from ${jobs.length} jobs and ${profiles.length} profiles.

Generate:
{
  "corePitch": "main differentiator",
  "brutalTruth": "truth",
  "donts": ["dont1", "dont2", "dont3"],
  "fixThisNow": "key differentiator",
  "hiddenBottleneck": "bottleneck",
  "scrollStoppers": ["stopper1", "stopper2", "stopper3"]
}

Return ONLY valid JSON.`;

    const response = await callOpenAI(prompt);
    return response;
  } catch (e) {
    console.error("AI Message Card error:", e);
    return basicTransformMessageCard(jobs, profiles, originalJobData);
  }
}

async function aiTransformOutreachCard(profiles: any[]): Promise<any> {
  try {
    const prompt = `Generate outreach strategy from ${profiles.length} profiles.

Generate:
{
  "introduction": "strategy overview",
  "message1": "first message",
  "message2": "second message",
  "message3": "third message",
  "brutalTruth": "truth",
  "redFlags": ["flag1", "flag2", "flag3", "flag4"],
  "donts": ["dont1", "dont2", "dont3", "dont4"],
  "fixes": ["fix1", "fix2", "fix3", "fix4"],
  "hiddenBottleneck": "bottleneck",
  "timelineToFailure1": "timeline1",
  "timelineToFailure2": "timeline2"
}

Return ONLY valid JSON.`;

    const response = await callOpenAI(prompt);
    return response;
  } catch (e) {
    console.error("AI Outreach Card error:", e);
    return basicTransformOutreachCard(profiles);
  }
}

async function aiTransformInterviewCard(jobs: any[]): Promise<any> {
  try {
    const prompt = `Generate interview process from ${jobs.length} jobs.

Generate:
{
  "optimalLoop": ["step1", "step2", "step3", "step4"],
  "brutalTruth": "truth",
  "redFlags": ["flag1", "flag2", "flag3", "flag4"],
  "donts": ["dont1", "dont2", "dont3"],
  "fixes": ["fix1", "fix2", "fix3"],
  "signalQuestions": ["q1", "q2", "q3", "q4", "q5"]
}

Return ONLY valid JSON.`;

    const response = await callOpenAI(prompt);
    return response;
  } catch (e) {
    console.error("AI Interview Card error:", e);
    return basicTransformInterviewCard(jobs);
  }
}

async function aiTransformScorecardCard(
  jobs: any[],
  profiles: any[]
): Promise<any> {
  try {
    const prompt = `Generate scorecard from ${jobs.length} jobs and ${profiles.length} profiles.

Generate:
{
  "competencies": ["comp1", "comp2", "comp3", "comp4", "comp5", "comp6"],
  "rating1": "slows the team",
  "rating2": "needs coaching",
  "rating3": "independent senior",
  "rating4": "raises the bar",
  "brutalTruth": "truth",
  "donts": ["dont1", "dont2", "dont3"],
  "fixes": ["fix1", "fix2", "fix3"],
  "evaluationMapping": [
    {"stage": "Stage 1 — Recruiter Screen", "competencies": "Communication, Ownership"},
    {"stage": "Stage 2 — Technical Deep Dive", "competencies": "Modelling, Reliability"},
    {"stage": "Stage 3 — Product Collaboration", "competencies": "Product Thinking, Collaboration"},
    {"stage": "Stage 4 — Values & Ownership", "competencies": "Ownership, Communication (advanced)"}
  ]
}

Return ONLY valid JSON.`;

    const response = await callOpenAI(prompt);
    return response;
  } catch (e) {
    console.error("AI Scorecard Card error:", e);
    return basicTransformScorecardCard(jobs, profiles);
  }
}

async function aiTransformPlanCard(jobs: any[], profiles: any[]): Promise<any> {
  try {
    const prompt = `Generate hiring plan from ${jobs.length} jobs and ${profiles.length} profiles.

Generate:
{
  "first7Days": ["task1", "task2", "task3", "task4", "task5", "task6"],
  "weeklyRhythm": ["activity1", "activity2", "activity3", "activity4", "activity5"],
  "brutalTruth": "truth",
  "redFlags": ["flag1", "flag2", "flag3", "flag4"],
  "donts": ["dont1", "dont2", "dont3"],
  "fixes": ["fix1", "fix2", "fix3"],
  "fastestPath": ["path1", "path2", "path3", "path4", "path5", "path6", "path7"]
}

Return ONLY valid JSON.`;

    const response = await callOpenAI(prompt);
    return response;
  } catch (e) {
    console.error("AI Plan Card error:", e);
    return basicTransformPlanCard(jobs, profiles);
  }
}

// ============================================================================
// HELPER: OpenAI API Call
// ============================================================================

async function callOpenAI(prompt: string): Promise<any> {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY not configured");
  }

  try {
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
              "You are a hiring data analyst. Analyze only the provided data. Return ONLY valid JSON, no markdown, no explanations.",
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
      const errorText = await response.text();
      throw new Error(
        `OpenAI API error: ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content in OpenAI response");
    }
    return JSON.parse(content);
  } catch (error: any) {
    console.error("OpenAI API call failed:", error);
    throw error;
  }
}

// ============================================================================
// BASIC TRANSFORMATION FUNCTIONS (Fallback)
// ============================================================================

function basicTransformMarketCard(
  jobs: any[],
  profiles: any[],
  originalJobData?: any
): any {
  const totalJobs = jobs.length;
  const totalProfiles = profiles.length;
  const ratio = totalProfiles > 0 ? totalProfiles / totalJobs : 10;
  const marketTightness =
    ratio < 5 ? "tight" : ratio > 20 ? "loose" : "balanced";

  // Extract primary location from original job data
  const primaryLocation =
    originalJobData?.location ||
    originalJobData?.jobLocation ||
    "Primary Location";

  // Calculate talent supply levels based on scraped data
  let midLevelSupply = "High";
  let seniorSupply = "Low";
  let productMindedSupply = "Very low";

  if (profiles.length > 0) {
    // Analyze profiles by experience level
    const midLevelProfiles = profiles.filter((p: any) => {
      const exp = p.experience || p.yearsOfExperience || 0;
      const title = (
        p.currentPosition?.[0]?.title ||
        p.headline ||
        ""
      ).toLowerCase();
      return (
        (exp >= 2 && exp < 7) ||
        title.includes("mid") ||
        title.includes("middle") ||
        (!title.includes("senior") &&
          !title.includes("junior") &&
          !title.includes("entry"))
      );
    }).length;

    const seniorProfiles = profiles.filter((p: any) => {
      const exp = p.experience || p.yearsOfExperience || 0;
      const title = (
        p.currentPosition?.[0]?.title ||
        p.headline ||
        ""
      ).toLowerCase();
      return (
        exp >= 7 ||
        title.includes("senior") ||
        title.includes("lead") ||
        title.includes("principal")
      );
    }).length;

    // Analyze product-minded profiles (those with product, ownership, or business impact keywords)
    const productMindedProfiles = profiles.filter((p: any) => {
      const headline = (p.headline || "").toLowerCase();
      const summary = (p.summary || "").toLowerCase();
      const skills = (p.skills || [])
        .map((s: any) => (s.name || s).toLowerCase())
        .join(" ");
      const text = `${headline} ${summary} ${skills}`;
      return (
        text.includes("product") ||
        text.includes("ownership") ||
        text.includes("business impact") ||
        text.includes("stakeholder") ||
        text.includes("cross-functional")
      );
    }).length;

    const totalProfilesCount = profiles.length;

    // Calculate supply levels based on ratios
    const midLevelRatio = midLevelProfiles / totalProfilesCount;
    const seniorRatio = seniorProfiles / totalProfilesCount;
    const productMindedRatio = productMindedProfiles / totalProfilesCount;

    // Determine supply levels
    if (midLevelRatio > 0.4) midLevelSupply = "High";
    else if (midLevelRatio > 0.2) midLevelSupply = "Medium";
    else if (midLevelRatio > 0.1) midLevelSupply = "Low";
    else midLevelSupply = "Very low";

    if (seniorRatio > 0.3) seniorSupply = "High";
    else if (seniorRatio > 0.15) seniorSupply = "Medium";
    else if (seniorRatio > 0.05) seniorSupply = "Low";
    else seniorSupply = "Very low";

    if (productMindedRatio > 0.3) productMindedSupply = "High";
    else if (productMindedRatio > 0.15) productMindedSupply = "Medium";
    else if (productMindedRatio > 0.05) productMindedSupply = "Low";
    else productMindedSupply = "Very low";
  } else if (totalJobs > 0) {
    // Estimate based on job market if no profiles
    // More jobs = tighter market = lower supply
    if (totalJobs < 20) {
      midLevelSupply = "High";
      seniorSupply = "Medium";
    } else if (totalJobs < 40) {
      midLevelSupply = "Medium";
      seniorSupply = "Low";
    } else {
      midLevelSupply = "Low";
      seniorSupply = "Very low";
    }
    productMindedSupply = "Very low"; // Always rare
  }

  return {
    talentAvailability: {
      total: totalProfiles || totalJobs * 10,
      qualified: Math.round((totalProfiles || totalJobs * 10) * 0.7),
      currentlyEmployed: 85,
      openToWork: Math.round((totalProfiles || totalJobs * 10) * 0.1),
    },
    supplyDemand: {
      openJobs: totalJobs,
      availableCandidates: totalProfiles || totalJobs * 10,
      ratio: `${Math.round(ratio)}:1`,
      marketTightness,
    },
    insights: [
      `${totalJobs} open positions found`,
      `${totalProfiles || "Estimated"} candidates in market`,
      `Market tightness: ${marketTightness}`,
    ],
    redFlags:
      marketTightness === "tight" ? ["Tight market", "High competition"] : [],
    opportunities: [],
    geographic: {
      primaryLocations: [primaryLocation],
      remoteAvailability: 20,
    },
    primaryLocation: primaryLocation,
    talentSupply: {
      midLevel: midLevelSupply,
      senior: seniorSupply,
      productMinded: productMindedSupply,
    },
  };
}

function basicTransformPayCard(jobs: any[], originalJobData?: any): any {
  const salaries = jobs
    .filter((j) => j.salary)
    .map((j) => ({
      min: j.salary.min,
      max: j.salary.max,
      currency: j.salary.currency || "EUR",
    }));

  if (salaries.length === 0) {
    return {
      marketCompensation: [
        { label: "Base", value: "Data not available" },
        { label: "Total comp", value: "Data not available" },
      ],
      recommendedRange: "Unable to determine",
      location: originalJobData?.location || "Unknown",
      currency: "EUR",
      brutalTruth: "No salary data found in scraped jobs",
      redFlags: ["No transparency"],
      donts: ["Hide comp"],
      fixes: ["Be transparent"],
      hiddenBottleneck: "Salary data unavailable",
      timelineToFailure: "Delayed comp = dropout",
    };
  }

  const min = Math.min(...salaries.map((s) => s.min));
  const max = Math.max(...salaries.map((s) => s.max));
  const currency = salaries[0].currency;

  return {
    marketCompensation: [
      { label: "Base", value: `${currency}${min}k–${currency}${max}k` },
      {
        label: "Total comp",
        value: `${currency}${Math.round(min * 1.1)}k–${currency}${Math.round(
          max * 1.15
        )}k`,
      },
    ],
    recommendedRange: `${currency}${Math.round(
      (min + max) / 2
    )}k for competitive offer`,
    location: originalJobData?.location || "Unknown",
    currency,
    brutalTruth: `Based on ${salaries.length} salary data points`,
    redFlags: ["Limited salary transparency"],
    donts: ["Offer below market"],
    fixes: ["Align with market"],
    hiddenBottleneck: "Comp transparency",
    timelineToFailure: "Delayed comp discussions",
  };
}

function basicTransformSkillCard(profiles: any[], jobs: any[]): any {
  const skills = profiles
    .filter((p) => p.skills)
    .flatMap((p) => p.skills.map((s: any) => s.name || s));

  const skillCounts: { [key: string]: number } = {};
  skills.forEach((skill) => {
    skillCounts[skill] = (skillCounts[skill] || 0) + 1;
  });

  const topSkills = Object.entries(skillCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([skill]) => skill);

  return {
    technicalSkills: topSkills.slice(0, 5),
    productSkills: topSkills.slice(5, 8),
    behaviouralSkills: ["Ownership", "Communication", "Problem-solving"],
    brutalTruth: "Most candidates lack key skills",
    redFlags: ["Missing critical skills"],
    donts: ["Hire without skills"],
    upskillableSkills: topSkills.slice(8, 12),
    mustHaveSkills: topSkills.slice(0, 4),
  };
}

function basicTransformTalentMapCard(profiles: any[]): any {
  const companyCounts: { [key: string]: number } = {};
  const companyWeights: { [key: string]: number } = {}; // Weighted by recency and relevance

  profiles.forEach((profile) => {
    // Count current companies (weight = 2.0 - most important)
    if (profile.currentPosition?.[0]?.companyName) {
      const company = profile.currentPosition[0].companyName;
      companyCounts[company] = (companyCounts[company] || 0) + 1;
      companyWeights[company] = (companyWeights[company] || 0) + 2.0;
    }

    // Count companies from experience history (weight = 1.0 - still important)
    if (profile.experience && Array.isArray(profile.experience)) {
      profile.experience.forEach((exp: any) => {
        if (exp.companyName) {
          const company = exp.companyName;
          companyCounts[company] = (companyCounts[company] || 0) + 1;
          companyWeights[company] = (companyWeights[company] || 0) + 1.0;
        }
      });
    }
  });

  // Sort by weighted score (companies with more candidates + current positions rank higher)
  const topCompanies = Object.entries(companyWeights)
    .sort((a, b) => b[1] - a[1]) // Sort by weight
    .slice(0, 12)
    .map(([company]) => company);

  // If we have fewer than 12 companies, fill with most common by count
  if (topCompanies.length < 12) {
    const byCount = Object.entries(companyCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([company]) => company)
      .filter((c) => !topCompanies.includes(c))
      .slice(0, 12 - topCompanies.length);
    topCompanies.push(...byCount);
  }

  return {
    primaryFeeders: topCompanies.slice(0, 8),
    secondaryFeeders: topCompanies.slice(8, 12),
    avoidList: ["Legacy companies", "Low-quality profiles"],
    brutalTruth: "Top talent comes from top companies",
    redFlags: ["Wrong company background"],
    donts: ["Target wrong companies"],
    fixes: ["Focus on right companies"],
    hiddenBottleneck: "Company targeting",
    talentFlowMap: [
      {
        flow: "Primary Flow",
        path: topCompanies.slice(0, 3).join(" → "),
        note: "Common career path",
      },
    ],
    personaInsights: [
      {
        type: "Primary Persona",
        motivated: "Growth, impact",
        needs: "Ownership, challenge",
        hates: "Bureaucracy",
      },
    ],
  };
}

function basicTransformRoleCard(jobs: any[], originalJobData?: any): any {
  return {
    roleSummary: `Role for ${originalJobData?.jobTitle || "position"}`,
    outcomes: [
      "Deliver key results",
      "Own domain",
      "Drive impact",
      "Mentor team",
      "Improve processes",
    ],
    redFlags: ["Generic JD", "Unclear ownership"],
    donts: ["Copy competitor JDs"],
    fixes: ["Focus on outcomes"],
    brutalTruth: "Role clarity is critical",
    whatGreatLooksLike: [
      "Owns outcomes",
      "Drives impact",
      "Mentors others",
      "Improves systems",
      "Communicates clearly",
      "Handles ambiguity",
    ],
  };
}

function basicTransformRealityCard(
  jobs: any[],
  profiles: any[],
  originalJobData?: any
): any {
  return {
    keyInsights: [
      `${jobs.length} open jobs, ${profiles.length} candidates`,
      "Market is competitive",
      "Speed matters",
    ],
    helpsCase: ["Good comp", "Modern stack", "Clear ownership"],
    hurtsCase: ["Low comp", "Slow process", "Unclear role"],
    hiddenBottleneck: "Internal alignment",
    timelineToFailure: "Week 6 if not aligned",
    bottomLine1: "Move fast, pay well, hire",
    bottomLine2: "Slow process, low comp, fail",
    whatsReallyGoingOn: "Competitive market requires speed",
    redFlags: ["Unclear requirements", "Slow process"],
    donts: ["Post and pray", "Hide comp"],
  };
}

function basicTransformFunnelCard(jobs: any[], profiles: any[]): any {
  const outreach = profiles.length * 1.2;
  const replies = Math.round(outreach * 0.2);
  const screens = Math.round(replies * 0.5);
  const tech = Math.round(screens * 0.7);
  const finalists = Math.round(tech * 0.3);
  const offers = Math.round(finalists * 0.7);

  return {
    funnelStages: [
      {
        label: "Outreach",
        value: `${Math.round(outreach)}–${Math.round(outreach * 1.2)}`,
      },
      {
        label: "Positive replies",
        value: `${replies}–${Math.round(replies * 1.2)}`,
      },
      { label: "Screens", value: `${screens}–${Math.round(screens * 1.2)}` },
      { label: "Tech rounds", value: `${tech}–${Math.round(tech * 1.2)}` },
      {
        label: "Finalists",
        value: `${finalists}–${Math.round(finalists * 1.2)}`,
      },
      { label: "Offers", value: `${offers}–${Math.round(offers * 1.2)}` },
      { label: "Hire", value: "1" },
    ],
    benchmarks: [
      { label: "Outbound reply rate", value: "20–30%" },
      { label: "Tech pass rate", value: "40–60%" },
      { label: "Offer acceptance", value: "70–85%" },
    ],
    brutalTruth: "Funnel leaks are internal",
    redFlags: ["Slow process", "Poor messaging"],
    donts: ["Rely only on inbound"],
    fixes: ["Warm candidates", "Move fast"],
    hiddenBottleneck: "Internal delays",
    funnelHealthComparison: [
      { type: "Healthy", outcome: "Hire in 25–35 days" },
      { type: "Typical", outcome: "Hire in 50–70 days" },
      { type: "Broken", outcome: "Restart at week 6" },
    ],
  };
}

function basicTransformFitCard(profiles: any[]): any {
  return {
    persona: "Product-Minded Professional",
    motivatedBy: ["Ownership", "Impact", "Growth", "Challenge", "Autonomy"],
    avoids: ["Micromanagement", "Legacy systems", "Slow pace"],
    brutalTruth: "Top talent is selective",
    redFlags: ["Wrong motivations", "Poor fit"],
    donts: ["Generic pitch", "Hide challenges"],
    fixes: ["Be honest", "Show impact"],
    candidateEvaluation: [
      "Team quality",
      "Growth opportunity",
      "Compensation",
      "Culture fit",
    ],
    decisionMakingYes: ["Clear value", "Good team", "Fair comp"],
    decisionMakingNo: ["Unclear role", "Poor comp", "Bad culture"],
  };
}

function basicTransformMessageCard(
  jobs: any[],
  profiles: any[],
  originalJobData?: any
): any {
  return {
    corePitch: "Impactful role with ownership",
    brutalTruth: "Generic messaging fails",
    donts: ["Generic pitch", "Company history first"],
    fixThisNow: "Lead with impact",
    hiddenBottleneck: "Messaging clarity",
    scrollStoppers: [
      "Real impact opportunity",
      "Ownership and autonomy",
      "Modern stack and team",
    ],
  };
}

function basicTransformOutreachCard(profiles: any[]): any {
  return {
    introduction: "Personalized outreach strategy",
    message1: "Reference their work",
    message2: "Show impact opportunity",
    message3: "Soft follow-up",
    brutalTruth: "Generic outreach fails",
    redFlags: ["Too long", "No personalization"],
    donts: ["Generic messages", "No research"],
    fixes: ["Personalize", "Be concise"],
    hiddenBottleneck: "Personalization",
    timelineToFailure1: "Week 1: Low reply rate",
    timelineToFailure2: "Week 2: Poor messaging",
  };
}

function basicTransformInterviewCard(jobs: any[]): any {
  return {
    optimalLoop: [
      "Recruiter screen",
      "Technical deep dive",
      "Product collaboration",
      "Final alignment",
    ],
    brutalTruth: "Unstructured interviews fail",
    redFlags: ["Winging it", "No scorecard"],
    donts: ["Too many rounds", "Long take-homes"],
    fixes: ["Structure questions", "Train interviewers"],
    signalQuestions: [
      "Walk through a project",
      "How do you test?",
      "What motivates you?",
    ],
  };
}

function basicTransformScorecardCard(jobs: any[], profiles: any[]): any {
  return {
    competencies: [
      "Technical skills",
      "Problem-solving",
      "Communication",
      "Ownership",
      "Collaboration",
      "Quality",
    ],
    rating1: "slows the team",
    rating2: "needs coaching",
    rating3: "independent senior",
    rating4: "raises the bar",
    brutalTruth: "Weak scorecards = bad hires",
    donts: ["Vague criteria", "No calibration"],
    fixes: ["Clear anchors", "Calibrate team"],
    evaluationMapping: [
      {
        stage: "Stage 1 — Recruiter Screen",
        competencies: "Communication, Ownership",
      },
      {
        stage: "Stage 2 — Technical Deep Dive",
        competencies: "Technical, Problem-solving",
      },
      {
        stage: "Stage 3 — Product Collaboration",
        competencies: "Collaboration, Communication",
      },
      {
        stage: "Stage 4 — Values & Ownership",
        competencies: "Ownership, Quality",
      },
    ],
  };
}

function basicTransformPlanCard(jobs: any[], profiles: any[]): any {
  return {
    first7Days: [
      "Finalize role definition",
      "Align scorecard",
      "Approve comp",
      "Build candidate list",
      "Schedule sync",
      "Launch sourcing",
    ],
    weeklyRhythm: [
      "Pipeline review",
      "Remove blockers",
      "Calibrate team",
      "Update messaging",
      "Track metrics",
    ],
    brutalTruth: "Internal blockers cause delays",
    redFlags: ["HM unavailable", "Slow feedback"],
    donts: ["Start before alignment", "No scorecard"],
    fixes: ["24h feedback", "Pre-book slots"],
    fastestPath: [
      "Broaden location",
      "Raise comp",
      "Simplify loop",
      "Strong messaging",
      "2 waves/week",
      "Early calibration",
      "Weekly alignment",
    ],
  };
}
