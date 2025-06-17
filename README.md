# Nunflix

Nunflix is a modern, feature-rich media streaming clone built with Next.js and Supabase. It allows users to discover movies and TV shows, view detailed information (cast, trailers, similar content), and stream content.

## Features

*   **Content Discovery:** Browse and filter movies and TV shows by genre.
*   **Detailed Content Pages:** View comprehensive details for each title, including:
    *   Overview and synopsis
    *   Release date and runtime
    *   Cast and crew information
    *   Trailers and video clips (from YouTube)
    *   Similar titles recommendations
    *   Episode listings for TV shows with direct play options
*   **Video Playback:** Seamless streaming experience for selected content.
*   **Pagination & Sorting:** Navigate through extensive content libraries with ease.
*   **User Authentication (Planned/Future):** Placeholder for authentication features.
*   **Responsive Design:** Optimized for various screen sizes.

## Technologies Used

*   **Next.js:** A React framework for production-grade applications.
*   **Supabase:** An open-source Firebase alternative providing a Postgres database, authentication, and storage.
*   **TMDB (The Movie Database) API:** Used to fetch rich movie and TV show metadata.
*   **ReactPlayer:** A versatile React component for playing various media URLs.
*   **Bun:** A fast all-in-one JavaScript runtime, bundler, test runner, and package manager.
*   **TypeScript:** For type safety and improved developer experience.
*   **CSS Modules:** For scoped component styling.

## Setup Instructions

Follow these steps to get your Nunflix project up and running locally.

### Prerequisites

*   **Git:** For cloning the repository.
*   **Node.js & npm/Yarn/Bun:** Make sure you have Node.js installed. Bun is recommended for this project.
    *   [Install Bun](https://bun.sh/docs/installation)
*   **Supabase CLI:** Although some database operations can be done through the Supabase UI, having the CLI is beneficial.
    *   [Install Supabase CLI](https://supabase.com/docs/guides/cli/getting-started)

### 1. Clone the Repository

```bash
git clone https://github.com/YazidOuldFouda/nunflix.git
cd nunflix/nunflix-nextjs-frontend
```

### 2. Environment Variables

Create a `.env.local` file in the `nunflix-nextjs-frontend` directory (if it doesn't exist) and add your Supabase and TMDB API keys:

```
NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
SUPABASE_SERVICE_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY"
TMDB_API_KEY="YOUR_TMDB_API_KEY"
```

*   **`NEXT_PUBLIC_SUPABASE_URL`**: Find this in your Supabase project settings -> API. It looks like `https://your-project-ref.supabase.co`.
*   **`SUPABASE_SERVICE_KEY`**: Found in your Supabase project settings -> API -> Project API keys. Use the `service_role` key. **Keep this key secret!**
*   **`TMDB_API_KEY`**: Obtain this from [The Movie Database API](https://www.themoviedb.org/documentation/api). Sign up, go to settings -> API, and request a Developer API key.

### 3. Install Dependencies

Navigate to the `nunflix-nextjs-frontend` directory and install the project dependencies using Bun:

```bash
bun install
```

### 4. Database Setup (Supabase)

Before populating data, ensure your Supabase project has the necessary tables.

*   **Link Supabase Project:**
    ```bash
    cd supabase # Navigate to the supabase directory
    supabase login # Log in to your Supabase account
    supabase link --project-ref YOUR_SUPABASE_PROJECT_REF # Link your local project to your Supabase project
    ```
    (Replace `YOUR_SUPABASE_PROJECT_REF` with the reference from your Supabase project URL, e.g., `kveihttvszgvmzzvnmqo`).

*   **Run Migrations:** Apply the database schema migrations.
    ```bash
    supabase db push
    ```
    If you encounter "relation already exists" errors, you might need to drop the tables or selectively run migrations. Refer to Supabase documentation for advanced migration handling.

*   **Populate Data:** Run the script to populate your `titles` and `episodes` tables with data, enriched from TMDB.
    ```bash
    cd .. # Go back to nunflix-nextjs-frontend
    bun run scripts/populate_db.ts
    ```
    This script fetches data from `db.json` and enriches it with details from the TMDB API before inserting into Supabase.

### 5. Run the Development Server

Once the database is set up and populated, start the Next.js development server:

```bash
bun dev
```

The application should now be accessible at `http://localhost:3000`.

## Project Structure

*   `nunflix-nextjs-frontend/`: The main Next.js application.
    *   `src/pages/`: Next.js pages (routes) for the application.
    *   `src/components/`: Reusable React components.
    *   `src/lib/`: Utility functions and Supabase client setup.
    *   `src/stores/`: Zustand stores for state management.
    *   `src/styles/`: Global and module-specific CSS.
    *   `scripts/`: Scripts for database population (`populate_db.ts`).
    *   `supabase/`: Supabase CLI configuration and migration files.

## Usage

*   Open your browser to `http://localhost:3000`.
*   Browse movies and TV shows.
*   Click on a title to see its detailed page.
*   For TV shows, select seasons to view episodes.
*   Click the "Play" button to stream content (if a valid `embed_url` is available from your `db.json` or source).

## Contributing

Contributions are welcome! If you find a bug or want to suggest an enhancement, please open an issue or submit a pull request. 