# Serverless Puppeteer Setup for Vercel

## Overview

This project has been refactored to run Puppeteer reliably in serverless environments (Vercel, AWS Lambda). The scraping functionality now works both locally and in production.

## Key Changes

### 1. Dependencies Updated

**Removed:**
- `puppeteer` (includes full Chromium binary - too large for serverless)

**Added:**
- `puppeteer-core` - Lightweight version without bundled browser
- `@sparticuz/chromium` - Optimized Chromium binary for AWS Lambda/Vercel

### 2. Code Refactoring (`lib/jobScraper.ts`)

#### Environment Detection
The scraper automatically detects whether it's running locally or in production:

```typescript
const isProduction = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
```

#### Production Configuration (Vercel/AWS Lambda)
```typescript
const launchOptions = {
  args: [
    ...chromium.args,
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--no-first-run",
    "--no-zygote",
    "--single-process",
    "--disable-extensions",
  ],
  defaultViewport: chromium.defaultViewport,
  executablePath: await chromium.executablePath(),
  headless: chromium.headless,
  ignoreHTTPSErrors: true,
};
```

#### Local Development Configuration
Automatically detects and uses system-installed browsers:
- Windows: Edge or Chrome
- macOS: Chrome or Edge
- Linux: Chrome or Chromium

#### Anti-Bot Detection
Added realistic browser headers to avoid being blocked:

```typescript
// Realistic user agent
await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...");

// Extra HTTP headers
await page.setExtraHTTPHeaders({
  "Accept-Language": "en-US,en;q=0.9",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Encoding": "gzip, deflate, br",
  "Connection": "keep-alive",
  "Upgrade-Insecure-Requests": "1",
});
```

#### Timeout & Wait Strategies
- **Navigation timeout:** 60 seconds
- **Network idle:** `waitUntil: "networkidle2"`
- **Content loading:** 15 second timeout with `waitForFunction`
- **Dynamic content:** 3-5 second delays for React/SPA apps

#### Proper Cleanup
Browser is always closed in `finally` block to prevent resource leaks:

```typescript
finally {
  if (browser) {
    try {
      await browser.close();
      console.log("✅ Browser closed successfully");
    } catch (closeError) {
      console.error("⚠️ Error closing browser:", closeError);
    }
  }
}
```

### 3. API Route Configuration

Both API routes (`/api/scrape-job` and `/api/parse-role`) have been configured for serverless:

```typescript
export const maxDuration = 60; // seconds (max timeout)
export const dynamic = 'force-dynamic'; // disable static optimization
```

## Installation

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `puppeteer-core@^23.11.1`
- `@sparticuz/chromium@^131.0.0`

### 2. Local Development

For local development, ensure you have Chrome or Edge installed. The scraper will automatically detect it.

**If no browser is found**, you'll see:
```
⚠️ No system browser found, puppeteer-core requires explicit executablePath
```

**Solution:** Install Chrome or set the `CHROME_PATH` environment variable:
```bash
# Windows
set CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe

# macOS/Linux
export CHROME_PATH=/Applications/Google Chrome.app/Contents/MacOS/Google Chrome
```

### 3. Run Locally

```bash
npm run dev
```

Test the scraper:
```bash
curl -X POST http://localhost:3000/api/scrape-job \
  -H "Content-Type: application/json" \
  -d '{"url": "https://jobs.ashbyhq.com/example/job-id"}'
```

## Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Refactor Puppeteer for serverless compatibility"
git push origin main
```

### 2. Deploy to Vercel

```bash
npx vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

### 3. Environment Variables

Make sure these are set in Vercel:
- `OPENAI_API_KEY` - For AI parsing (required)
- Any other API keys your app uses

### 4. Vercel Configuration (Optional)

If you need to customize, create `vercel.json`:

```json
{
  "functions": {
    "app/api/scrape-job/route.ts": {
      "maxDuration": 60,
      "memory": 3008
    },
    "app/api/parse-role/route.ts": {
      "maxDuration": 60,
      "memory": 3008
    }
  }
}
```

