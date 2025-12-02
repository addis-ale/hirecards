# 🎯 Dynamic Cards Implementation Plan

## Current Situation

The first 7 cards in `/results` page are currently **hardcoded with static data**:

1. **Reality Card** - Hardcoded feasibility score, market conditions
2. **Role Card** - Hardcoded role summary, outcomes
3. **Skills Card** - Hardcoded skills lists
4. **Market Card** - Hardcoded talent pool estimates
5. **Talent Map Card** - Hardcoded company lists
6. **Pay Card** - Hardcoded salary ranges
7. **Funnel Card** - Hardcoded funnel metrics

**Problem:** These cards don't accept props - all data is hardcoded inside the component.

---

## What Needs to Be Done

### **Phase 1: Make Cards Accept Props**

Each of the 7 cards needs to be refactored to accept props:

**Before:**
```tsx
export const PayCard = () => {
  return <div>€85k–€100k</div>; // Hardcoded
};
```

**After:**
```tsx
interface PayCardProps {
  marketComp: { label: string; value: string }[];
  recommendedRange: string;
  // ... other props
}

export const PayCard = ({ marketComp, recommendedRange }: PayCardProps) => {
  return <div>{recommendedRange}</div>; // Dynamic
};
```

---

### **Phase 2: Update Dynamic Card Generator**

The `generateDynamicCards()` function needs to generate data matching the card props:

**Example for Pay Card:**
```typescript
export function generatePayCard(linkedInJobs, salaryAnalysis) {
  return {
    type: "pay",
    data: {
      marketComp: [
        { label: "Base", value: `${salaryAnalysis.minSalary}–${salaryAnalysis.maxSalary}` },
        { label: "Median", value: salaryAnalysis.medianSalary },
        { label: "75th percentile", value: salaryAnalysis.percentile75 },
      ],
      recommendedRange: `${salaryAnalysis.minSalary}–${salaryAnalysis.maxSalary}`,
      insights: salaryAnalysis.insights,
    }
  };
}
```

---

### **Phase 3: Update HireCardTabs**

Pass the dynamic data to the cards:

**Before:**
```tsx
{activeTab === "pay" && <PayCard />}
```

**After:**
```tsx
{activeTab === "pay" && <PayCard {...cardsData.pay} />}
```

---

## Card Data Mapping

### **1. Reality Card**
**LinkedIn Data Needed:**
- Feasibility score (calculated from competition level, talent pool, salary alignment)
- Market conditions (from market analysis)
- Key insights (from all analyses)
- What helps/hurts (from talent pool, salary comparison)

**Sources:**
- `marketAnalysis.competitionLevel`
- `marketAnalysis.totalOpenPositions`
- `salaryAnalysis.insights`

---

### **2. Role Card**
**LinkedIn Data Needed:**
- Role summary (from most common job descriptions)
- Top outcomes (from responsibilities analysis)
- What great looks like (from high-performing company insights)

**Sources:**
- `responsibilitiesAnalysis.commonResponsibilities`
- Top company job descriptions

---

### **3. Skills Card**
**LinkedIn Data Needed:**
- Core technical skills (from skills analysis, 70%+ frequency)
- Product skills (from skills analysis, 40-70%)
- Behavioral skills (from job descriptions)

**Sources:**
- `skillsAnalysis.topSkills` (filtered by percentage)
- Skills with >70% = "Core"
- Skills with 40-70% = "Product/Nice-to-have"

---

### **4. Market Card**
**LinkedIn Data Needed:**
- Talent pool estimate (from LinkedIn job count + applicants)
- Market conditions (from market analysis)
- Talent supply (from demand trend)

**Sources:**
- `marketAnalysis.totalOpenPositions`
- `marketAnalysis.demandTrend`
- `marketAnalysis.competitionLevel`

---

### **5. Talent Map Card**
**LinkedIn Data Needed:**
- Primary feeder companies (top 10 companies hiring)
- Secondary feeders (companies 11-20)
- Common backgrounds (from job descriptions)

