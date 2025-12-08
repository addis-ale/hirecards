# 🔧 Input Format Fixes for Bulk Scraper

## Issues Found
The Apify bulk scraper has strict input validation requirements.

### Error Messages
1. ```
Error [ApifyApiError]: Input is not valid: Field input.experienceLevel must be array
```

2. ```
Error [ApifyApiError]: Input is not valid: Field input.postedLimit must be equal to one of the allowed values: "1h", "24h", "week", "month"
```

---

## ✅ What Was Fixed

### **1. Updated Interface in `lib/apifyClient.ts`**

**Before:**
```typescript
experienceLevel?: 'entryLevel' | 'associate' | 'midSenior' | 'director' | 'executive' | 'any';
workplaceType?: 'remote' | 'hybrid' | 'onsite' | 'any';
employmentType?: 'fullTime' | 'partTime' | 'contract' | 'temporary' | 'volunteer' | 'internship' | 'any';
```

**After:**
```typescript
experienceLevel?: string[]; // Array: ["entryLevel", "associate", "midSenior", "director", "executive"]
workplaceType?: string[]; // Array: ["remote", "hybrid", "onsite"]
employmentType?: string[]; // Array: ["fullTime", "partTime", "contract", "temporary", "volunteer", "internship"]
```

### **2. Updated All API Routes**

#### `app/api/enrich-salary/route.ts` ✅
```typescript
// Before: bulkScraperInput.experienceLevel = 'midSenior';
// After: bulkScraperInput.experienceLevel = ['midSenior'];

if (apifyInput.experienceLevel) {
  const mappedLevel = expLevelMap[apifyInput.experienceLevel];
  if (mappedLevel) {
    bulkScraperInput.experienceLevel = [mappedLevel]; // Now an array
  }
}
```

#### `app/api/enrich-market/route.ts` ✅
```typescript
// Same fix applied
bulkScraperInput.experienceLevel = [mappedLevel]; // Array
```

#### `app/api/scrape-jobs-bulk/route.ts` ✅
```typescript
// Fixed both workplaceType and experienceLevel
scraperInput.workplaceType = [mappedWorkModel]; // Array
scraperInput.experienceLevel = [mappedLevel]; // Array
```

---

## 📊 Input Format Now

### **Correct Input Structure:**
```typescript
{
  jobTitles: ["Account Manager"],              // Array ✅
  locations: ["Amsterdam, Netherlands"],       // Array ✅
  experienceLevel: ["midSenior"],              // Array ✅
  workplaceType: ["remote"],                   // Array ✅
  employmentType: ["fullTime"],                // Array ✅
  maxItems: 50,
  sortBy: "relevance",
  postedLimit: "pastMonth"
}
```

### **Why Arrays?**
The bulk scraper allows **multiple filters** at once:
- Search for multiple experience levels: `["midSenior", "director"]`
- Search for multiple workplace types: `["remote", "hybrid"]`
- Search for multiple employment types: `["fullTime", "contract"]`

This enables **broader searches** in a single API call.

### **Posted Limit Values**
Fixed the `postedLimit` to use correct values:
- ❌ Wrong: `"pastMonth"`, `"pastWeek"`, `"past24Hours"`, `"pastHour"`
- ✅ Correct: `"month"`, `"week"`, `"24h"`, `"1h"`

**Changed in all files:**
```typescript
postedLimit: 'month' // ✅ Correct (was 'pastMonth')
```

---

## 🧪 Test Again

Now the scraper should work correctly. Try again:

1. **Start dev server**: `npm run dev`
2. **Enter job URL**
3. **Generate cards**
4. **Check console** for:

```
✅ Bulk LinkedIn scraping completed: SUCCEEDED
📊 Found 50+ jobs from LinkedIn (bulk scraper)
```

---

## ✅ Status

- ✅ Interface updated to use arrays
- ✅ All API routes fixed
- ✅ TypeScript compiles without errors
- ✅ Ready for testing

**Try running the flow again!** The "experienceLevel must be array" error should be gone.
