# Nunflix

Nunflix is a modern, feature-rich media streaming clone built with Next.js and Supabase. It allows users to discover movies and TV shows, view detailed information (cast, trailers, similar content), stream content via third-party embeds, and manage personalized profiles.

## Features

- **Content Discovery:**  
  - Browse and filter movies and TV shows by genre or sorted criteria.  
  - Infinite scroll for seamless browsing of large catalogs.

- **Detailed Content Pages:**  
  - Overview and synopsis  
  - Release date, runtime, and status  
  - Cast and crew information  
  - Trailers (YouTube embeds)  
  - Similar titles recommendations  
  - Episode listings for TV shows with direct play options

- **Video Playback:**  
  - Dynamic stream resolver that probes multiple third-party embed providers (Vidsrc.to, MultiEmbed, etc.)  
  - Mirror rotation and health checks for resilient playback  

- **User Profiles & Personalization:**  
  - Sign up / Sign in (Supabase Auth)  
  - View and edit avatar, display name, and bio  
  - Favorite and watchlist management  
  - Resume playback from saved positions

- **API Façade & Caching:**  
  - Versioned routes under `/api/v1/*` (frontpage, discover, search, genres, title, profile)  
  - Cached metadata in Supabase (`list_cache`, `media_cache`) with configurable TTL  

- **DMCA Resilience:**  
  - `embed_providers` table with full-URL entries  
  - Scheduled health-check job to disable dead providers  
  - Nightly fallback scraper to auto-discover new embed URLs

- **Operations & Monitoring:**  
  - GitHub Actions CI for lint, tests, build, and deploy to Vercel  
  - Supabase Edge Functions for cron jobs and migrations  
  - Sentry integration for error tracking and alerts  
  - Rate limiting on public API routes  

- **Responsive Design:**  
  - Mobile-first layouts and dark mode via CSS Modules  

## Technology Stack

- **Next.js (v15.3.3)** — SSR, SSG, ISR  
- **Supabase Postgres (v15)** — Database, Auth, Edge Functions  
- **TMDB API** — Metadata source  
- **React Query** (`@tanstack/react-query`) — Data fetching & caching  
- **CSS Modules** — Scoped styling  
- **TypeScript** — Type safety  
- **Bun** — Runtime, bundler, and package manager  
- **Sentry** — Error tracking  
- **Upstash Rate Limit** (`@upstash/ratelimit`) — Abuse protection  

## Setup Instructions

### Prerequisites

- Git  
- Node.js (v18+) or [Bun](https://bun.sh) (recommended)  
- Supabase CLI

### 1. Clone & Install

```bash
git clone https://github.com/YazidOuldFouda/nunflix.git
cd nunflix/nunflix-nextjs-frontend
bun install

### 2. Set Up Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env.local
```

You will need to populate this file with your keys for Supabase, TMDB, Sentry, etc.

### 3. Apply Database Migrations

Push the database schema to your Supabase project:

```bash
npx supabase db push
```

### 4. Run the Development Server

```bash
bun dev
```
