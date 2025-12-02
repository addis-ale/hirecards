import * as cheerio from "cheerio";
import { ScrapedJobData } from "../types/scraper";
import { extractListItems } from "../scraper-utils";

/**
 * Scrape Greenhouse job boards
 */
export function scrapeGreenhouse(
  $: cheerio.CheerioAPI,
  url: string
): ScrapedJobData {
  const title = $("h1.app-title, .posting-headline h2").first().text().trim();
  const company = $(".company-name").first().text().trim();
  const location = $(".location").first().text().trim();
  const description = $("#content, .posting-description").text().trim();

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
    source: "Greenhouse",
  };
}
