import * as cheerio from "cheerio";
import { ScrapedJobData } from "../types/scraper";
import { extractListItems } from "../scraper-utils";

/**
 * Scrape Indeed job postings
 */
export function scrapeIndeed(
  $: cheerio.CheerioAPI,
  url: string
): ScrapedJobData {
  const title = $("h1.jobsearch-JobInfoHeader-title, h1").first().text().trim();
  const company = $(
    ".jobsearch-InlineCompanyRating-companyHeader, .jobsearch-CompanyInfoContainer"
  )
    .first()
    .text()
    .trim();
  const location = $(
    ".jobsearch-JobInfoHeader-subtitle div, .jobsearch-JobComponent-location"
  )
    .first()
    .text()
    .trim();

  const description = $("#jobDescriptionText, .jobsearch-jobDescriptionText")
    .text()
    .trim();

  const salary = $(".jobsearch-JobMetadataHeader-item, .salary-snippet")
    .text()
    .trim();

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
    source: "Indeed",
  };
}
