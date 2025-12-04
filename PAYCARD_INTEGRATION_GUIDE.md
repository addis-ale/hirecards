# PayCard Integration Guide

## Quick Start

You now have a complete PayCard salary enrichment system! Here's how to integrate it into your existing flow.

## What We Built

### 1. **Apify Client** (`lib/apifyClient.ts`)
   - Scrapes LinkedIn jobs using Actor `BHzefUZlZRKWxkTck`
   - Analyzes salary data from job postings
   - Generates market compensation insights

### 2. **API Endpoint** (`app/api/enrich-salary/route.ts`)
   - Accepts job title, location, experience level
   - Returns enriched PayCard data structure
   - Handles cases with/without salary data

### 3. **Dynamic PayCard Component** (`components/cards/DynamicPayCard.tsx`)
   - Renders PayCard with real market data
   - Supports loading states
   - Falls back to default data if needed

## Integration Steps

### Option A: Add to Card Generation Flow

Modify `app/api/generate-cards/route.ts` to include salary enrichment:

```typescript
import { scrapeLinkedInJobs, analyzeMarketCompensation } from '@/lib/apifyClient';

export async function POST(request: NextRequest) {
  const data = await request.json();
  
  // Generate regular cards
  const cards = generateBattleCards(data);
  
  // Enrich PayCard with market data (async)
  let payCardData = null;
  try {
    const jobs = await scrapeLinkedInJobs(
      data.jobTitle,
      data.location,
      data.experienceLevel,
      50
    );
    
    const marketComp = analyzeMarketCompensation(jobs, data.location);
    if (marketComp) {
      payCardData = generatePayCardData(marketComp, data.jobTitle, data.experienceLevel);
    }
  } catch (error) {
    console.error('Salary enrichment failed:', error);
    // Continue without enrichment
  }
  
  return NextResponse.json({
    success: true,
    cards,
    payCardData, // Include enriched data
    sessionId: generateSessionId(),
  });
}
```

### Option B: Separate Enrichment Step (Recommended)

Keep enrichment separate for better UX and performance:

```typescript
// In your frontend (e.g., app/results/page.tsx)

const [payCardData, setPayCardData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function enrichPayCard() {
    try {
      const response = await fetch('/api/enrich-salary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: scrapedData.jobTitle,
          location: scrapedData.location,
          experienceLevel: scrapedData.experienceLevel,
        }),
      });
      
      const result = await response.json();
      if (result.success && result.hasSalaryData) {
        setPayCardData(result.payCardData);
      }
    } catch (error) {
      console.error('Failed to enrich salary:', error);
    } finally {
      setLoading(false);
    }
  }
  
  enrichPayCard();
}, [scrapedData]);

// Render with dynamic data
return (
  <div>
    {/* Other cards */}
    <DynamicPayCard data={payCardData} loading={loading} />
  </div>
);
```

### Option C: On-Demand Enrichment

Add a button to let users trigger enrichment:

```tsx
const [enriching, setEnriching] = useState(false);

const handleEnrich = async () => {
  setEnriching(true);
  // Call API and update PayCard
};

return (
  <div>
    <button onClick={handleEnrich} disabled={enriching}>
      {enriching ? '🔍 Fetching Market Data...' : '💰 Get Real Salary Data'}
    </button>
    <DynamicPayCard data={payCardData} loading={enriching} />
  </div>
);
```

## Data Flow Example

```
User submits job URL
       ↓
Puppeteer scrapes → AI parses
       ↓
{
  jobTitle: "Senior Software Engineer",
  location: "Amsterdam",
  experienceLevel: "Senior",
  ...other fields
}
       ↓
POST /api/enrich-salary
       ↓
Apify scrapes 50 LinkedIn jobs
       ↓
Analyzes salary data (5 jobs have salaries)
       ↓
{
  payCardData: {
    marketCompensation: [...],
    recommendedRange: "€93k–€105k",
    brutalTruth: "...",
    ...
  }
}
       ↓
<DynamicPayCard data={payCardData} />
```

## Key Considerations

### 1. **Location & Job Title are Critical**

The Apify actor requires specific inputs:

✅ **Good**:
```javascript
{
  jobTitle: "Software Engineer",
  location: "Amsterdam",
  experienceLevel: "Senior"
}
```

❌ **Bad**:
```javascript
{
  jobTitle: "Rockstar Ninja Developer", // Not a real job title
  location: "Remote", // Too vague
  experienceLevel: "Super Senior" // Invalid format
}
```

### 2. **Handle Missing Salary Data**

Most LinkedIn jobs don't list salaries publicly:

