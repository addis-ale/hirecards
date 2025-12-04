# Debug Console Logs - Tracking Data Flow

## 🎯 Purpose

Added comprehensive console.logs to track the complete data flow from API to UI components to identify where static data is being shown instead of dynamic data.

## 📊 Console Log Structure

### PayCard Flow (🔵 Blue Logs)

```
🔵 ============================================
🔵 ENRICH-SALARY API CALLED
🔵 ============================================
📥 Request body: {...}
📥 Received direct API call
   Job Title: Software Engineer
   Location: Amsterdam

🔵 ============================================
🔵 STEP 1: AI FORMATTING FOR APIFY
🔵 ============================================
✅ Apify input formatted:
   Job Title: Software Engineer
   Location: Amsterdam
   Experience Level: 3

🔵 ============================================
🔵 STEP 2: APIFY LINKEDIN JOBS SCRAPER
🔵 ============================================
📊 Calling Apify with:
   Job Title: Software Engineer
   Location: Amsterdam
   Experience Level: 3
   Max Jobs: 50

📊 Apify returned 50 jobs
✅ Found 50 jobs from LinkedIn
   First 3 job titles: [...]

🔵 ============================================
🔵 STEP 3: AI ANALYSIS & PAYCARD GENERATION
🔵 ============================================
✅ PayCard generated successfully
📊 PayCard data structure:
   Market Compensation: [...]
   Recommended Range: ...
   Has Metadata: true
   Jobs with Salary: 3

🔵 ============================================
🔵 FINAL RESPONSE
🔵 ============================================
{
  "success": true,
  "hasSalaryData": true,
  "payCardData": {...},
  "metadata": {...}
}
```

### Market Card Flow (🟢 Green Logs)

```
🟢 ============================================
🟢 ENRICH-MARKET API CALLED
🟢 ============================================
📥 Request body: {...}
📥 Received direct API call
   Job Title: Software Engineer
   Location: Amsterdam

🟢 ============================================
🟢 STEP 1: AI FORMATTING FOR MARKET ANALYSIS
🟢 ============================================
✅ Jobs Input:
   Job Title: Software Engineer
   Location: Amsterdam
   Experience Level: 3
✅ Profiles Input:
   Search Query: Software Engineer Python
   Location: Amsterdam
   Max Profiles: 100

🟢 ============================================
🟢 STEP 2: PARALLEL APIFY SCRAPING
🟢 ============================================
📊 Starting BOTH scrapers in parallel...
   Jobs Scraper: 50 jobs
   Profile Scraper: 100 profiles

✅ Apify returned:
   Jobs: 50
   Profiles: 100
   First 3 job titles: [...]
   First 3 profile headlines: [...]

🟢 ============================================
🟢 STEP 3: AI ANALYSIS & MARKET CARD GENERATION
🟢 ============================================
✅ Market Card generated successfully
📊 Market Card data structure:
   Talent Availability: {...}
   Supply/Demand: {...}
   Has Metadata: true

🟢 ============================================
🟢 FINAL RESPONSE
🟢 ============================================
{
  "success": true,
  "hasMarketData": true,
  "marketCardData": {...},
  "metadata": {...}
}
```

### UI Components (💳 Pay Card / 📊 Market Card)

```
💳 ============================================
💳 EDITABLE PAY CARD RENDER
💳 ============================================
💳 Received data prop: YES/NO
💳 Data content: {...}

💳 useEffect triggered - data changed
💳 Updating marketComp from data: [...]
💳 Updating recommendedRange from data: ...
💳 Updating brutalTruth from data: ...
💳 Updating redFlags from data: 3 items
💳 Updating donts from data: 3 items
💳 Updating fixes from data: 3 items
```

```
📊 ============================================
📊 EDITABLE MARKET CARD RENDER
📊 ============================================
📊 Received data prop: YES/NO
📊 Data content: {...}

📊 useEffect triggered - data changed
📊 Updating amsterdamCount from data: 350
📊 Updating counts from availableCandidates: 350
📊 Updating marketConditions from data: 3 items
📊 Updating brutalTruth from insights: ...
```

## 🔍 How to Debug

### Step 1: Check if API is being called

Look for these logs in your console:
- `🔵 ENRICH-SALARY API CALLED` (PayCard)
- `🟢 ENRICH-MARKET API CALLED` (Market Card)

