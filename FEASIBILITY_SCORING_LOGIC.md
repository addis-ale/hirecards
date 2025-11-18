# Feasibility Scoring Logic & Scenarios

## Overview
This document outlines the complete feasibility scoring system for the HireCard application. The system evaluates job postings based on multiple factors, with an emphasis on providing accurate assessments rather than artificially boosting scores.

---

## Core Principle

**Accuracy Over Optimization**
- Filling in all fields does NOT guarantee a higher score
- Complete data = more accurate/realistic assessment
- Incomplete data = guesswork with wide uncertainty ranges
- Honesty is key: we tell users the truth, even if it hurts

---

## Scoring Components

### 1. Field Completeness (10% of total score)

**Required Fields:**
1. Role Title
2. Experience Level
3. Location
4. Work Model (Remote/Hybrid/On-site)
5. Critical Skills
6. Budget/Salary Range (Min & Max)
7. Why Hiring Now
8. Non-Negotiables
9. Timeline
10. Flexible Factors (Optional, lower weight)

**Scoring Breakdown:**

| Fields Provided | Completeness Score | Notes |
|----------------|-------------------|-------|
| All 10 fields | 10/10 | Full data for accurate assessment |
| 8-9 fields | 8/10 | Missing 1-2 fields, slight uncertainty |
| 6-7 fields | 6/10 | Missing 3-4 fields, moderate uncertainty |
| 4-5 fields | 4/10 | Missing 5-6 fields, high uncertainty |
| 2-3 fields | 2/10 | Missing 7-8 fields, mostly guesswork |
| 1 field (role only) | 1/10 | Pure speculation |

**Critical vs. Optional Fields:**
- **Critical fields** (bigger penalty if missing): Role Title, Location, Salary Range, Experience Level, Critical Skills
- **Important fields**: Work Model, Timeline, Why Hiring Now, Non-Negotiables
- **Nice-to-have fields**: Flexible Factors

---

### 2. Market Competitiveness (30% of total score)

**Factors Evaluated:**
- Role demand in current market (high-demand roles like AI/ML engineers vs. generic roles)
- Market saturation in specified location
- Industry trends and hiring patterns
- Competition for similar roles

**Scoring Examples:**

| Scenario | Competitiveness Score | Notes |
|----------|----------------------|-------|
| AI/ML Engineer in San Francisco | 12/30 | Extremely competitive, hard to hire |
| Senior Backend Engineer in Amsterdam | 18/30 | Competitive but manageable |
| Junior Frontend Developer in Midwest US | 24/30 | Less competitive, easier to fill |
| Generic Admin Assistant | 27/30 | High availability of candidates |

---

### 3. Salary vs. Requirements Alignment (30% of total score)

**Evaluation Criteria:**
- Is the salary competitive for the location?
- Does the salary match the experience level required?
- Is there alignment between skills required and compensation offered?
- Are benefits/perks considered in the package?

**Scoring Examples:**

| Scenario | Alignment Score | Notes |
|----------|----------------|-------|
| $180K-220K for Senior SWE in SF | 27/30 | Market rate, realistic |
| $120K-150K for Senior SWE in SF | 15/30 | Below market, will struggle |
| $80K for Senior SWE with 10 years exp | 5/30 | Delusional, won't attract anyone |
| $60K for Junior Dev in Kansas City | 23/30 | Reasonable for location |
| $200K for Entry-level role | 18/30 | Overpaying, might attract wrong candidates |

---

### 4. Role Clarity & Realism (20% of total score)

**Factors Evaluated:**
- Is the job description clear and well-structured?
- Are the requirements realistic (not asking for unicorns)?
- Do the skills/requirements make sense together?
- Is the role well-defined or a "kitchen sink" position?

**Scoring Examples:**

| Scenario | Clarity Score | Notes |
|----------|--------------|-------|
| Clear role, focused skills, realistic expectations | 18/20 | Well-defined position |
| Multiple conflicting requirements (Full-stack + DevOps + ML) | 8/20 | Unrealistic "unicorn" role |
| Vague description, unclear responsibilities | 6/20 | Candidates won't know what they're applying for |

---

### 5. Timeline Realism (10% of total score)

**Evaluation Criteria:**
- Does the hiring timeline match the seniority level?
- Is the urgency realistic for the market?
- Does "urgent" hiring signal red flags?

**Scoring Examples:**

