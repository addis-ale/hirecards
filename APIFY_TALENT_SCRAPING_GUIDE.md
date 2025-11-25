# Apify Talent Scraping Implementation Guide

## Overview

Apify is a cloud-based web scraping and automation platform that provides pre-built scrapers (called "Actors") for LinkedIn, GitHub, and other platforms. This guide shows how to integrate Apify into your HireCard application for talent sourcing.

## Why Use Apify?

✅ **Legal & Compliant** - Apify handles compliance and ToS issues
✅ **Pre-built Scrapers** - Ready-to-use actors for LinkedIn, GitHub, etc.
✅ **Reliable Infrastructure** - Cloud-based, scalable, and maintained
✅ **No Infrastructure Needed** - No need to manage proxies, browsers, etc.
✅ **Rate Limiting Built-in** - Automatic handling of rate limits
✅ **Official API** - Clean API integration

## Table of Contents

1. [Apify Setup](#apify-setup)
2. [Available Actors](#available-actors)
3. [Implementation](#implementation)
4. [Code Examples](#code-examples)
5. [Integration with HireCard](#integration-with-hirecard)
6. [Pricing](#pricing)
7. [Best Practices](#best-practices)

## Apify Setup

### Step 1: Create Apify Account

1. Go to [apify.com](https://apify.com)
2. Sign up for a free account
3. Get your API token from Settings → Integrations → API Token

### Step 2: Install Apify Client

```bash
npm install apify-client
```

### Step 3: Add Environment Variables

```env
APIFY_API_TOKEN=apify_api_...
```

## Available Actors

### 1. LinkedIn Profile Scraper
- **Actor ID**: `apify/linkedin-profile-scraper`
- **What it does**: Scrapes LinkedIn profiles
- **Input**: LinkedIn profile URLs
- **Output**: Name, title, company, location, skills, experience, etc.

### 2. LinkedIn Company Scraper
- **Actor ID**: `apify/linkedin-company-scraper`
- **What it does**: Scrapes company information
- **Input**: Company URLs or names
- **Output**: Company details, employees, etc.

### 3. GitHub Profile Scraper
- **Actor ID**: `apify/github-profile-scraper`
- **What it does**: Scrapes GitHub profiles
- **Input**: GitHub usernames
- **Output**: Repos, contributions, languages, etc.

### 4. Google Search Results Scraper
- **Actor ID**: `apify/google-search-scraper`
- **What it does**: Scrapes Google search results
- **Input**: Search queries (can use X-Ray queries)
- **Output**: URLs, titles, snippets

## Implementation

### Architecture with Apify

```
┌──────────────────────────────────────────────────────────────┐
│  User Input: Job Description                                 │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│  AI Analysis: Extract Requirements                           │
│  (Using existing parse-role or intelligent-extract API)      │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│  Generate X-Ray Search Query                                 │
│  site:linkedin.com/in/ "Software Engineer" "React"           │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│  Apify: Google Search Scraper                                │
│  Run actor with X-Ray query                                  │
│  Returns: LinkedIn profile URLs                              │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│  Apify: LinkedIn Profile Scraper                             │
│  Scrape each LinkedIn URL                                    │
│  Returns: Full profile data                                  │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│  Score & Rank Candidates                                     │
│  Match profiles against job requirements                     │
│  Return top candidates                                       │
└──────────────────────────────────────────────────────────────┘
```

## Code Examples

### 1. Create Apify Client Library

Create file: `lib/apifyClient.ts`

```typescript
import { ApifyClient } from 'apify-client';

// Initialize the ApifyClient with your API token
const client = new ApifyClient({
  token: process.env.APIFY_API_TOKEN!,
});

export interface LinkedInProfile {
  url: string;
  fullName: string;
  title: string;
  location: string;
  company: string;
  about: string;
  experience: Array<{
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    field: string;
    startYear: string;
    endYear: string;
  }>;
  skills: string[];
  languages: string[];
}

export interface SearchResult {
  url: string;
  title: string;
  description: string;
}

export class ApifyTalentScraper {
  /**
   * Search for LinkedIn profiles using Google X-Ray search
   */
  static async searchLinkedInProfiles(
    query: string,
    maxResults: number = 20
  ): Promise<SearchResult[]> {
    try {
      // Use Google Search Scraper actor
      const run = await client.actor('apify/google-search-scraper').call({
        queries: [query],
        maxPagesPerQuery: Math.ceil(maxResults / 10),
        resultsPerPage: 100,
        mobileResults: false,
        languageCode: 'en',
        countryCode: 'us',
      });

      // Fetch results from the run's dataset
      const { items } = await client.dataset(run.defaultDatasetId).listItems();

      // Filter only LinkedIn profile URLs
      const linkedInResults = items
        .filter((item: any) => 
          item.url && 
          item.url.includes('linkedin.com/in/') &&
          !item.url.includes('/posts/') &&
          !item.url.includes('/activity/')
        )
        .slice(0, maxResults)
        .map((item: any) => ({
          url: item.url,
          title: item.title,
          description: item.description,
        }));

      return linkedInResults;
    } catch (error) {
      console.error('Error searching LinkedIn profiles:', error);
      throw error;
    }
  }

  /**
   * Scrape LinkedIn profiles
   */
  static async scrapeLinkedInProfiles(
    profileUrls: string[]
  ): Promise<LinkedInProfile[]> {
    try {
      // Use LinkedIn Profile Scraper actor
      const run = await client.actor('apify/linkedin-profile-scraper').call({
        startUrls: profileUrls.map(url => ({ url })),
        proxyConfiguration: {
          useApifyProxy: true,
        },
      });

      // Fetch results from the run's dataset
      const { items } = await client.dataset(run.defaultDatasetId).listItems();

      return items.map((item: any) => ({
        url: item.url,
        fullName: item.fullName || '',
        title: item.title || '',
        location: item.location || '',
        company: item.company || '',
        about: item.about || '',
        experience: item.experience || [],
        education: item.education || [],
        skills: item.skills || [],
        languages: item.languages || [],
      }));
    } catch (error) {
      console.error('Error scraping LinkedIn profiles:', error);
      throw error;
    }
  }

  /**
   * Search and scrape LinkedIn profiles in one go
   */
  static async findAndScrapeLinkedInProfiles(
    xrayQuery: string,
    maxProfiles: number = 10
  ): Promise<LinkedInProfile[]> {
    // Step 1: Search for profile URLs
    const searchResults = await this.searchLinkedInProfiles(
      xrayQuery,
      maxProfiles
    );

    if (searchResults.length === 0) {
      return [];
    }

    // Step 2: Scrape the profiles
    const profileUrls = searchResults.map(result => result.url);
    const profiles = await this.scrapeLinkedInProfiles(profileUrls);

    return profiles;
  }

  /**
   * Scrape GitHub profiles
   */
  static async scrapeGitHubProfiles(usernames: string[]) {
    try {
      const run = await client.actor('apify/github-profile-scraper').call({
        usernames: usernames,
      });

      const { items } = await client.dataset(run.defaultDatasetId).listItems();
      return items;
    } catch (error) {
      console.error('Error scraping GitHub profiles:', error);
      throw error;
    }
  }
}
```

### 2. Create X-Ray Query Generator

Create file: `lib/xrayQueryGenerator.ts`

```typescript
interface JobRequirements {
  title: string;
  skills: string[];
  location?: string;
  experience?: string;
  company?: string;
}

export class XRayQueryGenerator {
  /**
   * Generate LinkedIn X-Ray search query optimized for Apify
   */
  static generateLinkedInQuery(requirements: JobRequirements): string {
    const { title, skills, location, experience, company } = requirements;
    
    let query = 'site:linkedin.com/in/';
    
    // Add title/role
    if (title) {
      query += ` intitle:"${title}"`;
    }
    
    // Add top skills (limit to 3-5 for better results)
    if (skills && skills.length > 0) {
      const topSkills = skills.slice(0, 5);
      topSkills.forEach(skill => {
        query += ` "${skill}"`;
      });
    }
    
    // Add location
    if (location && location.toLowerCase() !== 'remote') {
      query += ` "${location}"`;
    }
    
    // Add experience level keywords
    if (experience) {
      if (experience.toLowerCase().includes('senior')) {
        query += ` ("Senior" OR "Lead" OR "Staff")`;
      } else if (experience.toLowerCase().includes('junior')) {
        query += ` ("Junior" OR "Associate" OR "Entry")`;
      }
    }
    
    // Exclude common noise
    query += ' -intitle:"recruiter" -intitle:"hiring"';
    
    return query;
  }

  /**
   * Generate multiple variations of the query for better results
   */
  static generateQueryVariations(requirements: JobRequirements): string[] {
    const baseQuery = this.generateLinkedInQuery(requirements);
    const queries = [baseQuery];
    
    // Variation 1: Without location (for remote candidates)
    if (requirements.location) {
      const noLocationReq = { ...requirements, location: undefined };
      queries.push(this.generateLinkedInQuery(noLocationReq));
    }
    
    // Variation 2: With fewer skills (broader search)
    if (requirements.skills.length > 3) {
      const fewerSkillsReq = {
        ...requirements,
        skills: requirements.skills.slice(0, 3),
      };
      queries.push(this.generateLinkedInQuery(fewerSkillsReq));
    }
    
    return queries;
  }
}
```

### 3. Create API Route

Create file: `app/api/talent-search/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { ApifyTalentScraper } from '@/lib/apifyClient';
import { XRayQueryGenerator } from '@/lib/xrayQueryGenerator';

export const maxDuration = 300; // 5 minutes timeout for long-running scrapes

export async function POST(req: NextRequest) {
  try {
    const { jobDescription, maxCandidates = 10 } = await req.json();

    if (!jobDescription) {
      return NextResponse.json(
        { error: 'Job description is required' },
        { status: 400 }
      );
    }

    // Step 1: Parse job description using existing API
    const parseResponse = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/parse-role`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: jobDescription }),
      }
    );

    const requirements = await parseResponse.json();

    // Step 2: Generate X-Ray search query
    const xrayQuery = XRayQueryGenerator.generateLinkedInQuery({
      title: requirements.title || requirements.role,
      skills: requirements.skills || [],
      location: requirements.location,
      experience: requirements.experience,
    });

    // Step 3: Search and scrape LinkedIn profiles using Apify
    const profiles = await ApifyTalentScraper.findAndScrapeLinkedInProfiles(
      xrayQuery,
      maxCandidates
    );

    // Step 4: Score and rank candidates
    const scoredProfiles = profiles.map(profile => ({
      ...profile,
      matchScore: calculateMatchScore(profile, requirements),
    })).sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({
      success: true,
      query: xrayQuery,
      requirements,
      candidates: scoredProfiles,
      totalFound: scoredProfiles.length,
    });
  } catch (error: any) {
    console.error('Talent search error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to search for talent' },
      { status: 500 }
    );
  }
}

/**
 * Calculate match score between profile and job requirements
 */
function calculateMatchScore(profile: any, requirements: any): number {
  let score = 0;
  const maxScore = 100;

  // Check title match (30 points)
  if (profile.title && requirements.title) {
    const titleMatch = profile.title.toLowerCase().includes(
      requirements.title.toLowerCase()
    );
    if (titleMatch) score += 30;
  }

  // Check skills match (40 points)
  if (profile.skills && requirements.skills) {
    const profileSkills = profile.skills.map((s: string) => s.toLowerCase());
    const requiredSkills = requirements.skills.map((s: string) => s.toLowerCase());
    
    const matchingSkills = requiredSkills.filter((skill: string) =>
      profileSkills.some((ps: string) => ps.includes(skill) || skill.includes(ps))
    );
    
    score += (matchingSkills.length / requiredSkills.length) * 40;
  }

  // Check location match (15 points)
  if (profile.location && requirements.location) {
    const locationMatch = profile.location.toLowerCase().includes(
      requirements.location.toLowerCase()
    );
    if (locationMatch) score += 15;
  }

  // Check experience (15 points)
  if (profile.experience && profile.experience.length > 0) {
    score += Math.min(profile.experience.length * 3, 15);
  }

  return Math.min(Math.round(score), maxScore);
}
```

### 4. Create Frontend Component

Create file: `components/TalentSearchResults.tsx`

```typescript
"use client";

import { useState } from 'react';
import { Search, User, MapPin, Briefcase, Award, ExternalLink, Loader2 } from 'lucide-react';

interface Candidate {
  url: string;
  fullName: string;
  title: string;
  company: string;
  location: string;
  about: string;
  skills: string[];
  matchScore: number;
}

export default function TalentSearchResults() {
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSearch = async () => {
    if (!jobDescription.trim()) return;

    setLoading(true);
    setResults(null);

    try {
      const response = await fetch('/api/talent-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription,
          maxCandidates: 15,
        }),
      });

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
      alert('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4" style={{ color: '#102a63' }}>
          AI-Powered Talent Search
        </h1>
        <p className="text-lg text-gray-600">
          Find qualified candidates using Apify-powered LinkedIn scraping
        </p>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <label className="block text-sm font-medium mb-2" style={{ color: '#102a63' }}>
          Job Description
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste your job description here... We'll find matching candidates on LinkedIn."
          rows={6}
          className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-[#278f8c] focus:ring-2 focus:ring-[#278f8c]/20 transition-all"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !jobDescription.trim()}
          className="mt-4 px-8 py-3 bg-[#278f8c] text-white rounded-lg hover:bg-[#1a6764] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Searching LinkedIn... (may take 2-3 minutes)
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Find Candidates
            </>
          )}
        </button>
        {loading && (
          <p className="text-sm text-gray-500 mt-2">
            ⏱️ This may take 2-3 minutes as we search and scrape profiles...
          </p>
        )}
      </div>

      {/* Results */}
      {results && results.candidates && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
            <h3 className="text-xl font-bold mb-2" style={{ color: '#102a63' }}>
              Found {results.totalFound} Candidates
            </h3>
            <p className="text-sm text-gray-700">
              <strong>Search Query:</strong> {results.query}
            </p>
          </div>

          {/* Candidates List */}
          <div className="grid gap-6">
            {results.candidates.map((candidate: Candidate, idx: number) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4"
                style={{ borderLeftColor: candidate.matchScore >= 70 ? '#278f8c' : '#94a3b8' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {candidate.fullName?.[0] || '?'}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1" style={{ color: '#102a63' }}>
                        {candidate.fullName || 'Name not available'}
                      </h3>
                      <p className="text-gray-700 font-medium mb-2">
                        {candidate.title || 'Title not available'}
                      </p>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        {candidate.company && (
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {candidate.company}
                          </span>
                        )}
                        {candidate.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {candidate.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`inline-block px-4 py-2 rounded-full font-bold text-lg ${
                        candidate.matchScore >= 70
                          ? 'bg-green-100 text-green-700'
                          : candidate.matchScore >= 50
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {candidate.matchScore}%
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Match Score</p>
                  </div>
                </div>

                {/* About */}
                {candidate.about && (
                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                    {candidate.about}
                  </p>
                )}

                {/* Skills */}
                {candidate.skills && candidate.skills.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Skills:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.slice(0, 10).map((skill: string, i: number) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {candidate.skills.length > 10 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          +{candidate.skills.length - 10} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* View Profile Button */}
                <a
                  href={candidate.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#278f8c] text-white rounded-lg hover:bg-[#1a6764] transition-all font-medium"
                >
                  <User className="w-4 h-4" />
                  View LinkedIn Profile
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {results && results.candidates && results.candidates.length === 0 && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-8 text-center">
          <p className="text-lg text-yellow-800">
            No candidates found. Try adjusting your job description or search criteria.
          </p>
        </div>
      )}
    </div>
  );
}
```

## Integration with HireCard

### Add Talent Search to Results Page

Update `app/results/page.tsx` to include talent search:

```typescript
import TalentSearchResults from '@/components/TalentSearchResults';

// Add a new tab or section for talent search
<TalentSearchResults />
```

### Or Create Dedicated Talent Search Page

Create `app/talent-search/page.tsx`:

```typescript
import TalentSearchResults from '@/components/TalentSearchResults';

export default function TalentSearchPage() {
  return <TalentSearchResults />;
}
```

## Pricing

### Apify Pricing Tiers:

1. **Free Tier**:
   - $5 free credits/month
   - Good for testing (~50 profiles)

2. **Starter** ($49/month):
   - $49 worth of credits
   - ~500 LinkedIn profiles/month

3. **Professional** ($499/month):
   - $499 worth of credits
   - ~5,000 LinkedIn profiles/month

### Cost Breakdown:
- Google Search: ~$0.001 per search
- LinkedIn Profile Scrape: ~$0.10 per profile
- Typical search (10 profiles): ~$1.00

## Best Practices

### 1. Caching Results
```typescript
// Cache search results in database
await supabase.from('talent_searches').insert({
  query: xrayQuery,
  results: profiles,
  created_at: new Date(),
});
```

### 2. Batch Processing
```typescript
// Process profiles in batches to save costs
const batches = chunkArray(profileUrls, 10);
for (const batch of batches) {
  const profiles = await ApifyTalentScraper.scrapeLinkedInProfiles(batch);
  // Process and save
}
```

### 3. Rate Limiting
```typescript
// Limit searches per user
const searchCount = await getUserSearchCount(userId);
if (searchCount > 10) {
  throw new Error('Monthly search limit reached');
}
```

### 4. Error Handling
```typescript
try {
  const profiles = await ApifyTalentScraper.findAndScrapeLinkedInProfiles(query);
} catch (error) {
  if (error.message.includes('rate limit')) {
    // Handle rate limit
  } else if (error.message.includes('timeout')) {
    // Handle timeout
  }
}
```

## Environment Variables

```env
# Required
APIFY_API_TOKEN=apify_api_...

# For parsing job descriptions
OPENAI_API_KEY=sk-...

# Your app URL (for internal API calls)
NEXT_PUBLIC_URL=http://localhost:3000
```

## Testing

### Test with Sample Job Description:

```typescript
const testJobDescription = `
Senior Software Engineer - React & TypeScript
San Francisco, CA (Hybrid)

We're looking for a Senior Software Engineer with 5+ years of experience
in React, TypeScript, and Node.js. Must have experience with:
- React 18+
- TypeScript
- Next.js
- GraphQL
- AWS/Cloud platforms

Must be located in or willing to relocate to San Francisco Bay Area.
`;
```

## Advantages of Apify

✅ **Legal compliance** - Apify handles ToS issues
✅ **Reliability** - 99.9% uptime
✅ **Scalability** - Can scrape thousands of profiles
✅ **Maintenance-free** - Apify updates actors when sites change
✅ **No infrastructure** - No proxies, browsers, or servers needed
✅ **Rate limiting** - Built-in handling
✅ **Support** - Apify provides support

## Next Steps

1. **Sign up for Apify** - Get your API token
2. **Install Apify client** - `npm install apify-client`
3. **Copy the code examples** - Implement the provided code
4. **Test with small searches** - Try with 5-10 profiles
5. **Integrate with HireCard** - Add to results page or create dedicated page
6. **Monitor usage** - Track Apify credits
7. **Scale gradually** - Increase as needed

## Summary

Apify is the **best solution** for talent scraping because:
- ✅ Legal and compliant
- ✅ Reliable and maintained
- ✅ Easy to implement
- ✅ Cost-effective
- ✅ Scalable

**Ready to implement? Let me know if you need help with any specific part!**
