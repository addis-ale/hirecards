# Job Description URL Scraper

## Overview

This feature allows users to paste a job description URL from popular job boards, and the system will automatically scrape and extract all relevant information to pre-fill the HireCard creation form.

## Features

### ✅ Supported Job Boards

- **LinkedIn** - Full support for job postings
- **Indeed** - Full support for job postings
- **Greenhouse** - Full support for ATS job postings
- **Lever** - Full support for ATS job postings
- **Workday/MyWorkdayJobs** - Full support for Workday-hosted job boards
- **Ashby** - Full support for Ashby ATS
- **Generic Job Boards** - Fallback scraping for any job posting site

### 📊 Extracted Data

The scraper extracts and parses the following information:

1. **Job Title** - The role/position title
2. **Company Name** - The hiring company
3. **Location** - City, state, country, or "Remote"
4. **Work Model** - Remote, Hybrid, or On-site
5. **Experience Level** - Entry Level, Mid-Level, Senior, Lead, Principal
6. **Department** - Engineering, Product, Design, Marketing, etc.
7. **Salary Range** - Min and max salary (if listed)
8. **Required Skills** - Top 5-7 technical and soft skills
9. **Requirements** - Must-have qualifications
10. **Timeline** - Hiring urgency (if mentioned)

## Architecture

### Components

1. **`lib/jobScraper.ts`** - Core scraping logic
   - `scrapeJobURL()` - Fetches and parses HTML from job URLs
   - `parseScrapedJobData()` - Uses AI to extract structured data
   - Site-specific scrapers for each job board

2. **`app/api/scrape-job/route.ts`** - API endpoint
   - POST endpoint that accepts a URL
   - Returns structured job data
   - Handles errors gracefully

3. **`components/JobURLInput.tsx`** - UI component
   - Input field for pasting URLs
   - Loading and success states
   - Error handling and user feedback

4. **Integration with ConversationalChatbot**
   - Shows URL input at the start of conversation
   - Auto-fills extracted data into the chatbot context
   - Updates progress bar and captured information

## How It Works

### Step 1: User Pastes URL
```typescript
// User pastes: https://www.linkedin.com/jobs/view/12345
```

### Step 2: Scrape HTML Content
```typescript
const scrapedData = await scrapeJobURL(url);
// Returns:
{
  title: "Senior Backend Engineer",
  description: "Full job description text...",
  location: "San Francisco, CA",
  company: "TechCorp",
  source: "LinkedIn"
}
```

### Step 3: AI Parsing
```typescript
const parsedData = await parseScrapedJobData(scrapedData);
// Returns:
{
  jobTitle: "Senior Backend Engineer",
  experienceLevel: "Senior",
  workModel: "Hybrid",
  location: "San Francisco, CA",
  minSalary: "150000",
  maxSalary: "200000",
  skills: ["Python", "AWS", "Docker", "Kubernetes"],
  requirements: ["5+ years backend experience", "Strong Python skills"],
  confidence: 0.9
}
```

### Step 4: Auto-fill Form
The parsed data is automatically mapped to the form fields:
- Role Title
- Experience Level
- Location
- Work Model
- Skills
- Salary Range
- Requirements
- Timeline

## Usage

### In the Chatbot (AI Chat Mode)

1. Start a conversation with the AI assistant
2. You'll see a "Paste Job URL" card at the top
3. Paste any job posting URL
4. Click "Scrape Job"
5. The AI will extract all information and continue the conversation

### API Usage

```typescript
// POST /api/scrape-job
const response = await fetch('/api/scrape-job', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    url: 'https://example.com/jobs/12345' 
  })
});

const result = await response.json();
if (result.success) {
  console.log(result.data);
  // {
  //   roleTitle: "...",
  //   location: "...",
  //   skills: [...],
  //   ...
  // }
}
```

### Programmatic Usage

```typescript
import { scrapeJobURL, parseScrapedJobData } from '@/lib/jobScraper';

// Scrape a job URL
const scrapedData = await scrapeJobURL('https://...');

// Parse with AI
const parsedData = await parseScrapedJobData(scrapedData);

console.log(parsedData.jobTitle);
console.log(parsedData.skills);
```

## Error Handling

The scraper handles various error scenarios:

1. **Invalid URL** - Returns 400 with helpful message
2. **Network Errors** - Catches fetch failures
3. **Parsing Errors** - Falls back to basic extraction
4. **Blocked Requests** - Returns partial data with warning
5. **Unknown Job Boards** - Uses generic scraping

## Configuration

### Environment Variables

```bash
# Required for AI-powered parsing
OPENAI_API_KEY=your_openai_api_key

# If no API key is provided, the scraper will use fallback regex-based parsing
```

### Adding New Job Boards

To add support for a new job board:

1. Open `lib/jobScraper.ts`
2. Add a new site-specific scraper function:

```typescript
function scrapeNewJobBoard($: cheerio.CheerioAPI, url: string): ScrapedJobData {
  const title = $('.job-title-selector').text().trim();
  const company = $('.company-selector').text().trim();
  // ... extract other fields
  
  return {
    title,
    company,
    description,
    location,
    rawText,
    source: 'NewJobBoard',
  };
}
```

3. Add the hostname check in `scrapeJobURL()`:

```typescript
if (hostname.includes('newjobboard.com')) {
  scrapedData = scrapeNewJobBoard($, url);
}
```

## Limitations

1. **Dynamic Content** - Some job boards use JavaScript to load content. These may require headless browser solutions (Puppeteer/Playwright)
2. **Rate Limiting** - Heavy scraping may trigger rate limits
3. **Anti-Scraping** - Some sites actively block scrapers
4. **Login Required** - Private job postings require authentication

## Improvements & Future Enhancements

### Possible Enhancements

1. **Headless Browser Support**
   ```bash
   npm install puppeteer
   ```
   For sites with JavaScript-rendered content

2. **Caching**
   - Cache scraped results to reduce API calls
   - Use Redis or in-memory cache

3. **Proxy Support**
   - Rotate IP addresses to avoid rate limiting
   - Use proxy services for better reliability

4. **Batch Scraping**
   - Support multiple URLs at once
   - Async processing queue

5. **PDF Support**
   - Extract job descriptions from PDF files
   - Parse uploaded documents

## Testing

### Manual Testing

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/create`

3. Select "AI Chat" mode

4. Test with real job URLs from:
   - LinkedIn
   - Indeed
   - Greenhouse
   - Lever
   - etc.

### API Testing

```bash
# Test the API endpoint
curl -X POST http://localhost:3000/api/scrape-job \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/jobs/12345"}'
```

## Dependencies

- **cheerio** (^1.0.0-rc.12) - HTML parsing
- **OpenAI API** - AI-powered data extraction
- **Next.js** - API routes and server-side rendering

## Security Considerations

1. **URL Validation** - Always validate URLs before scraping
2. **Rate Limiting** - Implement rate limiting on the API endpoint
3. **Timeouts** - Set reasonable timeouts for fetch requests
4. **Error Messages** - Don't expose internal errors to users
5. **CORS** - Configure CORS properly for API endpoints

## Troubleshooting

### "Failed to scrape job URL"

- Check if the URL is accessible
- Verify the job posting is public
- Try a different URL format

### "Unable to extract data"

- The job board may have changed its HTML structure
- Update the site-specific scraper selectors
- Check browser console for errors

### Low Confidence Scores

- The job description may be incomplete
- Try copying the text directly instead
- Manual review of extracted data recommended

## Support

For issues or questions:
1. Check the browser console for errors
2. Verify your OpenAI API key is configured
3. Test with known working URLs first
4. Review the API response for details
