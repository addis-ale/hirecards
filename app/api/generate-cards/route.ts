import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate battle cards based on the intake form data
    const cards = generateBattleCards(data);
    
    return NextResponse.json({
      success: true,
      cards,
      sessionId: generateSessionId(),
    });
  } catch (error) {
    console.error('Error generating cards:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate cards' },
      { status: 500 }
    );
  }
}

function generateBattleCards(formData: any) {
  const { jobTitle, department, experienceLevel, location, salaryRange, keyResponsibilities, requiredSkills, companySize, hiringTimeline } = formData;
  
  return [
    {
      id: 1,
      type: 'Role Definition',
      title: 'Role Overview',
      icon: 'briefcase',
      content: {
        position: jobTitle,
        department: department,
        level: experienceLevel,
        summary: `${experienceLevel} ${jobTitle} role in ${department} department, responsible for driving key initiatives and delivering results.`,
      }
    },
    {
      id: 2,
      type: 'Compensation',
      title: 'Salary & Benefits',
      icon: 'dollar-sign',
      content: {
        range: salaryRange,
        location: location,
        benefits: ['Health Insurance', ' 401(k) Match', 'PTO', 'Remote Work Options'],
        marketPosition: 'Competitive (65th percentile)',
      }
    },
    {
      id: 3,
      type: 'Market Intelligence',
      title: 'Market Data',
      icon: 'trending-up',
      content: {
        demand: 'High',
        competition: 'Moderate',
        timeToFill: hiringTimeline || '45-60 days',
        talentAvailability: 'Growing market with strong candidate pool',
      }
    },
    {
      id: 4,
      type: 'Requirements',
      title: 'Key Skills & Qualifications',
      icon: 'check-circle',
      content: {
        required: requiredSkills?.split(',').map((s: string) => s.trim()) || [],
        preferred: ['Leadership', 'Communication', 'Problem Solving'],
        experience: experienceLevel,
      }
    },
    {
      id: 5,
      type: 'Responsibilities',
      title: 'Day-to-Day',
      icon: 'list',
      content: {
        primary: keyResponsibilities?.split(',').map((r: string) => r.trim()) || [],
        impact: 'Direct contribution to company growth and team success',
      }
    },
    {
      id: 6,
      type: 'Culture Fit',
      title: 'Ideal Candidate Profile',
      icon: 'users',
      content: {
        companySize: companySize,
        workStyle: 'Collaborative and autonomous',
        values: ['Innovation', 'Accountability', 'Growth Mindset'],
        environment: 'Fast-paced startup culture',
      }
    },
    {
      id: 7,
      type: 'Messaging',
      title: 'Recruiting Pitch',
      icon: 'message-square',
      content: {
        headline: `Join us as a ${jobTitle}`,
        valueProps: [
          'Work on cutting-edge projects',
          'Competitive compensation package',
          'Growth and learning opportunities',
          'Collaborative team environment',
        ],
        differentiators: ['Innovative product', 'Strong funding', 'Talented team'],
      }
    },
    {
      id: 8,
      type: 'Interview Guide',
      title: 'Assessment Framework',
      icon: 'clipboard',
      content: {
        stages: ['Phone Screen', 'Technical Interview', 'Team Interview', 'Final Round'],
        keyQuestions: [
          'Tell us about your experience with similar roles',
          'How do you approach problem-solving?',
          'Describe a challenging project you led',
        ],
        evaluation: 'Focus on technical skills, culture fit, and growth potential',
      }
    },
  ];
}

function generateSessionId(): string {
  return 'session_' + Math.random().toString(36).substring(2, 15);
}
