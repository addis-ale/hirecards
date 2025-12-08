/**
 * Apify Client for LinkedIn Jobs Scraper
 * Old Actor ID: BHzefUZlZRKWxkTck (deprecated)
 * New Bulk Actor ID: zn01OAlzP853oqn4Z (advanced bulk scraper)
 */

import { ApifyClient } from 'apify-client';

const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN;
const LINKEDIN_JOBS_ACTOR_ID = 'BHzefUZlZRKWxkTck'; // Old scraper (kept for backwards compatibility)
const LINKEDIN_JOBS_BULK_ACTOR_ID = 'zn01OAlzP853oqn4Z'; // New advanced bulk scraper
const LINKEDIN_PROFILE_SCRAPER_ACTOR_ID = 'esIg6IbBkM8uD9t9M'; // LinkedIn Profile Scraper (by URL - deprecated)
const LINKEDIN_PROFILE_SEARCH_ACTOR_ID = 'M2FMdjRVeF1HPGFcc'; // LinkedIn Profile Search (NEW - can search!)

interface LinkedInJobScraperInput {
  jobTitle: string;
  location: string;
  experienceLevel: '1' | '2' | '3' | '4' | '5'; // 1=Entry, 2=Mid, 3=Senior, 4=Lead, 5=Executive
  maxJobsPerSearch?: number;
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

    const input: LinkedInJobScraperInput = {
      jobTitle,
      location,
      experienceLevel: mapExperienceLevelToApify(experienceLevel),
      maxJobsPerSearch: maxJobs,
    };

    // Run the actor with a timeout
    const run = await client.actor(LINKEDIN_JOBS_ACTOR_ID).call(input, {
      waitSecs: 180, // 3 minutes timeout
    });

    console.log('✅ LinkedIn scraping completed:', run.status);

    // Get the results
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    console.log(`📊 Found ${items.length} jobs from LinkedIn`);

