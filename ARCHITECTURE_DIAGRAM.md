# System Architecture Diagram

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          FRONTEND (Next.js)                          │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    Hero Component                              │  │
│  │  ┌──────────────────────────────────────────────────────────┐ │  │
│  │  │  Input: "Senior Backend Engineer in Amsterdam"          │ │  │
│  │  │  Button: [Reality Check]                                 │ │  │
│  │  └──────────────────────────────────────────────────────────┘ │  │
│  │                           ▼                                     │  │
│  │  ┌──────────────────────────────────────────────────────────┐ │  │
│  │  │  handleAnalyze() - async function                        │ │  │
│  │  │  - Calls /api/parse-role                                 │ │  │
│  │  │  - Processes response                                    │ │  │
│  │  │  - Calculates score                                      │ │  │
│  │  │  - Shows results                                         │ │  │
│  │  └──────────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                           │                                          │
└───────────────────────────┼──────────────────────────────────────────┘
                            │
                            │ POST /api/parse-role
                            │ { input: "..." }
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    API ROUTE (Server-Side)                           │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │              /app/api/parse-role/route.ts                     │  │
│  │                                                                │  │
│  │  1. Validate input                                            │  │
│  │  2. Check if URL or text                                      │  │
│  │  3. Call parseRoleWithAI()                                    │  │
│  │     │                                                          │  │
│  │     ├─► If OPENAI_API_KEY exists:                            │  │
│  │     │   ├─► Call OpenAI API                                  │  │
│  │     │   ├─► Parse JSON response                              │  │
│  │     │   └─► Return structured data                           │  │
│  │     │                                                          │  │
│  │     └─► If API key missing/fails:                            │  │
│  │         └─► fallbackParsing() (pattern matching)             │  │
│  │                                                                │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                           │                                          │
└───────────────────────────┼──────────────────────────────────────────┘
                            │
                            │ HTTPS Request
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      OPENAI API (External)                           │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  GPT-4o-mini Model                                            │  │
│  │                                                                │  │
│  │  System Prompt:                                               │  │
│  │  "You are an expert at parsing job role descriptions..."     │  │
│  │                                                                │  │
│  │  User Input:                                                  │  │
│  │  "Senior Backend Engineer in Amsterdam"                      │  │
│  │                                                                │  │
│  │  Processing:                                                  │  │
│  │  - Natural language understanding                            │  │
│  │  - Entity extraction                                          │  │
│  │  - Confidence calculation                                    │  │
│  │                                                                │  │
│  │  Response: JSON                                               │  │
│  │  {                                                            │  │
│  │    "jobTitle": "Senior Backend Engineer",                    │  │
│  │    "location": "Amsterdam",                                  │  │
│  │    "experienceLevel": "Senior",                              │  │
│  │    "department": "Engineering",                              │  │
│  │    "confidence": 0.85                                        │  │
│  │  }                                                            │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

## Data Flow Sequence

```
┌──────┐     ┌──────┐     ┌─────────┐     ┌─────────┐     ┌──────┐
│ User │     │ Hero │     │   API   │     │ OpenAI  │     │ Hero │
└──┬───┘     └──┬───┘     └────┬────┘     └────┬────┘     └──┬───┘
   │            │              │               │              │
   │  Types &   │              │               │              │
   │  clicks    │              │               │              │
   ├───────────>│              │               │              │
   │            │              │               │              │
   │            │  POST        │               │              │
   │            │  /api/parse  │               │              │
   │            ├─────────────>│               │              │
   │            │              │               │              │
   │            │              │  Call GPT-4o  │              │
   │            │              ├──────────────>│              │
   │            │              │               │              │
   │            │              │   AI Process  │              │
   │            │              │   (1-2 sec)   │              │
   │            │              │               │              │
   │            │              │  JSON Result  │              │
   │            │              │<──────────────┤              │
   │            │              │               │              │
   │            │   Response   │               │              │
   │            │<─────────────┤               │              │
   │            │              │               │              │
   │            │  Calculate   │               │              │
   │            │  Score       │               │              │
   │            │              │               │              │
   │            │  Render      │               │              │
   │  Shows     │  Results     │               │              │
   │  Results   │<─────────────┘               │              │
   │<───────────┤                              │              │
   │            │                              │              │
```

## Component Architecture

```
app/
├── api/
│   └── parse-role/
│       └── route.ts ──────────────┐
│           │                       │
│           ├─► POST handler        │
│           ├─► isValidURL()        │
│           ├─► parseRoleWithAI()   │ Core Logic
│           ├─► fallbackParsing()   │
│           └─► parseJobURL()       │
│                                   │
components/                         │
└── Hero.tsx ──────────────────────┤
    │                               │
    ├─► State Management            │
    │   ├─► roleDescription         │
    │   ├─► analysisResult          │
    │   ├─► missingFields           │
    │   └─► isAnalyzing             │
    │                               │
    ├─► handleAnalyze() ────────────┘ Calls API
    │   ├─► fetch('/api/parse-role')
    │   ├─► Process response
    │   ├─► Calculate score
    │   └─► Update state
    │
    └─► Render
        ├─► Input field
        ├─► Button
        └─► Results card
```

