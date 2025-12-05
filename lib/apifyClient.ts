/**
 * Apify Client for LinkedIn Jobs Scraper
 * Actor ID: BHzefUZlZRKWxkTck
 */

import { ApifyClient } from 'apify-client';

const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN;
const LINKEDIN_JOBS_ACTOR_ID = 'JkfTWxtpgfvcRQn3p';

// New actor supports direct parameters: job_title, location, and optional filters.
interface LinkedInJobScraperInput {
  job_title?: string;
  location?: string;
  jobs_entries?: number; // optional
  experience_level?: string; // '1'..'6'
  job_type?: string;        // 'F','P','C','T','V','I','O'
  work_schedule?: string;   // '1','2','3'
  job_post_time?: string;   // 'r86400','r604800','r2592000'
  start_jobs?: number;      // optional, default 0
}

export interface LinkedInJob {
  id: string;
  title: string;
  salary: string;
  companyName: string;
  location: string;
  publishedAt: string;
  description: string;
  experienceLevel: string;
  contractType: string;
  workType: string;
  jobUrl: string;
  applicationsCount?: string;
  benefits?: string;
}

export interface SalaryData {
  minSalary: number | null;
  maxSalary: number | null;
  currency: string;
  period: 'yearly' | 'monthly' | 'hourly';
  rawSalary: string;
}

/**
 * Map experience level string to Apify actor format
 */
export function mapExperienceLevelToApify(level: string | null): '1' | '2' | '3' | '4' | '5' {
  if (!level) return '3'; // Default to Senior
  
  const normalized = level.toLowerCase();
  
  if (normalized.includes('entry') || normalized.includes('junior')) return '1';
  if (normalized.includes('mid')) return '2';
  if (normalized.includes('senior') || normalized.includes('sr')) return '3';
  if (normalized.includes('lead') || normalized.includes('staff')) return '4';
  if (normalized.includes('principal') || normalized.includes('executive') || normalized.includes('director')) return '5';
  
  return '3'; // Default to Senior
}

/**
 * Scrape LinkedIn jobs for market salary data
 */
export async function scrapeLinkedInJobs(
  jobTitle: string,
  location: string,
  experienceLevel: string | null,
  maxJobs: number = 50
): Promise<LinkedInJob[]> {
  if (!APIFY_API_TOKEN) {
    console.warn('⚠️ APIFY_API_TOKEN not configured');
    return [];
  }

  const client = new ApifyClient({
    token: APIFY_API_TOKEN,
  });

  try {
    console.log('🔍 Scraping LinkedIn jobs:', { jobTitle, location, experienceLevel, maxJobs });

    // Build actor input directly (no-cookies actor supports job_title + location)
    const input: LinkedInJobScraperInput = {
      job_title: jobTitle,
      location: location,
      // jobs_entries intentionally omitted to let actor default handle paging
      // Optional filters can be set here if needed
      // experience_level: mapExperienceLevelToApify(experienceLevel),
      // job_type: 'F',
      // work_schedule: '1',
      // job_post_time: 'r604800',
      // start_jobs: 0,
    };

    // Run the actor with a timeout
    const run = await client.actor(LINKEDIN_JOBS_ACTOR_ID).call(input, {
      waitSecs: 180, // 3 minutes timeout
    });

    console.log('✅ LinkedIn scraping completed:', run.status);

    // Get the results
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    console.log(`📊 Found ${items.length} jobs from LinkedIn`);

    // Post-filter: Title must include full target title (substring), Location must include target location
    const allJobs = items as LinkedInJob[];

    const filtered = allJobs.filter((job) => {
      const title = (job.title || '').toLowerCase();
      const loc = (job.location || '').toLowerCase();
      const targetTitle = jobTitle.toLowerCase();
      const targetLoc = location.toLowerCase();

      const titleMatches = title.includes(targetTitle);
      const locationMatches = loc.includes(targetLoc);

      return titleMatches && locationMatches;
    });

    console.log(`🔍 After strict filter (title subset + exact place): ${filtered.length}/${allJobs.length} jobs kept`);
    if (filtered.length === 0) {
      console.warn('⚠️ No jobs matched strict criteria. Actor likely returned irrelevant results.');
    } else {
      console.log('✅ Sample matched jobs:');
      filtered.slice(0, 3).forEach(j => console.log(`   - ${j.title} @ ${j.companyName} (${j.location})`));
    }

    return filtered;
  } catch (error) {
    console.error('❌ Error scraping LinkedIn jobs:', error);
    return [];
  }
}

/**
 * Parse salary string into structured data
 */
