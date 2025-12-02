/**
 * Skills Analyzer - Extract and analyze skills from LinkedIn jobs
 */

import { LinkedInJobResult } from "../apify/linkedin-scraper";

export interface SkillAnalysis {
  topSkills: { skill: string; count: number; percentage: number }[];
  totalSkillsMentioned: number;
  uniqueSkills: number;
  insights: string[];
}

/**
 * Common skill keywords to look for
 */
const SKILL_PATTERNS = [
  // Programming Languages
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C\\+\\+",
  "C#",
  "Ruby",
  "Go",
  "Swift",
  "Kotlin",
  "PHP",
  "Rust",
  "SQL",

  // Frameworks & Libraries
  "React",
  "Angular",
  "Vue",
  "Node\\.?js",
  "Next\\.?js",
  "Express",
  "Django",
  "Flask",
  "Spring",
  "Laravel",
  ".NET",

  // Cloud & DevOps
  "AWS",
  "Azure",
  "GCP",
  "Google Cloud",
  "Docker",
  "Kubernetes",
  "CI/CD",
  "Jenkins",
  "Terraform",
  "Ansible",

  // Databases
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Redis",
  "Elasticsearch",
  "DynamoDB",
  "Oracle",

  // Product & Design
  "Product Management",
  "Product Strategy",
  "Roadmapping",
  "Agile",
  "Scrum",
  "Figma",
  "Sketch",
  "UI/UX",
  "User Research",
  "A/B Testing",

  // Business & Soft Skills
  "Leadership",
  "Communication",
  "Collaboration",
  "Problem Solving",
  "Project Management",
  "Stakeholder Management",
  "Data Analysis",
  "Analytics",

  // Marketing & Sales
  "SEO",
  "SEM",
  "Content Marketing",
  "Social Media",
  "Email Marketing",
  "Salesforce",
  "HubSpot",

  // Other
  "Machine Learning",
  "AI",
  "Data Science",
  "API",
  "REST",
  "GraphQL",
  "Microservices",
  "Git",
  "GitHub",
];

/**
 * Extract skills from job description
 */
function extractSkills(description: string): string[] {
  const skills: string[] = [];
  const lowerDescription = description.toLowerCase();

  SKILL_PATTERNS.forEach((pattern) => {
    const regex = new RegExp(`\\b${pattern}\\b`, "gi");
    const matches = description.match(regex);
    if (matches) {
      // Use the original case from the pattern
      skills.push(pattern.replace(/\\\./g, ".").replace(/\\/g, ""));
    }
  });

  return skills;
}

/**
 * Analyze skills from LinkedIn jobs
 */
export function analyzeSkills(jobs: LinkedInJobResult[]): SkillAnalysis {
  const skillCounts = new Map<string, number>();
  const totalJobs = jobs.length;

  // Count skill occurrences
  jobs.forEach((job) => {
    const description = job.description || "";
    const skills = extractSkills(description);

    // Also check explicit skills field if available
    if (job.skills && Array.isArray(job.skills)) {
      skills.push(...job.skills);
    }

    // Count unique skills per job (don't double-count if mentioned multiple times)
    const uniqueSkillsInJob = new Set(skills);
    uniqueSkillsInJob.forEach((skill) => {
      skillCounts.set(skill, (skillCounts.get(skill) || 0) + 1);
    });
  });

  // Sort skills by count
  const sortedSkills = Array.from(skillCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([skill, count]) => ({
      skill,
      count,
      percentage: Math.round((count / totalJobs) * 100),
    }));

  const topSkills = sortedSkills.slice(0, 15);
  const totalSkillsMentioned = Array.from(skillCounts.values()).reduce((a, b) => a + b, 0);

  // Generate insights
  const insights: string[] = [];
  insights.push(`Analyzed ${totalJobs} job postings for skill requirements`);
  insights.push(`Found ${skillCounts.size} unique skills mentioned`);

  if (topSkills.length > 0) {
    const top3 = topSkills.slice(0, 3).map((s) => `${s.skill} (${s.percentage}%)`);
    insights.push(`Top 3 most required skills: ${top3.join(", ")}`);
  }

  const essentialSkills = topSkills.filter((s) => s.percentage >= 70);
  if (essentialSkills.length > 0) {
    insights.push(
      `${essentialSkills.length} skills are mentioned in 70%+ of job postings (must-haves)`
    );
  }

  return {
    topSkills,
    totalSkillsMentioned,
    uniqueSkills: skillCounts.size,
    insights,
  };
}
