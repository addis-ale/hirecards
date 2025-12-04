/**
 * LinkedIn Profile Scraper using Apify
 * Actor ID: 2SyF0bVxmgGr8IVCZ
 * Provides talent supply data for Market Card
 */

import { ApifyClient } from 'apify-client';

const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN;
const LINKEDIN_PROFILE_SCRAPER_ACTOR_ID = '2SyF0bVxmgGr8IVCZ';

export interface LinkedInProfile {
  fullName: string;
  headline: string;
  location: string;
  profileUrl: string;
  currentCompany?: string;
  currentPosition?: string;
  skills?: string[];
  experience?: any[];
  education?: any[];
  connections?: string;
}

export interface TalentSupplyData {
  totalProfiles: number;
  profilesAnalyzed: number;
  locationDistribution: { [location: string]: number };
  topSkills: { skill: string; count: number }[];
  experienceLevels: { [level: string]: number };
  currentlyEmployed: number;
  openToWork: number;
  topCurrentCompanies: { company: string; count: number }[];
}

/**
 * Scrape LinkedIn profiles based on search criteria
 */
export async function scrapeLinkedInProfiles(
  searchQuery: string,
  location: string,
  maxProfiles: number = 100
): Promise<LinkedInProfile[]> {
  if (!APIFY_API_TOKEN) {
    console.warn('⚠️ APIFY_API_TOKEN not configured');
    return [];
  }

  const client = new ApifyClient({
    token: APIFY_API_TOKEN,
  });

  try {
    console.log('🔍 Scraping LinkedIn profiles:', { searchQuery, location, maxProfiles });
    console.log('⚠️ Note: This actor requires profileUrls, not search. Returning empty for now.');
    console.log('   LinkedIn Profile Scraper needs actual profile URLs as input.');
    console.log('   Consider using LinkedIn People Search actor instead.');

    // This actor requires profile URLs, not search queries
    // For now, return empty array to prevent errors
    // TODO: Either provide actual profile URLs or use a different actor
    
    return [];

    // Original code commented out - requires profile URLs
    /*
    const input = {
      profileUrls: [], // REQUIRED - array of LinkedIn profile URLs
      // searchQuery and location are NOT supported by this actor
    };

    const run = await client.actor(LINKEDIN_PROFILE_SCRAPER_ACTOR_ID).call(input, {
      waitSecs: 180,
    });

    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    return items as LinkedInProfile[];
    */
  } catch (error) {
    console.error('❌ Error scraping LinkedIn profiles:', error);
    return [];
  }
}

/**
 * Analyze talent supply from scraped profiles
 */
export function analyzeTalentSupply(profiles: LinkedInProfile[]): TalentSupplyData {
  if (profiles.length === 0) {
    return {
      totalProfiles: 0,
      profilesAnalyzed: 0,
      locationDistribution: {},
      topSkills: [],
      experienceLevels: {},
      currentlyEmployed: 0,
      openToWork: 0,
      topCurrentCompanies: [],
    };
  }

  // Location distribution
  const locationMap: { [location: string]: number } = {};
  profiles.forEach((profile) => {
    const loc = profile.location || 'Unknown';
    locationMap[loc] = (locationMap[loc] || 0) + 1;
  });

  // Skills aggregation
  const skillsMap: { [skill: string]: number } = {};
  profiles.forEach((profile) => {
    if (profile.skills && Array.isArray(profile.skills)) {
      profile.skills.forEach((skill) => {
        skillsMap[skill] = (skillsMap[skill] || 0) + 1;
      });
    }
  });

  const topSkills = Object.entries(skillsMap)
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Experience levels (based on headline)
  const experienceLevels: { [level: string]: number } = {
    Junior: 0,
    'Mid-Level': 0,
    Senior: 0,
    Lead: 0,
    Executive: 0,
  };

  profiles.forEach((profile) => {
    const headline = (profile.headline || '').toLowerCase();
    if (headline.includes('junior') || headline.includes('entry')) {
      experienceLevels.Junior++;
    } else if (headline.includes('senior') || headline.includes('sr')) {
      experienceLevels.Senior++;
    } else if (
      headline.includes('lead') ||
      headline.includes('staff') ||
      headline.includes('principal')
    ) {
      experienceLevels.Lead++;
    } else if (
      headline.includes('director') ||
      headline.includes('vp') ||
      headline.includes('head of')
    ) {
      experienceLevels.Executive++;
    } else {
      experienceLevels['Mid-Level']++;
    }
  });

  // Employment status
  const currentlyEmployed = profiles.filter((p) => p.currentCompany).length;
  const openToWork = profiles.filter(
    (p) =>
      p.headline?.toLowerCase().includes('open to') ||
      p.headline?.toLowerCase().includes('seeking')
  ).length;

  // Current companies
  const companyMap: { [company: string]: number } = {};
  profiles.forEach((profile) => {
    if (profile.currentCompany) {
      companyMap[profile.currentCompany] =
        (companyMap[profile.currentCompany] || 0) + 1;
    }
  });

  const topCurrentCompanies = Object.entries(companyMap)
    .map(([company, count]) => ({ company, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalProfiles: profiles.length,
    profilesAnalyzed: profiles.length,
    locationDistribution: locationMap,
    topSkills,
    experienceLevels,
    currentlyEmployed,
    openToWork,
    topCurrentCompanies,
  };
}
