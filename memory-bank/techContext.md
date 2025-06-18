# Technical Context

This document details the technologies, architecture, and development practices used in the Nunflix project.

## Technology Stack

*   **Frontend:**
    *   Next.js v15.3.3
    *   React
    *   CSS Modules
*   **Backend & Data:**
    *   Supabase
        *   Postgres v15
        *   Edge Functions (Deno)
    *   Next.js API Routes
*   **Dependencies:**
    *   `@sentry/nextjs`
    *   `@supabase/supabase-js`
    *   `@tanstack/react-query`
    *   `@upstash/ratelimit`

## Architecture

*   **Frontend:** The frontend is a Next.js application that uses a combination of Server-Side Rendering (SSR) and Static Site Generation (SSG) with Incremental Static Regeneration (ISR).
*   **Backend:** The backend is a mix of Supabase Edge Functions and Next.js API routes. This hybrid approach allows for both serverless functions and traditional API endpoints.
*   **Database:** A Postgres database managed by Supabase is used for data storage.

## Development Setup

*   **Package Manager:** The project uses `bun` for package management.
*   **Linting:** ESLint is used for linting.
*   **Formatting:** Biome is used for code formatting.
