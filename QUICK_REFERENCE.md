# Quick Reference - AI Role Parsing

## 🚀 Quick Start (5 minutes)

1. **Get API Key**: https://platform.openai.com/api-keys
2. **Create `.env.local`**:
   ```bash
   OPENAI_API_KEY=sk-your-key-here
   ```
3. **Run dev server**:
   ```bash
   npm run dev
   ```
4. **Test it**: Visit http://localhost:3000

## 📁 File Locations

| File | Purpose |
|------|---------|
| `app/api/parse-role/route.ts` | AI parsing API endpoint |
| `components/Hero.tsx` | User input & results display |
| `.env.local` | API key (not in git) |
| `.env.example` | Environment template |

## 🔧 API Usage

### Request
```typescript
POST /api/parse-role
Content-Type: application/json

{
  "input": "Senior Backend Engineer in Amsterdam"
}
```

### Response
```typescript
{
  "success": true,
  "data": {
    "jobTitle": "Senior Backend Engineer",
    "location": "Amsterdam",
    "workModel": null,
    "experienceLevel": "Senior",
    "department": "Engineering",
    "skills": [],
    "isURL": false,
    "confidence": 0.85,
    "rawInput": "Senior Backend Engineer in Amsterdam"
  }
}
```

## 🎯 Extracted Fields

| Field | Type | Example | Description |
|-------|------|---------|-------------|
| `jobTitle` | string | "Senior Backend Engineer" | Job role title |
| `location` | string\|null | "Amsterdam" | City, country, or "Remote" |
| `workModel` | string\|null | "Remote" | Remote/Hybrid/On-site |
| `experienceLevel` | string\|null | "Senior" | Entry/Mid/Senior/Lead/Principal/Executive |
| `department` | string\|null | "Engineering" | Engineering/Product/Design/etc |
| `skills` | string[] | ["Python", "Django"] | Extracted skills |
| `isURL` | boolean | false | Was input a URL? |
| `confidence` | number | 0.85 | AI confidence (0-1) |

## 💰 Costs

| Model | Input | Output | Per Request |
|-------|-------|--------|-------------|
| GPT-4o-mini | $0.150/1M | $0.600/1M | ~$0.0001 |

**Daily estimates:**
- 1K requests = $0.10/day = $3/month
- 10K requests = $1.00/day = $30/month
- 100K requests = $10.00/day = $300/month

## 🧪 Test Commands

### Manual Browser Test
```bash
npm run dev
# Visit http://localhost:3000
# Try: "Senior Engineer in Amsterdam"
```

### API Test (curl)
```bash
curl -X POST http://localhost:3000/api/parse-role \
  -H "Content-Type: application/json" \
  -d '{"input":"Senior Backend Engineer in Amsterdam"}'
```

### Test Script
```bash
npx tsx tmp_rovodev_test_ai_parsing.ts
```

## 🔍 Common Patterns

### Pattern 1: Basic Check
```typescript
const response = await fetch('/api/parse-role', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ input: userInput })
});
const result = await response.json();
if (result.success) {
  console.log(result.data);
}
```

### Pattern 2: With Error Handling
```typescript
try {
  const response = await fetch('/api/parse-role', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: userInput })
  });
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error);
  }
  
  const parsed = result.data;
  // Use parsed data...
  
} catch (error) {
  console.error('Parsing failed:', error);
  // Fallback logic...
}
```

### Pattern 3: Pre-filling Form
```typescript
const parsed = result.data;

setFormData({
  jobTitle: parsed.jobTitle,
  location: parsed.location || '',
  experienceLevel: parsed.experienceLevel || '',
  workModel: parsed.workModel || '',
  department: parsed.department || '',
  requiredSkills: parsed.skills.join(', ')
});
```

## 🐛 Troubleshooting

### Issue: API returns error
```
Check: Is OPENAI_API_KEY set in .env.local?
Check: Is dev server running (npm run dev)?
Check: Is API key valid? (check OpenAI dashboard)
```

### Issue: Low confidence scores
```
Reason: Vague input
Solution: Encourage more detailed inputs
Example: "Engineer" → "Senior Backend Engineer in Amsterdam, Python"
```

### Issue: Wrong extractions
```
Reason: Ambiguous input or edge case
Solution: Review prompt in route.ts, adjust if needed
Fallback: Use fallback pattern matching
```

