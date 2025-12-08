# 👥 LinkedIn Profile Scraper Implementation

## ✅ What Was Implemented

### **1. Added Profile Scraper to `lib/apifyClient.ts`**

#### **Constants:**
```typescript
const LINKEDIN_PROFILE_SCRAPER_ACTOR_ID = 'esIg6IbBkM8uD9t9M';
```

#### **New Interfaces:**
```typescript
export interface LinkedInProfileScraperInput {
  urls: string[]; // REQUIRED: Array of LinkedIn profile URLs
  extractProjects?: boolean;
  extractRecommendations?: boolean;
  extractSimilarProfiles?: boolean;
  proxyConfiguration?: { useApifyProxy?: boolean };
}

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
  experience: Array<{...}>;  // Full work history
  education: Array<{...}>;    // Full education
  skills?: string[];          // ⭐ Critical for SKILL CARD
  certifications?: Array<{...}>;
  projects?: Array<{...}>;
  recommendations?: Array<{...}>;
  similarProfiles?: Array<{...}>;
  profileUrl: string;
}
```

#### **New Function:**
```typescript
export async function scrapeLinkedInProfiles(
  profileUrls: string[],
  options?: {
    extractProjects?: boolean;
    extractRecommendations?: boolean;
    extractSimilarProfiles?: boolean;
  }
): Promise<LinkedInProfile[]>
```

---

### **2. Created `/api/scrape-profiles/route.ts`**

**Endpoint:** `POST /api/scrape-profiles`

**Request Body:**
```json
{
  "profileUrls": [
    "https://www.linkedin.com/in/example1/",
    "https://www.linkedin.com/in/example2/"
  ],
  "extractProjects": true,
  "extractRecommendations": true,
  "extractSimilarProfiles": false
}
```

**Response:**
```json
{
  "success": true,
  "data": [...array of LinkedInProfile objects...],
  "metadata": {
    "totalProfiles": 10,
    "successfulProfiles": 9,
    "failedProfiles": 1,
    "profilesWithSkills": 8,
    "profilesWithExperience": 9,
    "timestamp": "2025-01-15T10:30:00.000Z"
  }
}
```

---

### **3. Updated `components/ConversationalChatbot.tsx`**

Added **Step 2.5: Profile Scraping** after job scraping:

```typescript
// STEP 2.5: Scrape LinkedIn profiles
console.log("👥 Step 2.5: Scraping LinkedIn profiles...");

const profileScrapeResponse = await fetch('/api/scrape-profiles', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    profileUrls: sampleProfileUrls,
    extractProjects: true,
    extractRecommendations: false,
    extractSimilarProfiles: false,
  }),
});

// Store in sessionStorage
sessionStorage.setItem("linkedin-people-profile-scraped-data", JSON.stringify(data));
```

**Note:** Currently skipped because we need profile URLs. See "Current Limitation" below.

---

### **4. Updated `app/results/page.tsx`**

Added second debug viewer:
```tsx
<DebugDataViewer 
  storageKey="job-scraped-data" 
  title="job-scraped-data" 
/>
<DebugDataViewer 
  storageKey="linkedin-people-profile-scraped-data" 
  title="linkedin-people-profile-scraped-data" 
/>
```

---

## 🎯 What Data is Extracted

### **Profile Information:**
✅ Full name, headline, location  
✅ About/summary section  
✅ Profile image  
✅ Followers & connections count  

### **Work Experience:** ⭐ **CRITICAL**
```json
"experience": [
  {
    "title": "Senior Analytics Engineer",
    "company": "Booking.com",
    "companyUrl": "https://linkedin.com/company/booking",
    "location": "Amsterdam",
    "startDate": "Jan 2021",
    "endDate": "Present",
    "duration": "3 yrs 2 mos",
    "description": "Built data pipelines..."
  }
]
```

### **Skills:** ⭐ **CRITICAL**
```json
"skills": ["dbt", "SQL", "Python", "Airflow", "Looker"]
```

### **Education:**
```json
"education": [
  {
    "school": "University of Amsterdam",
    "degree": "Master of Science",
    "field": "Computer Science",
    "startYear": "2014",
    "endYear": "2018"
  }
]
```

### **Certifications:**
```json
"certifications": [
  {
    "name": "AWS Certified Solutions Architect",
    "issuer": "Amazon Web Services",
    "issueDate": "Jan 2023",
    "credentialId": "ABC123"
  }
]
```

---

## 📊 Use Cases for Card Generation

### **MARKET CARD**
- **Count profiles** → Talent pool size
- **Analyze locations** → Geographic distribution
- **Map companies** → Where talent is concentrated

**Example Output:**
```
Addressable Talent Market:
- 387 Analytics Engineers in Amsterdam
- 1,200+ in Netherlands
- 3,500+ in Europe
```

---

