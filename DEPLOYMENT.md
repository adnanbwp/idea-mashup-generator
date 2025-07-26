# Deployment Guide

This guide covers deploying the Idea Mashup Generator to production using Vercel and Supabase.

## Prerequisites

- [Vercel Account](https://vercel.com)
- [Supabase Account](https://supabase.com)
- GitHub repository with your code

## Database Setup (Supabase)

### 1. Create a New Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New project"
3. Choose your organization and fill in project details
4. Wait for the project to be created

### 2. Set Up Database Schema

1. Navigate to the SQL Editor in your Supabase dashboard
2. Copy the contents of `src/lib/database.sql`
3. Paste and execute the SQL to create tables and policies

### 3. Seed the Database

1. Get your environment variables from Supabase:
   - Go to Settings > API
   - Copy `Project URL` and `anon public` key
   - Copy `service_role secret` key (keep this secure!)

2. Update your local `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_KEY=your_service_key
   ```

3. Run the seed script:
   ```bash
   npm run seed
   ```

### 4. Configure Authentication

1. In Supabase dashboard, go to Authentication > Settings
2. Configure Site URL: `https://your-domain.vercel.app`
3. Add redirect URLs for authentication flows

## Application Deployment (Vercel)

### 1. Connect GitHub Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the root directory

### 2. Configure Environment Variables

In Vercel project settings, add these environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
NODE_ENV=production
```

### 3. Deploy

1. Click "Deploy" in Vercel
2. Wait for the build to complete
3. Your app will be available at the generated URL

## Post-Deployment Steps

### 1. Update Supabase Settings

1. In Supabase dashboard, update Site URL to your Vercel domain
2. Add your domain to allowed origins in Authentication settings

### 2. Test the Application

1. Visit your deployed application
2. Test idea generation
3. Test user registration and login
4. Verify saving and deleting ideas works

### 3. Set Up Custom Domain (Optional)

1. In Vercel dashboard, go to Settings > Domains
2. Add your custom domain
3. Configure DNS settings as instructed
4. Update Supabase Site URL to your custom domain

## Environment-Specific Configuration

### Development
```env
NODE_ENV=development
NEXT_PUBLIC_SUPABASE_URL=your_local_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
```

### Production
```env
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_KEY=your_production_service_key
```

## Monitoring and Maintenance

### 1. Set Up Error Monitoring

Consider adding Sentry for error tracking:
```bash
npm install @sentry/nextjs
```

### 2. Performance Monitoring

- Use Vercel Analytics for performance insights
- Monitor Supabase usage in the dashboard
- Set up alerts for high error rates

### 3. Database Maintenance

- Regularly backup your database
- Monitor storage usage
- Update RLS policies as needed

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check environment variables are set correctly
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Authentication Issues**
   - Verify Site URL in Supabase matches deployment URL
   - Check redirect URLs are configured
   - Ensure API keys are correct

3. **Database Connection Issues**
   - Verify Supabase project is running
   - Check API keys and URLs
   - Ensure database schema is properly set up

4. **CORS Issues**
   - Add your domain to Supabase allowed origins
   - Check API route configurations

### Getting Help

- Check Vercel deployment logs
- Review Supabase logs in the dashboard
- Use browser developer tools for client-side issues
- Check GitHub Actions for CI/CD issues

## Security Considerations

1. **Environment Variables**
   - Never commit sensitive keys to version control
   - Use different keys for development and production
   - Regularly rotate service keys

2. **Database Security**
   - Row Level Security policies are enabled
   - Service key is only used server-side
   - Regular security audits

3. **Application Security**
   - Input validation on all endpoints
   - Rate limiting implemented
   - HTTPS enforced in production