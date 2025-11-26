# Quick Deploy Guide to Vercel

## Prerequisites ✅

- [x] Node.js 18+ installed
- [x] Vercel account (sign up at vercel.com)
- [x] OpenAI API key

## 🚀 Quick Deployment (5 minutes)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

```bash
vercel --prod
```

Follow the prompts:
- **Set up and deploy?** Yes
- **Which scope?** Select your account
- **Link to existing project?** No (first time) or Yes (subsequent deploys)
- **Project name?** Accept default or customize
- **Directory?** `.` (current directory)
- **Override settings?** No

### Step 4: Set Environment Variables

After deployment, go to your Vercel dashboard:

1. Navigate to your project
2. Go to **Settings** → **Environment Variables**
3. Add:
   - **Name:** `OPENAI_API_KEY`
   - **Value:** Your OpenAI API key
   - **Environments:** Production, Preview, Development

4. **Redeploy** to apply changes:

```bash
vercel --prod
```

## 🧪 Test Your Deployment

### Option 1: Using curl

```bash
curl -X POST https://your-app.vercel.app/api/scrape-job \
  -H "Content-Type: application/json" \
  -d '{"url": "https://jobs.lever.co/example/job-posting"}'
```

### Option 2: Using your browser

Navigate to your Vercel URL and use the app normally.

### Option 3: Check Vercel Logs

```bash
vercel logs
```

Or view in dashboard: **Deployments** → Click latest → **Runtime Logs**

## 📊 Verify It's Working

You should see in the logs:

```
🚀 Starting Puppeteer scrape for: [URL]
🌐 Running in serverless environment
📄 Navigating to URL...
✅ Navigation complete
⏳ Waiting for dynamic content to load...
✅ Content loaded successfully
✅ Puppeteer got HTML, length: [size]
✅ Browser closed successfully
✅ Scraping complete
```

## ⚙️ Advanced Configuration (Optional)

### Increase Function Timeout (Pro Plan Required)

Create `vercel.json` in root:

```json
{
  "functions": {
    "app/api/scrape-job/route.ts": {
      "maxDuration": 300,
      "memory": 3008
    },
    "app/api/parse-role/route.ts": {
      "maxDuration": 300,
      "memory": 3008
    }
  }
}
```

Then redeploy:

```bash
vercel --prod
```

### Set Custom Domain

In Vercel dashboard:
1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration steps

## 🐛 Troubleshooting

### Build Fails

**Check logs:**
```bash
vercel logs --follow
```

**Common issues:**
- Missing dependencies: Run `npm install` locally first
- TypeScript errors: Run `npm run build` locally to catch errors
- Environment variables: Make sure they're set in Vercel dashboard

### Function Timeout

**Symptoms:**
```
Task timed out after 60.00 seconds
```

**Solutions:**
1. Upgrade to Vercel Pro (300s timeout)
2. Optimize the target website
3. Add caching layer

### Memory Issues

**Symptoms:**
```
FATAL ERROR: Reached heap limit
```

**Solutions:**
1. Increase memory in `vercel.json` (Pro plan)
2. Check for memory leaks
3. Ensure browser is being closed properly

### Empty Page Content

**Symptoms:**
- Scraper returns minimal content
- Missing job details

**Solutions:**
1. Check if site requires authentication
2. Increase wait times in scraper
3. Check if site blocks automated access
4. Try different user agent

## 📈 Monitoring

### View Function Stats

Dashboard → **Analytics** → **Functions**

Monitor:
- Invocation count
- Duration (p50, p95, p99)
- Error rate
- Memory usage

### Set Up Alerts

1. Go to **Settings** → **Integrations**
2. Add monitoring service (e.g., Sentry, LogRocket)
3. Configure alerts for errors/timeouts

## 💰 Pricing Considerations

### Free Tier (Not Recommended for Puppeteer)
- 10s function timeout ❌
- 100 GB bandwidth
- 100 GB-hours compute

### Hobby Plan - $20/month (Minimum Recommended)
- **60s function timeout** ✅
- 100 GB bandwidth
- 1000 GB-hours compute
- Perfect for moderate usage

### Pro Plan - $20/month per member (Recommended)
- **300s function timeout** ✅
- 1 TB bandwidth
- 3000 GB-hours compute
- **3008 MB memory** ✅
- Advanced analytics

## 🔄 CI/CD Setup (Optional)

### Automatic Deployments

Connect to GitHub:
1. Go to Vercel dashboard
2. **Import Project** → Choose Git repository
3. Vercel will auto-deploy on every push to `main`

### Preview Deployments

Every PR gets a unique preview URL automatically.

## 📝 Deployment Checklist

Before deploying:
- [ ] Run `npm install` to verify dependencies
- [ ] Run `npm run build` to verify build works
- [ ] Test scraping locally with `npm run dev`
- [ ] Set `OPENAI_API_KEY` in Vercel
- [ ] Review function timeout limits
- [ ] Check if Pro plan is needed
- [ ] Set up monitoring/alerts
- [ ] Test production deployment
- [ ] Monitor logs for errors
- [ ] Test with real job URLs

## 🎉 Success!

Your Puppeteer scraper is now running in production on Vercel!

**Next Steps:**
- Monitor logs for the first few days
- Optimize based on usage patterns
- Consider adding caching
- Set up error tracking
- Scale as needed

## 📚 Additional Resources

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Function Limits](https://vercel.com/docs/functions/limitations)
- [Pricing](https://vercel.com/pricing)

## 🆘 Need Help?

1. Check Vercel function logs
2. Review `SERVERLESS_PUPPETEER_SETUP.md`
3. Test locally first
4. Contact Vercel support (Pro plan)

---

**Deployment Status:** Ready ✅  
**Estimated Deploy Time:** 5 minutes  
**Minimum Plan:** Hobby ($20/month)
