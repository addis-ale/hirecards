# 📊 Data Structure Analysis: Static Cards vs Scraped Data

## Overview
This document maps the static data structures used in each card component to the scraped LinkedIn job and profile data, showing exactly how scraped data should be transformed to match the UI requirements.

---

## 🎯 Card Categories & Cards

### **Foundation Category** (3 cards)
1. **Reality Card** (`reality`)
2. **Role Card** (`role`)
3. **Skill Card** (`skill`)

### **Market Intelligence Category** (3 cards)
4. **Market Card** (`market`)
5. **Talent Map Card** (`talentmap`)
6. **Pay Card** (`pay`)

### **Outreach & Engagement Category** (4 cards)
7. **Funnel Card** (`funnel`)
8. **Fit Card** (`fit`)
9. **Message Card** (`message`)
10. **Outreach Card** (`outreach`)

### **Selection Category** (2 cards)
11. **Interview Card** (`interview`)
12. **Scorecard Card** (`scorecard`)

### **Onboarding Category** (1 card)
13. **Plan Card** (`plan`)

---

## 📋 Detailed Card Data Structures

### 1. **Market Card** (`EditableMarketCard.tsx`)

#### Static Data Structure:
```typescript
{
  talentAvailability: {
    total: number;              // e.g., 250-400
    qualified: number;
    currentlyEmployed: number;
    openToWork: number;
  },
  supplyDemand: {
    openJobs: number;
    availableCandidates: number;
    ratio: string;              // e.g., "1:5"
    marketTightness: string;    // e.g., "Tight"
  },
  insights: string[];           // Market insights
  redFlags: string[];           // Market conditions warnings
  opportunities: string[];      // Market opportunities
  geographic: {
    primaryLocations: string[];
    remoteAvailability: number;
  }
}
```

#### Sub-Cards (Modals):
1. **Talent Pool Overview** - Shows counts (Amsterdam, EU Relocation, Remote-flex)
2. **Market Conditions** - List of market conditions
3. **Market Expansion Levers** - Table with levers, why, pool impact
4. **Score Impact Fixes** - Table with fixes, impact, tooltips
5. **Bottom Line** - Single brutal truth text

#### Scraped Data Sources:
- **Jobs Data** (`apifyRawJobsData_MarketCard`):
  - `location.parsed.city` → Primary locations
  - `workplaceType` → Remote availability
  - `applicants` → Competition metrics
  - `company.name` → Company distribution
  - Count of jobs → Open jobs estimate

- **Profiles Data** (`apifyRawProfilesData`, `linkedin-people-profile-scraped-data`):
  - Profile count → Available candidates
  - `location.parsed.city` → Geographic distribution
  - `openToWork` → Open to work count
  - `currentPosition` → Currently employed count

#### Transformation Mapping:
```typescript
// From scraped data to Market Card structure
{
  talentAvailability: {
    total: profiles.length,  // Total profiles scraped
    qualified: profiles.filter(p => hasRequiredSkills(p)).length,
    currentlyEmployed: profiles.filter(p => p.currentPosition).length,
    openToWork: profiles.filter(p => p.openToWork).length
  },
  supplyDemand: {
    openJobs: jobs.length,
    availableCandidates: profiles.length,
    ratio: `${jobs.length}:${profiles.length}`,
    marketTightness: calculateTightness(jobs.length, profiles.length)
  },
  geographic: {
    primaryLocations: extractTopLocations(profiles, 5),
    remoteAvailability: profiles.filter(p => p.location.includes('Remote')).length
  }
}
```

---

### 2. **Pay Card** (`EditablePayCard.tsx`)

#### Static Data Structure:
```typescript
{
  marketCompensation: Array<{
    label: string;    // e.g., "Base", "Total comp"
    value: string;    // e.g., "€85k–€100k"
  }>,
  recommendedRange: string;     // e.g., "€90k–€105k for top-tier senior"
  location: string;             // e.g., "Amsterdam"
  currency: string;              // e.g., "EUR"
  brutalTruth: string;
  redFlags: string[];
  donts: string[];
  fixes: string[];
  hiddenBottleneck: string;
  timelineToFailure: string;
}
```

