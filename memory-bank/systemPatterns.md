# System Patterns

This document describes the key design patterns and architectural decisions in the Nunflix project.

## Data Flow

*   **Data Fetching:** Data is fetched from the Supabase database using the `@supabase/supabase-js` client. The `@tanstack/react-query` library is used for managing server state, including caching, refetching, and optimistic updates.
*   **API Routes:** Next.js API routes are used to provide a backend for the frontend. These routes handle tasks such as searching, fetching content details, and managing user profiles.
*   **Edge Functions:** Supabase Edge Functions are used for tasks that need to be close to the user, such as the `provider-health-check` and `fallback-scraper`.

## Component Structure

*   **Reusable Components:** The project uses a component-based architecture. Reusable components are located in the `/src/components` directory.
*   **Styling:** CSS Modules are used for styling to ensure that styles are scoped to individual components.

## Database Schema

*   The database schema is defined in the SQL migration files located in `/supabase/migrations`.
*   Key tables include `titles`, `episodes`, `progress`, and `users`.