**If NOT present**: The API is not being called at all
**If present**: Continue to Step 2

### Step 2: Check if Apify is returning data

Look for:
- `📊 Apify returned X jobs`
- `✅ Found X jobs from LinkedIn`

**If 0 jobs**: Apify scraper is failing or no jobs found
**If >0 jobs**: Continue to Step 3

### Step 3: Check if AI is generating card data

Look for:
- `✅ PayCard generated successfully`
- `📊 PayCard data structure:`

**If not present**: AI analysis is failing
**If present**: Continue to Step 4

### Step 4: Check if response is being sent

Look for:
- `🔵 FINAL RESPONSE` with full JSON

**If not present**: API is crashing before response
**If present**: Continue to Step 5

### Step 5: Check if UI component receives data

Look for:
- `💳 Received data prop: YES` (should be YES)
- `💳 Data content: {...}` (should show full data)

**If NO**: Component is not receiving the data prop
**If YES**: Continue to Step 6

### Step 6: Check if useEffect updates state

Look for:
- `💳 useEffect triggered - data changed`
- `💳 Updating marketComp from data: [...]`

**If not present**: useEffect is not firing
**If present but still showing static**: SessionStorage might be overriding

## 🚨 Common Issues & Solutions

### Issue 1: API Not Called
**Symptoms**: No blue/green logs at all
**Cause**: Frontend not calling the API
**Solution**: Check where you're calling `/api/enrich-salary` or `/api/enrich-market`

### Issue 2: Apify Returns 0 Jobs
**Symptoms**: `📊 Apify returned 0 jobs`
**Causes**:
- APIFY_API_TOKEN not configured
- Apify out of credits
- Location/job title not found
**Solution**: Check `.env.local` for APIFY_API_TOKEN

### Issue 3: Component Receives NO Data
**Symptoms**: `💳 Received data prop: NO`
**Cause**: Component is rendered without passing the data prop
**Solution**: Pass data to component:
```tsx
<EditablePayCard data={payCardData} />
```

### Issue 4: Component Receives Data But Doesn't Update
**Symptoms**: 
- `💳 Received data prop: YES`
- But `💳 useEffect triggered` not shown
**Cause**: useEffect dependency issue
**Solution**: Already fixed in the code

### Issue 5: Data Updates But Reverts to Static
**Symptoms**: 
- Data updates initially
- Then reverts to hardcoded values
**Cause**: SessionStorage is loading old data
**Solution**: Clear sessionStorage or update sessionStorage save logic

## 🧪 How to Test

### Test PayCard:
```bash
# 1. Start dev server
npm run dev

# 2. Call API directly
curl -X POST http://localhost:3000/api/enrich-salary \
  -H "Content-Type: application/json" \
  -d '{"jobTitle":"Software Engineer","location":"Amsterdam","experienceLevel":"Senior"}'

# 3. Watch console for blue logs 🔵
# 4. Check if component receives data 💳
```

### Test Market Card:
```bash
# 1. Start dev server
npm run dev

# 2. Call API directly
curl -X POST http://localhost:3000/api/enrich-market \
  -H "Content-Type: application/json" \
  -d '{"jobTitle":"Software Engineer","location":"Amsterdam","experienceLevel":"Senior"}'

# 3. Watch console for green logs 🟢
# 4. Check if component receives data 📊
```

## 📋 Expected Flow

### Complete Success Flow:

1. ✅ API called (blue/green header)
2. ✅ AI formats input (STEP 1)
3. ✅ Apify returns data (STEP 2, >0 jobs)
4. ✅ AI generates card data (STEP 3)
5. ✅ Response sent (FINAL RESPONSE with full JSON)
6. ✅ Component receives data (data prop: YES)
7. ✅ useEffect updates state (Updating X from data)
8. ✅ UI shows dynamic data

### Where It's Breaking:

Look at the console logs to find the last successful step. The issue is at the next step after the last successful log.

## 🎯 Next Steps

Once you run the app and see the console logs:

1. **Share the console output** - Copy all the logs
2. **Identify the break point** - Where do the logs stop?
3. **Check the issue** - Use the troubleshooting guide above
4. **Fix the issue** - Based on what's missing in the logs

---

**The console logs will tell us exactly where the data flow is breaking!** 🔍