#### Sub-Cards (Modals):
1. **Market Compensation** - Key-value pairs (Base, Total comp, Published range)
2. **Recommended Hire Range** - Single text
3. **Brutal Truth** - Single text
4. **Red Flags** - List
5. **Don't Do This** - List
6. **Score Impact Fixes** - Table
7. **Hidden Bottleneck** - Single text
8. **Timeline to Failure** - Single text

#### Scraped Data Sources:
- **Jobs Data** (`apifyRawJobsData_PayCard`):
  - `salary.min`, `salary.max` → Compensation ranges
  - `salary.currency` → Currency
  - `salary.payPeriod` → Annual/Monthly
  - `location.parsed.city` → Location
  - Aggregate salary data → Market compensation

#### Transformation Mapping:
```typescript
// From scraped jobs to Pay Card structure
{
  marketCompensation: [
    {
      label: "Base",
      value: `${calculatePercentile(salaries, 25)}–${calculatePercentile(salaries, 75)}`
    },
    {
      label: "Total comp",
      value: `${calculatePercentile(totalComp, 25)}–${calculatePercentile(totalComp, 75)}`
    },
    {
      label: "Published range",
      value: `${minSalary}–${maxSalary}/${payPeriod}`
    }
  ],
  recommendedRange: `${recommendedMin}–${recommendedMax} for top-tier senior`,
  location: extractPrimaryLocation(jobs),
  currency: extractCurrency(jobs[0].salary.currency)
}
```

---

### 3. **Skill Card** (`EditableSkillCard.tsx`)

#### Static Data Structure:
```typescript
{
  technicalSkills: string[];      // e.g., ["Advanced SQL", "dbt modelling"]
  productSkills: string[];        // e.g., ["Define clear metrics"]
  behaviouralSkills: string[];    // e.g., ["Ownership mindset"]
  brutalTruth: string;
  redFlags: string[];
  donts: string[];
  upskillableSkills: string[];     // Can be trained
  mustHaveSkills: string[];        // Must-have at entry
}
```

#### Sub-Cards (Modals):
1. **Core Technical Skills** - List
2. **Product Skills** - List
3. **Behavioural Skills** - List
4. **Brutal Truth** - Single text
5. **Red Flags** - List
6. **Don't Do This** - List
7. **Upskillability Guide** - Two lists (upskillable vs must-have)
8. **Score Impact Fixes** - Table

#### Scraped Data Sources:
- **Jobs Data**:
  - `descriptionText` → Extract skills via NLP/keyword matching
  - `jobFunctions` → Job function categories
  - `descriptionHtml` → Parse for skill mentions

- **Profiles Data** (`apifyRawProfilesData`, `linkedin-people-profile-scraped-data`):
  - `skills[]` → Array of skill objects with name
  - `experience[].description` → Skills mentioned in experience
  - Aggregate skills across profiles → Most common skills

#### Transformation Mapping:
```typescript
// From scraped profiles to Skill Card structure
{
  technicalSkills: extractTopSkills(profiles, 'technical', 10),
  productSkills: extractTopSkills(profiles, 'product', 5),
  behaviouralSkills: extractTopSkills(profiles, 'behavioural', 5),
  mustHaveSkills: extractMustHaveSkills(jobs, profiles),  // Skills in 80%+ of jobs
  upskillableSkills: extractUpskillableSkills(jobs, profiles)  // Skills in <50% of jobs
}

// Helper function
function extractTopSkills(profiles, category, limit) {
  const allSkills = profiles.flatMap(p => 
    p.skills?.map(s => s.name) || []
  );
  const skillCounts = countOccurrences(allSkills);
  return Object.entries(skillCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([skill]) => skill);
}
```

---

