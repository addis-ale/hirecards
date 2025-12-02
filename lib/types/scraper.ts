// Scraper Type Definitions

export interface ScrapedJobData {
  title: string;
  description: string;
  location?: string;
  company?: string;
  salary?: string;
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
  rawText: string;
  source: string;
}

export interface ParsedJobData {
  isJobPosting: boolean;
  jobTitle: string | null;
  location: string | null;
  workModel: string | null;
  experienceLevel: string | null;
  minSalary: string | null;
  maxSalary: string | null;
  skills: string[];
  requirements: string[];
  timeline: string | null;
  department: string | null;
  confidence: number;
}

export type ScraperFunction = (
  $: any,
  url: string
) => ScrapedJobData;
