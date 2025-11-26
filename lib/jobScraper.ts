/**
 * Job Description URL Scraper
 *
 * This module provides functionality to scrape job descriptions from various job boards
 * and extract structured information using AI.
 */

import * as cheerio from "cheerio";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

interface ScrapedJobData {
  title: string;
  description: string;
  location?: string;
  company?: string;
  salary?: string;
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
  rawText: string;
  source: string;
}

/**
 * Scrape a job description from a URL using Puppeteer
 * Works for both static HTML and JavaScript-rendered pages
 */
export async function scrapeJobURL(url: string): Promise<ScrapedJobData> {
  let browser;

  try {
    console.log("🚀 Starting Puppeteer scrape for:", url);
    console.log("📍 Environment:", {
      isVercel: !!process.env.VERCEL,
      nodeEnv: process.env.NODE_ENV,
      platform: process.platform,
      arch: process.arch,
      version: process.version,
    });

    // Check if running in production (Vercel) or development
    const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production';
    
    let launchOptions: any = {
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
        "--disable-gpu",
      ],
    };

    if (isProduction) {
      // Production (Vercel): Use @sparticuz/chromium
      console.log('🌐 Running in production mode (Vercel)');
      launchOptions = {
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      };
    } else {
      // Development: Try to find system-installed browsers
      const fs = require('fs');
      let browserFound = false;

      if (process.platform === 'win32') {
        // Windows: Try Edge first (most commonly pre-installed), then Chrome
        const browserPaths = [
          'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
          'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
          'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
          'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        ];
        
        for (const browserPath of browserPaths) {
          try {
            if (fs.existsSync(browserPath)) {
              console.log(`✅ Found system browser at: ${browserPath}`);
              launchOptions.executablePath = browserPath;
              browserFound = true;
              break;
            }
          } catch (e) {
            // Continue to next path
          }
        }
      } else if (process.platform === 'darwin') {
        // macOS: Try Chrome, then Edge
        const browserPaths = [
          '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
          '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
        ];
        
        for (const browserPath of browserPaths) {
          try {
            if (fs.existsSync(browserPath)) {
              console.log(`✅ Found system browser at: ${browserPath}`);
              launchOptions.executablePath = browserPath;
              browserFound = true;
              break;
            }
          } catch (e) {
            // Continue to next path
          }
        }
      } else {
        // Linux: Try common Chrome/Chromium locations
        const browserPaths = [
          '/usr/bin/google-chrome',
          '/usr/bin/chromium-browser',
          '/usr/bin/chromium',
          '/snap/bin/chromium',
        ];
        
        for (const browserPath of browserPaths) {
          try {
            if (fs.existsSync(browserPath)) {
              console.log(`✅ Found system browser at: ${browserPath}`);
              launchOptions.executablePath = browserPath;
              browserFound = true;
              break;
            }
          } catch (e) {
            // Continue to next path
          }
        }
      }

      if (!browserFound) {
        console.log('⚠️ No system browser found. Please install Chrome or Edge, or use Puppeteer with Chrome.');
      }
    }

    // Launch browser
    console.log("🔧 Launch options:", JSON.stringify({
      ...launchOptions,
      executablePath: launchOptions.executablePath ? "SET" : "DEFAULT",
    }, null, 2));
    
    browser = await puppeteer.launch(launchOptions);
    console.log("✅ Browser launched successfully");

    const page = await browser.newPage();

    // Enable JavaScript
    await page.setJavaScriptEnabled(true);

    // Set a realistic user agent and viewport
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );
    await page.setViewport({ width: 1920, height: 1080 });

    // Navigate to the page and wait for network to be mostly idle
    try {
      await page.goto(url, {
        waitUntil: "networkidle2", // Wait until no more than 2 network connections for 500ms
        timeout: 60000,
      });
    } catch (error) {
      console.log("⚠️ Navigation timeout, but continuing anyway...");
    }

    // Wait longer for JavaScript to render content
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Check if we got the "You need to enable JavaScript" message (means React didn't load)
    let html = await page.content();
    if (html.includes("You need to enable JavaScript to run this app")) {
      console.log("⚠️ React app not loaded yet, waiting longer...");
      await new Promise((resolve) => setTimeout(resolve, 5000));
      html = await page.content();
    }

    // Try to wait for actual content (not just the React placeholder)
    try {
      await page.waitForFunction(
        () => {
          const bodyText = document.body.innerText;
          return bodyText.length > 500 && !bodyText.includes("You need to enable JavaScript");
        },
        { timeout: 10000 }
      );
      console.log("✅ Content loaded successfully");
      html = await page.content();
    } catch {
      console.log("⚠️ Content might not be fully loaded, but continuing...");
    }

    console.log("✅ Puppeteer got HTML, length:", html.length);

    // Parse with Cheerio
    const $ = cheerio.load(html);
    const hostname = new URL(url).hostname.toLowerCase();

    // Determine the job board and use appropriate selectors
    let scrapedData: ScrapedJobData;

    if (hostname.includes("linkedin.com")) {
      scrapedData = scrapeLinkedIn($, url);
    } else if (hostname.includes("indeed.com")) {
      scrapedData = scrapeIndeed($, url);
    } else if (hostname.includes("greenhouse.io")) {
      scrapedData = scrapeGreenhouse($, url);
    } else if (hostname.includes("lever.co")) {
      scrapedData = scrapeLever($, url);
    } else if (hostname.includes("workday.com")) {
      scrapedData = scrapeWorkday($, url);
    } else if (hostname.includes("myworkdayjobs.com")) {
      scrapedData = scrapeWorkday($, url);
    } else if (hostname.includes("ashbyhq.com")) {
      scrapedData = scrapeAshby($, url);
    } else if (hostname.includes("jobs.")) {
      scrapedData = scrapeGenericJobBoard($, url);
    } else {
      // Generic scraping for unknown job boards
      scrapedData = scrapeGenericJobBoard($, url);
    }

    console.log("✅ Scraping complete");
    return scrapedData;
  } catch (error: any) {
    console.error("❌ Error scraping job URL:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      cause: error.cause,
    });
    
    // Throw with detailed error information
    throw new Error(`Failed to scrape job description: ${error.message}`);
  } finally {
    // Always close the browser
    if (browser) {
      try {
        await browser.close();
        console.log("🔒 Browser closed successfully");
      } catch (closeError: any) {
        console.error("⚠️ Error closing browser:", closeError.message);
      }
    }
  }
}

