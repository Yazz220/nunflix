# Progress

This document tracks the completed work, remaining tasks, current status, and known issues for the Nunflix project.

## Completed Phases

### Phase 0: Front-End & Project Setup
*   UI Clone: Pixel-perfect Next.js frontend for homepage, detail pages, search, watch.
*   Theming & UX: UI bug fixes, dark mode, responsive grid cards, filter bars.
*   Repo & Environment: Private GitHub repo initialized, .env wired for Supabase, TMDB, Sentry.

### Phase 1: Data Security & Schema
*   Supabase Schema: Tables created for titles, episodes, favorites, watchlist, progress, list_cache, media_cache.
*   Auth: Supabase Auth enabled and tested (sign-up/sign-in).
*   Row-Level Security: Implemented for favorites, watchlist, progress.

### Phase 2: Stream Resolver (P1)
*   API Route: `pages/api/stream/[id].ts` added.
*   Embed Discovery: Logic to loop through providers (Vidsrc, MultiEmbed), HEAD-check URLs, and return `stream_sources[]`.
*   Watch Page: `/watch/[id]` updated to fetch `stream_sources` and load the first working embed.

### Phase 3: API Façade (P2)
*   Frontpage: `/api/v1/frontpage` created, pulling from `list_cache` with TMDB fallback.
*   Title Details: `/api/v1/title/[id]` built, merging cached TMDB metadata, credits, videos, and `stream_sources`.
*   Search: `/api/v1/search` exposed, wrapping TMDB’s multi-search.
*   Discover: Completed with cached API for genres and functional UI (filters, infinite scroll).

### Phase 4: Ops & Hygiene (P3)
*   Scheduled Cache Refresh: Supabase Scheduled Function deployed (refreshes caches every 6h).
*   Error Monitoring: Sentry integrated (client + server), source maps uploaded, high-severity alerts set up.
*   Rate Limiting: Token-bucket middleware added on all `/api/v1/*` routes.

### Phase 5: DMCA Resilience
*   `embed_providers` Table: New Supabase table created with seeding migration and RLS.
*   Randomized Stream Resolver: `/api/stream/[id]` updated to fetch active providers, shuffle, and probe.
*   Provider Health-Check Job: Scheduled Supabase function deployed to check provider status.

## Recently Completed Tasks

*   **Pre-Launch Readiness Review:** Completed all tasks identified in the pre-launch readiness review.
    *   **Security Enhancements:**
        *   Enabled RLS for the `user_settings` table.
        *   Added HTTP security headers (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`).
    *   **CI/CD & Deployment Improvements:**
        *   Added database migration and Vercel deployment steps to the CI/CD pipeline.
    *   **Feature Implementation:**
        *   Implemented pagination for the search page.
        *   Implemented metadata strip actions on the watch page.
    *   **SEO & Analytics:**
        *   Created `robots.txt` and a dynamic `sitemap.xml`.
    *   **Performance Optimizations:**
        *   Improved user-facing error messages with a custom error page.
        *   Implemented lazy loading for carousels.
*   **Watch Page Layout Improvement:** Implemented a new two-column layout for the watch page, including a custom header, video player enhancements, and a server selector panel.
*   **Dynamic Category Pages:** Created dynamic routes (`/movies/[category]`, `/shows/[category]`, `/streaming/[provider]`) and a reusable `CategoryPage` component to display content based on slugs. Added loading spinners to these pages to handle initial router query state.
*   **TMDB API Key Update:** Updated the TMDB API key in `.env.local`.
*   **Frontpage API Enhancement:** Modified `/api/v1/frontpage.ts` to fetch data for multiple content sections from TMDB and implemented caching. Refactored data fetching directly into `getStaticProps` in `index.tsx` to improve reliability.
*   **Home Page Update:** Updated `pages/index.tsx` to render dynamic carousels based on the enhanced frontpage API.
*   **Fixed Hydration Error:** Removed nested `<a>` tags in `ContentCard.tsx` to resolve hydration errors on category pages.
*   **DMCA Resilience Enhancement:** Modified `supabase/functions/fallback-scraper/index.ts` to be optional, controlled by an `ENABLE_FALLBACK_SCRAPER` environment variable. Added `deno.json` to the scraper function for correct Deno environment configuration.
*   **CI/CD Pipeline:** (Completed) Created `.github/workflows/ci.yml` for automated linting, building, and Vercel deployment on `main` branch pushes and pull requests.
*   **User Profile Functionality:** (Completed) Implemented a `ProfilePage` component (`src/components/ProfilePage/ProfilePage.tsx`) and integrated it into `src/pages/profile.tsx`. Refactored the profile update logic to use the `/api/v1/profile/me` endpoint, improving security and maintainability. Implemented API routes for settings, history, favorites, and watchlist, and applied database migrations for user settings.
*   **Provider Logos on Home Page:** Updated `Carousel.tsx` to accept a `logoUrl` prop and `index.tsx` to pass TMDB image paths for provider logos, ensuring they display correctly. Removed `filter: brightness(0) invert(1)` from `Carousel.module.css` to prevent white logos from disappearing on dark backgrounds.
*   **ESLint Errors:** Fixed all ESLint errors to ensure a passing CI/CD pipeline.

## What's Left to Build (from PROJECT_SUMMARY.md)

*   All major features are complete.

## Current Status

The application is stable with a passing CI/CD pipeline. The core streaming application is functional with robust data handling, security, and DMCA resilience features. The user profile functionality is now complete. The application is ready for launch.

## Known Issues

*   None explicitly mentioned in `COMPLETED_TASKS.md` or `PROJECT_SUMMARY.md`.
