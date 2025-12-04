# PayCard Salary Enrichment Implementation

## Overview

The PayCard now integrates with **Apify's LinkedIn Jobs Scraper** (Actor ID: `BHzefUZlZRKWxkTck`) to provide real-time market salary data. This enrichment happens after the initial job scraping and AI refinement, using the job title and location as critical inputs.

## Architecture

```
┌─────────────────────┐
│  Job URL Scraping   │
│   (Puppeteer)       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  AI Refinement      │
│   (ChatGPT)         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Salary Enrichment   │◄────── Job Title + Location
│  (Apify Actor)      │        (Critical Inputs!)
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  PayCard Data       │
│   Generation        │
└─────────────────────┘
```

## Key Components

### 1. Apify Client (`lib/apifyClient.ts`)

**Purpose**: Interface with Apify's LinkedIn Jobs Scraper to get market salary data.

**Main Functions**:
- `scrapeLinkedInJobs()` - Scrapes LinkedIn for similar job postings
- `analyzeMarketCompensation()` - Analyzes salary data from scraped jobs
- `parseSalaryString()` - Extracts structured salary data from text
- `mapExperienceLevelToApify()` - Converts experience level to Apify format

**Experience Level Mapping**:
- `"1"` = Entry Level / Junior
- `"2"` = Mid-Level
- `"3"` = Senior
- `"4"` = Lead / Staff
- `"5"` = Principal / Executive / Director

**Example Usage**:
```typescript
import { scrapeLinkedInJobs, analyzeMarketCompensation } from '@/lib/apifyClient';

// Scrape jobs
const jobs = await scrapeLinkedInJobs(
  'Senior Software Engineer',
  'Amsterdam',
  'Senior',
  50 // maxJobs
);

// Analyze compensation
const marketComp = analyzeMarketCompensation(jobs, 'Amsterdam');
```

### 2. Salary Enrichment API (`app/api/enrich-salary/route.ts`)

**Endpoint**: `POST /api/enrich-salary`

**Request Body**:
```json
{
  "jobTitle": "Senior Software Engineer",
  "location": "Amsterdam",
  "experienceLevel": "Senior"
}
```

**Response (Success with Salary Data)**:
```json
{
  "success": true,
  "hasSalaryData": true,
  "marketCompensation": {
    "baseMin": 85000,
    "baseMax": 100000,
    "totalCompMin": 93500,
    "totalCompMax": 115000,
    "currency": "EUR",
    "location": "Amsterdam",
    "sampleSize": 5,
    "publishedRanges": ["€50k-€70k", "€80k-€100k"],
    "jobsWithSalary": 5,
    "totalJobs": 50
  },
  "payCardData": {
    "marketCompensation": [
      { "label": "Base", "value": "€85k–€100k" },
      { "label": "Total comp", "value": "€94k–€115k" },
      { "label": "Published range", "value": "€50k-€70k" }
    ],
    "recommendedRange": "€93k–€105k for top-tier Senior talent",
    "location": "Amsterdam",
    "brutalTruth": "If you offer €68k, you will not hire a Senior Senior Software Engineer...",
    "redFlags": [...],
    "donts": [...],
    "fixes": [...],
    "hiddenBottleneck": "Your comp is competing with remote US employers...",
    "timelineToFailure": "If comp approval takes >5 days → expect candidate rejection."
  },
  "metadata": {
    "jobsScraped": 50,
    "jobsWithSalary": 5,
    "sampleSize": 5,
    "confidence": 0.6
  }
}
```

**Response (No Salary Data)**:
```json
{
  "success": true,
  "hasSalaryData": false,
  "jobsFound": 50,
  "message": "Found 50 jobs but none included salary information..."
}
```

### 3. Dynamic PayCard Component (`components/cards/DynamicPayCard.tsx`)

**Purpose**: Renders PayCard with enriched market salary data.

**Props**:
```typescript
interface PayCardData {
  marketCompensation: Array<{ label: string; value: string }>;
  recommendedRange: string;
  location: string;
  currency?: string;
  brutalTruth: string;
  redFlags: string[];
  donts: string[];
  fixes: string[];
  hiddenBottleneck: string;
  timelineToFailure: string;
}

interface DynamicPayCardProps {
  data?: PayCardData;
  loading?: boolean;
}
```

**Example Usage**:
```tsx
import { DynamicPayCard } from '@/components/cards/DynamicPayCard';

// With enriched data
<DynamicPayCard data={payCardData} />

// Loading state
<DynamicPayCard loading={true} />

// With fallback (uses default data)
<DynamicPayCard />
```

## Integration Flow

### Step-by-Step Process

1. **Job URL Scraping**
   ```typescript
   // app/api/scrape-job/route.ts
   const scrapedData = await scrapeJobURL(url);
   const parsedData = await parseScrapedJobData(scrapedData);
   ```

2. **AI Chatbot Refinement** (Optional)
   - User can refine job details through conversational chatbot
   - Missing fields are filled by AI
   - Job title and location are finalized