/**
 * Scrape LinkedIn job postings
 */
function scrapeLinkedIn($: cheerio.CheerioAPI, url: string): ScrapedJobData {
  const title = $("h1.top-card-layout__title, h1.topcard__title")
    .first()
    .text()
    .trim();
  const company = $("a.topcard__org-name-link, .topcard__flavor--black-link")
    .first()
    .text()
    .trim();
  const location = $("span.topcard__flavor--bullet, .topcard__flavor")
    .first()
    .text()
    .trim();

  const description = $(".description__text, .show-more-less-html__markup")
    .text()
    .trim();

  // Extract salary if available
  const salary = $(".salary, .compensation").text().trim();

  const rawText = $("body").text().replace(/\s+/g, " ").trim();

  return {
    title: title || "Job Position",
    description: description || rawText,
    location: location || undefined,
    company: company || undefined,
    salary: salary || undefined,
    requirements: extractListItems($, "requirements", description),
    responsibilities: extractListItems($, "responsibilities", description),
    benefits: extractListItems($, "benefits", description),
    rawText,
    source: "LinkedIn",
  };
}

/**
 * Scrape Indeed job postings
 */
function scrapeIndeed($: cheerio.CheerioAPI, url: string): ScrapedJobData {
  const title = $("h1.jobsearch-JobInfoHeader-title, h1").first().text().trim();
  const company = $(
    ".jobsearch-InlineCompanyRating-companyHeader, .jobsearch-CompanyInfoContainer"
  )
    .first()
    .text()
    .trim();
  const location = $(
    ".jobsearch-JobInfoHeader-subtitle div, .jobsearch-JobComponent-location"
  )
    .first()
    .text()
    .trim();

  const description = $("#jobDescriptionText, .jobsearch-jobDescriptionText")
    .text()
    .trim();

  const salary = $(".jobsearch-JobMetadataHeader-item, .salary-snippet")
    .text()
    .trim();

  const rawText = $("body").text().replace(/\s+/g, " ").trim();

  return {
    title: title || "Job Position",
    description: description || rawText,
    location: location || undefined,
    company: company || undefined,
    salary: salary || undefined,
    requirements: extractListItems($, "requirements", description),
    responsibilities: extractListItems($, "responsibilities", description),
    benefits: extractListItems($, "benefits", description),
    rawText,
    source: "Indeed",
  };
}

/**
 * Scrape Greenhouse job postings
 */
