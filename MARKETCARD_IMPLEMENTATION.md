# Market Card Implementation - Complete Guide

## 🎯 Overview

The Market Card now uses **two Apify scrapers** (Jobs + Profiles) to provide real-time market intelligence with AI-bounded analysis.

## 📊 The Flow

```
User provides job data (title, location, skills)
         ↓
AI formats data for BOTH Apify actors
   ├─ Jobs Input: { jobTitle, location, experienceLevel }
   └─ Profiles Input: { searchQuery, location, maxProfiles }
         ↓
Run BOTH scrapers in parallel (60-120s)
   ├─ LinkedIn Jobs Scraper → 50 job postings
   └─ LinkedIn Profile Scraper → 100 candidate profiles
         ↓
AI analyzes BOTH responses (bounded to scraped data)
   ├─ Demand side: jobs, competition, hiring velocity
   ├─ Supply side: candidates, skills, availability
   └─ Combined: supply/demand ratio, market tightness
         ↓
Format → Market Card structure
         ↓
Render with REAL market data
```

## 🔧 Files Created

### 1. **`lib/linkedinProfileScraper.ts`** (NEW)
**Purpose**: LinkedIn Profile Scraper integration

**Key Functions**:
- `scrapeLinkedInProfiles()` - Scrapes candidate profiles
- `analyzeTalentSupply()` - Analyzes supply-side data

**Apify Actor**: `2SyF0bVxmgGr8IVCZ`

**What it scrapes**:
- Candidate profiles matching search criteria
- Skills, experience, location
- Current employment status
- Education, companies

### 2. **`lib/aiMarketCardFormatter.ts`** (NEW)
**Purpose**: AI formatting and bounded analysis

**Key Functions**:
- `formatForMarketAnalysis()` - AI formats data for BOTH actors
- `analyzeAndFormatMarketCard()` - AI analyzes both responses
- Fallback functions for when AI unavailable

**AI's Role**:
- Format input for both scrapers
- Analyze supply (profiles) + demand (jobs)
- Calculate market dynamics
- Generate insights from patterns
- BOUNDED to scraped data only

### 3. **`app/api/enrich-market/route.ts`** (NEW)
**Purpose**: API endpoint for market enrichment

**Endpoint**: `POST /api/enrich-market`

**Request**:
```json
{
  "jobTitle": "Software Engineer",
  "location": "Amsterdam",
  "experienceLevel": "Senior",
  "skills": ["Python", "React", "AWS"]
}
```

**OR**:
```json
{
  "scrapedJobData": { /* full scraped object */ }
}
```

**Response**:
```json
{
  "success": true,
  "hasMarketData": true,
  "marketCardData": {
    "talentAvailability": {
      "total": 350,
      "qualified": 245,
      "currentlyEmployed": 85,
      "openToWork": 25
    },
    "supplyDemand": {
      "openJobs": 45,
      "availableCandidates": 350,
      "ratio": "8:1",
      "marketTightness": "balanced"
    },
    "competition": {
      "activeCompanies": 12,
      "topCompetitors": ["Booking.com", "Adyen", "Mollie"],
      "averageApplications": 87
    },
    "hiringVelocity": {
      "averageTimeToFill": "45 days",
      "marketActivity": "medium"
    },
    "skillLandscape": {
      "mostCommon": ["Python", "React", "AWS"],
      "scarcity": {}
    },
    "geographic": {
      "primaryLocations": ["Amsterdam"],
      "remoteAvailability": 20
    },
    "insights": [
      "350 candidates found for Software Engineer",
      "45 open positions (balanced market)",
      "85% of candidates currently employed",
      "Supply/Demand ratio: 8:1"
    ],
    "redFlags": [
      "Top talent is employed",
      "High competition",
      "Outbound required"
    ],
    "opportunities": [
      "25 candidates actively seeking opportunities",
      "Good time to hire with active job seekers"
    ],
    "metadata": {
      "jobsAnalyzed": 45,
      "profilesAnalyzed": 350,
      "dataQuality": "high",
      "confidence": 0.85
    }
  },
  "metadata": {
    "jobsAnalyzed": 45,
    "profilesAnalyzed": 350,
    "dataQuality": "high",
    "confidence": 0.85,
    "inputs": {
      "jobsInput": { /* ... */ },
      "profilesInput": { /* ... */ }
    }
  }
}
```

