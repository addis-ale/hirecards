import * as cheerio from "cheerio";

/**
 * Extract list items from description based on keywords
 */
export function extractListItems(
  $: cheerio.CheerioAPI,
  type: "requirements" | "responsibilities" | "benefits",
  text: string
): string[] {
  const items: string[] = [];

  // Keywords to look for based on type
  const keywords: Record<string, string[]> = {
    requirements: [
      "requirements",
      "qualifications",
      "required",
      "must have",
      "you have",
    ],
    responsibilities: [
      "responsibilities",
      "duties",
      "you will",
      "what you'll do",
      "day-to-day",
    ],
    benefits: ["benefits", "perks", "we offer", "what we offer", "compensation"],
  };

  const typeKeywords = keywords[type] || [];

  // Try to find sections with these keywords
  for (const keyword of typeKeywords) {
    const regex = new RegExp(`${keyword}[^a-z]*:?`, "i");
    const sections = text.split(regex);

    if (sections.length > 1) {
      // Found a section with this keyword
      const section = sections[1].split(/\n\n|Requirements|Responsibilities|Benefits/i)[0];

      // Extract list items
      const lines = section.split(/\n|•|–|-/).filter((line) => line.trim().length > 10);

      items.push(...lines.map((line) => line.trim()));
      break;
    }
  }

  return items.slice(0, 10); // Limit to 10 items
}

/**
 * Detect job board type from URL
 */
export function detectJobBoard(url: string): string {
  const lowercaseUrl = url.toLowerCase();

  if (lowercaseUrl.includes("linkedin.com")) return "linkedin";
  if (lowercaseUrl.includes("indeed.com")) return "indeed";
  if (lowercaseUrl.includes("greenhouse.io")) return "greenhouse";
  if (lowercaseUrl.includes("lever.co")) return "lever";
  if (lowercaseUrl.includes("workday.com") || lowercaseUrl.includes("myworkdayjobs"))
    return "workday";
  if (lowercaseUrl.includes("ashbyhq.com") || lowercaseUrl.includes("jobs.ashbyhq"))
    return "ashby";

  return "generic";
}

/**
 * Extract basic fields from scraped data
 */
export function extractBasicFields(scrapedData: any): any {
  return {
    jobTitle: scrapedData.title || null,
    location: scrapedData.location || null,
    company: scrapedData.company || null,
    minSalary: null,
    maxSalary: null,
    skills: [],
    requirements: scrapedData.requirements || [],
    timeline: null,
    department: null,
  };
}