3. **Salary Enrichment**
   ```typescript
   // Call the enrichment API
   const response = await fetch('/api/enrich-salary', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       jobTitle: refinedJobTitle,
       location: refinedLocation,
       experienceLevel: refinedExperienceLevel
     })
   });
   
   const { payCardData } = await response.json();
   ```

4. **Card Generation**
   ```tsx
   // Render all cards including enriched PayCard
   <DynamicPayCard data={payCardData} />
   ```

## Important Notes

### Location and Job Title Matter!

The Apify actor **heavily relies on accurate location and job title**:

✅ **Good Inputs**:
- Location: "Amsterdam", "London", "Berlin", "San Francisco"
- Job Title: "Senior Software Engineer", "Product Manager", "Data Scientist"

❌ **Poor Inputs**:
- Location: "Remote" (too broad), "Europe" (too vague)
- Job Title: "Rockstar Developer" (not standard), "Ninja Coder" (not real)

### Salary Data Availability

**Reality Check**: Most LinkedIn job postings (70-90%) don't include salary information publicly.

**What this means**:
- The actor may scrape 50 jobs but only 5-10 have salary data
- Confidence scores reflect this: 
  - 20+ salaries = 90% confidence
  - 10-19 salaries = 75% confidence
  - 5-9 salaries = 60% confidence
  - 3-4 salaries = 50% confidence
  - 1-2 salaries = 30% confidence

**Fallback Strategy**:
- If no salary data is found, the API returns `hasSalaryData: false`
- The component should fall back to default/manual data entry
- Consider adding a "Data unavailable" message to the PayCard

### Performance Considerations

**Scraping Time**: 1-3 minutes per job search
- Recommend running enrichment **asynchronously**
- Show loading state while scraping
- Consider caching results for common job title + location combinations

**API Costs**: 
- Apify charges per compute unit
- Each scrape of 50 jobs ≈ 0.05-0.10 compute units
- Consider limiting to 25-50 jobs per search

## Configuration

### Environment Variables

Add to `.env.local`:
```bash
APIFY_API_TOKEN=apify_api_your_token_here
```

### Installing Dependencies

```bash
npm install apify-client
```

## Testing

### Test the Apify Integration

```bash
# Test LinkedIn scraper directly
node tmp_rovodev_test_apify_wait.js

# Test salary enrichment API (requires dev server running)
npm run dev
node tmp_rovodev_test_salary_enrichment.js
```

### Manual Testing

1. Start dev server: `npm run dev`
2. Make a POST request to `http://localhost:3000/api/enrich-salary`:
   ```bash
   curl -X POST http://localhost:3000/api/enrich-salary \
     -H "Content-Type: application/json" \
     -d '{"jobTitle":"Software Engineer","location":"Amsterdam","experienceLevel":"Senior"}'
   ```

## Future Enhancements

### 1. Caching
```typescript
// Cache market compensation data for 7 days
const cacheKey = `salary:${jobTitle}:${location}:${experienceLevel}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

// ... scrape and cache
await redis.setex(cacheKey, 604800, JSON.stringify(result));
```

### 2. Multiple Data Sources
- Combine LinkedIn data with Glassdoor, Indeed, etc.
- Use multiple Apify actors for better coverage
- Aggregate and normalize data from all sources

### 3. AI-Enhanced Analysis
```typescript
// Use ChatGPT to analyze scraped descriptions for hidden compensation signals
const insights = await analyzeJobDescriptionsWithAI(jobs);
```

### 4. Real-time Updates
- WebSocket connection for live scraping progress
- Progressive data loading as jobs are scraped
- Update PayCard in real-time as data comes in

## Troubleshooting

### "No salary data found"
- **Cause**: LinkedIn jobs don't publicly list salaries
- **Solution**: Increase `maxJobsPerSearch` to 100+, or use fallback data

### "Actor timeout"
- **Cause**: LinkedIn blocking or network issues
- **Solution**: Increase `waitSecs` timeout, or retry with exponential backoff

### "Invalid experience level"
- **Cause**: Incorrect format (must be "1", "2", "3", "4", or "5")
- **Solution**: Use `mapExperienceLevelToApify()` helper function

### "APIFY_API_TOKEN not configured"
- **Cause**: Missing environment variable
- **Solution**: Add token to `.env.local` and restart dev server

## Summary

The PayCard salary enrichment provides **real market data** to make hiring decisions more informed and competitive. By leveraging Apify's LinkedIn Jobs Scraper with job title and location as critical inputs, we can generate accurate compensation ranges, identify red flags, and provide actionable recommendations.

**Key Takeaways**:
1. ✅ Location and job title are **critical** - be specific!
2. ⏱️ Scraping takes 1-3 minutes - use async/loading states
3. 📊 Salary data is sparse - handle `hasSalaryData: false` gracefully
4. 💰 Use confidence scores to inform decision-making
5. 🔄 Consider caching for common searches