**Note:** 
- Free tier: Max 10 seconds timeout
- Hobby tier: Max 60 seconds timeout
- Pro tier: Max 300 seconds timeout

## Performance Optimizations

### Bundle Size
- `@sparticuz/chromium` is optimized for AWS Lambda/Vercel
- Uses lazy loading and compression
- ~50MB in production (vs 300MB+ with regular Puppeteer)

### Memory Usage
- Uses `--single-process` flag to reduce memory
- Closes browser immediately after scraping
- Recommended memory: 3008 MB on Vercel

### Timeout Strategy
- Progressive timeouts (60s navigation, 15s content loading)
- Continues even if timeout occurs (partial content is better than none)
- Proper error handling and cleanup

## Troubleshooting

### Issue: "No browser found" in local development
**Solution:** Install Chrome or Edge, or set `CHROME_PATH` environment variable

### Issue: Timeout in production
**Solution:** 
- Upgrade to Vercel Pro for higher limits
- Optimize the target website (some sites are slow)
- Check if the site is blocking automated access

### Issue: "Protocol error" or browser crashes
**Solution:**
- Increase memory allocation in Vercel settings
- Check if the target site uses aggressive anti-bot measures
- Try adding `--disable-blink-features=AutomationControlled` to args

### Issue: Page content is empty
**Solution:**
- The site might be heavily JavaScript-dependent
- Increase wait times in the scraper
- Check if the site requires authentication

## Testing

### Test Local Environment
```bash
npm run dev
# Test with a real job URL
curl -X POST http://localhost:3000/api/scrape-job \
  -H "Content-Type: application/json" \
  -d '{"url": "YOUR_JOB_URL"}'
```

### Test Production Environment
```bash
curl -X POST https://your-app.vercel.app/api/scrape-job \
  -H "Content-Type: application/json" \
  -d '{"url": "YOUR_JOB_URL"}'
```

## Supported Job Boards

The scraper has optimized selectors for:
- ✅ LinkedIn
- ✅ Indeed
- ✅ Greenhouse
- ✅ Lever
- ✅ Workday / MyWorkdayJobs
- ✅ Ashby
- ✅ Generic job boards (fallback)

## Best Practices

1. **Always set maxDuration** in API routes that use Puppeteer
2. **Always close the browser** in a `finally` block
3. **Use realistic user agents** to avoid blocking
4. **Implement proper error handling** - partial data is better than none
5. **Monitor memory usage** - Puppeteer can be memory-intensive
6. **Add retry logic** for critical scraping operations (optional)
7. **Cache results** if scraping the same URL repeatedly (optional)

## Cost Considerations

### Vercel Pricing
- **Hobby Plan ($20/month):** 100GB bandwidth, 60s function timeout
- **Pro Plan ($20/month per member):** 1TB bandwidth, 300s function timeout

### Recommended
For production use with Puppeteer, upgrade to **Pro Plan** for:
- Longer timeouts (5 minutes vs 1 minute)
- More memory allocation
- Better error rates

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Test locally: `npm run dev`
3. ✅ Deploy to Vercel: `npx vercel --prod`
4. ✅ Monitor logs in Vercel dashboard
5. ⏳ Implement caching (optional)
6. ⏳ Add retry logic (optional)
7. ⏳ Set up monitoring/alerts (optional)

## Additional Resources

- [Puppeteer Core Docs](https://pptr.dev/)
- [@sparticuz/chromium GitHub](https://github.com/Sparticuz/chromium)
- [Vercel Functions Docs](https://vercel.com/docs/functions)
- [Vercel Function Limits](https://vercel.com/docs/functions/limitations)

## Support

If you encounter issues:
1. Check Vercel function logs
2. Test locally first to isolate environment issues
3. Verify the target website allows scraping
4. Check if you need to upgrade your Vercel plan
