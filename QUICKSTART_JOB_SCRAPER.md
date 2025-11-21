# 🚀 Job Scraper Quick Start Guide

## What You Can Do Now

Paste any job description URL from LinkedIn, Indeed, Greenhouse, Lever, Workday, or any job board, and the system will automatically extract all the details and pre-fill your HireCard form!

## 🎯 Try It Now (3 Steps)

### Step 1: Start the Dev Server
```bash
npm run dev
```

### Step 2: Navigate to Create Page
Open your browser to: `http://localhost:3000/create`

### Step 3: Paste a Job URL

#### Option A: Chat Mode (AI Assistant)
1. Click "AI Chat" button
2. You'll see a "Paste Job URL" card at the top
3. Paste any job URL (example below)
4. Click "Scrape Job"
5. The AI will extract the data and continue the conversation

#### Option B: Form Mode
1. Click "Form Mode" button
2. You'll see a "Paste Job URL" card at Step 1
3. Paste any job URL
4. Click "Scrape Job"
5. Form fields auto-fill with extracted data

## 📋 Example URLs to Test

Try these sample job boards (use real job postings):

**LinkedIn:**
```
https://www.linkedin.com/jobs/view/3234567890
```

**Indeed:**
```
https://www.indeed.com/viewjob?jk=1234567890
```

**Greenhouse:**
```
https://boards.greenhouse.io/company/jobs/1234567890
```

**Lever:**
```
https://jobs.lever.co/company/position-name
```

## 🎨 What Gets Extracted

The scraper automatically extracts:
- ✅ Job Title
- ✅ Company Name
- ✅ Location (or "Remote")
- ✅ Work Model (Remote/Hybrid/On-site)
- ✅ Experience Level (Senior, Mid-Level, etc.)
- ✅ Department
- ✅ Salary Range
- ✅ Required Skills
- ✅ Key Requirements
- ✅ Timeline/Urgency

## ⚙️ Configuration

### Required: OpenAI API Key

Add to `.env.local`:
```bash
OPENAI_API_KEY=your_api_key_here
```

**Without API Key:** The scraper still works but uses basic regex-based parsing (lower accuracy).

## 🎉 That's It!

You now have a fully functional job scraper that:
- ✅ Works with 7+ major job boards
- ✅ Extracts 15+ data fields automatically
- ✅ Integrates with both chat and form modes
- ✅ Handles errors gracefully
- ✅ Provides beautiful UI/UX

## 📚 Need More Details?

- Full documentation: `JOB_SCRAPER_DOCUMENTATION.md`
- Implementation guide: `README_JOB_SCRAPER.md`
- API reference: `app/api/scrape-job/route.ts`
- Core logic: `lib/jobScraper.ts`

## 🐛 Common Issues

**"Failed to scrape"**
- Make sure the URL is public and accessible
- Verify you have internet connection
- Try a different URL from the same job board

**"Low confidence scores"**
- The job description might be incomplete
- Try copying the text directly instead
- Check if OpenAI API key is configured

**"Timeout errors"**
- Some sites take longer to load
- Try again in a few seconds
- Check if the target site is online

## 🎯 What's Next?

1. **Test with real job URLs** from different boards
2. **Customize the UI** in `components/JobURLInput.tsx`
3. **Add more job boards** in `lib/jobScraper.ts`
4. **Configure caching** for better performance
5. **Set up monitoring** for production use

---

**Questions?** Check the full documentation or inspect the code!
