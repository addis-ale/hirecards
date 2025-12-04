/**
 * Glassdoor Salary Scraper using ScrapingBee
 * Provides better salary data than LinkedIn job postings
 */

import axios from "axios";
import * as cheerio from "cheerio";

const SCRAPINGBEE_API_KEY = process.env.SCRAPINGBEE_API_KEY;

export interface GlassdoorSalary {
  jobTitle: string;
  location: string;
  baseSalary: {
    min: number;
    max: number;
    average: number;
  } | null;
  totalCompensation: {
    min: number;
    max: number;
    average: number;
  } | null;
  currency: string;
  sampleSize: number;
  source: string;
}

/**
 * Scrape Glassdoor salary data for a specific job title and location
 */
export async function scrapeGlassdoorSalary(
  jobTitle: string,
  location: string
): Promise<GlassdoorSalary | null> {
  if (!SCRAPINGBEE_API_KEY) {
    console.warn("⚠️ SCRAPINGBEE_API_KEY not configured");
    return null;
  }

  try {
    // Build Glassdoor salary search URL
    const searchQuery = `${jobTitle} ${location}`;
    const glassdoorUrl = `https://www.glassdoor.com/Salaries/${encodeURIComponent(
      searchQuery
    )}-salary-SRCH_KO0,${searchQuery.length}.htm`;

    console.log("🔍 Scraping Glassdoor:", glassdoorUrl);

    // Fetch via ScrapingBee with JavaScript rendering
    const response = await axios.get("https://app.scrapingbee.com/api/v1", {
      params: {
        api_key: SCRAPINGBEE_API_KEY,
        url: glassdoorUrl,
        render_js: "true",
        premium_proxy: "true",
        wait: "5000",
        country_code: "us",
      },
      timeout: 30000,
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Parse Glassdoor salary data
    const salaryData = parseGlassdoorSalaryPage($, jobTitle, location);

    if (salaryData) {
      console.log("✅ Glassdoor salary found:", {
        jobTitle: salaryData.jobTitle,
        base: salaryData.baseSalary
          ? `${salaryData.baseSalary.min}-${salaryData.baseSalary.max}`
          : "N/A",
        sampleSize: salaryData.sampleSize,
      });
    } else {
      console.warn("⚠️ No salary data found on Glassdoor");
    }

    return salaryData;
  } catch (error) {
    console.error("❌ Glassdoor scraping error:", error);
    return null;
  }
}

/**
 * Parse Glassdoor salary page HTML
 */
function parseGlassdoorSalaryPage(
  $: cheerio.CheerioAPI,
  jobTitle: string,
  location: string
): GlassdoorSalary | null {
  // Glassdoor uses various selectors for salary data
  // Try multiple patterns to extract salary information

  let baseSalary = null;
  let totalComp = null;
  let sampleSize = 0;

  // Pattern 1: Look for salary range in common containers
  const salaryText = $(
    '[data-test="salary-title"], .salaryTitle, .SalaryTitle, h1, h2'
  )
    .text()
    .toLowerCase();

  // Extract salary from text like "$85K - $120K" or "€70,000 - €95,000"
  const salaryMatch = salaryText.match(
    /([€$£])?\s*(\d+(?:,\d{3})*(?:\.\d+)?)\s*k?\s*[-–—]\s*([€$£])?\s*(\d+(?:,\d{3})*(?:\.\d+)?)\s*k?/i
  );

  if (salaryMatch) {
    const currency = salaryMatch[1] || salaryMatch[3] || "$";
    let min = parseFloat(salaryMatch[2].replace(/,/g, ""));
    let max = parseFloat(salaryMatch[4].replace(/,/g, ""));

    // Handle K notation
    if (salaryText.includes("k")) {
      if (min < 1000) min *= 1000;
      if (max < 1000) max *= 1000;
    }

    baseSalary = {
      min: Math.round(min),
      max: Math.round(max),
      average: Math.round((min + max) / 2),
    };
  }

  // Pattern 2: Look for structured salary data in JSON-LD
  $('script[type="application/ld+json"]').each((_, elem) => {
    try {
      const jsonData = JSON.parse($(elem).html() || "");
      if (jsonData.baseSalary || jsonData.salary) {
        const salary = jsonData.baseSalary || jsonData.salary;
        if (salary.minValue && salary.maxValue) {
          baseSalary = {
            min: parseFloat(salary.minValue),
            max: parseFloat(salary.maxValue),
            average: (parseFloat(salary.minValue) + parseFloat(salary.maxValue)) / 2,
          };
        }
      }
    } catch (e) {
      // Invalid JSON, skip
    }
  });

  // Pattern 3: Extract sample size (e.g., "Based on 245 salaries")
  const sampleText = $("body")
    .text()
    .match(/based\s+on\s+(\d+(?:,\d{3})*)\s+salaries?/i);
  if (sampleText) {
    sampleSize = parseInt(sampleText[1].replace(/,/g, ""));
  }

  // If no data found, return null
  if (!baseSalary) {
    return null;
  }

  // Determine currency based on location
  let currency = "USD";
  const locationLower = location.toLowerCase();
  if (
    locationLower.includes("amsterdam") ||
    locationLower.includes("netherlands") ||
    locationLower.includes("berlin") ||
    locationLower.includes("germany") ||
    locationLower.includes("europe")
  ) {
    currency = "EUR";
  } else if (locationLower.includes("london") || locationLower.includes("uk")) {
    currency = "GBP";
  }

  return {
    jobTitle,
    location,
    baseSalary,
    totalCompensation: totalComp,
    currency,
    sampleSize,
    source: "Glassdoor",
  };
}

/**
 * Scrape Indeed salary data as alternative/supplement
 */
export async function scrapeIndeedSalary(
  jobTitle: string,
  location: string
): Promise<GlassdoorSalary | null> {
  if (!SCRAPINGBEE_API_KEY) {
    console.warn("⚠️ SCRAPINGBEE_API_KEY not configured");
    return null;
  }

  try {
    // Build Indeed salary search URL
    const indeedUrl = `https://www.indeed.com/career/${encodeURIComponent(
      jobTitle
    )}/salaries?l=${encodeURIComponent(location)}`;

    console.log("🔍 Scraping Indeed Salary:", indeedUrl);

    const response = await axios.get("https://app.scrapingbee.com/api/v1", {
      params: {
        api_key: SCRAPINGBEE_API_KEY,
        url: indeedUrl,
        render_js: "true",
        premium_proxy: "true",
        wait: "3000",
      },
      timeout: 30000,
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Parse Indeed salary data
    const salaryData = parseIndeedSalaryPage($, jobTitle, location);

    if (salaryData) {
      console.log("✅ Indeed salary found:", {
        jobTitle: salaryData.jobTitle,
        base: salaryData.baseSalary
          ? `${salaryData.baseSalary.min}-${salaryData.baseSalary.max}`
          : "N/A",
      });
    }

    return salaryData;
  } catch (error) {
    console.error("❌ Indeed scraping error:", error);
    return null;
  }
}

/**
 * Parse Indeed salary page
 */
function parseIndeedSalaryPage(
  $: cheerio.CheerioAPI,
  jobTitle: string,
  location: string
): GlassdoorSalary | null {
  let baseSalary:any = null;

  // Indeed shows average salary prominently
  const salaryElements = $(
    '[data-testid="salary-display"], .salary-snippet, .estimated-salary'
  );

  salaryElements.each((_, elem) => {
    const text = $(elem).text();
    const match = text.match(
      /([€$£])?\s*(\d+(?:,\d{3})*(?:\.\d+)?)\s*k?\s*[-–—to]\s*([€$£])?\s*(\d+(?:,\d{3})*(?:\.\d+)?)\s*k?/i
    );

    if (match && !baseSalary) {
      let min = parseFloat(match[2].replace(/,/g, ""));
      let max = parseFloat(match[4].replace(/,/g, ""));

      if (text.toLowerCase().includes("k")) {
        if (min < 1000) min *= 1000;
        if (max < 1000) max *= 1000;
      }

      baseSalary = {
        min: Math.round(min),
        max: Math.round(max),
        average: Math.round((min + max) / 2),
      };
    }
  });

  if (!baseSalary) {
    return null;
  }

  return {
    jobTitle,
    location,
    baseSalary,
    totalCompensation: null,
    currency: "USD",
    sampleSize: 0,
    source: "Indeed",
  };
}

/**
 * Aggregate salary data from multiple sources
 */
export async function getAggregatedSalaryData(
  jobTitle: string,
  location: string
): Promise<GlassdoorSalary | null> {
  console.log("🔍 Fetching salary data from multiple sources...");

  // Scrape both Glassdoor and Indeed in parallel
  const [glassdoorData, indeedData] = await Promise.all([
    scrapeGlassdoorSalary(jobTitle, location),
    scrapeIndeedSalary(jobTitle, location),
  ]);

  // Prefer Glassdoor data if available (usually more reliable)
  if (glassdoorData) {
    console.log("✅ Using Glassdoor salary data");
    return glassdoorData;
  }

  // Fall back to Indeed data
  if (indeedData) {
    console.log("✅ Using Indeed salary data");
    return indeedData;
  }

  console.warn("⚠️ No salary data found from any source");
  return null;
}
