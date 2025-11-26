# Puppeteer Debug Guide

## Overview

This guide explains how to use the debugging tools to diagnose Puppeteer issues in production (Vercel).

## Debug Tools Available

### 1. Debug UI Page: `/debug-scraper`

A comprehensive debugging interface to test and diagnose the job scraper.

**Access:** Visit `https://your-domain.vercel.app/debug-scraper`

**Features:**
- **Quick Puppeteer Test** - Tests if Puppeteer/Chromium is working correctly
- **Job Scraper Test** - Test actual job URL scraping with detailed error output
- **Environment Information** - Shows browser and system details
- **Error Details** - Complete error messages, stack traces, and debugging hints

### 2. Test API Endpoint: `/api/test-puppeteer`

A dedicated API endpoint that tests Puppeteer setup without scraping.

**Access:** `GET https://your-domain.vercel.app/api/test-puppeteer`

**What it tests:**
1. ✅ Environment detection (production vs development)
2. ✅ Chromium executable path resolution
3. ✅ Browser launch capability
4. ✅ Basic page navigation (loads example.com)

**Example Response:**
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": {
    "isVercel": true,
    "vercelEnv": "production",
    "nodeEnv": "production",
    "platform": "linux",
    "arch": "x64",
    "nodeVersion": "v18.17.0"
  },
  "tests": [
    {
      "name": "Environment Detection",
      "status": "✅ Pass",
      "result": "Production mode"
    },
    {
      "name": "Chromium Executable Path",
      "status": "✅ Pass",
      "result": "Path resolved"
    },
    {
      "name": "Browser Launch",
      "status": "✅ Pass",
      "result": "Browser launched successfully"
    },
    {
      "name": "Page Navigation",
      "status": "✅ Pass",
      "result": "Successfully loaded page: Example Domain"
    }
  ],
  "summary": {
    "status": "✅ All tests passed",
    "totalTests": 4,
    "passed": 4,
    "failed": 0
  }
}
```

### 3. Enhanced Error Logging

The job scraper now includes detailed logging at every step:

**Console Logs to Check (in Vercel):**
```
🚀 Starting Puppeteer scrape for: [URL]
📍 Environment: { isVercel, nodeEnv, platform, arch, version }
🌐 Running in production mode (Vercel)
🔧 Launch options: { args, executablePath, headless }
✅ Browser launched successfully
✅ Scraping complete
🔒 Browser closed successfully
```

**Error Logs:**
```
❌ Error scraping job URL: [error]
Error details: { message, stack, name, cause }
```

## How to Debug Production Issues

### Step 1: Run Quick Puppeteer Test

1. Deploy to Vercel
2. Visit `https://your-domain.vercel.app/debug-scraper`
3. Click "Run Puppeteer Test"
4. Review the test results

**If all tests pass:** Puppeteer is working correctly, issue is likely with specific job URLs or scraping logic.

**If tests fail:** Check which specific test failed:
- Environment Detection failure → Environment variables issue
- Executable Path failure → @sparticuz/chromium not installed
- Browser Launch failure → Memory/timeout issue
- Page Navigation failure → Network or configuration issue

### Step 2: Test Actual Job Scraping

1. On the same debug page, enter a job URL
2. Click "Test Scraper"
3. Wait for results (may take 10-30 seconds)
4. Review detailed error information if it fails

### Step 3: Check Vercel Logs

1. Go to Vercel Dashboard → Your Project → Functions
2. Find the `/api/scrape-job` or `/api/test-puppeteer` function
3. Check the logs for detailed error messages
4. Look for the emoji-prefixed logs (🚀, 📍, 🔧, ✅, ❌)

## Common Issues and Solutions

### Issue 1: "Could not find Chrome executable"

**Error Message:**
```
Failed to scrape job description: Could not find Chrome
```

**Cause:** `@sparticuz/chromium` not properly installed or loaded

**Solution:**
```bash
# Ensure dependencies are installed
npm install @sparticuz/chromium puppeteer-core

# Redeploy to Vercel
vercel --prod
```

### Issue 2: Function Timeout

**Error Message:**
```
Function timeout (10s)
```

**Cause:** Default Vercel timeout is too short for Puppeteer operations

**Solution:**
Add `vercel.json` to increase function timeout:
```json
{
  "functions": {
    "app/api/scrape-job/route.ts": {
      "maxDuration": 60
    },
    "app/api/test-puppeteer/route.ts": {
      "maxDuration": 30
    }
  }
}
```

### Issue 3: Memory Limit Exceeded

**Error Message:**
```
JavaScript heap out of memory
```

**Cause:** Insufficient memory allocation

**Solution:**
- Upgrade Vercel plan (Pro plan has 3GB memory)
- Or reduce Chromium memory usage by adding args:
  ```typescript
  args: [
    ...chromium.args,
    '--disable-dev-shm-usage',
    '--single-process'
  ]
  ```

### Issue 4: Works Locally but Not in Production

**Symptoms:**
- ✅ Works on `npm run dev`
- ❌ Fails on Vercel

**Common Causes:**
1. **Environment variables not set** - Check Vercel environment variables
2. **Different Node versions** - Ensure compatible versions
3. **Case-sensitive paths** - Vercel is Linux, check file paths
4. **Missing dependencies** - Ensure all deps in `package.json`

**Debug Steps:**
1. Check if `process.env.VERCEL` is detected correctly
2. Verify `@sparticuz/chromium` is in dependencies (not devDependencies)
3. Check Vercel build logs for any warnings
4. Test with `/api/test-puppeteer` endpoint

## Reading Debug Output

### Success Example

```json
{
  "success": true,
  "data": {
    "roleTitle": "Senior Software Engineer",
    "company": "Example Corp",
    ...
  }
}
```

### Error Example

```json
{
  "success": false,
  "error": "Failed to scrape job description: Could not find Chrome",
  "errorDetails": {
    "message": "Could not find Chrome",
    "type": "Error",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "environment": {
      "isVercel": true,
      "nodeEnv": "production",
      "platform": "linux",
      "arch": "x64",
      "nodeVersion": "v18.17.0"
    },
    "stack": "Error: Could not find Chrome\n    at ..."
  },
  "hint": "Check the browser console and debug UI at /debug-scraper",
  "suggestions": [
    "The URL might be inaccessible or blocked",
    "Puppeteer/Chrome might not be installed correctly",
    "The serverless function might have timed out",
    "Try copying the job description text instead"
  ]
}
```

## Next Steps After Debugging

Once you identify the issue:

1. **Installation Issue** → Run `npm install` and redeploy
2. **Configuration Issue** → Update `vercel.json` or environment variables
3. **Timeout Issue** → Increase function timeout or optimize scraping logic
4. **Memory Issue** → Upgrade plan or optimize memory usage
5. **Network Issue** → Check URL accessibility and add retry logic

## Getting Help

When reporting issues, include:

1. **Debug UI Screenshot** - From `/debug-scraper`
2. **Test Results** - JSON output from "Run Puppeteer Test"
3. **Vercel Logs** - Function logs from Vercel dashboard
4. **Environment Details** - From errorDetails in API response
5. **Job URL** - The URL you're trying to scrape (if possible)

## Additional Resources

- [Stefan Judis - Headless Chrome in Serverless](https://www.stefanjudis.com/blog/how-to-use-headless-chrome-in-serverless-functions/)
- [@sparticuz/chromium Documentation](https://github.com/Sparticuz/chromium)
- [Vercel Function Limits](https://vercel.com/docs/functions/serverless-functions/limits)
- [Puppeteer Troubleshooting](https://pptr.dev/troubleshooting)