### 4. **`components/cards/EditableMarketCard.tsx`** (UPDATED)
**Purpose**: Render Market Card with dynamic data

**What Changed**:
- Now accepts `data` prop
- Initializes from real market data
- Falls back to defaults if no data
- Still editable by user

**Before** (Static):
```tsx
const [amsterdamCount, setAmsterdamCount] = useState("250-400");
const [marketConditions, setMarketConditions] = useState([
  "Top talent is employed",
  "High competition",
  "Outbound required"
]);
```

**After** (Dynamic):
```tsx
const [amsterdamCount, setAmsterdamCount] = useState(
  data?.talentAvailability?.total 
    ? `${data.talentAvailability.total}` 
    : "250-400"
);
const [marketConditions, setMarketConditions] = useState(
  data?.redFlags && data.redFlags.length > 0
    ? data.redFlags
    : ["Top talent is employed", "High competition", "Outbound required"]
);
```

### 5. **`components/cards/DynamicMarketCard.tsx`** (NEW)
**Purpose**: Non-editable Market Card for display

**Features**:
- Full market data visualization
- Supply/demand metrics
- Competition landscape
- Hiring velocity
- Skill landscape
- Key insights
- Red flags & opportunities
- Data quality indicators

## 🚀 Usage

### Option 1: API Call

```javascript
const response = await fetch('/api/enrich-market', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jobTitle: 'Software Engineer',
    location: 'Amsterdam',
    experienceLevel: 'Senior',
    skills: ['Python', 'React', 'AWS']
  })
});

const { marketCardData } = await response.json();
```

### Option 2: With Scraped Data

```javascript
// After initial job scraping
const response = await fetch('/api/enrich-market', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    scrapedJobData: {
      jobTitle: 'Senior Software Engineer',
      location: 'Amsterdam',
      experienceLevel: 'Senior',
      skills: ['Python', 'React', 'AWS']
    }
  })
});

const { marketCardData } = await response.json();
```

### Option 3: Render in UI

```tsx
import { EditableMarketCard } from '@/components/cards/EditableMarketCard';
import { DynamicMarketCard } from '@/components/cards/DynamicMarketCard';

// Editable version (user can modify)
<EditableMarketCard data={marketCardData} />

// Display version (read-only)
<DynamicMarketCard data={marketCardData} />

// Loading state
<DynamicMarketCard loading={true} />

// Fallback (uses defaults)
<EditableMarketCard />
```

## 🎯 What Market Card Shows

### Supply Side (from Profile Scraper):
- **Total Profiles Found**: 350 candidates
- **Qualified Candidates**: ~245 (70% match)
- **Currently Employed**: 85%
- **Actively Looking**: 25 candidates
- **Top Skills**: Python, React, AWS
- **Current Companies**: Where they work now

### Demand Side (from Job Scraper):
- **Open Jobs**: 45 positions
- **Active Companies**: 12 competitors
- **Top Competitors**: Booking.com, Adyen, Mollie
- **Average Applications**: 87 per job
- **Market Activity**: High/Medium/Low

### Combined Insights:
- **Supply/Demand Ratio**: 8:1 (8 candidates per job)
- **Market Tightness**: Tight/Balanced/Loose
- **Average Time to Fill**: 45 days
- **Geographic Distribution**: Where talent is
- **Remote Availability**: % open to remote

### AI-Generated:
- **Key Insights**: Market patterns detected
- **Red Flags**: Hiring challenges
- **Opportunities**: Market advantages
- **Brutal Truth**: Reality check

## 🔄 Data Mapping

### How Static Data Becomes Dynamic:

**Amsterdam Count**:
```
Static: "250-400"
Dynamic: data.talentAvailability.total = 350
```

**EU Relocation Count**:
```
Static: "~1,500+"
Dynamic: ~${Math.round(availableCandidates * 0.3)}+ = ~105+
```

**Remote Flex Count**:
```
Static: "~3,000+"
Dynamic: ~${Math.round(availableCandidates * 0.6)}+ = ~210+
```

**Market Conditions**:
```
Static: ["Top talent is employed", "High competition", "Outbound required"]
Dynamic: data.redFlags = ["85% candidates employed", "12 companies competing", "Only 25 actively looking"]
```

**Brutal Truth**:
```
Static: "Strict location + low comp = long search."
Dynamic: data.insights[0] = "350 candidates found but only 25 actively seeking. Tight market requires outbound recruiting."
```