## State Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Initial State                             │
│                                                               │
│  roleDescription: ""                                         │
│  analysisResult: null                                        │
│  showResults: false                                          │
│  isAnalyzing: false                                          │
│  missingFields: []                                           │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ User types input
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    Input State                               │
│                                                               │
│  roleDescription: "Senior Backend Engineer in Amsterdam"    │
│  analysisResult: null                                        │
│  showResults: false                                          │
│  isAnalyzing: false                                          │
│  missingFields: []                                           │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ User clicks "Reality Check"
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   Analyzing State                            │
│                                                               │
│  roleDescription: "Senior Backend Engineer in Amsterdam"    │
│  analysisResult: null                                        │
│  showResults: false                                          │
│  isAnalyzing: true ◄────────────────────────────────────────┐│
│  missingFields: []                                           ││
└───────────────────────┬─────────────────────────────────────┘│
                        │                                       │
                        │ API call in progress                  │
                        │ (1-2 seconds)                         │
                        ▼                                       │
┌─────────────────────────────────────────────────────────────┐│
│                   Results State                              ││
│                                                               ││
│  roleDescription: "Senior Backend Engineer in Amsterdam"    ││
│  analysisResult: {                                           ││
│    score: 35,                                                ││
│    category: "Low Feasibility",                             ││
│    message: "...",                                           ││
│    isIncomplete: true                                        ││
│  }                                                            ││
│  showResults: true                                           ││
│  isAnalyzing: false ◄────────────────────────────────────────┘│
│  missingFields: ["Work Model", "Skills", ...]               │
└─────────────────────────────────────────────────────────────┘
```

## API Request/Response Schema

```
┌─────────────────────────────────────────────────────────────┐
│                        REQUEST                               │
│                                                               │
│  POST /api/parse-role                                        │
│  Content-Type: application/json                              │
│                                                               │
│  Body:                                                        │
│  {                                                            │
│    "input": "Senior Backend Engineer in Amsterdam"          │
│  }                                                            │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                       RESPONSE                               │
│                                                               │
│  Status: 200 OK                                              │
│  Content-Type: application/json                              │
│                                                               │
│  Body:                                                        │
│  {                                                            │
│    "success": true,                                          │
│    "data": {                                                 │
│      "jobTitle": "Senior Backend Engineer",                 │
│      "location": "Amsterdam",                                │
│      "workModel": null,                                      │
│      "experienceLevel": "Senior",                           │
│      "department": "Engineering",                           │
│      "skills": [],                                           │
│      "isURL": false,                                         │
│      "confidence": 0.85,                                     │
│      "rawInput": "Senior Backend Engineer in Amsterdam"     │
│    }                                                          │
│  }                                                            │
└─────────────────────────────────────────────────────────────┘
```

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    API Route                                 │
│                                                               │
│  try {                                                        │
│    const parsed = await parseRoleWithAI(input);             │
│    return success response                                   │
│  }                                                            │
│  catch (error) {                                             │
│    console.error(error);                                     │
│    ├─► Try fallbackParsing()                                │
│    └─► Return error response                                │
│  }                                                            │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ On Error
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                 Fallback Parsing                             │
│                                                               │
│  Uses regex patterns:                                        │
│  ├─► Location: /\bin\s+([A-Z][a-z]+)/                      │
│  ├─► Experience: /(senior|junior|lead)/i                   │
│  ├─► Work Model: /(remote|hybrid|on-site)/i                │
│  └─► Returns with confidence: 0.4                           │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                 Hero Component                               │
│                                                               │
│  catch (error) {                                             │
│    Show error message                                        │
│    Display fallback results                                  │
│    Allow user to retry                                       │
│  }                                                            │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     PRODUCTION                               │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │         Vercel / Netlify / Your Platform            │    │
│  │                                                       │    │
│  │  ┌────────────────────────────────────────────────┐ │    │
│  │  │  Frontend (Static)                             │ │    │
│  │  │  - HTML, CSS, JS                               │ │    │
│  │  │  - React Components                            │ │    │
│  │  └────────────────────────────────────────────────┘ │    │
│  │                                                       │    │
│  │  ┌────────────────────────────────────────────────┐ │    │
│  │  │  API Routes (Serverless Functions)            │ │    │
│  │  │  - /api/parse-role                             │ │    │
│  │  │  - Reads OPENAI_API_KEY from env              │ │    │
│  │  └────────────────────────────────────────────────┘ │    │
│  │                                                       │    │
│  │  Environment Variables:                              │    │
│  │  - OPENAI_API_KEY=sk-...                            │    │
│  │                                                       │    │
│  └─────────────────────────────────────────────────────┘    │
│                           │                                   │
└───────────────────────────┼───────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   OpenAI API Servers                         │
│                   api.openai.com                             │
└─────────────────────────────────────────────────────────────┘
```

## Cost Flow

```
User Request
    │
    ▼
Frontend (Free)
    │
    ▼
API Route (Free/Serverless)
    │
    ▼
OpenAI API (Paid)
    │
    ├─► Input tokens: ~200 = $0.00003
    ├─► Output tokens: ~150 = $0.00009
    └─► Total per request: ~$0.0001
```

## Scalability

```
        Load
         │
         ▼
┌─────────────────┐
│   1-100 users   │  No caching needed
│   Cost: $3/mo   │  Direct API calls
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  100-1K users   │  Add basic caching
│  Cost: $30/mo   │  Cache common queries
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  1K-10K users   │  Redis caching layer
│  Cost: $300/mo  │  Rate limiting
└────────┬────────┘  CDN for assets
         │
         ▼
┌─────────────────┐
│  10K+ users     │  Database caching
│  Custom pricing │  Advanced rate limits
└─────────────────┘  Multiple AI providers
```

---

**This architecture provides:**
- ✅ Scalability (serverless)
- ✅ Reliability (fallback logic)
- ✅ Performance (1-2s response)
- ✅ Cost-efficiency ($0.0001/req)
- ✅ Maintainability (clean separation)
