import * as cheerio from "cheerio";
import { ScrapedJobData } from "../types/scraper";
import { extractListItems } from "../scraper-utils";

/**
 * Scrape Ashby job boards
 */
export function scrapeAshby(
  $: cheerio.CheerioAPI,
  url: string
): ScrapedJobData {
  const title = $("h1, .job-title").first().text().trim();
  const company = $(".company-name, header h2").first().text().trim();
  const location = $(".location, .job-location").first().text().trim();
  const description = $(".job-description, main").text().trim();

  const rawText = $("body").text().replace(/\s+/g, " ").trim();

  return {
    title: title || "Job Position",
    description: description || rawText,
    location: location || undefined,
    company: company || undefined,
    requirements: extractListItems($, "requirements", description),
    responsibilities: extractListItems($, "responsibilities", description),
    benefits: extractListItems($, "benefits", description),
    rawText,
    source: "Ashby",
  };
}