### 4. **Talent Map Card** (`EditableTalentMapCard.tsx`)

#### Static Data Structure:
```typescript
{
  primaryFeeders: string[];        // e.g., ["Adyen", "bunq", "Booking"]
  secondaryFeeders: string[];      // e.g., ["ING", "Rabobank"]
  avoidList: string[];             // Companies/profiles to avoid
  brutalTruth: string;
  redFlags: string[];
  donts: string[];
  fixes: string[];
  hiddenBottleneck: string;
  talentFlowMap: Array<{
    flow: string;                  // e.g., "Fintech Flow"
    path: string;                  // e.g., "Adyen → bunq → Mollie"
    note: string;
  }>;
  personaInsights: Array<{
    type: string;                   // e.g., "Fintech AEs"
    motivated: string;
    needs: string;
    hates: string;
  }>;
}
```

#### Sub-Cards (Modals):
1. **Primary Feeder Companies** - Company tags
2. **Secondary Feeder Companies** - Company tags
3. **Avoid** - List
4. **Brutal Truth** - Single text
5. **Red Flags** - List
6. **Don't Do This** - List
7. **Talent Flow Map** - Flow objects with paths
8. **Persona Insights** - Persona objects
9. **Score Impact Fixes** - Table
10. **Hidden Bottleneck** - Single text

#### Scraped Data Sources:
- **Profiles Data** (`apifyRawProfilesData`, `linkedin-people-profile-scraped-data`):
  - `experience[].companyName` → Company names
  - `experience[].companyLinkedinUrl` → Company URLs
  - `currentPosition[].companyName` → Current companies
  - Aggregate companies → Most common companies
  - `experience[].position` → Job titles
  - `experience[].startDate`, `endDate` → Career progression

#### Transformation Mapping:
```typescript
// From scraped profiles to Talent Map Card structure
{
  primaryFeeders: extractTopCompanies(profiles, 'current', 8),
  secondaryFeeders: extractTopCompanies(profiles, 'previous', 4),
  talentFlowMap: buildTalentFlowMap(profiles),  // Analyze career paths
  personaInsights: analyzePersonas(profiles)   // Group by company type
}

// Helper functions
function extractTopCompanies(profiles, type, limit) {
  const companies = profiles.flatMap(p => {
    if (type === 'current') {
      return p.currentPosition?.map(pos => pos.companyName) || [];
    } else {
      return p.experience?.map(exp => exp.companyName) || [];
    }
  });
  const companyCounts = countOccurrences(companies);
  return Object.entries(companyCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([company]) => company);
}

function buildTalentFlowMap(profiles) {
  // Analyze career progression patterns
  // e.g., "Adyen → bunq → Mollie" patterns
  const flows = analyzeCareerPaths(profiles);
  return flows.map(flow => ({
    flow: flow.name,
    path: flow.companies.join(' → '),
    note: flow.insight
  }));
}
```

---

### 5. **Role Card** (`EditableRoleCard.tsx`)

#### Static Data Structure:
```typescript
{
  roleSummary: string;             // Brief role description
  outcomes: string[];              // Expected outcomes
  redFlags: string[];
  donts: string[];
  fixes: string[];
  brutalTruth: string;
  whatGreatLooksLike: string[];    // Characteristics of excellence
  roleMission: string;             // Detailed mission
  whatYoullWorkWith: string[];     // Tools/technologies
  whatYouWontDo: string[];         // What role is NOT
  jdBefore: string;                // Bad JD example
  jdAfter: string;                 // Good JD example
  fullJdSnippet: string;           // Complete JD
  commonFailureModes: string[];
}
```

#### Sub-Cards (Modals):
1. **Role Mission** - Long text
2. **Top Outcomes** - List
3. **What Great Looks Like** - List
4. **What You'll Work With** - List
5. **What You Won't Do** - List
6. **JD Rewrite** - Before/after comparison
7. **Full JD Snippet** - Complete JD text
8. **Common Failure Modes** - List
9. **Brutal Truth** - Single text
10. **Red Flags** - List
11. **Don't Do This** - List
12. **Score Impact Fixes** - Table

