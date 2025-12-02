import { NextRequest, NextResponse } from "next/server";
import { validateAuth } from "@/lib/auth-helpers";

export async function POST(req: NextRequest) {
  // Validate authentication
  const auth = await validateAuth();
  if (!auth.authenticated) {
    return auth.response;
  }

  try {
    const body = await req.json();
    const { 
      score, 
      category,
      roleDescription,
      extractedFields,
      missingFields 
    } = body;

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "OpenAI API key not configured",
          roast: "Can't roast you right now - our AI is on strike. But honestly, if you're missing this many details, you're asking for trouble anyway."
        },
        { status: 500 }
      );
    }

    // Build context about what data we have
    const hasData = extractedFields && extractedFields.length > 0;
    const hasMissing = missingFields && missingFields.length > 0;

    const prompt = `You are a brutally honest, sarcastic hiring reality checker. Your job is to roast hiring managers about their job postings in a funny but truthful way.

TONE STYLE (like dontbuildthis.com):
- Sarcastic and blunt
- Funny but insightful
- Call out obvious problems
- Use phrases like "spoiler alert", "plot twist", "here's the thing", "let's be real"
- Don't be mean, be honest with humor
- Keep it punchy and memorable

CONTEXT:
Role Description: "${roleDescription}"
Clarity Score: ${score}/100
Category: ${category}
${hasData ? `Found: ${extractedFields.join(', ')}` : 'Found: Almost nothing'}
${hasMissing ? `Missing: ${missingFields.join(', ')}` : ''}

YOUR TASK:
Generate a short, punchy roast (2-3 sentences max) that:
1. Points out what's wrong or risky about this hiring attempt
2. Uses sarcasm and humor
3. Is brutally honest but not cruel
4. Relates to the actual score and missing data

EXAMPLES OF THE TONE:

If score is LOW (0-40):
"This job posting has the clarity of a fortune cookie written by ChatGPT. You're basically asking the universe to send you someone who can read minds AND work for peanuts. Spoiler alert: they don't exist."

If score is MEDIUM (41-65):
"You'll probably hire *someone*, but whether they'll still be there in six months is a coin flip. The role looks good on paper, but so did that SaaS idea your cousin pitched you at Thanksgiving."

If score is HIGH (66-100):
"Okay, you actually did your homework. The role is clear, the requirements make sense, and you might not scare away every qualified candidate. Congrats on being a functional adult."

If MISSING DATA:
"You've given me about as much info as a LinkedIn cold DM. I can't tell if you're hiring a 'Senior Engineer' or a 'Senior Sandwich Artist.' Fill in the blanks before the good candidates ghost you."

Now generate a roast for THIS hiring attempt. Keep it under 150 words. Be sarcastic, funny, and truthful.`;

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
            content: "You are a sarcastic hiring expert who roasts job postings with brutal honesty and humor. You're funny but insightful, like a comedy roast mixed with real career advice.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.9,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI API error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to get AI response",
          roast: "Our roast generator just failed harder than your job posting. But let's be real - you're missing critical info anyway."
        },
        { status: 500 }
      );
    }

    const data = await response.json();
    const roast = data.choices[0]?.message?.content?.trim() || 
      "Your hiring plan is so vague, even I can't roast it properly. Try again with actual details.";

    return NextResponse.json({
      success: true,
      roast: roast,
    });
  } catch (error) {
    console.error("Error generating roast:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate roast",
        roast: "Our roast generator is taking a coffee break. But real talk: if you can't even tell us what you're hiring for, how do you expect candidates to apply?"
      },
      { status: 500 }
    );
  }
}