function scrapeGreenhouse($: cheerio.CheerioAPI, url: string): ScrapedJobData {
  const title = $("#header .app-title, h1.app-title").first().text().trim();
  const company = $(".company-name").first().text().trim();
  const location = $(".location").first().text().trim();

  const description = $("#content, .content").text().trim();

  const rawText = $("body").text().replace(/\s+/g, " ").trim();

  return {
    title: title || "Job Position",
    description: description || rawText,
    location: location || undefined,
    company: company || undefined,
    requirements: extractListItems($, "requirements", description),
    responsibilities: extractListItems($, "responsibilities", description),
    benefits: extractListItems($, "benefits", description),
    rawText,
    source: "Greenhouse",
  };
}

/**
 * Scrape Lever job postings
 */
function scrapeLever($: cheerio.CheerioAPI, url: string): ScrapedJobData {
  const title = $(".posting-headline h2, h2").first().text().trim();
  const company = $(".main-header-text-item-company, .company-name")
    .first()
    .text()
    .trim();
  const location = $(".posting-categories .location, .workplaceTypes")
    .first()
    .text()
    .trim();

  const description = $(".section-wrapper, .posting-description").text().trim();

  const rawText = $("body").text().replace(/\s+/g, " ").trim();

  return {
    title: title || "Job Position",
    description: description || rawText,
    location: location || undefined,
    company: company || undefined,
    requirements: extractListItems($, "requirements", description),
    responsibilities: extractListItems($, "responsibilities", description),
    benefits: extractListItems($, "benefits", description),
    rawText,
    source: "Lever",
  };
}

/**
 * Scrape Workday job postings
 */
function scrapeWorkday($: cheerio.CheerioAPI, url: string): ScrapedJobData {
  const title = $('h1[data-automation-id="jobPostingHeader"], h1')
    .first()
    .text()
    .trim();
  const location = $('[data-automation-id="locations"], .jobLocation')
    .first()
    .text()
    .trim();

  const description = $(
    '[data-automation-id="jobPostingDescription"], .jobDescription'
  )
    .text()
    .trim();

  const rawText = $("body").text().replace(/\s+/g, " ").trim();

  return {
    title: title || "Job Position",
    description: description || rawText,
    location: location || undefined,
    requirements: extractListItems($, "requirements", description),
    responsibilities: extractListItems($, "responsibilities", description),
    benefits: extractListItems($, "benefits", description),
    rawText,
    source: "Workday",
  };
}

/**
 * Scrape Ashby job postings
 */
