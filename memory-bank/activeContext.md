# Active Context

This document captures the current work focus, recent changes, next steps, and important decisions for the Nunflix project.

## Current Work Focus

The current focus is on enhancing the home page with dynamic content sections, improving the watch page layout, and implementing user profiles.

## Recent Changes

*   **Watch Page Layout:** Implemented a new two-column layout for the watch page, including a custom header, video player enhancements, and a server selector panel.
*   **Dynamic Category Pages:** Created dynamic routes (`/movies/[category]`, `/shows/[category]`, `/streaming/[provider]`) and a reusable `CategoryPage` component to display content based on slugs. Added loading spinners to these pages to handle initial router query state.
*   **TMDB API Key:** Updated the TMDB API key in `.env.local`.
*   **Frontpage API Enhancement:** Modified `/api/v1/frontpage.ts` to fetch data for multiple content sections from TMDB and implemented caching.
*   **Home Page Update:** Updated `pages/index.tsx` to render dynamic carousels based on the enhanced frontpage API.
*   **Fixed Hydration Error:** Removed nested `<a>` tags in `ContentCard.tsx` to resolve hydration errors on category pages.
*   **DMCA Resilience Enhancement:** Modified `supabase/functions/fallback-scraper/index.ts` to be optional, controlled by an `ENABLE_FALLBACK_SCRAPER` environment variable. Added `deno.json` to the scraper function for correct Deno environment configuration.
*   **CI/CD Pipeline:** (Completed) Created `.github/workflows/ci.yml` for automated linting, building, and Vercel deployment on `main` branch pushes and pull requests.
*   **User Profile Functionality:** Implemented a `ProfilePage` component (`src/components/ProfilePage/ProfilePage.tsx`) and integrated it into `src/pages/profile.tsx`. Confirmed `src/pages/api/v1/profile/me.ts` handles profile updates.
*   **Provider Logos on Home Page:** Updated `Carousel.tsx` to accept a `logoUrl` prop and `index.tsx` to pass TMDB image paths for provider logos, ensuring they display correctly. Removed `filter: brightness(0) invert(1)` from `Carousel.module.css` to prevent white logos from disappearing on dark backgrounds.

## Next Steps

1.  Continue with any remaining tasks from the project plan.

## Important Patterns and Preferences

*   Next.js for frontend development.
*   Supabase for backend and database.
*   Component-based architecture.
*   CSS Modules for styling.
*   Dynamic routing for content categories.
*   TMDB integration for content data.
*   Caching for API responses.
*   GitHub Actions for CI/CD.
*   Zustand for state management.

## Learnings and Project Insights

*   The project uses a hybrid approach for the backend with Supabase Edge Functions and Next.js API routes.
*   There's a clear focus on improving resilience and automation.
*   Dynamic routing and API enhancements are crucial for scalability.
*   Careful management of Next.js data fetching (e.g., `getStaticProps`) is essential to avoid runtime errors and ensure reliable data loading.
*   Debugging frontend rendering issues (hydration errors, image loading) requires inspecting both browser console logs and server-side terminal output.
*   Directly downloading external assets can be problematic due to hotlinking restrictions; using reliable CDN paths (like TMDB's) is often more robust.
