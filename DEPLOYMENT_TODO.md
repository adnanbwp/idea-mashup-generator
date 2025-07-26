# Production Deployment Todo List: Idea Mashup Generator

## Phase 1: Prerequisites & Account Setup (15-20 min)

### ✅ Task 1: Create Vercel account and connect GitHub
- Go to [vercel.com](https://vercel.com)
- Sign up using your GitHub account
- Authorize Vercel to access your GitHub repositories
- **Status**: Pending

### ✅ Task 2: Create Supabase account
- Go to [supabase.com](https://supabase.com)
- Create a free account
- Verify your email address
- **Status**: Pending

### ✅ Task 3: Verify local development environment works
- Run `npm install` in your project directory
- Create `.env.local` file (copy from `.env.local.example`)
- Test that the app runs locally with `npm run dev`
- **Status**: Pending

---

## Phase 2: Supabase Database Setup (20-30 min)

### ✅ Task 4: Create new Supabase project
- In Supabase dashboard, click "New Project"
- Choose organization and enter project details
- Wait for project to be created (2-3 minutes)
- **Status**: Pending

### ✅ Task 5: Run database schema from database.sql
- Navigate to SQL Editor in Supabase dashboard
- Copy contents of `src/lib/database.sql`
- Paste and execute SQL to create tables and policies
- **Status**: Pending

### ✅ Task 6: Configure authentication settings in Supabase
- Go to Authentication > Settings in Supabase
- Configure Site URL (will update later with production URL)
- Review authentication providers
- **Status**: Pending

### ✅ Task 7: Get API keys and connection details from Supabase
- Go to Settings > API in Supabase
- Copy Project URL
- Copy `anon public` key
- Copy `service_role secret` key (keep secure!)
- **Status**: Pending

### ✅ Task 8: Run database seeding script
- Update local `.env.local` with Supabase credentials
- Run `npm run seed` to populate database
- Verify data appears in Supabase dashboard
- **Status**: Pending

---

## Phase 3: Vercel Deployment Setup (15-20 min)

### ✅ Task 9: Connect GitHub repository to Vercel
- In Vercel dashboard, click "New Project"
- Import your GitHub repository
- Select root directory
- **Status**: Pending

### ✅ Task 10: Configure environment variables in Vercel
- In Vercel project settings, add environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_KEY`
  - `NODE_ENV=production`
- **Status**: Pending

### ✅ Task 11: Run initial deployment on Vercel
- Click "Deploy" in Vercel
- Wait for build to complete
- Note the generated URL
- **Status**: Pending

---

## Phase 4: Production Testing & Configuration (10-15 min)

### ✅ Task 12: Test deployed application functionality
- Visit deployed application URL
- Test idea generation
- Test basic navigation
- **Status**: Pending

### ✅ Task 13: Update Supabase settings with production domain
- Update Site URL in Supabase to Vercel domain
- Add domain to allowed origins
- **Status**: Pending

### ✅ Task 14: Verify authentication flows work in production
- Test user registration
- Test user login/logout
- Test saving and deleting ideas
- **Status**: Pending

---

## Phase 5: Optional Enhancements (10-15 min)

### ✅ Task 15: Set up custom domain (optional)
- In Vercel dashboard, go to Settings > Domains
- Add custom domain
- Configure DNS settings
- Update Supabase Site URL
- **Status**: Pending

### ✅ Task 16: Configure monitoring and error tracking (optional)
- Consider adding Sentry for error tracking
- Set up Vercel Analytics
- Monitor Supabase usage
- **Status**: Pending

---

## Important Notes

- **Never commit sensitive keys to version control**
- **Keep service keys secure and server-side only**
- **Test thoroughly before marking tasks complete**
- **Each phase builds on the previous one**

## Troubleshooting Resources

- Vercel deployment logs: Check in Vercel dashboard
- Supabase logs: Available in Supabase dashboard
- Application logs: Use browser developer tools
- Common issues documented in DEPLOYMENT.md

---

**Total Estimated Time**: 1-1.5 hours
**Current Status**: Ready to begin Phase 1