export function parseSalaryString(salaryStr: string): SalaryData | null {
  if (!salaryStr || salaryStr.trim() === '') {
    return null;
  }

  const normalized = salaryStr.toLowerCase().replace(/\s+/g, ' ').trim();
  
  // Try to extract currency
  let currency = 'EUR'; // Default
  if (normalized.includes('$')) currency = 'USD';
  else if (normalized.includes('€')) currency = 'EUR';
  else if (normalized.includes('£')) currency = 'GBP';
  
  // Determine period
  let period: 'yearly' | 'monthly' | 'hourly' = 'yearly';
  if (normalized.includes('/mo') || normalized.includes('month')) period = 'monthly';
  else if (normalized.includes('/hr') || normalized.includes('hour')) period = 'hourly';
  else if (normalized.includes('/yr') || normalized.includes('year') || normalized.includes('annual')) period = 'yearly';
  
  // Extract numbers
  // Look for patterns like: €50,000 - €70,000 or $120k-$150k
  const rangeMatch = normalized.match(/[€$£]?\s*(\d+[,.]?\d*)\s*k?\s*[-–—to]\s*[€$£]?\s*(\d+[,.]?\d*)\s*k?/i);
  
  if (rangeMatch) {
    let min = parseFloat(rangeMatch[1].replace(/,/g, ''));
    let max = parseFloat(rangeMatch[2].replace(/,/g, ''));
    
    // Handle 'k' notation
    if (normalized.includes('k')) {
      if (min < 1000) min *= 1000;
      if (max < 1000) max *= 1000;
    }
    
    return {
      minSalary: Math.round(min),
      maxSalary: Math.round(max),
      currency,
      period,
      rawSalary: salaryStr,
    };
  }
  
  // Try single number
  const singleMatch = normalized.match(/[€$£]?\s*(\d+[,.]?\d*)\s*k?/i);
  if (singleMatch) {
    let value = parseFloat(singleMatch[1].replace(/,/g, ''));
    
    if (normalized.includes('k') && value < 1000) {
      value *= 1000;
    }
    
    return {
      minSalary: Math.round(value),
      maxSalary: Math.round(value),
      currency,
      period,
      rawSalary: salaryStr,
    };
  }
  
  return null;
}

/**
 * Analyze scraped jobs and calculate market compensation
 */
export interface MarketCompensation {
  baseMin: number;
  baseMax: number;
  totalCompMin: number;
  totalCompMax: number;
  currency: string;
  location: string;
  sampleSize: number;
  publishedRanges: string[];
  jobsWithSalary: number;
  totalJobs: number;
}

export function analyzeMarketCompensation(
  jobs: LinkedInJob[],
  location: string
): MarketCompensation | null {
  // Filter jobs with salary data
  const jobsWithSalary = jobs.filter(job => job.salary && job.salary.trim() !== '');
  
  console.log(`💰 ${jobsWithSalary.length}/${jobs.length} jobs have salary information`);
  
  if (jobsWithSalary.length === 0) {
    return null;
  }
  
  // Parse all salaries
  const salaries: SalaryData[] = [];
  const publishedRanges: string[] = [];
  
  jobsWithSalary.forEach(job => {
    const parsed = parseSalaryString(job.salary);
    if (parsed) {
      salaries.push(parsed);
      publishedRanges.push(job.salary);
    }
  });
  
  if (salaries.length === 0) {
    return null;
  }
  
  // Normalize all to yearly EUR (simplified - in production you'd use exchange rates)
  const normalizedSalaries = salaries.map(s => {
    let min = s.minSalary || 0;
    let max = s.maxSalary || 0;
    
    // Convert to yearly
    if (s.period === 'monthly') {
      min *= 12;
      max *= 12;
    } else if (s.period === 'hourly') {
      min *= 2080; // 40 hours/week * 52 weeks
      max *= 2080;
    }
    
    return { min, max };
  });
  
  // Calculate percentiles
  const allMins = normalizedSalaries.map(s => s.min).filter(n => n > 0).sort((a, b) => a - b);
  const allMaxs = normalizedSalaries.map(s => s.max).filter(n => n > 0).sort((a, b) => a - b);
  
  const percentile = (arr: number[], p: number) => {
    const index = Math.ceil(arr.length * p) - 1;
    return arr[Math.max(0, index)];
  };
  
  // Use 25th and 75th percentiles for base range
  const baseMin = percentile(allMins, 0.25);
  const baseMax = percentile(allMaxs, 0.75);
  
  // Estimate total comp as 10-15% higher
  const totalCompMin = Math.round(baseMin * 1.1);
  const totalCompMax = Math.round(baseMax * 1.15);
  
  return {
    baseMin: Math.round(baseMin),
    baseMax: Math.round(baseMax),
    totalCompMin,
    totalCompMax,
    currency: 'EUR',
    location,
    sampleSize: salaries.length,
    publishedRanges: publishedRanges.slice(0, 5), // Top 5
    jobsWithSalary: jobsWithSalary.length,
    totalJobs: jobs.length,
  };
}
