import { ScrapedJobData, ParsedJobData } from "../types/scraper";
import { extractBasicFields } from "../scraper-utils";

/**
 * Parse scraped job data using OpenAI
 * Extracts structured information from raw job posting text
 */
export async function parseScrapedJobData(
  scrapedData: ScrapedJobData
): Promise<ParsedJobData> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.warn("⚠️ OpenAI API key not found, returning basic extraction");
    return {
      isJobPosting: true,
      ...extractBasicFields(scrapedData),
      workModel: null,
      experienceLevel: null,
      confidence: 0.5,
    };
  }

  try {
    const jobText = `
Title: ${scrapedData.title}
Company: ${scrapedData.company || "Unknown"}
Location: ${scrapedData.location || "Unknown"}
Salary: ${scrapedData.salary || "Not specified"}

Description:
${scrapedData.description}

Requirements:
${scrapedData.requirements?.join("\n") || "Not specified"}

Responsibilities:
${scrapedData.responsibilities?.join("\n") || "Not specified"}
    `.trim();

    const systemPrompt = `You are a job posting analyzer. Extract structured information from job postings.

Analyze this job posting and extract:
- Job title
- Location (city/country or "Remote")
- Work model (Remote/Hybrid/On-site)
- Experience level (Entry/Mid/Senior/Lead/Executive)
- Salary range (min and max as numbers)
- Required skills (array)
- Critical requirements (must-haves)
- Timeline/urgency (if mentioned)
- Department (Engineering, Product, Design, Marketing, Sales, etc.)

IMPORTANT FOR SALARY:
- Extract minSalary and maxSalary as pure numbers (no currency symbols, no commas)
- Example: "$120,000 - $150,000" → minSalary: "120000", maxSalary: "150000"
- Example: "£50k-£70k" → minSalary: "50000", maxSalary: "70000"
- If only one number is mentioned, set both min and max to that number
- If no salary is mentioned, set both to null

Return ONLY valid JSON with this exact structure:
{
  "isJobPosting": true/false,
  "jobTitle": "extracted role title or null",
  "location": "city/country or Remote or null",
  "workModel": "Remote/Hybrid/On-site or null",
  "experienceLevel": "level or null",
  "minSalary": "number string or null (e.g., '120000')",
  "maxSalary": "number string or null (e.g., '150000')",
  "skills": ["skill1", "skill2"] or [],
  "requirements": ["req1", "req2"] or [],
  "timeline": "timeline or null",
  "department": "department or null",
  "confidence": 0.0-1.0
}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: jobText,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    const result = await response.json();

    if (result.choices && result.choices[0]?.message?.content) {
      const content = result.choices[0].message.content.trim();

      // Remove markdown code blocks if present
      const cleanedContent = content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      const parsed = JSON.parse(cleanedContent);
      return parsed;
    }

    throw new Error("Invalid AI response");
  } catch (error) {
    console.error("AI parsing error:", error);

    // Fallback to basic extraction
    return {
      isJobPosting: true,
      ...extractBasicFields(scrapedData),
      workModel: null,
      experienceLevel: null,
      confidence: 0.5,
    };
  }
}