| Scenario | Timeline Score | Notes |
|----------|---------------|-------|
| 6-8 weeks for Senior Engineer | 9/10 | Realistic timeline |
| 2 weeks for Senior Engineer | 3/10 | Unrealistic, signals desperation |
| 3 months for Junior role | 8/10 | Reasonable but might lose candidates |
| 1 week for any role | 1/10 | Red flag, desperation hire |

---

## Complete Scenarios & Examples

### Scenario 1: URL with ALL Fields Present

**Input:**  
URL: `https://company.com/jobs/senior-backend-engineer`

**Mock Scraped Data:**
- Role Title: Senior Backend Engineer
- Experience Level: 5-7 years
- Location: San Francisco, CA
- Work Model: Hybrid (3 days on-site)
- Critical Skills: Python, Django, PostgreSQL, AWS
- Salary Range: $160K - $190K
- Why Hiring Now: Scaling product team for new feature launch
- Non-Negotiables: Strong backend architecture experience
- Timeline: 6-8 weeks
- Flexible: Open to candidates with different framework experience

**Scoring Breakdown:**
- Field Completeness: 10/10 ✅ (all fields present)
- Market Competitiveness: 15/30 ⚠️ (competitive SF market)
- Salary Alignment: 21/30 ⚠️ (slightly below market for SF)
- Role Clarity: 16/20 ✅ (clear and realistic)
- Timeline: 8/10 ✅ (reasonable)

**Total Score: 70/100**

**Category:** "Moderate to High Feasibility"

**Roasting Message:**
"Okay, you actually filled everything out. Impressive. We scraped your URL and found a complete job description—role, salary, timeline, the works. Here's the reality check: your salary is about 10-15% below market for SF. You're offering $160K-$190K when the market's closer to $180K-$220K for senior backend engineers. With all the data in, your score is 70—not bad, but not great either. The market competitiveness in SF is brutal, and your salary puts you at a disadvantage. You'll get applicants, but expect to lose them in final rounds to better offers. Bump the range or prepare for second-choice candidates. Your timeline is solid though, so that's something."

**Call to Action:**
- Button: "Refine Your Data & Get Full Analysis" → `/create`
- Description: "Verify the scraped data and get a complete market analysis with competitor benchmarking and sourcing strategy."

---

### Scenario 2: URL with Most Fields (1-2 Missing)

**Input:**  
URL: `https://startup.com/careers/product-manager`

**Mock Scraped Data:**
- Role Title: Senior Product Manager
- Experience Level: 4-6 years
- Location: Remote (US-based)
- Work Model: Fully Remote
- Critical Skills: Product strategy, user research, agile
- Salary Range: ❌ MISSING
- Why Hiring Now: Expanding product line
- Non-Negotiables: Previous B2B SaaS experience
- Timeline: ❌ MISSING
- Flexible: Open to different backgrounds

