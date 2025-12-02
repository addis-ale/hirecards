import * as cheerio from "cheerio";
import { ScrapedJobData } from "../types/scraper";
import { extractListItems } from "../scraper-utils";

/**
 * Scrape Workday job boards
 */
export function scrapeWorkday(
  $: cheerio.CheerioAPI,
  url: string
): ScrapedJobData {
  const title = $("h2[data-automation-id='jobPostingHeader'], h1")
    .first()
    .text()
    .trim();
  const company = $(".company-name, [data-automation-id='company']")
    .first()
    .text()
    .trim();
  const location = $("[data-automation-id='locations'], .location")
    .first()
    .text()
    .trim();
  const description = $(
    "[data-automation-id='jobPostingDescription'], .job-description"
  )
    .text()
    .trim();

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
    source: "Workday",
  };
}
