# Project Summary

## Technology Stack & Architecture
- **Frontend:**
  - Next.js v15.3.3
  - Combination of SSR and SSG with ISR
  - CSS Modules
- **Backend & Data:**
  - Supabase Postgres v15
  - Edge Functions and Next.js API routes
- **DevOps & CI/CD:**
  - GitHub Actions for CI/CD
  - Vercel for hosting
- **Monitoring & Analytics:**
  - Sentry for error tracking

## Project Structure & Key Files
- **Repository Layout:**
  - `/pages`: Pages and API routes
  - `/components`: Reusable components
  - `/lib`: Utility functions and Supabase client
  - `/supabase/functions`: Supabase Edge Functions
  - `/supabase/migrations`: Database migrations
- **Critical Files:**
  - `discover.tsx`: Discover page
  - `/api/v1/discover.ts`: Discover API route
  - `.github/workflows/ci.yml`: CI/CD workflow

## Dependencies
- `@sentry/nextjs`
- `@supabase/supabase-js`
- `@tanstack/react-query`
- `@upstash/ratelimit`

## Detailed Requirements
- **API Contracts:** Defined in API route files
- **Function Behavior:** Some error handling and fallback logic, but could be improved
- **Data Models:** Defined in migration files

## What’s Next
- **User Profiles:** (In Progress) Complete the User Profile implementation by enhancing the UI and adding user settings.
- **Stabilize Application:** (In Progress) Fix all ESLint errors to ensure a passing CI/CD pipeline.
