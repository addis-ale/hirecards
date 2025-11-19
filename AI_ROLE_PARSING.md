# AI-Powered Role Parsing Implementation

## Overview

This document explains the production-ready AI integration for parsing job roles and extracting structured information from user input (either free text or job description URLs).

## Architecture

### Components

1. **API Route**: `/app/api/parse-role/route.ts`
   - Handles role parsing requests
   - Integrates with OpenAI API
   - Includes fallback parsing logic

2. **Hero Component**: `components/Hero.tsx`
   - User input interface
   - Calls the parse-role API
   - Displays analysis results

3. **Environment Configuration**: `.env.local` (not in repo)
   - Stores API keys securely

## How It Works

### 1. User Input Processing

The system accepts two types of input:
- **Free text**: "Senior Backend Engineer in Amsterdam"
- **Job Description URL**: "https://company.com/jobs/123"

### 2. AI Extraction

When a user submits input, the system:

1. Calls `/api/parse-role` with the input
2. The API uses OpenAI's GPT-4o-mini model to extract:
   - **Job Title**: e.g., "Senior Backend Engineer"
   - **Location**: e.g., "Amsterdam" or "Remote"
   - **Work Model**: Remote, Hybrid, or On-site
   - **Experience Level**: Entry Level, Mid-Level, Senior, Lead, Principal, Executive
   - **Department**: Engineering, Product, Design, etc.
   - **Skills**: Array of key skills
   - **Confidence Score**: 0.0-1.0 indicating parsing confidence

3. Returns structured data to the Hero component

### 3. Scoring & Analysis

The Hero component:
- Calculates a feasibility score (16-85) based on:
  - Field completeness (how many fields were extracted)
  - AI confidence level
- Identifies missing critical fields
- Provides context-aware feedback messages
- Stores extracted data in session storage for use in the full form

## AI Prompt Design

The system uses a carefully crafted prompt that:

```
- Extracts structured information from natural language
- Handles various input formats (casual text, formal descriptions, URLs)
- Returns JSON with strict schema
- Provides confidence scores for reliability
- Uses low temperature (0.3) for consistent extraction
```

## Examples

### Input: "Senior Backend Engineer in Amsterdam"

**Extracted Data:**
```json
{
  "jobTitle": "Senior Backend Engineer",
  "location": "Amsterdam",
  "workModel": null,
  "experienceLevel": "Senior",
  "department": "Engineering",
  "skills": [],
  "isURL": false,
  "confidence": 0.85
}
```

**Missing Fields:**
- Work Model
- Critical Skills
- Budget/Salary Range
- Why Hiring Now
- Non-Negotiables
- Timeline

**Score**: ~35-40 (Low-Moderate Feasibility)

---

### Input: "Remote Product Manager, 5+ years experience, SaaS background, product strategy, user research"

**Extracted Data:**
```json
{
  "jobTitle": "Product Manager",
  "location": "Remote",
  "workModel": "Remote",
  "experienceLevel": "Senior",
  "department": "Product",
  "skills": ["product strategy", "user research", "SaaS"],
  "isURL": false,
  "confidence": 0.90
}
```

**Missing Fields:**
- Budget/Salary Range
- Why Hiring Now
- Non-Negotiables
- Timeline

**Score**: ~50-60 (Moderate Feasibility)

---

### Input: "https://company.com/jobs/backend-engineer"

**Extracted Data** (after scraping - not yet implemented):
```json
{
  "jobTitle": "Backend Engineer",
  "location": "New York, NY",
  "workModel": "Hybrid",
  "experienceLevel": "Mid-Level",
  "department": "Engineering",
  "skills": ["Python", "Django", "PostgreSQL", "AWS"],
  "isURL": true,
  "confidence": 0.75
}
```

**Note**: URL scraping requires additional implementation (see Future Enhancements below)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure OpenAI API Key

Create a `.env.local` file in the root directory:

```bash
OPENAI_API_KEY=sk-your-api-key-here
```

**Get your API key**: https://platform.openai.com/api-keys

### 3. Test the Implementation

```bash
npm run dev
```

Navigate to `http://localhost:3000` and test with various inputs:

- "Software Engineer in San Francisco"
- "Senior Product Manager - Remote"
- "Frontend Developer @ London, React/TypeScript"
- "Data Scientist, NYC, 3-5 years, Python/ML"

## Cost Optimization

### Model Selection