### Issue: Slow responses
```
Reason: Cold start or OpenAI API latency
Solution: Normal for first request (1-3 seconds)
Optimization: Add caching layer for common queries
```

## 📊 Confidence Score Guide

| Score | Meaning | Action |
|-------|---------|--------|
| 90-100% | Excellent | Trust the extraction |
| 70-89% | Good | Likely accurate |
| 50-69% | Fair | Review extractions |
| 30-49% | Poor | Use with caution |
| 0-29% | Very Poor | Fallback activated |

## 🔐 Security Checklist

- [ ] API key in `.env.local` (NOT in code)
- [ ] `.env.local` in `.gitignore`
- [ ] API route validates input
- [ ] Rate limiting implemented (TODO)
- [ ] Error messages don't expose internals
- [ ] API key set in production environment

## 🚢 Production Deployment

### Vercel
```bash
vercel
vercel env add OPENAI_API_KEY
# Paste your key when prompted
vercel --prod
```

### Netlify
```bash
netlify deploy
netlify env:set OPENAI_API_KEY sk-your-key
netlify deploy --prod
```

### Other Platforms
Set `OPENAI_API_KEY` as environment variable in platform dashboard.

## 📈 Monitoring

### Check API Usage
- Dashboard: https://platform.openai.com/usage
- Set alerts for budget limits
- Track requests per day

### Monitor Errors
```typescript
// Add to route.ts
catch (error) {
  console.error('[Parse Role Error]', {
    error: error.message,
    input: input.substring(0, 50), // First 50 chars
    timestamp: new Date().toISOString()
  });
  // Send to monitoring service (Sentry, etc.)
}
```

## 🎨 Customization

### Change AI Model
```typescript
// In route.ts, line ~58
model: "gpt-4o-mini",  // Current
model: "gpt-4o",       // More powerful, higher cost
model: "gpt-3.5-turbo" // Faster, lower quality
```

### Adjust Temperature
```typescript
// In route.ts, line ~98
temperature: 0.3,  // Current (more consistent)
temperature: 0.0,  // Most deterministic
temperature: 0.7,  // More creative
```

### Modify Prompt
```typescript
// In route.ts, lines 61-89
content: `You are an expert at parsing job role descriptions...`
// Edit this prompt to change extraction behavior
```

## 📚 Documentation Links

- **Setup Guide**: `SETUP_GUIDE.md`
- **Technical Docs**: `AI_ROLE_PARSING.md`
- **Implementation Summary**: `AI_IMPLEMENTATION_SUMMARY.md`
- **UX Flow**: `USER_EXPERIENCE_FLOW.md`
- **This File**: `QUICK_REFERENCE.md`

## 🆘 Emergency Fallback

If AI completely fails, the system automatically uses pattern matching:

```typescript
// Fallback extracts basic info using regex:
- Location: /\bin\s+([A-Z][a-z]+)/
- Experience: /(senior|junior|lead|principal)/i
- Work Model: /(remote|hybrid|on-site)/i
```

App continues to work, just with lower accuracy.

## ⚡ Performance Tips

1. **Cache common queries**: Store frequent inputs
2. **Debounce requests**: Wait for user to stop typing
3. **Batch requests**: Process multiple at once
4. **Use CDN**: Cache static assets
5. **Optimize bundle**: Remove unused code

## 🎯 Best Practices

✅ **DO:**
- Validate all inputs
- Handle errors gracefully
- Log failures for debugging
- Monitor API usage
- Set budget limits
- Cache frequent queries

❌ **DON'T:**
- Commit API keys to git
- Expose keys in frontend code
- Skip error handling
- Ignore fallback logic
- Forget to set prod env vars
- Hardcode values

## 🔄 Update Checklist

When updating the AI logic:

- [ ] Test with various inputs
- [ ] Check confidence scores
- [ ] Verify error handling
- [ ] Update documentation
- [ ] Monitor costs
- [ ] Collect user feedback
- [ ] A/B test if major change

## 📞 Support Resources

- **OpenAI Docs**: https://platform.openai.com/docs
- **OpenAI Status**: https://status.openai.com
- **Community**: https://community.openai.com
- **Pricing**: https://openai.com/pricing

---

**Pro Tip**: Bookmark this file for quick reference! 📌
