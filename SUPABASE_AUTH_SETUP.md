# Supabase Authentication Setup Guide

## ✅ What's Been Integrated

### 1. **Authentication Methods**
- ✅ Email/Password authentication
- ✅ Google OAuth authentication

### 2. **Protected Routes**
The following routes now require authentication:
- `/create` - Create HireCard strategy
- `/results` - View generated HireCards
- `/dashboard` - View saved HireCards library
- `/pricing` - Pricing page

**Public routes:**
- `/` - Homepage (landing page)
- `/login` - Login/Signup page

### 3. **Protected API Routes**
All API endpoints now require authentication:
- `/api/chat` - Chatbot API
- `/api/generate-cards` - Generate battle cards
- `/api/scrape-job` - Job scraping
- `/api/extract-data` - Data extraction
- `/api/intelligent-extract` - Intelligent extraction
- `/api/parse-role` - Role parsing
- `/api/roast-hiring` - Hiring roast

### 4. **Files Created**

**Supabase Client Setup:**
- `lib/supabase/client.ts` - Browser client
- `lib/supabase/server.ts` - Server client
- `lib/supabase/middleware.ts` - Middleware for auth checks
- `middleware.ts` - Root middleware for route protection

**Authentication Components:**
- `components/AuthProvider.tsx` - Auth context provider
- `app/login/page.tsx` - Login/Signup page
- `app/auth/callback/route.ts` - OAuth callback handler
- `lib/auth-helpers.ts` - Auth validation helper

**Configuration:**
- `.env.local` - Environment variables (already configured with your Supabase credentials)

### 5. **Updated Components**
- `components/Navbar.tsx` - Now shows login/logout and user menu
- `app/layout.tsx` - Wrapped with AuthProvider

## 🔧 Next Steps: Configure Supabase Dashboard

### Step 1: Enable Google OAuth

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/dnqfkgejhjptqvohzwxn
2. Navigate to **Authentication → Providers**
3. Find **Google** and click to configure
4. You'll need to create a Google OAuth app:

#### Create Google OAuth Credentials:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Go to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Configure OAuth consent screen if prompted
6. For Application type, select **Web application**
7. Add these URLs:
   - **Authorized JavaScript origins:**
     - `http://localhost:3000` (for development)
     - `https://your-production-domain.com` (for production)
   
   - **Authorized redirect URIs:**
     - `https://dnqfkgejhjptqvohzwxn.supabase.co/auth/v1/callback`
     - `http://localhost:3000/auth/callback` (optional, for testing)

8. Copy the **Client ID** and **Client Secret**
9. Back in Supabase, paste them into the Google provider settings
10. Enable the Google provider
11. Save changes

### Step 2: Configure Email Settings (Optional)

By default, Supabase requires email confirmation. You can:
- **Keep it enabled** (more secure) - Users will receive a confirmation email
- **Disable it** (for testing) - Go to Authentication → Settings → Disable "Enable email confirmations"

### Step 3: Set Up Email Templates (Optional)

Go to **Authentication → Email Templates** to customize:
- Confirmation email
- Password reset email
- Magic link email

### Step 4: Configure Redirect URLs

Go to **Authentication → URL Configuration** and add:
- `http://localhost:3000/**` (for development)
- `https://your-production-domain.com/**` (for production)

## 🚀 How to Test

### 1. Install Dependencies (if not already done)
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Test Authentication Flow

#### Email/Password:
1. Go to `http://localhost:3000/create` (or any protected route)
2. You'll be redirected to `/login`
3. Click "Sign Up" tab
4. Enter email and password
5. Check your email for confirmation link (if email confirmation is enabled)
6. After confirmation, you'll be logged in and redirected

#### Google OAuth:
1. Go to `http://localhost:3000/create`
2. You'll be redirected to `/login`
3. Click "Continue with Google"
4. Complete Google sign-in
5. You'll be redirected back and logged in

### 4. Test Protected Features

Once logged in:
- ✅ Can access `/create`, `/results`, `/dashboard`, `/pricing`
- ✅ Navbar shows user email and logout option
- ✅ API routes work properly
- ✅ "My HireCards" link appears in navbar

### 5. Test Logout
- Click on your email in the navbar
- Click "Sign Out"
- You'll be redirected to homepage
- Protected routes will redirect to login

## 📊 Data Storage

**Important:** Authentication is now integrated, but data storage remains unchanged:
- ✅ User authentication via Supabase
- ❌ HireCards still stored in `localStorage` (no database migration yet)
- ❌ Session data still in `sessionStorage`

Each authenticated user will have their own local storage, but data won't sync across devices yet.

## 🔒 Security Notes

- Environment variables are in `.env.local` (already in .gitignore)
- Never commit `.env.local` to git
- API routes validate authentication before processing
- Middleware protects routes at the Next.js level
- Supabase handles secure token management via cookies

## 🐛 Troubleshooting

### "Unauthorized" errors:
- Make sure you're logged in
- Check browser console for errors
- Verify Supabase credentials in `.env.local`

### Google OAuth not working:
- Verify Google OAuth credentials in Supabase dashboard
- Check redirect URLs are correctly configured
- Ensure Google provider is enabled in Supabase

### Email confirmation not arriving:
- Check spam folder
- Verify email settings in Supabase dashboard
- For testing, you can disable email confirmation

## 📝 Production Deployment

When deploying to production:
1. Add production URL to Supabase redirect URLs
2. Add production URL to Google OAuth authorized origins/redirects
3. Set environment variables in your hosting platform (Vercel, Netlify, etc.)
4. Test authentication flow in production

## 🎉 Summary

Your HireCards app now has:
- ✅ Full authentication system (Email + Google OAuth)
- ✅ Protected routes and API endpoints
- ✅ User-specific experiences
- ✅ Professional login/signup UI
- ✅ Secure token management

**Ready for next steps:** When you're ready to migrate data storage to Supabase database, we can implement that as a separate feature!
