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

*   **Watch Page Layout Improvement:** Implemented a new two-column layout for the watch page, including a custom header, video player enhancements, and a server selector panel.
*   **Dynamic Category Pages:** Created dynamic routes (`/movies/[category]`, `/shows/[category]`, `/streaming/[provider]`) and a reusable `CategoryPage` component to display content based on slugs. Added loading spinners to these pages to handle initial router query state.
*   **TMDB API Key Update:** Updated the TMDB API key in `.env.local`.
*   **Frontpage API Enhancement:** Modified `/api/v1/frontpage.ts` to fetch data for multiple content sections from TMDB and implemented caching. Refactored data fetching directly into `getStaticProps` in `index.tsx` to improve reliability.
*   **Home Page Update:** Updated `pages/index.tsx` to render dynamic carousels based on the enhanced frontpage API.
*   **Fixed Hydration Error:** Removed nested `<a>` tags in `ContentCard.tsx` to resolve hydration errors on category pages.
*   **DMCA Resilience Enhancement:** Modified `supabase/functions/fallback-scraper/index.ts` to be optional, controlled by an `ENABLE_FALLBACK_SCRAPER` environment variable. Added `deno.json` to the scraper function for correct Deno environment configuration.
*   **CI/CD Pipeline:** (Completed) Created `.github/workflows/ci.yml` for automated linting, building, and Vercel deployment on `main` branch pushes and pull requests.
*   **User Profile Functionality:** Implemented a `ProfilePage` component (`src/components/ProfilePage/ProfilePage.tsx`) and integrated it into `src/pages/profile.tsx`. Refactored the profile update logic to use the `/api/v1/profile/me` endpoint, improving security and maintainability.
*   **Provider Logos on Home Page:** Updated `Carousel.tsx` to accept a `logoUrl` prop and `index.tsx` to pass TMDB image paths for provider logos, ensuring they display correctly. Removed `filter: brightness(0) invert(1)` from `Carousel.module.css` to prevent white logos from disappearing on dark backgrounds.

## What's Left to Build (from PROJECT_SUMMARY.md)

*   **DMCA Resilience:** Implement optional fallback scraping (already partially done with `fallback-scraper` function).
*   **CI/CD & Deployment:** (Completed) Create a workflow that lints/tests on PRs and auto-deploys main.
*   **User Profiles:** (Completed) Add user profiles.

## Current Status

The core streaming application is functional with robust data handling, security, and DMCA resilience features. The primary remaining tasks involve further enhancing DMCA resilience, setting up automated deployment, and implementing user profiles. The home page and watch page have been significantly improved.

## Known Issues

*   None explicitly mentioned in `COMPLETED_TASKS.md` or `PROJECT_SUMMARY.md`.