### **TALENT MAP CARD**
- **Segment by experience** → Persona archetypes
- **Analyze skill combinations** → Different candidate types
- **Map career paths** → Previous companies

**Example Output:**
```
Persona 1: "Pure Analytics Engineer" (145 profiles)
- Current companies: Booking.com, Adyen, Mollie
- Skills: dbt (95%), SQL (98%), Looker (78%)
- Avg experience: 4 years

Persona 2: "Data Engineer (Analytics-Heavy)" (180 profiles)
- Current companies: ING, ABN AMRO, Tech startups
- Skills: Airflow (85%), Python (92%), dbt (65%)
- Avg experience: 6 years
```

---

### **SKILL CARD**
- **Aggregate skills** → Must-haves vs Nice-to-haves
- **Calculate frequency** → % of profiles with each skill
- **Identify patterns** → Skill combinations

**Example Output:**
```
Must-Have Skills (80%+ of profiles):
- SQL (98%)
- dbt (85%)
- Python (82%)

Nice-to-Have Skills (40-80%):
- Airflow (68%)
- Looker (55%)
- Git (48%)
```

---

## ⚠️ Current Limitation

### **Problem: Need Profile URLs**

The profile scraper requires **LinkedIn profile URLs** as input:
```typescript
{
  urls: [
    "https://www.linkedin.com/in/john-doe/",
    "https://www.linkedin.com/in/jane-smith/"
  ]
}
```

**But we don't have profile URLs yet!**

---

## 🔄 Two Solutions

### **Option 1: LinkedIn People Search Scraper** ⭐ **RECOMMENDED**

**What we need:**
- Another Apify actor that **searches for profiles** by keywords
- Input: Job title, location, skills
- Output: Array of profile URLs matching the search

**Flow:**
```
1. Search: "Analytics Engineer in Amsterdam"
   ↓
2. Get 100-500 profile URLs
   ↓
3. Scrape those profiles with profile scraper
   ↓
4. Analyze data → Populate cards
```

**This is the proper solution we need to implement next!**

---

### **Option 2: Extract URLs from Job Data**

**What we can do:**
- Scrape jobs → Get company URLs
- Visit company pages → Get employee lists
- Extract profile URLs of employees

**Challenges:**
- More complex workflow
- Slower
- May not get the right people

---

## 🎯 Next Steps

### **Immediate:**
1. **Find LinkedIn People Search Scraper** on Apify
   - Should search by: title, location, company, skills
   - Output: Profile URLs + basic info

2. **Implement the search scraper**
   - Similar to how we did jobs scraper
   - Input: Role title, location from form
   - Output: 100-500 matching profile URLs

3. **Chain the scrapers**
   - Step 1: Search for profiles → Get URLs
   - Step 2: Scrape those profiles → Get full data
   - Step 3: Analyze → Populate cards

### **Testing:**
Once LinkedIn People Search is implemented:
```
1. Enter job: "Senior Analytics Engineer in Amsterdam"
2. Search for profiles → Find 200 matching profiles
3. Scrape those 200 profiles → Get full data
4. View in debug viewer as "linkedin-people-profile-scraped-data"
5. Analyze → Generate MARKET, TALENT MAP, SKILL cards
```

---

## 📁 Files Created/Modified

1. ✅ `lib/apifyClient.ts` - Added profile scraper function
2. ✅ `app/api/scrape-profiles/route.ts` - New API endpoint (created)
3. ✅ `components/ConversationalChatbot.tsx` - Added profile scraping step
4. ✅ `app/results/page.tsx` - Added second debug viewer

---

## 📚 Documentation

**Actor:** `esIg6IbBkM8uD9t9M` (LinkedIn Profile Scraper)

**What it does:**
- Scrapes full profile data from LinkedIn profile URLs
- Extracts: experience, skills, education, certifications

**What it DOESN'T do:**
- Search for profiles (need separate search scraper)
- Find profile URLs by keywords

---

## ✅ Status

| Component | Status | Notes |
|-----------|--------|-------|
| **Profile Scraper Function** | ✅ Done | In `lib/apifyClient.ts` |
| **Profile Scraper API** | ✅ Done | `/api/scrape-profiles` |
| **Chatbot Integration** | ⚠️ Partial | Integrated but skipped (no URLs) |
| **Debug Viewer** | ✅ Done | Shows profile data |
| **TypeScript** | 🔄 Compiling | Should be clean |
| **Testing** | ❌ Blocked | Need profile URLs |

---

## 🚀 What's Next?

**We need to find and implement:**

### **LinkedIn People Search Scraper**
- Search by job title, location, skills
- Returns profile URLs
- Then we can chain it with the profile scraper

**Can you search Apify for:**
- "LinkedIn People Search"
- "LinkedIn Profile Search"
- "LinkedIn Talent Search"
- Or similar actors that search for profiles

Once we have that, we can complete the full flow! 🎯