#### Scraped Data Sources:
- **Jobs Data** (`apifyRawJobsData_MarketCard`, `apifyRawJobsData_PayCard`):
  - `descriptionText` → Role description
  - `title` → Job title
  - `jobFunctions` → Job functions
  - `descriptionHtml` → Full JD
  - Aggregate descriptions → Common patterns

#### Transformation Mapping:
```typescript
// From scraped jobs to Role Card structure
{
  roleSummary: extractRoleSummary(jobs[0].descriptionText),
  outcomes: extractOutcomes(jobs),  // NLP extraction from descriptions
  whatYoullWorkWith: extractTechnologies(jobs),  // Extract tools/tech
  whatYouWontDo: extractNegatives(jobs),  // What's explicitly NOT
  fullJdSnippet: generateJD(jobs[0]),  // Combine best practices
  whatGreatLooksLike: extractExcellenceIndicators(profiles)  // From top performers
}
```

---

## 🔄 Scraped Data Structure Reference

### **LinkedIn Jobs Data** (`BulkLinkedInJob`)
```typescript
{
  id: string;
  title: string;
  linkedinUrl: string;
  descriptionText: string;
  descriptionHtml: string;
  location: {
    linkedinText: string;
    parsed: {
      city: string;
      country: string;
      state: string;
    };
  };
  employmentType: string;  // "full_time"
  workplaceType: string;    // "on_site", "remote", "hybrid"
  workRemoteAllowed: boolean;
  applicants: number;
  salary: {
    min: number;
    max: number;
    currency: string;
    payPeriod: string;  // "YEARLY", "MONTHLY"
  } | null;
  jobFunctions: string[];
  benefits: string[];
  company: {
    name: string;
    linkedinUrl: string;
    employeeCount: number;
    industries: string[];
  };
}
```

### **LinkedIn Profile Data** (`LinkedInProfileSearchResult`)
```typescript
{
  id: string;
  firstName: string;
  lastName: string;
  headline: string;
  location: {
    linkedinText: string;
    parsed: {
      city: string;
      country: string;
    };
  };
  openToWork: boolean;
  currentPosition: Array<{
    companyName: string;
  }>;
  experience: Array<{
    position: string;
    companyName: string;
    companyLinkedinUrl: string;
    startDate: { year: number; month: string };
    endDate: { year: number; month: string };
    description: string;
    skills: string[];
  }>;
  education: Array<{
    schoolName: string;
    degree: string;
    fieldOfStudy: string;
  }>;
  skills: Array<{
    name: string;
    endorsements: string;
  }>;
}
```

---

## 🎯 Data Transformation Strategy

### **Common Transformation Patterns:**

1. **Aggregation** - Count, sum, average across multiple records
2. **Extraction** - Parse text fields (descriptions, titles) for specific data
3. **Categorization** - Group by company, location, skills, etc.
4. **Ranking** - Sort by frequency, relevance, importance
5. **Normalization** - Standardize formats (currency, dates, locations)
6. **Enrichment** - Combine job + profile data for insights

### **Key Transformation Functions Needed:**

```typescript
// Count occurrences
function countOccurrences(items: string[]): Record<string, number>

// Extract top N items by frequency
function extractTopN(items: string[], n: number): string[]

// Calculate percentiles
function calculatePercentile(values: number[], percentile: number): number

// Extract skills from text
function extractSkills(text: string): string[]

// Analyze career paths
function analyzeCareerPaths(profiles: Profile[]): FlowMap[]

// Calculate market tightness
function calculateTightness(openJobs: number, candidates: number): string

// Extract locations
function extractTopLocations(profiles: Profile[], limit: number): string[]

// Extract technologies
function extractTechnologies(jobs: Job[]): string[]
```

---

## 📝 Implementation Notes

