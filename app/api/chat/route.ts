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

    // Analyze what data is already collected
    const hasRoleTitle = extractedData?.roleTitle;
    const hasExperienceLevel = extractedData?.experienceLevel;
    const hasLocation = extractedData?.location;
    const hasWorkModel = extractedData?.workModel;
    const hasCriticalSkill = extractedData?.criticalSkill;
    const hasMinSalary = extractedData?.minSalary;
    const hasMaxSalary = extractedData?.maxSalary;
    const hasNonNegotiables = extractedData?.nonNegotiables;
    const hasFlexible = extractedData?.flexible;
    const hasTimeline = extractedData?.timeline;

    // Calculate what's missing
    const missingFields = [];
    if (!hasRoleTitle) missingFields.push("Role Title");
    if (!hasExperienceLevel) missingFields.push("Experience Level");
    if (!hasLocation) missingFields.push("Location");
    if (!hasWorkModel) missingFields.push("Work Model");
    if (!hasCriticalSkill) missingFields.push("Critical Skill");
    if (!hasMinSalary || !hasMaxSalary) missingFields.push("Salary Range");
    if (!hasNonNegotiables) missingFields.push("Non-Negotiables");
    if (!hasFlexible) missingFields.push("Flexible Requirements");
    if (!hasTimeline) missingFields.push("Timeline");

    const completenessPercentage = Math.round(((10 - missingFields.length) / 10) * 100);

    // Build dynamic context about what's already known
    const alreadyKnown = [];
    if (hasRoleTitle) alreadyKnown.push(`Role: ${hasRoleTitle}`);
    if (hasExperienceLevel) alreadyKnown.push(`Experience: ${hasExperienceLevel}`);
    if (hasLocation) alreadyKnown.push(`Location: ${hasLocation}`);
    if (hasWorkModel) alreadyKnown.push(`Work Model: ${hasWorkModel}`);
    if (hasCriticalSkill) alreadyKnown.push(`Critical Skill: ${hasCriticalSkill}`);
    if (hasMinSalary && hasMaxSalary) alreadyKnown.push(`Salary: $${hasMinSalary} - $${hasMaxSalary}`);
    if (hasNonNegotiables) alreadyKnown.push(`Must-Haves: ${hasNonNegotiables}`);
    if (hasFlexible) alreadyKnown.push(`Nice-to-Haves: ${hasFlexible}`);
    if (hasTimeline) alreadyKnown.push(`Timeline: ${hasTimeline}`);

    // System prompt that guides the AI assistant
    const systemPrompt = `You are a friendly and professional HR assistant helping recruiters create a HireCard strategy.

═══════════════════════════════════════════════════════
📊 CURRENT PROGRESS: ${completenessPercentage}% Complete
═══════════════════════════════════════════════════════

✅ ALREADY COLLECTED (${alreadyKnown.length}/10):
${alreadyKnown.length > 0 ? alreadyKnown.map(item => `   • ${item}`).join('\n') : '   (None yet)'}

❓ STILL NEEDED (${missingFields.length}/10):
${missingFields.length > 0 ? missingFields.map(field => `   • ${field}`).join('\n') : '   (Everything collected!)'}

═══════════════════════════════════════════════════════

CRITICAL RULES:
1. 🚫 NEVER ask about fields that are already collected (marked with ✅)
2. ✅ ONLY ask about fields marked with ❓ 
3. 🎯 Ask about ONE missing field at a time (keep it conversational)
4. 💡 If user provides info about a field that's already known, acknowledge it briefly but don't dwell on it
5. 🎉 When all 10 fields are collected, say: "Perfect! I have everything I need. Let me generate your HireCard strategy now! 🎉"

CONVERSATION STYLE:
- Warm, friendly, and conversational (like chatting with a colleague)
- Keep responses SHORT (1-2 sentences)
- Use natural transitions between topics
- Acknowledge what was just shared before moving on
- If multiple fields are still missing, prioritize asking about them in this order:
  1. Role Title
  2. Critical Skill
  3. Experience Level
  4. Non-Negotiables
  5. Salary Range
  6. Location
  7. Work Model
  8. Timeline
  9. Flexible Requirements

EXAMPLES OF GOOD RESPONSES:

If Role is collected but Critical Skill is missing:
"Great! Senior Backend Engineer it is. What's the most critical technical skill they absolutely must have?"

If multiple fields were just detected:
"Perfect! I've captured all that. Now, what are the must-have requirements for this role?"

If user asks about something already collected:
"Actually, I already have that - [roleTitle] is set. Let me ask about [next missing field]..."

IMPORTANT:
- Be intelligent and context-aware
- Don't repeat yourself
- Don't ask about data you already have
- Keep the conversation flowing naturally
- If user seems to be giving you everything at once, acknowledge it all and ask what's missing`;


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
