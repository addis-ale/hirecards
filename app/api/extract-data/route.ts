import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { success: false, error: "Invalid messages format" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    // Extract only user and assistant messages for context
    const conversationText = messages
      .filter((m: any) => m.role !== "system")
      .map((m: any) => `${m.role}: ${m.content}`)
      .join("\n");

    const extractionPrompt = `Based on this conversation between a recruiter and an HR assistant, extract the hiring information into a structured JSON format.

CONVERSATION:
${conversationText}

Extract the following fields (use null if not mentioned):
- roleTitle: The job title/role (string)
- experienceLevel: One of: "Junior", "Mid-Level", "Senior", "Lead/Staff", "Principal/Architect", "Executive" (or null)
- location: City/country or work location (string)
- workModel: One of: "Remote", "Hybrid", "On-site", "Flexible" (or null)
- criticalSkill: The most important skill/requirement (string)
- minSalary: Minimum salary as a number (no currency symbols)
- maxSalary: Maximum salary as a number (no currency symbols)
- nonNegotiables: Must-have requirements (string)
- flexible: Nice-to-have or flexible requirements (string)
- timeline: When they need to start (string)

IMPORTANT:
- Extract values naturally from the conversation
- If a field wasn't discussed, use null
- For salary, extract just the numbers (e.g., "120000" from "$120,000" or "120k")
- Be smart about variations (e.g., "We're fully remote" = workModel: "Remote")
- Combine related information (e.g., multiple skills mentioned can be in criticalSkill)

Return ONLY valid JSON in this exact format:
{
  "roleTitle": "string or null",
  "experienceLevel": "string or null",
  "location": "string or null",
  "workModel": "string or null",
  "criticalSkill": "string or null",
  "minSalary": "string or null",
  "maxSalary": "string or null",
  "nonNegotiables": "string or null",
  "flexible": "string or null",
  "timeline": "string or null"
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
            content: "You are a data extraction assistant. Extract structured data from conversations and return valid JSON.",
          },
          {
            role: "user",
            content: extractionPrompt,
          },
        ],
        temperature: 0.1,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI API error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to extract data" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const extractedData = JSON.parse(data.choices[0].message.content);

    // Calculate completeness
    const fields = [
      "roleTitle",
      "experienceLevel",
      "location",
      "workModel",
      "criticalSkill",
      "minSalary",
      "maxSalary",
      "nonNegotiables",
      "flexible",
      "timeline",
    ];
    
    const filledFields = fields.filter(
      (field) => extractedData[field] !== null && extractedData[field] !== ""
    );
    
    const completeness = Math.round((filledFields.length / fields.length) * 100);
    const isComplete = completeness >= 90; // 9 out of 10 fields

    return NextResponse.json({
      success: true,
      data: extractedData,
      completeness,
      isComplete,
      filledFields: filledFields.length,
      totalFields: fields.length,
    });
  } catch (error) {
    console.error("Extract data API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
