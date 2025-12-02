/**
 * Job Description URL Scraper - Main Coordinator
 *
 * This module coordinates scraping job descriptions from various job boards
 * and extracting structured information using AI.
 */

import * as cheerio from "cheerio";
import axios from "axios";
import { ScrapedJobData } from "./types/scraper";
import { detectJobBoard } from "./scraper-utils";
import { scrapeLinkedIn } from "./scrapers/linkedin";
import { scrapeIndeed } from "./scrapers/indeed";
import { scrapeGreenhouse } from "./scrapers/greenhouse";
import { scrapeLever } from "./scrapers/lever";
import { scrapeWorkday } from "./scrapers/workday";
import { scrapeAshby } from "./scrapers/ashby";
import { scrapeGenericJobBoard } from "./scrapers/generic";
import { parseScrapedJobData } from "./parsers/aiParser";

const SCRAPINGBEE_API_KEY = process.env.SCRAPINGBEE_API_KEY;

/**
 * Main scraping function - Scrape a job description from a URL
 * Works for both static HTML and JavaScript-rendered pages
 */
export async function scrapeJobURL(url: string): Promise<ScrapedJobData> {
  try {
    console.log("🚀 Starting scrape:", url);

    // Detect which job board we're scraping
    const boardType = detectJobBoard(url);
    console.log("📋 Detected job board:", boardType);

    let html: string;

    // Try ScrapingBee first (handles JS-rendered pages)
    if (SCRAPINGBEE_API_KEY) {
      console.log("🐝 Using ScrapingBee API...");
      const scrapingBeeUrl = `https://app.scrapingbee.com/api/v1/?api_key=${SCRAPINGBEE_API_KEY}&url=${encodeURIComponent(
        url
      )}&render_js=true&premium_proxy=true&country_code=us`;

      const response = await axios.get(scrapingBeeUrl, {
        timeout: 30000,
      });

      html = response.data;
    } else {
      // Fallback to direct axios request
      console.log("📡 Using direct HTTP request...");
      const response = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        timeout: 15000,
      });

      html = response.data;
    }

    // Parse HTML with cheerio
    const $ = cheerio.load(html);

    // Route to appropriate scraper based on job board type
    let scrapedData: ScrapedJobData;

    switch (boardType) {
      case "linkedin":
        scrapedData = scrapeLinkedIn($, url);
        break;
      case "indeed":
        scrapedData = scrapeIndeed($, url);
        break;
      case "greenhouse":
        scrapedData = scrapeGreenhouse($, url);
        break;
      case "lever":
        scrapedData = scrapeLever($, url);
        break;
      case "workday":
        scrapedData = scrapeWorkday($, url);
        break;
      case "ashby":
        scrapedData = scrapeAshby($, url);
        break;
      default:
        scrapedData = scrapeGenericJobBoard($, url);
    }

    console.log("✅ Scraping successful:", scrapedData.title);
    return scrapedData;
  } catch (error) {
    console.error("❌ Scraping error:", error);
    throw new Error(
      `Failed to scrape job URL: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

// Re-export the parser for convenience
export { parseScrapedJobData };