function scrapeAshby($: cheerio.CheerioAPI, url: string): ScrapedJobData {
  // Get all text from the page
  const rawText = $("body").text().replace(/\s+/g, " ").trim();

  // Try to find title - Ashby often puts it in h1 or h2
  let title = "";

  // Look through all headings and get the first substantial one
  $("h1, h2, h3").each((_, elem) => {
    const text = $(elem).text().trim();
    if (text && text.length > 5 && text.length < 100 && !title) {
      title = text;
    }
  });

  // Fallback to page title
  if (!title) {
    const pageTitle = $("title").text();
    title = pageTitle.split("|")[0].split("-")[0].trim();
  }

  // Extract structured fields from sidebar (Location, Employment Type, etc.)
  let company = "";
  let location = "";
  let employmentType = "";
  let locationType = "";
  let department = "";
  let salary = "";

  // Ashby often has a sidebar with labeled fields
  // Look for patterns like "Location\nSydney Office" or "Department\nCommercial"
  const lines = rawText
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l);

  for (let i = 0; i < lines.length - 1; i++) {
    const current = lines[i];
    const next = lines[i + 1];

    if (current === "Location" && !location) {
      // Handle multiple locations (could be comma-separated on one line or multiple lines)
      // Check if next line contains comma-separated locations
      if (next && next.includes(',')) {
        // All locations on one line: "Mexico, Colombia, Peru, Ecuador"
        location = next;
      } else {
        // Multiple lines for locations
        let locations = [next];
        
        // Check if next line(s) are also locations (not a field label)
        const fieldLabels = ["Employment Type", "Location Type", "Department", "Compensation", "Remote Type"];
        let j = i + 2;
        while (j < lines.length && !fieldLabels.includes(lines[j]) && lines[j].length < 50) {
          // If it looks like a location (short, not a label), add it
          if (lines[j] && !lines[j].includes(":") && lines[j] !== next) {
            locations.push(lines[j]);
            j++;
          } else {
            break;
          }
        }
        
        location = locations.join(", ");
      }
    } else if (current === "Employment Type") {
      employmentType = next;
    } else if (current === "Location Type") {
      locationType = next;
      // Normalize work model values
      const lower = locationType.toLowerCase();
      if (lower.includes("remote") || lower === "remote") {
        locationType = "Remote";
      } else if (lower.includes("hybrid")) {
        locationType = "Hybrid";
      } else if (lower.includes("office") || lower.includes("on-site") || lower.includes("onsite")) {
        locationType = "On-site";
      }
    } else if (current === "Department") {
      department = next;
    } else if (current === "Compensation" && i + 1 < lines.length) {
      // Compensation might span multiple lines
      salary = lines.slice(i + 1, i + 3).join(" ");
    }
  }

  // Try to find company name in the page
  // Often appears near the top or in meta tags
  const companyMeta = $('meta[property="og:site_name"]').attr("content");
  if (companyMeta) {
    company = companyMeta;
  } else {
    // Try to extract from URL hostname (e.g., jobs.ashbyhq.com/COMPANY_NAME/...)
    const urlParts = url.split("/");
    if (urlParts.length > 3 && urlParts[2].includes("ashbyhq.com")) {
      const potentialCompany = urlParts[3];
      if (potentialCompany && potentialCompany.length > 2 && potentialCompany.length < 50) {
        company = potentialCompany.charAt(0).toUpperCase() + potentialCompany.slice(1);
      }
    }
    
    // If still no company, look for company name patterns in text
    // But exclude common field labels
    const excludeWords = ["Location", "Department", "Employment Type", "Location Type", "Compensation", "Remote", "Hybrid", "On-site"];
    if (!company) {
      $("*").each((_, elem) => {
        const text = $(elem).text().trim();
        if (
          text.match(/^[A-Z][a-zA-Z\s]+$/) &&
          text.length > 3 &&
          text.length < 30 &&
          !excludeWords.includes(text) &&
          !company
        ) {
          company = text;
        }
      });
    }
  }

  // For Ashby, the entire page text is the best we can get for description
  // The AI is smart enough to extract the relevant parts
  const description = rawText;

  console.log("🔍 Ashby scrape result:", {
    title: title.substring(0, 50),
    company,
    location,
    locationType,
    department,
    salary: salary.substring(0, 50),
    textLength: description.length,
  });

  return {
    title: title || "Job Position",
    description: description,
    location: location || undefined,
    company: company || undefined,
    salary: salary || undefined,
    requirements: [],
    responsibilities: [],
    benefits: [],
    rawText,
    source: "Ashby",
  };
}

/**
 * Generic scraping for unknown job boards
 */
function scrapeGenericJobBoard(
  $: cheerio.CheerioAPI,
  url: string
): ScrapedJobData {
  // Try to find title using common patterns
  const title = $(
    'h1, [class*="title" i], [class*="job" i] h1, [class*="position" i]'
  )
    .first()
    .text()
    .trim();

  // Try to find location
  const location = $('[class*="location" i], [data-location], .location')
    .first()
    .text()
    .trim();

  // Try to find company
  const company = $('[class*="company" i], .company-name')
    .first()
    .text()
    .trim();

  // Try to find description - look for the largest text block
  let description = "";
  $('[class*="description" i], [class*="content" i], main, article').each(
    (_, elem) => {
      const text = $(elem).text().trim();
      if (text.length > description.length) {
        description = text;
      }
    }
  );

  const rawText = $("body").text().replace(/\s+/g, " ").trim();

  return {
    title: title || "Job Position",
    description: description || rawText,
    location: location || undefined,
    company: company || undefined,
    requirements: extractListItems($, "requirements", description),
    responsibilities: extractListItems($, "responsibilities", description),
    benefits: extractListItems($, "benefits", description),
    rawText,
    source: "Generic",
  };
}

/**
 * Extract list items from a section (requirements, responsibilities, benefits)
 */
function extractListItems(
  $: cheerio.CheerioAPI,
  section: string,
  context: string
): string[] {
  const items: string[] = [];

  // Look for section headers and extract list items
  const sectionRegex = new RegExp(section, "i");

  // Find elements that might contain the section
  $("h2, h3, h4, h5, strong, b").each((_, elem) => {
    const text = $(elem).text().trim();
    if (sectionRegex.test(text)) {
      // Get the next sibling elements (ul, ol, or p tags)
      let next = $(elem).next();
      let count = 0;

      while (next.length && count < 5) {
        if (next.is("ul, ol")) {
          next.find("li").each((_, li) => {
            const item = $(li).text().trim();
            if (item) items.push(item);
          });
          break;
        } else if (next.is("p")) {
          const item = next.text().trim();
          if (item) items.push(item);
        }
        next = next.next();
        count++;
      }
    }
  });

  return items;
}

