import { NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

/**
 * Test endpoint to verify Puppeteer/Chromium setup
 * GET /api/test-puppeteer
 */
export async function GET() {
  const testResults: any = {
    timestamp: new Date().toISOString(),
    environment: {
      isVercel: !!process.env.VERCEL,
      vercelEnv: process.env.VERCEL_ENV || "N/A",
      nodeEnv: process.env.NODE_ENV,
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
    },
    chromium: {
      version: chromium.headless,
      argsCount: chromium.args.length,
    },
    tests: [] as any[],
  };

  let browser = null;

  try {
    // Test 1: Check environment detection
    const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production';
    testResults.tests.push({
      name: "Environment Detection",
      status: "✅ Pass",
      result: isProduction ? "Production mode" : "Development mode",
    });

    // Test 2: Get executable path
    let executablePath: string | undefined;
    try {
      if (isProduction) {
        executablePath = await chromium.executablePath();
        testResults.tests.push({
          name: "Chromium Executable Path",
          status: "✅ Pass",
          result: executablePath ? "Path resolved" : "No path",
          path: executablePath,
        });
      } else {
        // Development - check for system browsers
        const fs = require('fs');
        const browserPaths = process.platform === 'win32' 
          ? [
              'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
              'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
              'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
              'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
            ]
          : process.platform === 'darwin'
          ? [
              '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
              '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
            ]
          : [
              '/usr/bin/google-chrome',
              '/usr/bin/chromium-browser',
              '/usr/bin/chromium',
            ];

        for (const path of browserPaths) {
          if (fs.existsSync(path)) {
            executablePath = path;
            break;
          }
        }

        testResults.tests.push({
          name: "System Browser Detection",
          status: executablePath ? "✅ Pass" : "⚠️ Warning",
          result: executablePath ? "Browser found" : "No system browser found",
          path: executablePath,
        });
      }
    } catch (error: any) {
      testResults.tests.push({
        name: "Executable Path Resolution",
        status: "❌ Fail",
        error: error.message,
      });
    }

    // Test 3: Launch browser
    try {
      const launchOptions: any = isProduction
        ? {
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
          }
        : {
            headless: true,
            args: [
              "--no-sandbox",
              "--disable-setuid-sandbox",
              "--disable-dev-shm-usage",
              "--disable-gpu",
            ],
            executablePath,
          };

      console.log("Attempting to launch browser with options:", {
        ...launchOptions,
        executablePath: launchOptions.executablePath ? "SET" : "DEFAULT",
      });

      browser = await puppeteer.launch(launchOptions);
      
      testResults.tests.push({
        name: "Browser Launch",
        status: "✅ Pass",
        result: "Browser launched successfully",
      });

      // Test 4: Open a simple page
      const page = await browser.newPage();
      await page.goto("https://example.com", { timeout: 30000 });
      const title = await page.title();
      
      testResults.tests.push({
        name: "Page Navigation",
        status: "✅ Pass",
        result: `Successfully loaded page: ${title}`,
      });

      await page.close();
    } catch (error: any) {
      testResults.tests.push({
        name: "Browser Launch/Navigation",
        status: "❌ Fail",
        error: error.message,
        stack: error.stack,
      });
    }

    // Final result
    const allPassed = testResults.tests.every((t: any) => t.status.includes("✅"));
    testResults.summary = {
      status: allPassed ? "✅ All tests passed" : "❌ Some tests failed",
      totalTests: testResults.tests.length,
      passed: testResults.tests.filter((t: any) => t.status.includes("✅")).length,
      failed: testResults.tests.filter((t: any) => t.status.includes("❌")).length,
    };

    return NextResponse.json(testResults);
  } catch (error: any) {
    return NextResponse.json(
      {
        ...testResults,
        error: "Unexpected error during testing",
        errorDetails: {
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
      },
      { status: 500 }
    );
  } finally {
    if (browser) {
      try {
        await browser.close();
        console.log("Browser closed successfully");
      } catch (error: any) {
        console.error("Error closing browser:", error.message);
      }
    }
  }
}
