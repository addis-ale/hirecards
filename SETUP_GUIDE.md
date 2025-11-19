# Quick Setup Guide - AI Role Parsing

## Step 1: Install Dependencies

No additional dependencies needed! The implementation uses native `fetch` API.

## Step 2: Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-...`)

## Step 3: Configure Environment

Create `.env.local` in your project root:

```bash
OPENAI_API_KEY=sk-your-actual-key-here
```

**Important**: 
- Never commit `.env.local` to git (it's already in `.gitignore`)
- For production, set this in your hosting platform (Vercel, Netlify, etc.)

## Step 4: Test Locally

```bash
npm run dev
```

Visit http://localhost:3000 and try these examples:

### Test Cases

1. **Simple Role + Location**
   ```
   Senior Backend Engineer in Amsterdam
   ```
   Expected: Extracts role, location, experience level

2. **Detailed Description**
   ```
   Product Manager, remote, 5+ years experience, SaaS, agile
   ```
   Expected: Extracts role, location (remote), experience, skills

3. **Casual Input**
   ```
   Frontend Dev @ London
   ```
   Expected: Extracts role, location

4. **With Skills**
   ```
   Data Scientist NYC, Python, Machine Learning, 3-5 years
   ```
   Expected: Extracts role, location, skills, experience

## Step 5: Verify It's Working

You should see:
- ✅ AI extracts structured information from your input
- ✅ Score is calculated based on completeness
- ✅ Missing fields are highlighted
- ✅ Extracted data appears in the results

## Troubleshooting

### Problem: "We couldn't analyze this role properly"

**Solution**: Check that your API key is set correctly

```bash
# Verify the environment variable
echo $OPENAI_API_KEY
```

### Problem: Slow Response

**Possible causes**:
- OpenAI API is slow (normal for first requests)
- Network issues
- API rate limits

**Solution**: The system will fallback to basic parsing automatically

### Problem: Inaccurate Extractions

**Why**: AI confidence is low for vague inputs

**Solution**: Provide more details in the input:
- ❌ "Engineer"
- ✅ "Senior Backend Engineer in Amsterdam, Python/Django"

## Testing Without API Key

The system includes fallback logic. To test without API key:

1. Don't set `OPENAI_API_KEY` in `.env.local`
2. The system will use pattern matching instead
3. Results will have lower confidence scores

## Production Deployment

### Vercel
```bash
vercel env add OPENAI_API_KEY
# Paste your API key when prompted
```

### Netlify
```bash
netlify env:set OPENAI_API_KEY sk-your-key-here
```

### Other Platforms
Add `OPENAI_API_KEY` as an environment variable in your hosting platform's dashboard.

## Cost Management

### Free Tier
OpenAI gives $5 in free credits for new accounts

### Monitoring Usage
- Dashboard: https://platform.openai.com/usage
- Set up usage alerts to avoid surprises

### Budget Limits
Set a monthly budget limit in your OpenAI account settings:
1. Go to Settings → Limits
2. Set "Hard limit" (e.g., $10/month)
3. Enable email notifications

## Next Steps

1. ✅ Get API key and configure `.env.local`
2. ✅ Test with various inputs
3. ✅ Monitor API usage
4. 📊 Track parsing accuracy
5. 🚀 Deploy to production

## Need Help?

Check these resources:
1. `AI_ROLE_PARSING.md` - Full technical documentation
2. OpenAI API Docs: https://platform.openai.com/docs
3. API Status: https://status.openai.com

---

**Estimated Setup Time**: 5-10 minutes