    return items as unknown as LinkedInJob[];
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

// ============================================
// NEW BULK LINKEDIN JOBS SCRAPER
// ============================================

/**
 * Input interface for the advanced bulk LinkedIn Jobs Scraper
 * Actor ID: zn01OAlzP853oqn4Z
 */
export interface BulkLinkedInJobScraperInput {
  jobTitles: string[]; // REQUIRED: Array of job titles to search for
  locations?: string[]; // Array of locations (e.g., ["Amsterdam, Netherlands", "Berlin, Germany"])
  companies?: string[]; // Array of company names or LinkedIn URLs
  workplaceType?: string[]; // Array of workplace types: ["remote", "hybrid", "onsite"]
  employmentType?: string[]; // Array: ["fullTime", "partTime", "contract", "temporary", "volunteer", "internship"]
  experienceLevel?: string[]; // Array: ["entryLevel", "associate", "midSenior", "director", "executive"]
  salaryMin?: number; // Minimum salary filter
  salaryMax?: number; // Maximum salary filter
  postedLimit?: '1h' | '24h' | 'week' | 'month'; // Posted time limit (must use these exact values)
  sortBy?: 'relevance' | 'date';
  under10Applicants?: boolean;
  easyApply?: boolean;
  maxItems?: number; // Max jobs per search query (0 = all available, up to 40 pages)
}

/**
 * Output interface for bulk scraper (richer than old scraper)
 */
export interface BulkLinkedInJob {
  id: string;
  title: string;
  linkedinUrl: string;
  jobState: string; // e.g., "LISTED"
  postedDate: string; // ISO date
  descriptionText: string;
  descriptionHtml: string;
  location: {
    linkedinText: string;
    postalAddress: any;
    countryCode: string;
    geoId: string;
    parsed: {
      text: string;
      countryCode: string;
      regionCode: string | null;
      country: string;
      countryFull: string;
      state: string;
      city: string;
    };
  };
  employmentType: string; // e.g., "full_time"
  workplaceType: string; // e.g., "on_site", "remote", "hybrid"
  workRemoteAllowed: boolean;
  easyApplyUrl: string | null;
  applyMethod: {
    companyApplyUrl?: string;
    applyStartersPreferenceVoid?: boolean;
    inPageOffsiteApply?: boolean;
    type: string;
  };
  applicants: number;
  salary: {
    text: string;
    min: number;
    max: number;
    currency: string;
    payPeriod: string; // e.g., "YEARLY"
    compensationType: string;
    compensationSource: string;
    providedByEmployer: boolean;
  } | null;
  jobFunctions: string[];
  benefits: string[];
  benefitsDataSource: string;
  views: number;
  expireAt: string | null;
  new: boolean;
  closedAt: string | null;
  company: {
    id: string;
    universalName: string;
    linkedinUrl: string;
    name: string;
    logo: string;
    employeeCount: number;
    employeeCountRange: {
      start: number;
      end: number;
    };
    followerCount: number;
    description: string;
    locations: any[];
    specialities: string[];
    industries: string[];
    logos: any[];
    backgroundCovers: any[];
  };
}

/**
 * Validate if we have enough data to run the bulk scraper
 * Returns { valid: boolean, missingFields: string[], suggestions: string[], canProceed: boolean }
 */
export function validateBulkScraperInput(data: {
  roleTitle?: string | null;
  location?: string | null;
  company?: string | null;
}): {
  valid: boolean;
  missingFields: string[];
  suggestions: string[];
  canProceed: boolean; // Can proceed with scraping (even if not ideal)
} {
  const missingFields: string[] = [];
  const suggestions: string[] = [];

  // Job titles are REQUIRED
  if (!data.roleTitle || data.roleTitle.trim() === '') {
    missingFields.push('jobTitle');
    suggestions.push('What job title should I search for? (e.g., "Senior Analytics Engineer")');
  }

  // Location is highly recommended but NOT required
  const locationLower = data.location?.toLowerCase().trim() || '';
  const isRemoteLocation = locationLower === 'remote' || locationLower === 'anywhere' || locationLower === 'global';
  
  if (!data.location || data.location.trim() === '') {
    missingFields.push('location');
    suggestions.push('Which location(s) should I search in? (e.g., "Amsterdam, Netherlands", "United States", "Europe") - This will give you better, more targeted results!');
  } else if (isRemoteLocation) {
    // Location is "Remote" - this is valid but we can suggest being more specific
    // Don't mark as missing, but could suggest improvement
    suggestions.push('💡 Tip: You can get more targeted results by specifying a region (e.g., "United States", "Europe", "APAC") instead of just "Remote"');
  }

  // Valid if we have at least job title
  const valid = !missingFields.includes('jobTitle');
  
  // Can proceed if we have job title (even without location or with "Remote", results will be global)
  const canProceed = valid;

  return {
    valid,
    missingFields,
    suggestions,
    canProceed,
  };
}

/**
 * Scrape LinkedIn jobs using the advanced bulk scraper
 * This is much faster and more powerful than the old scraper
 */
export async function scrapeLinkedInJobsBulk(
  input: BulkLinkedInJobScraperInput
): Promise<BulkLinkedInJob[]> {
  if (!APIFY_API_TOKEN) {
    console.warn('⚠️ APIFY_API_TOKEN not configured');
    return [];
  }

  const client = new ApifyClient({
    token: APIFY_API_TOKEN,
  });

  try {
    console.log('🔍 Starting BULK LinkedIn jobs scraping...');
    console.log('📊 Input:', {
      jobTitles: input.jobTitles,
      locations: input.locations,
      companies: input.companies,
      workplaceType: input.workplaceType,
      maxItems: input.maxItems,
    });

    // Run the actor with extended timeout (bulk scraping can take 1-2 minutes)
    const run = await client.actor(LINKEDIN_JOBS_BULK_ACTOR_ID).call(input, {
      waitSecs: 300, // 5 minutes timeout for bulk scraping
    });

    console.log('✅ Bulk LinkedIn scraping completed:', run.status);

    // Get the results
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    console.log(`📊 Found ${items.length} jobs from LinkedIn (bulk scraper)`);

    return items as unknown as BulkLinkedInJob[];
  } catch (error) {
    console.error('❌ Error scraping LinkedIn jobs (bulk):', error);
    return [];
  }
}

// ============================================
// LINKEDIN PROFILE SCRAPER
// ============================================

/**
 * Input interface for LinkedIn Profile Scraper
 * Actor ID: esIg6IbBkM8uD9t9M
 */
export interface LinkedInProfileScraperInput {
  urls: string[]; // REQUIRED: Array of LinkedIn profile URLs to scrape
  extractProjects?: boolean; // Extract projects section
  extractRecommendations?: boolean; // Extract recommendations
  extractSimilarProfiles?: boolean; // Extract similar profiles
  proxyConfiguration?: {
    useApifyProxy?: boolean;
    apifyProxyGroups?: string[];
  };
}

/**
 * Output interface for LinkedIn Profile Scraper
 */
export interface LinkedInProfile {
  success: boolean;
  error?: string;
  name: string;
  image: string;
  headline?: string;
  location: string;
  followers: number;
  connections: string;
  about: string;
  experience: Array<{
    title: string;
    company: string;
    companyUrl?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    duration?: string;
    description?: string;
  }>;
  education: Array<{
    school: string;
    degree?: string;
    field?: string;
    startYear?: string;
    endYear?: string;
    description?: string;
  }>;
  skills?: string[]; // Array of skill names
  certifications?: Array<{
    name: string;
    issuer: string;
    issueDate?: string;
    credentialId?: string;
    credentialUrl?: string;
  }>;
  projects?: Array<{
    title: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    url?: string;
  }>;
  recommendations?: Array<{
    text: string;
    author: string;
    authorTitle?: string;
  }>;
  similarProfiles?: Array<{
    name: string;
    profileUrl: string;
    headline?: string;
  }>;
  profileUrl: string;
  recentPosts?: any[];
  articles?: any[];
  activity?: any[];
  publications?: any[];
}

/**
 * Scrape LinkedIn profiles by URLs (DEPRECATED - Use searchLinkedInProfiles instead)
 */
export async function scrapeLinkedInProfiles(
  profileUrls: string[],
  options?: {
    extractProjects?: boolean;
    extractRecommendations?: boolean;
    extractSimilarProfiles?: boolean;
  }
): Promise<LinkedInProfile[]> {
  if (!APIFY_API_TOKEN) {
    console.warn('⚠️ APIFY_API_TOKEN not configured');
    return [];
  }

  const client = new ApifyClient({
    token: APIFY_API_TOKEN,
  });

  try {
    console.log('👥 Starting LinkedIn profile scraping...');
    console.log(`📊 Scraping ${profileUrls.length} profiles`);

    const input: LinkedInProfileScraperInput = {
      urls: profileUrls,
      extractProjects: options?.extractProjects ?? true,
      extractRecommendations: options?.extractRecommendations ?? true,
      extractSimilarProfiles: options?.extractSimilarProfiles ?? false,
      proxyConfiguration: {
        useApifyProxy: true,
      },
    };

    // Run the actor with extended timeout
    const run = await client.actor(LINKEDIN_PROFILE_SCRAPER_ACTOR_ID).call(input, {
      waitSecs: 300, // 5 minutes timeout
    });

    console.log('✅ LinkedIn profile scraping completed:', run.status);

    // Get the results
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    console.log(`📊 Scraped ${items.length} profiles from LinkedIn`);

    return items as unknown as LinkedInProfile[];
  } catch (error) {
    console.error('❌ Error scraping LinkedIn profiles:', error);
    return [];
  }
}

// ============================================
// NEW LINKEDIN PROFILE SEARCH SCRAPER
// ============================================

/**
 * Input interface for LinkedIn Profile Search Scraper
 * Actor ID: M2FMdjRVeF1HPGFcc
 */
export interface LinkedInProfileSearchInput {
  // Search parameters
  searchQuery?: string; // General search query (fuzzy search)
  currentJobTitles?: string[]; // List of current job titles (exact search)
  pastJobTitles?: string[]; // List of past job titles (exact search)
  locations?: string[]; // List of locations where they currently live
  currentCompanies?: string[]; // List of LinkedIn Company URLs where they currently work
  pastCompanies?: string[]; // List of LinkedIn Company URLs where they previously worked
  schools?: string[]; // List of LinkedIn School URLs where they studied
  industries?: number[]; // List of LinkedIn industry IDs (only numbers)
  yearsOfExperience?: number[]; // List of total years of experience
  yearsAtCurrentCompany?: number[]; // List of years at the current company
  
