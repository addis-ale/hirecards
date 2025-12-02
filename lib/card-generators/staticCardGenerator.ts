/**
 * Static Card Generator - Generate remaining cards using AI (Cards 8-13)
 * These cards don't require LinkedIn data analysis
 */

/**
 * Generate Card 8: Messaging/Outreach Card (Static AI)
 */
export async function generateMessagingCard(jobData: any): Promise<any> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      id: 8,
      type: "Messaging",
      title: "Recruiting Messaging",
      icon: "MessageSquare",
      content: {
        elevatorPitch: `We're seeking a talented ${jobData.jobTitle} to join our ${jobData.department} team.`,
        emailSubject: `Exciting ${jobData.jobTitle} Opportunity`,
        inMailTemplate: "Generic template",
      },
    };
  }

  try {
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
            content: "You are a recruiting messaging expert. Create compelling outreach messages.",
          },
          {
            role: "user",
            content: `Create recruiting messaging for a ${jobData.jobTitle} role. Include: elevatorPitch (2 sentences), emailSubject (catchy), and inMailTemplate (50 words). Return JSON only.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const result = await response.json();
    const content = result.choices[0]?.message?.content?.trim() || "{}";
    const messaging = JSON.parse(content.replace(/```json\n?/g, "").replace(/```\n?/g, ""));

    return {
      id: 8,
      type: "Messaging",
      title: "Recruiting Messaging",
      icon: "MessageSquare",
      content: messaging,
    };
  } catch (error) {
    console.error("Messaging generation error:", error);
    return {
      id: 8,
      type: "Messaging",
      title: "Recruiting Messaging",
      icon: "MessageSquare",
      content: {
        elevatorPitch: `Exciting opportunity for a ${jobData.jobTitle} to make an impact.`,
      },
    };
  }
}

/**
 * Generate remaining static cards (9-13)
 */
export async function generateStaticCards(jobData: any): Promise<any[]> {
  const cards = [];

  // Card 8: Messaging
  cards.push(await generateMessagingCard(jobData));

  // Cards 9-13: Placeholder for now (can be expanded later)
  cards.push(
    {
      id: 9,
      type: "Interview Guide",
      title: "Interview Guide",
      icon: "ClipboardList",
      content: {
        stages: ["Phone Screen", "Technical Interview", "Team Interview", "Final Round"],
      },
    },
    {
      id: 10,
      type: "Onboarding",
      title: "Onboarding Plan",
      icon: "BookOpen",
      content: {
        week1: "Orientation and team introductions",
      },
    },
    {
      id: 11,
      type: "Success Metrics",
      title: "Success Metrics",
      icon: "Target",
      content: {
        metrics: ["30-day goals", "60-day goals", "90-day goals"],
      },
    },
    {
      id: 12,
      type: "Career Growth",
      title: "Career Growth Path",
      icon: "TrendingUp",
      content: {
        nextRole: "Senior level progression",
      },
    },
    {
      id: 13,
      type: "Benefits",
      title: "Benefits & Perks",
      icon: "Gift",
      content: {
        benefits: ["Health insurance", "401k", "PTO", "Remote work"],
      },
    }
  );

  return cards;
}
