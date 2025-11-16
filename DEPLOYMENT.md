# HireCards - Deployment Guide

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended - Easiest)

**Why Vercel?**
- Made by the creators of Next.js
- Zero configuration needed
- Automatic HTTPS
- Global CDN
- Free tier available
- Perfect for Next.js apps

**Steps:**

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: HireCards app"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js settings
   - Click "Deploy"
   - Done! Your app is live in ~2 minutes

3. **Your Live URL**
   - Vercel provides: `your-app-name.vercel.app`
   - Add custom domain if desired

**Alternative: Vercel CLI**
```bash
npm install -g vercel
vercel login
vercel
# Follow the prompts
```

---

### Option 2: Netlify

**Steps:**

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Deploy via Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify init
   netlify deploy --prod
   ```

3. **Or use Netlify UI**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Click "Deploy site"

---

### Option 3: AWS Amplify

**Steps:**

1. **Push to GitHub** (if not already done)

2. **AWS Amplify Console**
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
   - Click "New app" → "Host web app"
   - Connect your GitHub repository
   - Configure build settings:
     ```yaml
     version: 1
     frontend:
       phases:
         preBuild:
           commands:
             - npm install
         build:
           commands:
             - npm run build
       artifacts:
         baseDirectory: .next
         files:
           - '**/*'
       cache:
         paths:
           - node_modules/**/*
     ```
   - Click "Save and deploy"

---

### Option 4: Digital Ocean App Platform

**Steps:**

1. **Push to GitHub**

2. **Create App**
   - Go to [Digital Ocean Apps](https://cloud.digitalocean.com/apps)
   - Click "Create App"
   - Select GitHub and choose your repository
   - Configure:
     - Type: Web Service
     - Build command: `npm run build`
     - Run command: `npm start`
     - Port: 3000
   - Choose plan (Basic or Pro)
   - Deploy!

---

### Option 5: Docker (Self-Hosted)

**Create Dockerfile:**

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

**Create .dockerignore:**

```
node_modules
.next
.git
*.md
npm-debug.log
```

**Update next.config.js:**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Add this for Docker
}

module.exports = nextConfig
```

**Build and Run:**

```bash
# Build Docker image
docker build -t hirecards .

# Run container
docker run -p 3000:3000 hirecards

# Or use Docker Compose
docker-compose up
```

**docker-compose.yml:**

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
```

---

### Option 6: Railway

**Steps:**

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy**
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Or use Railway UI**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Railway auto-detects Next.js
   - Deploy!

---

### Option 7: Render

**Steps:**

1. **Push to GitHub**

2. **Create Web Service**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Configure:
     - Name: hirecards
     - Environment: Node
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`
   - Click "Create Web Service"

---

## 🔧 Environment Variables

If you need environment variables (for future features):

**Create `.env.local`:**
```env
# Example variables
NEXT_PUBLIC_API_URL=https://api.example.com
DATABASE_URL=your_database_url
API_SECRET_KEY=your_secret_key
```

**Add to deployment platform:**
- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Build & Deploy → Environment
- **AWS**: Amplify Console → App Settings → Environment Variables
- **Docker**: Pass via `-e` flag or docker-compose

---

## 📊 Post-Deployment Checklist

After deploying, verify:

- ✅ Homepage loads correctly
- ✅ Navigation works
- ✅ Create form is accessible
- ✅ Form submission generates cards
- ✅ Results page displays cards
- ✅ Cards are expandable
- ✅ Download functionality works
- ✅ Responsive on mobile
- ✅ All animations working
- ✅ No console errors

---

## 🌐 Custom Domain Setup

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records (Vercel provides instructions)
4. SSL automatically configured

### Netlify
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Update DNS records
4. SSL automatically configured

### Others
Similar process - each platform provides DNS instructions

---

## 🔍 Monitoring & Analytics

### Add Analytics (Optional)

**Vercel Analytics:**
```bash
npm install @vercel/analytics
```

Add to `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**Google Analytics:**
Add to `app/layout.tsx` in the `<head>` section

**Plausible / Fathom:**
Add their script tags

---

## 🚨 Troubleshooting

### Build Fails

**Check Node Version:**
```bash
node -v  # Should be 18.x or higher
```

**Clear Cache:**
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Runtime Errors

**Check Logs:**
- Vercel: Deployment → Functions tab
- Netlify: Deploys → View logs
- Others: Check platform-specific logs

### Performance Issues

**Optimize Build:**
- Enable compression
- Use CDN for assets
- Enable caching headers
- Optimize images (add next/image)

---

## 📈 Scaling Considerations

### For High Traffic:

1. **Enable ISR** (Incremental Static Regeneration)
   - Add `revalidate` to pages
   
2. **Add Caching**
   - Cache API responses
   - Use Redis for sessions
   
3. **CDN Configuration**
   - Most platforms include CDN
   - Configure cache headers
   
4. **Database** (if adding persistence)
   - Use connection pooling
   - Add indexes
   - Consider read replicas

---

## 💰 Cost Estimates

### Free Tier Options:
- **Vercel**: Free for personal projects
- **Netlify**: Free tier includes 300 build minutes/month
- **Railway**: $5 credit/month free
- **Render**: Free tier available

### Paid Options:
- **Vercel Pro**: $20/month per user
- **Netlify Pro**: $19/month
- **AWS Amplify**: Pay as you go (~$10-50/month)
- **Digital Ocean**: $5-12/month

### Recommendation:
Start with **Vercel Free** - perfect for this application!

---

## 🎯 Best Practices

1. **Use Git Tags** for releases
   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

2. **Set up CI/CD**
   - Automatic deploys on push
   - Preview deploys for PRs
   - Production deploys on merge

3. **Monitor Performance**
   - Use Lighthouse CI
   - Check Web Vitals
   - Monitor error rates

4. **Enable HTTPS**
   - All platforms provide free SSL
   - Force HTTPS redirects

5. **Backup Your Code**
   - Keep GitHub as source of truth
   - Tag stable releases
   - Document changes

---

## 🚀 Quick Start Deployment

**Fastest Way to Deploy (2 minutes):**

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel

# 3. Follow prompts (hit Enter for defaults)
# Done! Your app is live!
```

---

## 📞 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **GitHub Issues**: For project-specific questions

---

## ✅ Ready to Deploy!

Your HireCards application is production-ready. Choose your preferred platform above and deploy in minutes!

**Recommended path for beginners:**
1. Push to GitHub
2. Connect to Vercel
3. Click Deploy
4. Share your live URL! 🎉

---

**Status**: ✅ Ready for Production
**Deployment Difficulty**: ⭐ Easy (especially with Vercel)
**Time to Deploy**: 2-5 minutes