**Sources:**
- `marketAnalysis.topCompanies`
- Split into primary (top 10) and secondary (11-20)

---

### **6. Pay Card**
**LinkedIn Data Needed:**
- Market compensation (salary analysis data)
- Recommended hire range (median ±10%)
- Insights (from salary analysis)

**Sources:**
- `salaryAnalysis.minSalary`
- `salaryAnalysis.maxSalary`
- `salaryAnalysis.medianSalary`
- `salaryAnalysis.percentile25`
- `salaryAnalysis.percentile75`

---

### **7. Funnel Card**
**LinkedIn Data Needed:**
- Expected funnel (calculated from average applicants)
- Benchmarks (from competition data)
- Red flags (from market analysis)

**Sources:**
- `marketAnalysis.averageApplicants`
- Calculate funnel: outreach → replies (20-30%) → screens → hire
- Competition level affects funnel conversion rates

---

## Implementation Steps

### **Step 1: Refactor Card Components (7 files)**
- Add TypeScript interfaces for props
- Replace hardcoded values with props
- Keep UI exactly the same

**Files to update:**
1. `components/cards/RealityCard.tsx`
2. `components/cards/RoleCard.tsx`
3. `components/cards/SkillCard.tsx`
4. `components/cards/MarketCard.tsx`
5. `components/cards/TalentMapCard.tsx`
6. `components/cards/PayCard.tsx`
7. `components/cards/FunnelCard.tsx`

---

### **Step 2: Update Dynamic Card Generator**
**File:** `lib/card-generators/dynamicCardGenerator.ts`

Replace current generic card generation with specific card data:

```typescript
export async function generateDynamicCards(jobData, linkedInJobs) {
  // Run analyses
  const salaryAnalysis = analyzeSalaryData(linkedInJobs);
  const skillsAnalysis = analyzeSkills(linkedInJobs);
  const marketAnalysis = analyzeMarket(linkedInJobs);
  const responsibilitiesAnalysis = await analyzeResponsibilities(linkedInJobs);

  return {
    reality: generateRealityCardData(marketAnalysis, salaryAnalysis, jobData),
    role: generateRoleCardData(responsibilitiesAnalysis, linkedInJobs),
    skill: generateSkillCardData(skillsAnalysis),
    market: generateMarketCardData(marketAnalysis),
    talentmap: generateTalentMapCardData(marketAnalysis, linkedInJobs),
    pay: generatePayCardData(salaryAnalysis, jobData),
    funnel: generateFunnelCardData(marketAnalysis),
  };
}
```

---

### **Step 3: Update HireCardTabs**
**File:** `components/HireCardTabs.tsx`

- Fetch cards data from sessionStorage
- Pass data as props to each card

```typescript
const cardsData = JSON.parse(sessionStorage.getItem("battleCards") || "{}");

{activeTab === "reality" && <RealityCard {...cardsData.reality} />}
{activeTab === "role" && <RoleCard {...cardsData.role} />}
// etc.
```

---

### **Step 4: Update API Route**
**File:** `app/api/generate-cards/route.ts`

- Return cards data in new format (keyed by card type)

```typescript
return NextResponse.json({
  success: true,
  cards: {
    reality: { ... },
    role: { ... },
    skill: { ... },
    // etc.
  },
  sessionId: generateSessionId(),
});
```

---

## Estimated Effort

**Files to modify:** 11 files
**New functions:** 7 card data generators
**Complexity:** High (each card has unique data structure)

---

## Decision Point

This is a **major refactoring** that will take multiple iterations. 

**Options:**

1. **Full Implementation** - Refactor all 7 cards (10-15 iterations)
2. **Proof of Concept** - Refactor just 2 cards (Pay + Market) to show it works (3-5 iterations)
3. **Alternative Approach** - Create NEW dynamic card components, keep old ones as fallback

**Which approach would you prefer?**

The chatbot progress tracking fix and LinkedIn scraping is working. This dynamic cards refactoring is a separate, larger task.

---

**Status:** Plan Complete, Awaiting Decision
**Current Iterations Used:** 23 out of ~30 available
