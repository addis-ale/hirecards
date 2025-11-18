import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate battle cards based on the intake form data
    const cards = generateBattleCards(data);

    return NextResponse.json({
      success: true,
      cards,
      sessionId: generateSessionId(),
    });
  } catch (error) {
    console.error("Error generating cards:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate cards" },
      { status: 500 }
    );
  }
}

function generateBattleCards(formData: any) {
  const {
    jobTitle,
    department,
    experienceLevel,
    location,
    salaryRange,
    keyResponsibilities,
    requiredSkills,
    companySize,
    hiringTimeline,
  } = formData;

  return [
    {
      id: 1,
      type: "Role Definition",
      title: "The Job (Yes, It's Real)",
      icon: "briefcase",
      content: {
        position: jobTitle,
        department: department,
        level: experienceLevel,
        summary: `Looking for a ${experienceLevel} ${jobTitle} who can actually ${
          department === "Engineering"
            ? "ship code"
            : department === "Marketing"
            ? "not just make pretty slides"
            : department === "Sales"
            ? "close deals (shocking concept)"
            : department === "Product"
            ? "prioritize features without breaking engineering"
            : "do their job"
        }. ${department} team needs someone who won't ghost after the first sprint. Bonus points if you show up to meetings.`,
      },
    },
    {
      id: 2,
      type: "Compensation",
      title: "The Money Talk 💸",
      icon: "dollar-sign",
      content: {
        range: `${salaryRange} (we actually mean it, not "competitive")`,
        location: `${location} (where rent eats your soul)`,
        benefits: [
          "Health Insurance (you'll need it for the stress)",
          "401(k) Match (because retirement is a thing, apparently)",
          "PTO (that you'll feel guilty using)",
          "Remote Options (aka work from bed in your PJs)",
        ],
        marketPosition:
          "Competitive (translation: we Googled industry averages)",
      },
    },
    {
      id: 3,
      type: "Market Intelligence",
      title: "The Harsh Reality 📊",
      icon: "trending-up",
      content: {
        demand: "High (everyone wants this unicorn)",
        competition: "Moderate (aka every tech company in a 50-mile radius)",
        timeToFill: hiringTimeline || "45-60 days (if you're lucky)",
        talentAvailability:
          "Good candidates exist. Finding them? That's the fun part 🎯",
      },
    },
    {
      id: 4,
      type: "Requirements",
      title: "Must-Haves (We're Serious) ✓",
      icon: "check-circle",
      content: {
        required: requiredSkills?.split(",").map((s: string) => s.trim()) || [
          "Skills TBD (fill out the form properly next time)",
        ],
        preferred: [
          "Leadership (but not a control freak)",
          "Communication (Slack messages that make sense)",
          "Problem Solving (Google doesn't count... okay, it counts)",
        ],
        experience: `${experienceLevel} (actual experience, not just job hopping)`,
      },
    },
    {
      id: 5,
      type: "Responsibilities",
      title: "What You'll Actually Do 📝",
      icon: "list",
      content: {
        primary: keyResponsibilities
          ?.split(",")
          .map((r: string) => r.trim()) || [
          "TBD (we're making this up as we go)",
        ],
        impact:
          "Direct contribution to company growth (and endless Slack threads)",
      },
    },
    {
      id: 6,
      type: "Culture Fit",
      title: "Culture (The Real Version) 🎭",
      icon: "users",
      content: {
        companySize: `${companySize} (we're ${
          companySize.includes("1-10")
            ? "scrappy"
            : companySize.includes("1000+")
            ? "corporate (but pretending we're not)"
            : "growing fast (or trying to)"
        })`,
        workStyle:
          "Collaborative but autonomous (figure it out, but also ask for help)",
        values: [
          "Innovation (fail fast, learn faster)",
          "Accountability (own your mistakes like an adult)",
          "Growth Mindset (aka we're all just winging it)",
        ],
        environment:
          "Fast-paced (translation: organized chaos with occasional pizza)",
      },
    },
    {
      id: 7,
      type: "Messaging",
      title: "How to Sell This Job 🎤",
      icon: "message-square",
      content: {
        headline: `Join us as a ${jobTitle} (we promise it's not a trap)`,
        valueProps: [
          "Work on projects that might actually matter",
          "Competitive pay (see card #2, we weren't lying)",
          "Growth opportunities (LinkedIn Learning access included)",
          "Team that won't make you fake laugh in meetings",
        ],
        differentiators: [
          "Product people actually use (revolutionary, we know)",
          "Funding that lets us pay you (on time, every time)",
          "Team with 0% jerks policy (enforced)",
        ],
      },
    },
    {
      id: 8,
      type: "Interview Guide",
      title: "The Gauntlet 🎯",
      icon: "clipboard",
      content: {
        stages: [
          "Phone Screen (can you string sentences together?)",
          "Technical Round (do you actually know your stuff?)",
          "Team Interview (will we want to work with you?)",
          "Final Boss (convince the people who sign checks)",
        ],
        keyQuestions: [
          "Tell us about something you built that didn't completely fail",
          "How do you fix problems without having a meltdown?",
          "Describe a time you led something (without blaming everyone else)",
        ],
        evaluation:
          "Can they do the job? Will they fit in? Will they stick around? (in that order)",
      },
    },
    {
      id: 9,
      type: "Reality Check",
      title: "Wake Up Call ☕️",
      icon: "trending-up",
      content: {
        timeToHire: "~36 days (if the hiring gods are merciful)",
        applicationsNeeded:
          "250+ resumes to find ONE keeper (enjoy the reading)",
        successRate: "73% success rate... IF you have your act together",
        theHarshTruth: "The Brutal Truth™",
        insights: [
          "Candidates judge your company in 10 minutes. First impressions aren't just important, they're everything.",
          "Radio silence = ghosting. Keep candidates updated or they'll find someone who will.",
          "Culture fit isn't optional. Misaligned hires leave 30% faster (and cost you way more).",
          "Your 'competitive salary' better actually be competitive. Candidates Google that stuff now.",
          "That 'rockstar ninja guru' in your job post? Instant red flag. Write like a human.",
        ],
      },
    },
  ];
}

function generateSessionId(): string {
  return "session_" + Math.random().toString(36).substring(2, 15);
}