  // Scraping options
  profileScraperMode?: 'Short' | 'Full' | 'Full + email search'; // Default: 'Full'
  startPage?: number; // The page number to start scraping from. Default is 1
  takePages?: number; // The number of pages to scrape. One page is up to 25 results. Maximum is 100 pages
  maxItems?: number; // Maximum number of profiles to scrape. If 0, scrape all available (up to 2500 per query)
}

/**
 * Output interface for LinkedIn Profile Search
 */
export interface LinkedInProfileSearchResult {
  id: string;
  publicIdentifier: string;
  linkedinUrl: string;
  firstName: string;
  lastName: string;
  headline?: string;
  about?: string;
  openToWork?: boolean;
  hiring?: boolean;
  photo?: string;
  premium?: boolean;
  influencer?: boolean;
  location?: {
    linkedinText: string;
    countryCode: string;
    parsed: {
      text: string;
      countryCode: string;
      regionCode: string | null;
      country: string;
      countryFull: string;
      state: string;
      city: string;
    };
  };
  verified?: boolean;
  registeredAt?: string;
  topSkills?: string;
  connectionsCount?: number;
  followerCount?: number;
  currentPosition?: Array<{
    companyName: string;
  }>;
  experience?: Array<{
    position: string;
    location?: string;
    employmentType?: string;
    workplaceType?: string;
    companyName: string;
    companyLinkedinUrl?: string;
    companyId?: string;
    companyUniversalName?: string;
    duration?: string;
    description?: string;
    skills?: string[];
    startDate?: {
      month?: string;
      year?: number;
      text?: string;
    };
    endDate?: {
      month?: string;
      year?: number;
      text?: string;
    };
  }>;
  education?: Array<{
    schoolName: string;
    schoolLinkedinUrl?: string;
    degree?: string;
    fieldOfStudy?: string;
    skills?: string[];
    startDate?: {
      month?: string;
      year?: number;
      text?: string;
    };
    endDate?: {
      month?: string;
      year?: number;
      text?: string;
    };
    period?: string;
  }>;
  skills?: Array<{
    name: string;
    positions?: string[];
    endorsements?: string;
  }>;
  certifications?: Array<{
    title: string;
    issuedAt?: string;
    issuedBy?: string;
    issuedByLink?: string;
  }>;
  projects?: Array<{
    title: string;
    description?: string;
    duration?: string;
    startDate?: any;
    endDate?: any;
  }>;
  volunteering?: Array<{
    role: string;
    duration?: string;
    organizationName: string;
    organizationLinkedinUrl?: string;
    cause?: string;
  }>;
  languages?: Array<{
    name: string;
    proficiency?: string;
  }>;
  courses?: Array<{
    title: string;
    associatedWith?: string;
    associatedWithLink?: string;
  }>;
  publications?: Array<{
    title: string;
    publishedAt?: string;
    link?: string;
  }>;
  patents?: any[];
  honorsAndAwards?: Array<{
    title: string;
    issuedBy?: string;
    issuedAt?: string;
    description?: string;
    associatedWith?: string;
    associatedWithLink?: string;
  }>;
  receivedRecommendations?: any[];
  moreProfiles?: Array<{
    id: string;
    firstName: string;
    lastName: string;
    position?: string;
    publicIdentifier: string;
    linkedinUrl: string;
  }>;
  _meta?: {
    pagination?: {
      pageNumber: number;
      totalElements: number;
    };
  };
}

/**
 * Search LinkedIn profiles by criteria (NEW - REPLACES OLD SCRAPER)
 */
export async function searchLinkedInProfiles(
  input: LinkedInProfileSearchInput
): Promise<LinkedInProfileSearchResult[]> {
  if (!APIFY_API_TOKEN) {
    console.warn('⚠️ APIFY_API_TOKEN not configured');
    return [];
  }

  const client = new ApifyClient({
    token: APIFY_API_TOKEN,
  });

  try {
    console.log('🔍 Starting LinkedIn profile search...');
    console.log('📊 Search criteria:', {
      searchQuery: input.searchQuery,
      currentJobTitles: input.currentJobTitles,
      locations: input.locations,
      maxItems: input.maxItems,
      mode: input.profileScraperMode || 'Full',
    });

    // Default to Full mode for complete data
    const searchInput: LinkedInProfileSearchInput = {
      ...input,
      profileScraperMode: input.profileScraperMode || 'Full',
    };

    // Run the actor with extended timeout
    const run = await client.actor(LINKEDIN_PROFILE_SEARCH_ACTOR_ID).call(searchInput, {
      waitSecs: 600, // 10 minutes timeout for large searches
    });

    console.log('✅ LinkedIn profile search completed:', run.status);

    // Get the results
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    const profiles = items as unknown as LinkedInProfileSearchResult[];
    
    console.log(`📊 Found ${profiles.length} profiles from LinkedIn search`);

    // Log pagination info if available
    if (profiles.length > 0 && profiles[0]._meta?.pagination) {
      console.log(`📄 Pagination: Page ${profiles[0]._meta.pagination.pageNumber}, Total: ${profiles[0]._meta.pagination.totalElements}`);
    }

    return profiles;
  } catch (error) {
    console.error('❌ Error searching LinkedIn profiles:', error);
    return [];
  }
}