## ⚡ Performance

| Step | Duration | Notes |
|------|----------|-------|
| AI Format (Step 1) | 1-2s | Format for both scrapers |
| Parallel Scraping (Step 2) | 60-120s | Jobs + Profiles simultaneously |
| AI Analysis (Step 3) | 3-5s | Analyze both responses |
| **Total** | **65-130s** | ~1-2 minutes |

**Optimization**:
- Both scrapers run in **parallel** (not sequential)
- Reduces total time by ~50%

## 🎯 AI Bounded Analysis

AI analyzes ONLY what both scrapers return:

```javascript
// AI receives:
- 50 job postings (titles, companies, locations, salaries)
- 100 candidate profiles (skills, experience, companies)

// AI calculates:
- Supply/demand ratio from counts
- Market tightness from ratio
- Top competitors from job data
- Skill distribution from profiles
- Employment status from profiles

// AI generates:
- Insights based on patterns
- Red flags from data
- Opportunities from analysis

// AI does NOT:
- Use external market knowledge
- Make assumptions beyond data
- Generate insights without proof
```

## 📊 Example Output

### Input:
```
Job: Senior Software Engineer
Location: Amsterdam
Skills: Python, React, AWS
```

### After Scraping:
```
Jobs Found: 45
Profiles Found: 350
```

### Market Card Shows:
```
📊 Supply & Demand: BALANCED Market
   - 350 Available Candidates
   - 45 Open Jobs  
   - 8:1 Ratio

👥 Talent Availability:
   - Total: 350 profiles
   - Qualified: ~245 candidates
   - Currently Employed: 85%
   - Actively Looking: 25

💼 Competition:
   - 12 companies actively hiring
   - Top: Booking.com, Adyen, Mollie
   - Avg applications: 87 per job

⚡ Hiring Velocity:
   - Average Time to Fill: 45 days
   - Market Activity: Medium

🎯 Top Skills:
   Python • React • AWS • Kubernetes • Docker

📍 Key Insights:
   • 350 candidates found for Senior Software Engineer
   • 45 open positions (balanced market)
   • 85% of candidates currently employed
   • Supply/Demand ratio: 8:1

⚠️ Market Challenges:
   • Top talent is employed - outbound required
   • High competition from 12 companies
   • Only 25 candidates actively seeking

✨ Opportunities:
   • 25 candidates actively seeking opportunities
   • Good balance of supply and demand
   • Strong local talent pool in Amsterdam
```

## 🔧 Configuration

### Required:
```bash
# .env.local
OPENAI_API_KEY=sk-...           # For AI formatting/analysis
APIFY_API_TOKEN=apify_api_...   # For both scrapers
```

### Optional:
```bash
SCRAPINGBEE_API_KEY=...         # For initial job URL scraping
```

## 🚨 Important Notes

### Two Scrapers Required:

1. **LinkedIn Jobs Scraper** (`BHzefUZlZRKWxkTck`)
   - Demand side
   - Already implemented

2. **LinkedIn Profile Scraper** (`2SyF0bVxmgGr8IVCZ`)
   - Supply side
   - Newly implemented

### Costs:

**Apify Credits**:
- Jobs scraper: ~0.05-0.10 units per run
- Profile scraper: ~0.10-0.20 units per run
- **Total per Market Card**: ~0.15-0.30 units

### Performance:

**Sequential** (old way):
- Scrape jobs: 60-120s
- Then scrape profiles: 60-120s
- **Total**: 120-240s (2-4 minutes)

**Parallel** (new way):
- Scrape BOTH simultaneously: 60-120s
- **Total**: 60-120s (1-2 minutes)
- **50% faster!**

## 🎉 Summary

The Market Card is now **truly dynamic**:

✅ **Two data sources**: Jobs + Profiles
✅ **Real market data**: Live from LinkedIn
✅ **AI bounded**: Only analyzes scraped data
✅ **Parallel scraping**: Faster performance
✅ **Transparent**: Shows data quality and sample sizes
✅ **Editable**: Users can still modify
✅ **Fallback**: Works without data

**Before**: Static hardcoded numbers
**After**: Real-time market intelligence

---

**Ready to test?**
```bash
npm run dev

curl -X POST http://localhost:3000/api/enrich-market \
  -H "Content-Type: application/json" \
  -d '{"jobTitle":"Software Engineer","location":"Amsterdam","experienceLevel":"Senior"}'
```
