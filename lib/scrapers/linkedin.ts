import * as cheerio from "cheerio";
import { ScrapedJobData } from "../types/scraper";
import { extractListItems } from "../scraper-utils";

/**
 * Scrape LinkedIn job postings
 */
export function scrapeLinkedIn(
  $: cheerio.CheerioAPI,
  url: string
): ScrapedJobData {
  const title = $("h1.top-card-layout__title, h1")
    .first()
    .text()
    .trim();
  const company = $("a.topcard__org-name-link, .topcard__flavor--black-link")
    .first()
    .text()
    .trim();
  const location = $("span.topcard__flavor--bullet, .topcard__flavor")
    .first()
    .text()
    .trim();

  const description = $(".description__text, .show-more-less-html__markup")
    .text()
    .trim();

  // Extract salary if available
  const salary = $(".salary, .compensation").text().trim();

  const rawText = $("body").text().replace(/\s+/g, " ").trim();

  return {
    title: title || "Job Position",
    description: description || rawText,
    location: location || undefined,
    company: company || undefined,
    salary: salary || undefined,
    requirements: extractListItems($, "requirements", description),
    responsibilities: extractListItems($, "responsibilities", description),
    benefits: extractListItems($, "benefits", description),
    rawText,
    source: "LinkedIn",
  };
}