1. **Data Sources Priority:**
   - Use `apifyRawJobsData_PayCard` for Pay Card
   - Use `apifyRawJobsData_MarketCard` for Market Card
   - Use `apifyRawProfilesData` + `linkedin-people-profile-scraped-data` for Profile-based cards

2. **Fallback Strategy:**
   - If scraped data is missing, use static defaults
   - Show loading states while processing
   - Cache processed data in sessionStorage

3. **Data Processing:**
   - Process data in `HireCardTabs.tsx` or create separate transformation utilities
   - Store transformed data in same format as static data
   - Cards should receive data in exact same structure

4. **Real-time Updates:**
   - Cards already support `data` prop
   - Update cards when enriched data arrives
   - Maintain backward compatibility with static data

---

---

## 📋 Remaining Cards Analysis

### 6. **Reality Card** (`EditableRealityCard.tsx`)

#### Static Data Structure:
```typescript
{
  feasibilityScore: string;        // e.g., "5.5/10"
  feasibilityTitle: string;        // e.g., "Possible with alignment and speed"
  feasibilitySubtext: string;
  realityCheck1: string;           // Market assessment
  realityCheck2: string;           // Requirements
  keyInsights: string[];           // Market insights
  helpsCase: string[];             // What helps your case
  hurtsCase: string[];             // What hurts your case
  hiddenBottleneck: string;
  timelineToFailure: string;
  bottomLine1: string;             // Positive outcome
  bottomLine2: string;             // Negative outcome
  whatsReallyGoingOn: string;
  redFlags: string[];
  donts: string[];
}
```

#### Sub-Cards (Modals):
1. **What's Really Going On** - Market assessment text
2. **What Helps Your Case** - List of positive factors
3. **What Hurts Your Case** - List of negative factors
4. **Brutal Truth** - Hidden bottleneck text
5. **Red Flags** - List
6. **Don't Do This** - List
7. **Score Impact Fixes** - Table
8. **Timeline to Failure** - Single text
9. **Bottom Line** - Two outcomes (positive/negative)

#### Scraped Data Sources:
- **Jobs Data** (`apifyRawJobsData_MarketCard`, `apifyRawJobsData_PayCard`):
  - `applicants` → Competition level
  - `salary.min`, `salary.max` → Compensation reality
  - `company.employeeCount` → Company size distribution
  - `postedDate` → Job freshness
  - Count of jobs → Market saturation

- **Profiles Data** (`apifyRawProfilesData`, `linkedin-people-profile-scraped-data`):
  - `openToWork` → Active job seekers percentage
  - `currentPosition` → Currently employed count
  - `experience[].companyName` → Company quality indicators
  - Profile count → Talent pool size

#### Transformation Mapping:
```typescript
{
  keyInsights: [
    `Market is ${calculateTightness(jobs.length, profiles.length)}: ${profiles.length} candidates for ${jobs.length} open roles`,
    `Speed wins: Average time-to-hire is ${calculateAvgTimeToHire(jobs)} days`,
    `Compensation reality: ${calculateSalaryReality(jobs)}`
  ],
  helpsCase: extractHelpsCase(jobs, profiles),  // Modern stack, good comp, etc.
  hurtsCase: extractHurtsCase(jobs, profiles),  // Location constraints, low comp, etc.
  feasibilityScore: calculateFeasibilityScore(jobs, profiles)
}
```

---

### 7. **Funnel Card** (`EditableFunnelCard.tsx`)

#### Static Data Structure:
```typescript
{
  funnelStages: Array<{
    label: string;    // e.g., "Outreach", "Positive replies"
    value: string;    // e.g., "120–150", "20–25"
  }>;
  benchmarks: Array<{
    label: string;    // e.g., "Outbound reply rate"
    value: string;    // e.g., "20–30%"
  }>;
  brutalTruth: string;
  redFlags: string[];
  donts: string[];
  fixes: string[];
  hiddenBottleneck: string;
  funnelHealthComparison: Array<{
    type: string;     // e.g., "Healthy (48–72 hr flow)"
    outcome: string; // e.g., "Hire in 25–35 days"
  }>;
}
```

