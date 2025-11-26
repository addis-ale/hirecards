# Puppeteer Browser Setup Guide

## Overview

The job scraper uses Puppeteer to extract job descriptions from various job boards. Puppeteer needs a Chrome/Chromium-based browser to function.

## Automatic Browser Detection

The scraper now **automatically detects and uses system-installed browsers** in the following priority order:

### Windows
1. Microsoft Edge (64-bit) - `C:\Program Files\Microsoft\Edge\Application\msedge.exe`
2. Microsoft Edge (32-bit) - `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`
3. Google Chrome (64-bit) - `C:\Program Files\Google\Chrome\Application\chrome.exe`
4. Google Chrome (32-bit) - `C:\Program Files (x86)\Google\Chrome\Application\chrome.exe`

### macOS
1. Google Chrome - `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`
2. Microsoft Edge - `/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge`

### Linux
1. Google Chrome - `/usr/bin/google-chrome`
2. Chromium Browser - `/usr/bin/chromium-browser`
3. Chromium - `/usr/bin/chromium`
4. Snap Chromium - `/snap/bin/chromium`

## Setup Options

### Option 1: Use Your System Browser (Recommended)

If you have **Microsoft Edge** or **Google Chrome** already installed on your system, **no additional setup is required!** The scraper will automatically detect and use it.

**Advantages:**
- ✅ No downloads needed
- ✅ Works immediately
- ✅ Smaller deployment size
- ✅ Uses your existing browser

### Option 2: Install Puppeteer's Chrome

If you don't have a compatible browser installed, you can install Puppeteer's bundled Chrome:

```bash
npm install
```

This will automatically run the postinstall script that downloads Chrome.

Or manually install it:

```bash
npx puppeteer browsers install chrome
```

**Advantages:**
- ✅ Consistent version across all environments
- ✅ Isolated from system browser updates

## Troubleshooting

### Error: "Could not find Chrome"

This means:
1. No system browser was found at the expected locations
2. Puppeteer's Chrome hasn't been installed

**Solution:**
- Install Edge or Chrome on your system, OR
- Run `npx puppeteer browsers install chrome`

### Browser Detection Logs

Check your console for these messages:
- `✅ Found system browser at: [path]` - System browser detected successfully
- `⚠️ No system browser found, will use Puppeteer's bundled Chrome` - Falling back to Puppeteer's Chrome

### Custom Browser Path

If your browser is installed in a non-standard location, you can set an environment variable:

```bash
# Windows
set PUPPETEER_EXECUTABLE_PATH=C:\path\to\your\browser.exe

# macOS/Linux
export PUPPETEER_EXECUTABLE_PATH=/path/to/your/browser
```

## Deployment Considerations

### Vercel/Netlify/Other Serverless

Puppeteer can be heavy for serverless environments. Consider:

1. **Use Chrome AWS Lambda Layer** (for AWS deployments)
2. **Use Browserless.io** - Cloud browser service
3. **Use Playwright** - More serverless-friendly alternative
4. **Use puppeteer-core** with external Chrome service

### Docker

When deploying with Docker, install Chromium in your Dockerfile:

```dockerfile
RUN apt-get update && apt-get install -y \
    chromium \
    chromium-driver
```

## Browser Compatibility

Both Edge and Chrome work identically with Puppeteer since:
- Edge is built on Chromium (same engine as Chrome)
- Both support the same DevTools Protocol that Puppeteer uses
- Page rendering and JavaScript execution are identical

## Why System Browser First?

1. **Faster startup** - No need to download 100+ MB of Chrome
2. **Smaller disk usage** - Reuses existing browser
3. **Windows optimization** - Edge comes pre-installed on Windows 10/11
4. **Developer convenience** - Works out of the box for most users