/**
 * Parse scraped data using AI to extract structured fields
 */
export async function parseScrapedJobData(
  scrapedData: ScrapedJobData
): Promise<any> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.warn("OpenAI API key not configured");
    return extractBasicFields(scrapedData);
  }

  try {
    console.log("📄 Sending to AI:", {
      title: scrapedData.title,
      company: scrapedData.company,
      location: scrapedData.location,
      descriptionLength: scrapedData.description.length,
      descriptionPreview: scrapedData.description.substring(0, 200),
    });

    const prompt = `You are an expert at parsing job descriptions. Analyze the following content and determine if it's a legitimate job posting.

Job Title: ${scrapedData.title}
Company: ${scrapedData.company || "Not specified"}
Location: ${scrapedData.location || "Not specified"}

Description:
${scrapedData.description.substring(0, 4000)}

CRITICAL: First, determine if this is actually a job posting. If it's NOT a job posting (e.g., company homepage, random article, search page, error page), set confidence to 0.0 and return minimal data.

If it IS a valid job posting, extract the following:
- Job title (clean format)
- Location (city/state/country or "Remote")
- Work model (Remote, Hybrid, On-site)
- Experience level (Entry Level, Mid-Level, Senior, Lead, Principal)
- Salary range (extract min and max as separate numbers, remove currency symbols and commas)
- Key required skills (top 5-7 skills)
- Critical requirements (must-haves)
- Timeline/urgency (if mentioned)
- Department (Engineering, Product, Design, Marketing, Sales, etc.)

IMPORTANT FOR SALARY:
- Extract minSalary and maxSalary as pure numbers (no currency symbols, no commas)
- Example: "$120,000 - $150,000" → minSalary: "120000", maxSalary: "150000"
- Example: "£50k-£70k" → minSalary: "50000", maxSalary: "70000"
- If only one number is mentioned, set both min and max to that number
- If no salary is mentioned, set both to null

Return ONLY valid JSON with this exact structure:
{
  "isJobPosting": true/false,
  "jobTitle": "extracted role title or null",
  "location": "city/country or Remote or null",
  "workModel": "Remote/Hybrid/On-site or null",
  "experienceLevel": "level or null",
  "minSalary": "number string or null (e.g., '120000')",
  "maxSalary": "number string or null (e.g., '150000')",
  "skills": ["skill1", "skill2"] or [],
  "requirements": ["req1", "req2"] or [],
  "timeline": "timeline or null",
  "department": "department or null",
  "confidence": 0.0-1.0
}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an expert at parsing job descriptions. Always return valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const parsed = JSON.parse(data.choices[0].message.content);

    console.log("🤖 AI parsed job data:", {
      isJobPosting: parsed.isJobPosting,
      confidence: parsed.confidence,
      jobTitle: parsed.jobTitle,
      location: parsed.location,
      skillsCount: parsed.skills?.length || 0,
    });

    return {
      ...parsed,
      company: scrapedData.company,
      source: scrapedData.source,
      isURL: true,
    };
  } catch (error) {
    console.error("AI parsing error:", error);
    return extractBasicFields(scrapedData);
  }
}

/**
 * Extract basic fields without AI (fallback)
 */
function extractBasicFields(scrapedData: ScrapedJobData): any {
  const description = scrapedData.description.toLowerCase();

  // Determine work model
  let workModel = null;
  if (description.includes("remote")) workModel = "Remote";
  else if (description.includes("hybrid")) workModel = "Hybrid";
  else if (description.includes("on-site") || description.includes("onsite"))
    workModel = "On-site";

  // Determine experience level
  let experienceLevel = null;
  if (description.includes("senior") || description.includes("sr."))
    experienceLevel = "Senior";
  else if (description.includes("lead")) experienceLevel = "Lead";
  else if (description.includes("principal")) experienceLevel = "Principal";
  else if (description.includes("junior") || description.includes("entry"))
    experienceLevel = "Entry Level";
  else if (
    description.includes("mid-level") ||
    description.includes("mid level")
  )
    experienceLevel = "Mid-Level";

  return {
    jobTitle: scrapedData.title,
    location: scrapedData.location || null,
    workModel,
    experienceLevel,
    minSalary: null,
    maxSalary: null,
    skills: scrapedData.requirements?.slice(0, 5) || [],
    requirements: scrapedData.requirements || [],
    timeline: null,
    department: null,
    company: scrapedData.company,
    source: scrapedData.source,
    confidence: 0.6,
    isURL: true,
  };
}