#### Sub-Cards (Modals):
1. **Expected Funnel** - Key-value pairs (stages → volumes)
2. **Benchmarks** - Key-value pairs (metrics → percentages)
3. **Brutal Truth** - Single text
4. **Red Flags** - List
5. **Don't Do This** - List
6. **Funnel Health Comparison** - Table (type → outcome)
7. **Score Impact Fixes** - Table
8. **Hidden Bottleneck** - Single text

#### Scraped Data Sources:
- **Jobs Data**:
  - `applicants` → Competition metrics
  - `postedDate`, `expireAt` → Time-to-fill patterns
  - Aggregate → Average applicants per job

- **Profiles Data**:
  - Profile count → Available candidates
  - `openToWork` → Active candidates
  - Response patterns (if available) → Reply rates

#### Transformation Mapping:
```typescript
{
  funnelStages: calculateFunnelStages(jobs, profiles),
  // e.g., [{ label: "Outreach", value: `${profiles.length * 0.8}–${profiles.length}` }]
  benchmarks: [
    { label: "Outbound reply rate", value: calculateReplyRate(profiles) },
    { label: "Tech pass rate", value: "40–60%" },  // Industry standard
    { label: "Offer acceptance", value: "70–85%" }  // Industry standard
  ],
  funnelHealthComparison: calculateFunnelHealth(jobs)
}
```

---

### 8. **Fit Card** (`EditableFitCard.tsx`)

#### Static Data Structure:
```typescript
{
  persona: string;                  // e.g., "Product-Minded AE"
  motivatedBy: string[];            // What drives this persona
  avoids: string[];                 // What they avoid
  brutalTruth: string;
  redFlags: string[];
  donts: string[];
  fixes: string[];
  candidateEvaluation: string[];    // What candidates evaluate you on
  decisionMakingYes: string[];       // When they say yes
  decisionMakingNo: string[];       // When they say no
}
```

#### Sub-Cards (Modals):
1. **Persona** - Single text
2. **Motivated By** - List
3. **Avoids** - List
4. **Brutal Truth** - Single text
5. **Red Flags** - List
6. **Don't Do This** - List
7. **Fix This Now** - List
8. **Decision-Making Model** - Two lists (yes/no)
9. **Candidate Flip Test** - List of evaluation criteria
10. **Score Impact Fixes** - Table

#### Scraped Data Sources:
- **Profiles Data** (`apifyRawProfilesData`, `linkedin-people-profile-scraped-data`):
  - `experience[].companyName` → Company types (fintech, scale-up, etc.)
  - `experience[].description` → Work patterns, motivations
  - `headline` → Career focus
  - `skills[]` → Technical interests
  - Aggregate patterns → Persona characteristics

- **Jobs Data**:
  - `descriptionText` → What companies value
  - `benefits` → What attracts candidates
  - `company.industries` → Industry patterns

#### Transformation Mapping:
```typescript
{
  persona: extractPersona(profiles),  // Analyze company types, roles
  motivatedBy: extractMotivations(profiles, jobs),  // From experience descriptions
  avoids: extractAvoids(profiles, jobs),  // Common pain points
  candidateEvaluation: extractEvaluationCriteria(jobs),  // What companies emphasize
  decisionMakingYes: extractYesFactors(profiles),
  decisionMakingNo: extractNoFactors(profiles)
}
```

---

### 9. **Message Card** (`EditableMessageCard.tsx`)

#### Static Data Structure:
```typescript
{
  corePitch: string;                // Main differentiator
  brutalTruth: string;
  donts: string[];
  fixThisNow: string;               // Key differentiator
  hiddenBottleneck: string;
  template1: string;                // Message template 1
  template2: string;                // Message template 2
  template3: string;                // Message template 3
  scrollStoppers: string[];         // Short attention-grabbing lines
}
```

