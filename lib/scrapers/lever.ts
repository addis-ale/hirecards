import * as cheerio from "cheerio";
import { ScrapedJobData } from "../types/scraper";
import { extractListItems } from "../scraper-utils";

/**
 * Scrape Lever job boards
 */
export function scrapeLever(
  $: cheerio.CheerioAPI,
  url: string
): ScrapedJobData {
  const title = $(".posting-headline h2, h1").first().text().trim();
  const company = $(".main-header-text-company-logo, .company-name")
    .first()
    .text()
    .trim();
  const location = $(".posting-categories .location, .location")
    .first()
    .text()
    .trim();
  const description = $(".content, .posting-description").text().trim();

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
    source: "Lever",
  };
}