- **Using**: `gpt-4o-mini` ($0.150 / 1M input tokens, $0.600 / 1M output tokens)
- **Why**: Cost-effective for structured data extraction
- **Typical request**: ~200 tokens input + ~150 tokens output = ~$0.0001 per request

### Cost Estimates

- **1,000 requests/day**: ~$3/month
- **10,000 requests/day**: ~$30/month
- **100,000 requests/day**: ~$300/month

### Alternative: Use Anthropic Claude

If you prefer Anthropic, update the API call in `route.ts`:

```typescript
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.ANTHROPIC_API_KEY!,
    "anthropic-version": "2023-06-01",
  },
  body: JSON.stringify({
    model: "claude-3-haiku-20240307", // Cost-effective option
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: `Extract job role information from: ${input}`
      }
    ]
  })
});
```

## Fallback Logic

When the AI API is unavailable or the API key is missing:

1. **Pattern Matching**: Basic regex patterns extract location/experience
2. **Keyword Detection**: Identifies common terms like "remote", "senior"
3. **Lower Confidence**: Fallback results have confidence ~0.4

This ensures the app continues to function even without AI.

## Error Handling

The system handles:
- **API Failures**: Falls back to pattern matching
- **Invalid Input**: Returns basic extraction with low confidence
- **Rate Limits**: Logs errors and uses fallback
- **Network Issues**: Catches and handles gracefully

## Future Enhancements

### 1. URL Scraping

Implement job description scraping:

```typescript
// Using Puppeteer or Playwright
import puppeteer from 'puppeteer';

async function scrapeJobURL(url: string): Promise<string> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const content = await page.evaluate(() => document.body.innerText);
  await browser.close();
  return content;
}
```

**Alternative**: Use a scraping service like:
- ScraperAPI
- Bright Data
- Apify

### 2. Location Normalization

Standardize location names:
- "SF" → "San Francisco, CA"
- "NYC" → "New York, NY"
- "Amsterdam, NL" → "Amsterdam, Netherlands"

### 3. Salary Estimation

Add AI-powered salary estimation based on:
- Role title
- Location
- Experience level
- Market data

### 4. Competitive Intelligence

Extract and analyze:
- Similar roles from competitors
- Market positioning
- Compensation benchmarks

### 5. Multi-Language Support

Support job descriptions in:
- Dutch, German, French
- Spanish, Italian, Portuguese
- Other European languages

## Testing

### Manual Testing

Test with various inputs:

```
✅ "Senior Backend Engineer in Amsterdam"
✅ "Product Manager - Remote, 5+ years"
✅ "Frontend Dev @ London"
✅ "Data Scientist NYC Python ML"
✅ "https://example.com/jobs/123"
```

### Automated Testing (TODO)

Create test suite:

```typescript
describe('Role Parsing API', () => {
  it('should extract role and location', async () => {
    const result = await parseRole("Senior Engineer in Berlin");
    expect(result.jobTitle).toBe("Senior Engineer");
    expect(result.location).toBe("Berlin");
  });
  
  it('should identify work model', async () => {
    const result = await parseRole("Remote Product Manager");
    expect(result.workModel).toBe("Remote");
  });
});
```

## Production Checklist

Before deploying to production:

- [ ] Set `OPENAI_API_KEY` in production environment
- [ ] Enable rate limiting on the API route
- [ ] Add monitoring/logging for API usage
- [ ] Implement caching for repeated queries
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Test fallback logic thoroughly
- [ ] Add analytics tracking for parsing accuracy
- [ ] Create user feedback mechanism for corrections

## Security Considerations

1. **API Key Protection**: Never expose API keys in frontend code
2. **Rate Limiting**: Implement per-user/IP rate limits
3. **Input Validation**: Sanitize all user inputs
4. **Output Sanitization**: Clean extracted data before storage
5. **CORS Configuration**: Restrict API access to your domain

## Monitoring

Track these metrics:

- **API Success Rate**: % of successful AI parsing calls
- **Fallback Rate**: % of requests using fallback logic
- **Average Response Time**: API call duration
- **Extraction Accuracy**: User feedback on parsed data
- **Cost Per Request**: Monthly API spending

## Support

For questions or issues:
- Review this documentation
- Check API logs for errors
- Test with fallback mode (remove API key temporarily)
- Verify environment variables are set correctly

---

**Last Updated**: January 2025
**Version**: 1.0