**Scoring Breakdown:**
- Field Completeness: 8/10 ⚠️ (missing 2 critical fields)
- Market Competitiveness: 21/30 ✅ (moderate competition for PMs)
- Salary Alignment: 15/30 ⚠️ (can't assess without salary data)
- Role Clarity: 16/20 ✅ (clear requirements)
- Timeline: 5/10 ⚠️ (unknown, assumed moderate)

**Total Score: 65/100**  
*Note: This is an ESTIMATE with ±15 point uncertainty*

**Category:** "Moderate Feasibility (Uncertain)"

**Roasting Message:**
"Not bad! You've got most of the picture. We found role details, location, skills—good stuff. But here's where it gets fuzzy: no salary range and no timeline. That 65 you're seeing? It's a guess. If you're paying $140K-$180K (competitive for remote PM), you might hit 75-80. If you're offering $100K and expecting to hire yesterday, you're looking at 45-50. See the problem? We're reading tea leaves. Fill in salary and timeline, and we'll tell you if you're competitive or dreaming."

**Call to Action:**
- Button: "Add Missing Fields & Get Accurate Score" → `/create`
- Description: "Your score could swing ±15 points based on what's missing. Stop guessing—get the real answer."

---

### Scenario 3: URL with Many Missing Fields (5+ Missing)

**Input:**  
URL: `https://company.com/jobs/123`

**Mock Scraped Data:**
- Role Title: Backend Engineer
- Experience Level: ❌ MISSING
- Location: New York, NY
- Work Model: ❌ MISSING
- Critical Skills: ❌ MISSING
- Salary Range: ❌ MISSING
- Why Hiring Now: ❌ MISSING
- Non-Negotiables: ❌ MISSING
- Timeline: ❌ MISSING
- Flexible: ❌ MISSING

**Scoring Breakdown:**
- Field Completeness: 2/10 ❌ (only 2 fields present)
- Market Competitiveness: 12/30 ❌ (can't assess properly)
- Salary Alignment: 8/30 ❌ (no data)
- Role Clarity: 6/20 ❌ (too vague)
- Timeline: 3/10 ❌ (unknown)

**Total Score: 31/100**  
*Note: Massive uncertainty - real score could be 15-70*

**Category:** "Low Feasibility (Ghost Town)"

**Roasting Message:**
"You dropped a URL like you're trying to impress us. Cool. We scraped it. Found 'Backend Engineer' and 'New York.' That's it. Your job description is basically a ghost town. No salary range? No required skills? No timeline? No experience level? Come on. We're giving you a 31, but honestly, that's charity. Your real score could be 60 if you're hiding a solid offer, or 15 if this is as empty as it looks. This isn't hiring, it's hope. And hope doesn't close talent. Want the actual truth? Fill in what's missing."

**Missing Fields Display:**
```
Missing Critical Data:
[Experience Level] [Work Model] [Critical Skills] [Salary Range] 
[Why Hiring Now] [Non-Negotiables] [Timeline] [Flexible]
```

**Call to Action:**
- Button: "Stop Guessing. Get Accurate Results." → `/create`
- Description: "Fill the blanks and we'll tell you the truth—whether this role is solid gold or hiring fantasy. Complete analysis with real market data, not guesswork."

---

### Scenario 4: Just a Job Role (No URL)

**Input:**  
Text: "Senior Frontend Engineer"

**Mock Data:**
- Role Title: Senior Frontend Engineer
- Experience Level: ❌ MISSING
- Location: ❌ MISSING
- Work Model: ❌ MISSING
- Critical Skills: ❌ MISSING
- Salary Range: ❌ MISSING
- Why Hiring Now: ❌ MISSING
- Non-Negotiables: ❌ MISSING
- Timeline: ❌ MISSING
- Flexible: ❌ MISSING

**Scoring Breakdown:**
- Field Completeness: 1/10 ❌ (only 1 field)
- Market Competitiveness: 8/30 ❌ (can't determine without location)
- Salary Alignment: 0/30 ❌ (no data)
- Role Clarity: 4/20 ❌ (just a title)
- Timeline: 3/10 ❌ (unknown)

**Total Score: 16/100**  
*Note: Extreme uncertainty - real score could be 10-85*

**Category:** "Ghost Town"

**Roasting Message:**
"Just a job title? Really? That's like walking into a café and saying 'coffee' and expecting a masterpiece. We gave you a 16, but let's be real—we know nothing. Your actual feasibility could be 70 if you've got a solid offer in Austin with $150K salary, or it could be 10 if you're asking for a unicorn on a shoestring budget in the middle of nowhere. This isn't an assessment, it's a coin flip. Give us actual details and we'll give you an actual answer."

**Missing Fields Display:**
```
Missing Critical Data:
[Experience Level] [Location] [Work Model] [Critical Skills] 
[Salary Range] [Why Hiring Now] [Non-Negotiables] [Timeline]
```

**Call to Action:**
- Button: "Stop Guessing. Get Accurate Results." → `/create`
- Description: "Fill the blanks and we'll tell you the truth—whether this role is solid gold or hiring fantasy. Complete analysis with real market data, not guesswork."

---

### Scenario 5: Complete Form Submission (All Fields Filled)

**Input:**  
User fills out complete form at `/create`

**Complete Data:**
- Role Title: AI/ML Engineer
- Experience Level: 5+ years
- Location: Remote (Global)
- Work Model: Fully Remote
- Critical Skills: Python, TensorFlow, PyTorch, NLP
- Salary Range: $120K - $150K
- Why Hiring Now: Building AI product from scratch
- Non-Negotiables: Published research or production ML experience
- Timeline: 4 weeks
- Flexible: Open to consulting arrangements

**Scoring Breakdown:**
- Field Completeness: 10/10 ✅ (all fields present)
- Market Competitiveness: 8/30 ❌ (AI/ML extremely competitive)
- Salary Alignment: 6/30 ❌ (way below market - AI/ML engineers get $180K-$300K+)
- Role Clarity: 16/20 ✅ (clear requirements)
- Timeline: 3/10 ❌ (4 weeks is unrealistic for senior ML engineer)

**Total Score: 43/100**

**Category:** "Low Feasibility (But Complete Data)"

**Roasting Message:**
"Alright, you filled out everything. Gold star for participation. Now let's talk reality. You want an AI/ML engineer with 5+ years experience, published research, and production ML chops. Cool. You're offering $120K-$150K. Here's the problem: those engineers are getting $200K-$300K+ at big tech, and you're competing with them. Your budget is about 50% below market. And you want to hire in 4 weeks? Good luck. AI/ML engineers have their pick of offers and take 2-3 months to close. Your role is clear and well-defined, but your expectations are living in 2015. Bump your budget to $180K+ minimum or prepare for tumbleweed."

**Recommendations:**
1. **Salary Adjustment:** Increase range to $180K-$240K to be competitive
2. **Timeline Extension:** Plan for 8-12 weeks minimum
3. **Flexibility:** Consider mid-level engineers (3-4 years) at lower rates
4. **Alternative Approach:** Contract/consulting arrangements for budget flexibility

**Call to Action:**
- Button: "Get Full HireCard Strategy" → `/pricing`
- Description: "Complete feasibility analysis, competitor benchmarking, sourcing strategy, and battle-tested reality check. Stop guessing, start hiring with confidence."

---

### Scenario 6: Complete Form - Realistic Role

**Input:**  
User fills out complete form at `/create`

**Complete Data:**
- Role Title: Junior Frontend Developer
- Experience Level: 1-2 years
- Location: Austin, TX
- Work Model: Hybrid (2 days remote)
- Critical Skills: React, JavaScript, CSS, Git
- Salary Range: $65K - $80K
- Why Hiring Now: Growing team, need additional frontend support
- Non-Negotiables: Portfolio with 2+ projects
- Timeline: 6-8 weeks
- Flexible: Open to bootcamp graduates with strong portfolios

**Scoring Breakdown:**
- Field Completeness: 10/10 ✅ (all fields present)
- Market Competitiveness: 24/30 ✅ (junior roles easier to fill)
- Salary Alignment: 27/30 ✅ (competitive for Austin junior devs)
- Role Clarity: 18/20 ✅ (clear, realistic requirements)
- Timeline: 9/10 ✅ (perfect timeline)

**Total Score: 88/100**

**Category:** "High Feasibility"

**Roasting Message:**
"Well, well, look at you being realistic. You filled out everything, and here's the shocker: it actually makes sense. Junior frontend dev, $65K-$80K in Austin, 1-2 years experience, React skills, 6-8 weeks to hire. You're not asking for unicorns, your budget is competitive for the market, and your timeline is reasonable. You'll get applicants. Good ones, even. Only critique: hybrid work might limit your candidate pool slightly—fully remote would get you more options—but that's nitpicking. This is a hireable role. Congratulations, you're in the top 15% of job postings that don't make us want to roast you into oblivion."

**Recommendations:**
1. ✅ Role is well-structured and realistic
2. ✅ Salary is competitive for market and experience level
3. ✅ Timeline is appropriate
4. 💡 Consider fully remote to expand candidate pool
5. 💡 Highlight growth opportunities to attract ambitious juniors

**Call to Action:**
- Button: "Get Full HireCard Strategy" → `/pricing`
- Description: "Get detailed sourcing strategy, interview templates, and market insights to close this hire quickly."

---

## Scoring Summary Table

| Scenario | Fields Provided | Est. Score | Uncertainty | Category |
|----------|----------------|------------|-------------|----------|
| URL - All fields | 10/10 | 65-75 | Low (±5) | Moderate-High Feasibility |
| URL - Most fields (1-2 missing) | 8-9/10 | 55-70 | Moderate (±10-15) | Moderate Feasibility |
| URL - Some fields (3-5 missing) | 5-7/10 | 35-55 | High (±15-20) | Low-Moderate Feasibility |
| URL - Few fields (6+ missing) | 2-4/10 | 20-35 | Very High (±20-30) | Low Feasibility |
| Job role only | 1/10 | 10-20 | Extreme (±30-50) | Ghost Town |
| Complete form - Realistic | 10/10 | 80-95 | None | High Feasibility |
| Complete form - Problematic | 10/10 | 35-50 | None | Low Feasibility |

---

## Messaging Tone Guidelines

### Roasting Principles:
1. **Honest but not cruel:** Point out problems directly but offer solutions
2. **Sarcastic but helpful:** Use humor to deliver hard truths
3. **Data-driven:** Back up roasts with market realities
4. **Motivating:** Push users to improve while keeping them engaged

### Example Roasting Phrases:

**For incomplete data:**
- "We're reading tea leaves here"
- "This isn't an assessment, it's a coin flip"
- "Your job description is a ghost town"
- "Hope doesn't close talent"
- "LinkedIn posts don't fill seats"

**For unrealistic expectations:**
- "Your expectations are living in 2015"
- "That's like finding a unicorn on Craigslist"
- "Good luck with that"
- "Prepare for tumbleweed"
- "You're competing with Google's budget on a startup salary"

**For good postings:**
- "Look at you being realistic"
- "This actually makes sense (shocking)"
- "You're in the top 15% of postings that don't make us want to roast you"
- "Congratulations, you understand market rates"

---

## Implementation Notes

### For Hero Page (Quick Analysis):
- Focus on **field completeness** as primary factor
- Give incomplete scores (15-40 range) with uncertainty ranges
- Use roasting tone to communicate uncertainty
- Drive users to `/create` for accurate analysis

### For Full Analysis (`/create` page):
- Calculate complete feasibility score with all 5 factors
- Provide detailed breakdown of each component
- Give specific, actionable recommendations
- Show market data and competitor benchmarking
- Offer sourcing strategy based on score

### Data Storage:
```javascript
// Store incomplete analysis data
sessionStorage.setItem("incompleteData", JSON.stringify({
  isURL: true/false,
  roleDescription: "user input",
  extractedFields: { /* scraped/entered data */ },
  missingFields: ["array", "of", "missing", "fields"],
  estimatedScore: 35,
  uncertainty: 20, // ±20 points
}));
```

---

## Future Enhancements

### Phase 1 (Current - Prototype):
- ✅ Mock URL scraping
- ✅ Field completeness scoring
- ✅ Roasting messages
- ✅ Missing fields display
- ✅ Redirect to `/create` for complete data

### Phase 2 (Real Implementation):
- 🔄 Actual URL scraping with Puppeteer/Playwright
- 🔄 AI-powered data extraction from job descriptions
- 🔄 Market data integration (salary APIs, location data)
- 🔄 Competitor benchmarking

### Phase 3 (Advanced):
- 🔮 ML-based feasibility prediction
- 🔮 Historical hiring data analysis
- 🔮 Industry-specific scoring adjustments
- 🔮 Real-time market competitiveness tracking

---

## Testing Scenarios

### Test Case 1: Optimistic User
**Input:** URL with decent info but missing salary  
**Expected:** Score ~55-65, message emphasizes uncertainty around salary  
**Goal:** Show that incomplete data means uncertain results

### Test Case 2: Bare Minimum User
**Input:** Just "Software Engineer"  
**Expected:** Score ~15-25, harsh roasting about lack of info  
**Goal:** Motivate user to provide more details

### Test Case 3: Complete but Unrealistic User
**Input:** Full form with low salary + high requirements  
**Expected:** Score ~50-60, roast about unrealistic expectations  
**Goal:** Educate user about market realities

### Test Case 4: Ideal User
**Input:** Full form with realistic expectations  
**Expected:** Score ~85-95, positive feedback with minor suggestions  
**Goal:** Validate good hiring practices

---

## Appendix: Field Weights

| Field | Weight | Impact if Missing |
|-------|--------|------------------|
| Role Title | Critical | -10 points |
| Salary Range | Critical | -8 points |
| Location | Critical | -7 points |
| Experience Level | Critical | -6 points |
| Critical Skills | Critical | -6 points |
| Work Model | Important | -5 points |
| Timeline | Important | -4 points |
| Why Hiring Now | Important | -3 points |
| Non-Negotiables | Important | -3 points |
| Flexible Factors | Nice-to-have | -1 point |

**Note:** These are base penalties. Actual impact varies based on context and other factors.

---

*Last Updated: [Current Date]*  
*Version: 1.0*  
*Status: Prototype Documentation*
