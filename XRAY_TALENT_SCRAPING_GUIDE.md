# X-Ray Talent Scraping Documentation

## Overview

This guide explains how to implement talent scraping based on job descriptions using X-Ray search techniques. X-Ray search is a method of using search engines (Google, Bing) to find candidate profiles on platforms like LinkedIn, GitHub, Stack Overflow, etc.

## Table of Contents

1. [What is X-Ray Search](#what-is-xray-search)
2. [Architecture Overview](#architecture-overview)
3. [Implementation Steps](#implementation-steps)
4. [API Routes](#api-routes)
5. [Search Query Generation](#search-query-generation)
6. [Scraping Methods](#scraping-methods)
7. [Legal & Ethical Considerations](#legal-ethical-considerations)
8. [Alternative Solutions](#alternative-solutions)

## What is X-Ray Search?

X-Ray search uses search engine operators to find candidate profiles on public websites. Instead of using LinkedIn's internal search, you use Google/Bing with specific query parameters.

### Example X-Ray Search Query:

```
site:linkedin.com/in/ "Software Engineer" "React" "TypeScript" "San Francisco"
```

This finds LinkedIn profiles of Software Engineers with React and TypeScript skills in San Francisco.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│  User Input: Job Description                                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  AI Analysis: Extract key requirements                      │
│  - Skills (React, TypeScript, Python)                       │
│  - Role (Software Engineer, Senior Developer)               │
│  - Location (Remote, San Francisco)                         │
│  - Experience Level (5+ years)                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Generate X-Ray Search Queries                              │
│  - LinkedIn query                                           │
│  - GitHub query                                             │
│  - Stack Overflow query                                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Search Engine API / Web Scraping                           │
│  - Google Custom Search API                                 │
│  - Bing Search API                                          │
│  - Or: Puppeteer/Playwright for direct scraping            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Parse Results & Extract Profile Data                       │
│  - Name                                                      │
│  - Title                                                     │
│  - Company                                                   │
│  - Location                                                  │
│  - Profile URL                                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Score & Rank Candidates                                     │
│  - Match score based on job requirements                     │
│  - Present top candidates to user                           │
└─────────────────────────────────────────────────────────────┘
```

## Implementation Steps

### Step 1: Install Required Packages

```bash
npm install puppeteer
npm install cheerio
npm install axios
# Or for better browser automation:
npm install playwright
```

### Step 2: Create X-Ray Search Query Generator

Create file: `lib/xraySearchGenerator.ts`

```typescript
interface JobRequirements {
  title: string;
  skills: string[];
  location?: string;
  experience?: string;
  education?: string;
}

export class XRaySearchGenerator {
  /**
   * Generate LinkedIn X-Ray search query
   */
  static generateLinkedInQuery(requirements: JobRequirements): string {
    const { title, skills, location } = requirements;

    let query = "site:linkedin.com/in/";

    // Add title
    if (title) {
      query += ` "${title}"`;
    }

    // Add skills (use OR for flexibility)
    if (skills && skills.length > 0) {
      const skillsQuery = skills.map((skill) => `"${skill}"`).join(" OR ");
      query += ` (${skillsQuery})`;
    }

    // Add location
    if (location) {
      query += ` "${location}"`;
    }

    return query;
  }

  /**
   * Generate GitHub X-Ray search query
   */
  static generateGitHubQuery(requirements: JobRequirements): string {
    const { skills, location } = requirements;

    let query = "site:github.com";

    // Add programming languages/skills
    if (skills && skills.length > 0) {
      const skillsQuery = skills
        .slice(0, 3)
        .map((skill) => `"${skill}"`)
        .join(" ");
      query += ` ${skillsQuery}`;
    }

    // Add location if available
    if (location) {
      query += ` location:"${location}"`;
    }

    return query;
  }

  /**
   * Generate Stack Overflow X-Ray search query
   */
  static generateStackOverflowQuery(requirements: JobRequirements): string {
    const { skills } = requirements;

    let query = "site:stackoverflow.com/users";

    // Add top skills as tags
    if (skills && skills.length > 0) {
      const topSkills = skills.slice(0, 3).join(" ");
      query += ` ${topSkills}`;
    }

    return query;
  }

  /**
   * Generate multiple search queries from job description
   */
  static generateAllQueries(requirements: JobRequirements) {
    return {
      linkedin: this.generateLinkedInQuery(requirements),
      github: this.generateGitHubQuery(requirements),
      stackoverflow: this.generateStackOverflowQuery(requirements),
    };
  }
}
```

### Step 3: Extract Requirements from Job Description

Create file: `lib/jobDescriptionParser.ts`

```typescript
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function parseJobDescription(jobDescription: string) {
  const prompt = `
Extract the following information from this job description:
- Job Title
- Required Skills (list top 5-10)
- Location
- Experience Level
- Education Requirements

Job Description:
${jobDescription}

Return as JSON with this structure:
{
  "title": "Job Title",
  "skills": ["skill1", "skill2", ...],
  "location": "Location or Remote",
  "experience": "Experience level",
  "education": "Education requirements"
}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are a recruitment expert that extracts structured data from job descriptions.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0].message.content;
  return JSON.parse(content || "{}");
}
```

### Step 4: Implement Search Using Google Custom Search API

Create file: `lib/talentSearch.ts`

```typescript
import axios from "axios";

const GOOGLE_API_KEY = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
const GOOGLE_SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID;

export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  displayLink?: string;
}

/**
 * Perform X-Ray search using Google Custom Search API
 */
export async function performXRaySearch(
  query: string,
  maxResults: number = 10
): Promise<SearchResult[]> {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/customsearch/v1",
      {
        params: {
          key: GOOGLE_API_KEY,
          cx: GOOGLE_SEARCH_ENGINE_ID,
          q: query,
          num: maxResults,
        },
      }
    );

    if (!response.data.items) {
      return [];
    }

    return response.data.items.map((item: any) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      displayLink: item.displayLink,
    }));
  } catch (error) {
    console.error("Error performing X-Ray search:", error);
    return [];
  }
}
```

### Step 5: Alternative - Web Scraping with Puppeteer

Create file: `lib/profileScraper.ts`

```typescript
import puppeteer from "puppeteer";

/**
 * Scrape LinkedIn profiles using Puppeteer
 * NOTE: This may violate LinkedIn's ToS. Use with caution.
 */
export async function scrapeLinkedInProfiles(searchQuery: string) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    // Set user agent to avoid detection
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    );

    // Navigate to Google search with X-Ray query
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
      searchQuery
    )}`;
    await page.goto(googleSearchUrl, { waitUntil: "networkidle2" });

    // Extract search results
    const results = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll(".g"));
      return items.map((item) => {
        const titleElement = item.querySelector("h3");
        const linkElement = item.querySelector("a");
        const snippetElement = item.querySelector(".VwiC3b");

        return {
          title: titleElement?.textContent || "",
          link: linkElement?.getAttribute("href") || "",
          snippet: snippetElement?.textContent || "",
        };
      });
    });

    return results;
  } catch (error) {
    console.error("Error scraping profiles:", error);
    return [];
  } finally {
    await browser.close();
  }
}

/**
 * Extract profile information from LinkedIn profile page
 * NOTE: Requires authentication and may violate ToS
 */
export async function scrapeLinkedInProfile(profileUrl: string) {
  // This would require LinkedIn authentication
  // and may violate their Terms of Service
  // Consider using LinkedIn's official API instead

  throw new Error(
    "Direct LinkedIn profile scraping not recommended. Use LinkedIn API."
  );
}
```

### Step 6: Create API Route

Create file: `app/api/xray-search/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { parseJobDescription } from "@/lib/jobDescriptionParser";
import { XRaySearchGenerator } from "@/lib/xraySearchGenerator";
import { performXRaySearch } from "@/lib/talentSearch";

export async function POST(req: NextRequest) {
  try {
    const { jobDescription } = await req.json();

    if (!jobDescription) {
      return NextResponse.json(
        { error: "Job description is required" },
        { status: 400 }
      );
    }

    // Step 1: Parse job description to extract requirements
    const requirements = await parseJobDescription(jobDescription);

    // Step 2: Generate X-Ray search queries
    const queries = XRaySearchGenerator.generateAllQueries(requirements);

    // Step 3: Perform searches
    const [linkedInResults, githubResults, stackOverflowResults] =
      await Promise.all([
        performXRaySearch(queries.linkedin, 20),
        performXRaySearch(queries.github, 10),
        performXRaySearch(queries.stackoverflow, 10),
      ]);

    // Step 4: Combine and return results
    return NextResponse.json({
      success: true,
      requirements,
      queries,
      results: {
        linkedin: linkedInResults,
        github: githubResults,
        stackoverflow: stackOverflowResults,
      },
      totalResults:
        linkedInResults.length +
        githubResults.length +
        stackOverflowResults.length,
    });
  } catch (error: any) {
    console.error("X-Ray search error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to perform X-Ray search" },
      { status: 500 }
    );
  }
}
```

### Step 7: Create Frontend Component

Create file: `components/XRayTalentSearch.tsx`

```typescript
"use client";

import { useState } from "react";
import { Search, Users, Loader2 } from "lucide-react";

export default function XRayTalentSearch() {
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSearch = async () => {
    if (!jobDescription.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/xray-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription }),
      });

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">X-Ray Talent Search</h2>

      {/* Input */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <label className="block text-sm font-medium mb-2">
          Job Description
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste job description here..."
          rows={8}
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Find Candidates
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Requirements */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Extracted Requirements</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Title:</strong> {results.requirements.title}
              </div>
              <div>
                <strong>Location:</strong> {results.requirements.location}
              </div>
              <div className="col-span-2">
                <strong>Skills:</strong>{" "}
                {results.requirements.skills.join(", ")}
              </div>
            </div>
          </div>

          {/* LinkedIn Results */}
          {results.results.linkedin.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Users className="w-6 h-6" />
                LinkedIn Profiles ({results.results.linkedin.length})
              </h3>
              <div className="space-y-4">
                {results.results.linkedin.map((result: any, idx: number) => (
                  <div key={idx} className="border-l-4 border-blue-500 pl-4">
                    <a
                      href={result.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold text-blue-600 hover:underline"
                    >
                      {result.title}
                    </a>
                    <p className="text-sm text-gray-600 mt-1">
                      {result.snippet}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GitHub Results */}
          {results.results.github.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">
                GitHub Profiles ({results.results.github.length})
              </h3>
              <div className="space-y-4">
                {results.results.github.map((result: any, idx: number) => (
                  <div key={idx} className="border-l-4 border-gray-700 pl-4">
                    <a
                      href={result.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold text-gray-700 hover:underline"
                    >
                      {result.title}
                    </a>
                    <p className="text-sm text-gray-600 mt-1">
                      {result.snippet}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

## Legal & Ethical Considerations

### ⚠️ Important Warnings:

1. **LinkedIn Terms of Service**: LinkedIn explicitly prohibits scraping in their ToS. Violating this can result in:

   - IP bans
   - Legal action
   - Account termination

2. **Google Custom Search**: Has rate limits and usage quotas

   - Free tier: 100 queries/day
   - Paid tier required for production use

3. **GDPR & Privacy Laws**: Scraping personal data may violate:
   - GDPR (EU)
   - CCPA (California)
   - Other privacy regulations

### Legal Alternatives:

1. **LinkedIn Recruiter API** (Paid)

   - Official API access
   - Legal and compliant
   - Better data quality

2. **LinkedIn Recruiter Lite/Full** (Subscription)

   - Direct platform access
   - Advanced search features
   - InMail credits

3. **Third-Party Sourcing Tools**:
   - Hired.com
   - AngelList Talent
   - Wellfound
   - Sourcing.io

## Alternative Solutions

### Option 1: Use Official APIs

```typescript
// LinkedIn API (requires Recruiter license)
import { LinkedInAPI } from "linkedin-api-client";

const linkedin = new LinkedInAPI({
  accessToken: process.env.LINKEDIN_ACCESS_TOKEN,
});

const searchResults = await linkedin.search({
  keywords: "Software Engineer React TypeScript",
  location: "San Francisco",
});
```

### Option 2: Use Third-Party Sourcing APIs

```typescript
// Example: Apollo.io API
const apolloResponse = await fetch("https://api.apollo.io/v1/people/search", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Api-Key": process.env.APOLLO_API_KEY,
  },
  body: JSON.stringify({
    q_keywords: "Software Engineer",
    person_titles: ["Software Engineer", "Senior Developer"],
    person_locations: ["San Francisco, CA"],
  }),
});
```

### Option 3: Google Custom Search API Setup

1. **Create a Programmable Search Engine**:

   - Go to: https://programmablesearchengine.google.com/
   - Create new search engine
   - Add sites: linkedin.com, github.com, etc.
   - Get Search Engine ID

2. **Get API Key**:

   - Go to: https://console.cloud.google.com/
   - Enable Custom Search API
   - Create credentials
   - Get API key

3. **Add to Environment Variables**:

```env
GOOGLE_CUSTOM_SEARCH_API_KEY=your_api_key
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id
```

## Environment Variables Required

```env
# OpenAI for job description parsing
OPENAI_API_KEY=sk-...

# Google Custom Search (recommended)
GOOGLE_CUSTOM_SEARCH_API_KEY=...
GOOGLE_SEARCH_ENGINE_ID=...

# Optional: LinkedIn API (if using official API)
LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...
LINKEDIN_ACCESS_TOKEN=...

# Optional: Apollo.io or other sourcing APIs
APOLLO_API_KEY=...
```

## Best Practices

1. **Rate Limiting**: Implement rate limiting to avoid bans
2. **Caching**: Cache search results to reduce API calls
3. **User Agent Rotation**: Use different user agents if scraping
4. **Proxies**: Use proxy rotation for large-scale scraping
5. **Respect robots.txt**: Always check and respect robots.txt
6. **Error Handling**: Implement robust error handling
7. **Data Storage**: Store results in database for future use

## Conclusion

While X-Ray search is technically possible, the **recommended approach** is to:

1. Use **official APIs** (LinkedIn Recruiter API, Apollo.io, etc.)
2. Use **paid sourcing tools** (LinkedIn Recruiter, Sourcing.io)
3. Use **Google Custom Search API** for public data only
4. Avoid direct scraping of LinkedIn profiles

This ensures legal compliance and better long-term sustainability.

## Next Steps

1. Choose your approach (API vs. scraping)
2. Set up necessary accounts and API keys
3. Implement the chosen solution
4. Test with small datasets
5. Scale gradually with proper rate limiting
6. Monitor for any legal/ToS issues

Need help implementing any specific part? Let me know!