```typescript
const result = await fetch('/api/enrich-salary', {...});
const data = await result.json();

if (data.hasSalaryData) {
  // Use enriched data
  setPayCardData(data.payCardData);
} else {
  // Fall back to defaults or show message
  console.log(data.message); // "Found 50 jobs but none included salary"
  setPayCardData(defaultPayCardData);
}
```

### 3. **Performance - It Takes Time**

Scraping 50 LinkedIn jobs takes **1-3 minutes**:

```tsx
// Show loading state
<DynamicPayCard loading={true} />

// Or show progress
<div>
  <p>🔍 Searching LinkedIn for similar jobs...</p>
  <p>⏱️ This usually takes 1-2 minutes</p>
  <ProgressBar />
</div>
```

### 4. **Consider Caching**

Cache results to avoid repeated scraping:

```typescript
// Simple session storage cache
const cacheKey = `salary:${jobTitle}:${location}:${experienceLevel}`;
const cached = sessionStorage.getItem(cacheKey);

if (cached) {
  const data = JSON.parse(cached);
  // Check if cache is still fresh (e.g., < 7 days old)
  if (Date.now() - data.timestamp < 7 * 24 * 60 * 60 * 1000) {
    return data.payCardData;
  }
}

// Fetch fresh data and cache it
const result = await fetch('/api/enrich-salary', {...});
sessionStorage.setItem(cacheKey, JSON.stringify({
  payCardData: result.payCardData,
  timestamp: Date.now(),
}));
```

## Testing Your Integration

### 1. Test with Mock Data First

```typescript
// Test without actually calling Apify
const mockPayCardData = {
  marketCompensation: [
    { label: "Base", value: "€85k–€100k" },
    { label: "Total comp", value: "€94k–€115k" },
    { label: "Published range", value: "€6,100–€7,900/month" }
  ],
  recommendedRange: "€93k–€105k for top-tier Senior",
  location: "Amsterdam",
  brutalTruth: "If you offer €68k, you won't hire a senior.",
  redFlags: ["Candidate wants >20% above market", "..."],
  donts: ["Hide comp until final stage", "..."],
  fixes: ["Align comp band with market data", "..."],
  hiddenBottleneck: "Your comp is competing with remote US employers.",
  timelineToFailure: "If comp approval takes >5 days → rejection."
};

<DynamicPayCard data={mockPayCardData} />
```

### 2. Test API Endpoint

```bash
# Start dev server
npm run dev

# Test the API
curl -X POST http://localhost:3000/api/enrich-salary \
  -H "Content-Type: application/json" \
  -d '{
    "jobTitle": "Software Engineer",
    "location": "Amsterdam",
    "experienceLevel": "Senior"
  }'
```

### 3. Test Full Integration

Create a simple test page:

```tsx
// app/test-paycard/page.tsx
"use client";

import { useState } from 'react';
import { DynamicPayCard } from '@/components/cards/DynamicPayCard';

export default function TestPayCard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const testEnrichment = async () => {
    setLoading(true);
    const response = await fetch('/api/enrich-salary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobTitle: 'Software Engineer',
        location: 'Amsterdam',
        experienceLevel: 'Senior',
      }),
    });
    
    const result = await response.json();
    if (result.hasSalaryData) {
      setData(result.payCardData);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-8">
      <button 
        onClick={testEnrichment}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Test Salary Enrichment
      </button>
      
      <DynamicPayCard data={data} loading={loading} />
    </div>
  );
}
```

Visit: `http://localhost:3000/test-paycard`

## Troubleshooting

### "APIFY_API_TOKEN not configured"
```bash
# Add to .env.local
APIFY_API_TOKEN=process.env.APIFY_TOKEN

# Restart dev server
npm run dev
```

### "No salary data found"
- This is normal! Most LinkedIn jobs don't list salaries
- Try increasing `maxJobsPerSearch` to 100
- Fall back to default PayCard data
- Consider adding manual salary input option

### "Request timeout"
- Increase `waitSecs` in API call
- Reduce `maxJobsPerSearch` to 25
- Add retry logic with exponential backoff

## What's Next?

Now that you understand the PayCard implementation, here are the next steps:

1. **Integrate into your existing flow** - Choose Option A, B, or C above
2. **Test with real data** - Try different job titles and locations
3. **Handle edge cases** - No salary data, timeouts, API errors
4. **Add caching** - Avoid repeated scraping for same queries
5. **Improve UX** - Add progress indicators, better error messages

Would you like me to:
- **A)** Integrate this into your existing card generation flow?
- **B)** Add this to the chatbot flow so users can trigger enrichment?
- **C)** Create a standalone test page to demonstrate the feature?
- **D)** Add caching to improve performance?
- **E)** Something else?