#### Sub-Cards (Modals):
1. **Core Pitch** - Single text
2. **Don't Do This** - List
3. **Fix This Now** - Single text
4. **Scroll Stoppers** - List
5. **Three Step Outreach** - Three message templates
6. **Score Impact Fixes** - Table
7. **Brutal Truth** - Single text
8. **Hidden Bottleneck** - Single text

#### Scraped Data Sources:
- **Jobs Data**:
  - `descriptionText` → Common messaging patterns
  - `title` → Job title variations
  - `company.name` → Company positioning
  - Aggregate → What works vs what doesn't

- **Profiles Data**:
  - `headline` → How candidates describe themselves
  - `experience[].description` → What they value
  - `about` → Candidate motivations

#### Transformation Mapping:
```typescript
{
  corePitch: extractCorePitch(jobs, profiles),  // Unique differentiator
  scrollStoppers: generateScrollStoppers(jobs, profiles),  // Attention-grabbing lines
  template1: generateTemplate1(jobs, profiles),
  template2: generateTemplate2(jobs, profiles),
  template3: generateTemplate3(jobs, profiles)
}
```

---

### 10. **Outreach Card** (`EditableOutreachCard.tsx`)

#### Static Data Structure:
```typescript
{
  introduction: string;             // Outreach strategy overview
  message1: string;                 // First message
  message2: string;                 // Second message
  message3: string;                 // Third message
  brutalTruth: string;
  redFlags: string[];
  donts: string[];
  fixes: string[];
  hiddenBottleneck: string;
  timelineToFailure1: string;
  timelineToFailure2: string;
}
```

#### Scraped Data Sources:
- **Jobs Data**:
  - `descriptionText` → Effective outreach patterns
  - `company.name` → Company positioning

- **Profiles Data**:
  - `headline` → How to personalize
  - `experience[].description` → What to reference
  - `skills[]` → Personalization points

#### Transformation Mapping:
```typescript
{
  message1: generatePersonalizedMessage1(profiles),  // Reference their work
  message2: generateMessage2(jobs, profiles),  // Product impact
  message3: generateMessage3()  // Soft follow-up
}
```

---

### 11. **Interview Card** (`EditableInterviewCard.tsx`)

#### Static Data Structure:
```typescript
{
  optimalLoop: string[];            // e.g., ["Recruiter screen", "Modelling + SQL deep dive"]
  brutalTruth: string;
  redFlags: string[];
  donts: string[];
  fixes: string[];
  signalQuestions: string[];          // Key questions to ask
}
```

#### Sub-Cards (Modals):
1. **Optimal Interview Loop** - Ordered list of stages
2. **Signal Questions** - List of questions
3. **Red Flags** - List
4. **Don't Do This** - List
5. **Fixes** - List
6. **Score Impact Fixes** - Table
7. **Brutal Truth** - Single text

#### Scraped Data Sources:
- **Jobs Data**:
  - `descriptionText` → Required competencies
  - `jobFunctions` → Job function categories
  - Aggregate → Common interview patterns

- **Profiles Data**:
  - `experience[].description` → What to evaluate
  - `skills[]` → Technical assessment areas

#### Transformation Mapping:
```typescript
{
  optimalLoop: generateOptimalLoop(jobs),  // Based on role complexity
  signalQuestions: generateSignalQuestions(jobs, profiles)  // Based on required skills
}
```

---

### 12. **Scorecard Card** (`EditableScorecardCard.tsx`)

#### Static Data Structure:
```typescript
{
  competencies: string[];            // e.g., ["Modelling", "Data quality discipline"]
  rating1: string;                   // e.g., "slows the team"
  rating2: string;                   // e.g., "needs coaching"
  rating3: string;                   // e.g., "independent senior"
  rating4: string;                   // e.g., "raises the bar"
  brutalTruth: string;
  donts: string[];
  fixes: string[];
  evaluationMapping: Array<{
    stage: string;                    // e.g., "Stage 1 — Recruiter Screen"
    competencies: string;             // e.g., "Communication, Ownership"
  }>;
}
```

