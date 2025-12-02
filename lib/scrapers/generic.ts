import * as cheerio from "cheerio";
import { ScrapedJobData } from "../types/scraper";
import { extractListItems } from "../scraper-utils";

/**
 * Generic job board scraper - fallback for unknown job boards
 * Uses common HTML patterns to extract job information
 */
export function scrapeGenericJobBoard(
  $: cheerio.CheerioAPI,
  url: string
): ScrapedJobData {
  // Try multiple common selectors for title
  let title = "";
  const titleSelectors = [
    "h1",
    ".job-title",
    ".position-title",
    "[class*='title']",
    "[class*='heading']",
  ];

  for (const selector of titleSelectors) {
    title = $(selector).first().text().trim();
    if (title && title.length > 3) break;
  }

  // Try to find company name
  let company = "";
  const companySelectors = [
    ".company-name",
    ".company",
    "[class*='company']",
    "a[href*='company']",
  ];

  for (const selector of companySelectors) {
    company = $(selector).first().text().trim();
    if (company && company.length > 2) break;
  }

  // Try to find location
  let location = "";
  const locationSelectors = [
    ".location",
    ".job-location",
    "[class*='location']",
    "[class*='address']",
  ];

  for (const selector of locationSelectors) {
    location = $(selector).first().text().trim();
    if (location && location.length > 2) break;
  }

  // Try to find salary
  let salary = "";
  const salarySelectors = [
    ".salary",
    ".compensation",
    "[class*='salary']",
    "[class*='pay']",
    "[class*='compensation']",
  ];

  for (const selector of salarySelectors) {
    salary = $(selector).first().text().trim();
    if (
      salary &&
      (salary.includes("$") || salary.includes("€") || salary.includes("£"))
    ) {
      break;
    }
  }

  // Try to find job description
  let description = "";
  const descriptionSelectors = [
    ".job-description",
    ".description",
    "[class*='description']",
    "main",
    "article",
    ".content",
  ];

  for (const selector of descriptionSelectors) {
    description = $(selector).text().trim();
    if (description && description.length > 100) break;
  }

  const rawText = $("body").text().replace(/\s+/g, " ").trim();

  return {
    title: title || "Job Position",
    description: description || rawText,
    location: location || undefined,
    company: company || undefined,
    salary: salary || undefined,
    requirements: extractListItems($, "requirements", description || rawText),
    responsibilities: extractListItems(
      $,
      "responsibilities",
      description || rawText
    ),
    benefits: extractListItems($, "benefits", description || rawText),
    rawText,
    source: "Generic",
  };
}
