import { NextRequest, NextResponse } from "next/server";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const { messages, extractedData } = await request.json();

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

    // System prompt that guides the AI assistant
    const systemPrompt = `You are a friendly and professional HR assistant helping recruiters create a HireCard strategy. Your goal is to naturally collect the following information through conversation:

REQUIRED INFORMATION:
1. Role Title (e.g., "Senior Backend Engineer")
2. Experience Level (Junior, Mid-Level, Senior, Lead/Staff, Principal/Architect, Executive)
3. Location (city/country or Remote/Hybrid/On-site)
4. Work Model (Remote, Hybrid, On-site, Flexible)
5. Critical Skill (the one skill that's absolutely essential)
6. Salary Range (min and max in dollars)
7. Non-Negotiables (must-have requirements)
8. Flexible Requirements (nice-to-haves)
9. Timeline (when they need to start: ASAP, 2-4 weeks, 1-2 months, etc.)

CONVERSATION STYLE:
- Be warm, friendly, and conversational
- Ask follow-up questions if answers are vague
- Confirm understanding by paraphrasing back
- If user gives multiple pieces of info at once, acknowledge all and ask about what's missing
- Keep responses concise (2-3 sentences max)
- Use emojis sparingly but appropriately 
- Don't repeat questions if already answered

CURRENT EXTRACTED DATA:
${JSON.stringify(extractedData || {}, null, 2)}

INSTRUCTIONS:
- Look at the current extracted data to see what's already collected
- Only ask about missing information
- When you have all 9 pieces of information, say: "Perfect! I have everything I need. Let me generate your HireCard strategy now! 🎉"
- Be smart about extracting info - if user says "We need a senior Python developer in Amsterdam", extract: role="Senior Python Developer", experienceLevel="Senior", location="Amsterdam"
- After each user response, think about what information was provided and what's still missing

IMPORTANT: 
- Never make up information
- If unclear, ask for clarification
- Be professional but personable
- Guide the conversation naturally`;

    const conversationMessages: Message[] = [
      {
        role: "system",
        content: systemPrompt,
      },
      ...messages,
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: conversationMessages,
        temperature: 0.7,
        max_tokens: 500,
        presence_penalty: 0.6,
        frequency_penalty: 0.3,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI API error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to get AI response" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    return NextResponse.json({
      success: true,
      message: assistantMessage,
      usage: data.usage,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