#### Sub-Cards (Modals):
1. **Competencies** - List
2. **Rating Anchor** - 1-4 scale definitions
3. **Evaluation Mapping** - Table (stage → competencies)
4. **Don't Do This** - List
5. **Fixes** - List
6. **Score Impact Fixes** - Table
7. **Brutal Truth** - Single text

#### Scraped Data Sources:
- **Jobs Data**:
  - `descriptionText` → Required competencies
  - `jobFunctions` → Job function requirements

- **Profiles Data**:
  - `skills[]` → What top performers have
  - `experience[].description` → Competency indicators

#### Transformation Mapping:
```typescript
{
  competencies: extractCompetencies(jobs, profiles),  // Most important skills
  evaluationMapping: mapCompetenciesToStages(jobs)  // Which stage evaluates what
}
```

---

### 13. **Plan Card** (`EditablePlanCard.tsx`)

#### Static Data Structure:
```typescript
{
  first7Days: string[];              // Critical first week actions
  weeklyRhythm: string[];            // Ongoing activities
  brutalTruth: string;
  redFlags: string[];
  donts: string[];
  fixes: string[];
  fastestPath: string[];             // Optimized actions
}
```

#### Sub-Cards (Modals):
1. **First 7 Days** - List
2. **Weekly Rhythm** - List
3. **Fastest Path to Hire** - List
4. **Red Flags** - List
5. **Don't Do This** - List
6. **Fixes** - List
7. **Score Impact Fixes** - Table
8. **Brutal Truth** - Single text

#### Scraped Data Sources:
- **Jobs Data**:
  - `postedDate`, `expireAt` → Time-to-hire patterns
  - `applicants` → Pipeline requirements

- **Profiles Data**:
  - Response patterns → Outreach frequency
  - Engagement metrics → Follow-up timing

#### Transformation Mapping:
```typescript
{
  first7Days: generateFirst7Days(jobs, profiles),
  weeklyRhythm: generateWeeklyRhythm(jobs, profiles),
  fastestPath: generateFastestPath(jobs, profiles)  // Based on market data
}
```

---

## ✅ Complete Data Mapping Summary

| Card | Primary Data Source | Secondary Data Source | Key Transformations |
|------|-------------------|---------------------|-------------------|
| **Reality** | Jobs + Profiles | Market metrics | Feasibility score, helps/hurts case |
| **Role** | Jobs | Profiles | Role summary, outcomes, JD generation |
| **Skill** | Profiles + Jobs | Job descriptions | Technical/product/behavioural skills |
| **Market** | Jobs + Profiles | Geographic data | Talent pool, supply/demand, locations |
| **Talent Map** | Profiles | Jobs | Company feeders, career paths, personas |
| **Pay** | Jobs | Salary data | Compensation ranges, market rates |
| **Funnel** | Jobs + Profiles | Conversion metrics | Funnel stages, benchmarks |
| **Fit** | Profiles | Jobs | Persona, motivations, decision factors |
| **Message** | Jobs + Profiles | Messaging patterns | Core pitch, templates, scroll stoppers |
| **Outreach** | Profiles + Jobs | Outreach patterns | 3-step sequence, personalization |
| **Interview** | Jobs + Profiles | Interview patterns | Optimal loop, signal questions |
| **Scorecard** | Jobs + Profiles | Competency data | Competencies, evaluation mapping |
| **Plan** | Jobs + Profiles | Timeline data | First 7 days, weekly rhythm, fastest path |

---

## ✅ Next Steps for Implementation

1. Create transformation utility functions (`lib/dataTransformers.ts`)
2. Process scraped data in `HireCardTabs.tsx` or chatbot
3. Pass transformed data to each card component
4. Test with real scraped data
5. Handle edge cases (missing data, empty arrays, etc.)

