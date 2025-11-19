import { NextRequest, NextResponse } from "next/server";

interface ParsedRole {
  jobTitle: string;
  location: string | null;
  workModel: string | null;
  experienceLevel: string | null;
  department: string | null;
  skills: string[];
  isURL: boolean;
  confidence: number;
  rawInput: string;
}

export async function POST(request: NextRequest) {
  try {
    const { input } = await request.json();

    if (!input || typeof input !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid input" },
        { status: 400 }
      );
    }

    // Check if input is a URL
    const isURL = isValidURL(input);

    let parsedData: ParsedRole;

    if (isURL) {
      // If it's a URL, we'd scrape it (for now, simulate)
      parsedData = await parseJobDescriptionURL(input);
    } else {
      // Parse free-text role description using AI
      parsedData = await parseRoleWithAI(input);
    }

    return NextResponse.json({
      success: true,
      data: parsedData,
    });
  } catch (error) {
    console.error("Error parsing role:", error);
    return NextResponse.json(
      { success: false, error: "Failed to parse role information" },
      { status: 500 }
    );
  }
}

function isValidURL(text: string): boolean {
  try {
    new URL(text);
    return true;
  } catch {
    return text.toLowerCase().includes("http") || text.includes("www.");
  }
}

async function parseRoleWithAI(input: string): Promise<ParsedRole> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.warn("OpenAI API key not configured, using fallback parsing");
    return fallbackParsing(input);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Cost-effective model for structured extraction
        messages: [
          {
            role: "system",
            content: `You are an expert at parsing job role descriptions. Extract structured information from user input.
            
Rules:
- Extract job title/role (e.g., "Senior Backend Engineer", "Product Manager")
- Extract location if mentioned (city, country, or "Remote", "Hybrid", "Anywhere")
- Determine work model: "Remote", "Hybrid", "On-site", or null if not specified
- Determine experience level: "Entry Level", "Mid-Level", "Senior", "Lead", "Principal", "Executive", or null
- Determine department: "Engineering", "Product", "Design", "Marketing", "Sales", "Customer Success", "Operations", "Finance", "HR", or null
- Extract key skills if mentioned
- Be liberal in interpretation but conservative in confidence scoring

Return ONLY valid JSON with this exact structure:
{
  "jobTitle": "extracted role title",
  "location": "city/country or Remote/Hybrid or null",
  "workModel": "Remote/Hybrid/On-site or null",
  "experienceLevel": "level or null",
  "department": "department or null",
  "skills": ["skill1", "skill2"],
  "confidence": 0.0-1.0
}`,
          },
          {
            role: "user",
            content: input,
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

    return {
      jobTitle: parsed.jobTitle || input,
      location: parsed.location || null,
      workModel: parsed.workModel || null,
      experienceLevel: parsed.experienceLevel || null,
      department: parsed.department || null,
      skills: parsed.skills || [],
      isURL: false,
      confidence: parsed.confidence || 0.7,
      rawInput: input,
    };
  } catch (error) {
    console.error("AI parsing error:", error);
    return fallbackParsing(input);
  }
}

async function parseJobDescriptionURL(url: string): Promise<ParsedRole> {
  // In production, you would:
  // 1. Scrape the URL using a service like Puppeteer, Playwright, or a scraping API
  // 2. Extract the job description text
  // 3. Use AI to parse the extracted content
  
  // For now, simulate with mock data
  console.log("URL parsing not yet implemented:", url);
  
  return {
    jobTitle: "Role from URL",
    location: "Location from URL",
    workModel: "Hybrid",
    experienceLevel: "Senior",
    department: "Engineering",
    skills: [],
    isURL: true,
    confidence: 0.5,
    rawInput: url,
  };
}

function fallbackParsing(input: string): ParsedRole {
  // Basic pattern matching as fallback when AI is not available
  const lowerInput = input.toLowerCase();
  
  // Extract location patterns
  let location: string | null = null;
  const locationPatterns = [
    /\bin\s+([A-Z][a-zA-Z\s,.-]+?)(?:\s*$|\s+(?:or|and|with|for|\||–|-|$))/i,
    /[@]\s*([A-Z][a-zA-Z\s,.-]+?)(?:\s*$)/i,
    /[-–]\s*([A-Z][a-zA-Z\s,.-]+?)(?:\s*$)/i,
  ];
  
  for (const pattern of locationPatterns) {
    const match = input.match(pattern);
    if (match) {
      location = match[1].trim();
      break;
    }
  }
  
  // Check for remote/hybrid keywords
  let workModel: string | null = null;
  if (lowerInput.includes("remote")) workModel = "Remote";
  else if (lowerInput.includes("hybrid")) workModel = "Hybrid";
  else if (lowerInput.includes("on-site") || lowerInput.includes("onsite")) workModel = "On-site";
  
  // Check for experience level
  let experienceLevel: string | null = null;
  if (lowerInput.includes("senior")) experienceLevel = "Senior";
  else if (lowerInput.includes("lead")) experienceLevel = "Lead";
  else if (lowerInput.includes("principal")) experienceLevel = "Principal";
  else if (lowerInput.includes("junior") || lowerInput.includes("entry")) experienceLevel = "Entry Level";
  else if (lowerInput.includes("mid-level") || lowerInput.includes("mid level")) experienceLevel = "Mid-Level";
  
  // Clean job title
  let jobTitle = input;
  if (location) {
    jobTitle = jobTitle.replace(new RegExp(location, 'i'), '').trim();
  }
  jobTitle = jobTitle.replace(/\s*(in|@|[-–])\s*$/, '').trim();
  
  return {
    jobTitle: jobTitle || input,
    location,
    workModel,
    experienceLevel,
    department: null,
    skills: [],
    isURL: false,
    confidence: 0.4,
    rawInput: input,
  };
}
