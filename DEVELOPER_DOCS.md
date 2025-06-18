# Nunflix Developer Documentation

## 1. Introduction
This document provides all the necessary information for developers working on the Nunflix project. It covers the project architecture, setup instructions, and guidelines for common development tasks.

## 2. Getting Started

### Environment Setup
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-repo/nunflix.git
    cd nunflix/nunflix-nextjs-frontend
    ```
2.  **Install dependencies:**
    ```bash
    pnpm install
    ```
3.  **Set up environment variables:**
    *   Create a `.env.local` file in the `nunflix-nextjs-frontend` directory by copying the `.env.example` file.
    *   Fill in the required values for Supabase, TMDB, Sentry, etc.

### Running the App Locally
1.  **Start the development server:**
    ```bash
    pnpm dev
    ```
2.  The application will be available at `http://localhost:3000`.

### Seeding Initial Data
The initial data for `embed_providers` is seeded automatically when you apply the database migrations. To apply migrations, run:
```bash
npx supabase db push
```

## 3. Managing Embed Providers

### How to Add a New Provider
1.  **Database:** Add a new entry to the `embed_providers` table in your local Supabase instance or directly in the Supabase dashboard.
2.  **Scraper (Optional):** If the provider has a page with a list of embeds, you can add it to the `SCRAPE_TARGETS` array in the `fallback-scraper` function. The configuration for the scraper can be found at `nunflix-nextjs-frontend/supabase/functions/fallback-scraper/index.ts`.

## 4. Cache Management

### Overview
The application uses a two-level caching strategy in Supabase to minimize API calls to TMDB:
*   `list_cache`: Caches the results of list-based queries (e.g., frontpage, discover).
*   `media_cache`: Caches the detailed metadata for individual titles.

### Manual Cache Purge
To clear the cache for debugging purposes, you can run the following SQL commands in your Supabase SQL editor:
```sql
TRUNCATE TABLE list_cache;
TRUNCATE TABLE media_cache;
```

## 5. Database Migrations

### Overview
Database schema changes are managed using Supabase migrations. Migration files are stored in the `nunflix-nextjs-frontend/supabase/migrations` directory.

### Creating a New Migration
To create a new migration, use the Supabase CLI:
```bash
npx supabase migrations new <migration_name>
```
This will create a new SQL file in the `migrations` directory. Add your schema changes to this file.

### Applying Migrations
Migrations are applied automatically by the CI/CD pipeline. To apply migrations in your local development environment, run:
```bash
npx supabase db push