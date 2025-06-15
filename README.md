# Nunflix Clone

## Project Description
This project is a functional clone of the Nunflix streaming website, built with a modern React front-end. The goal is to replicate the core functionalities and user experience of Nunflix, including content browsing, search, playback, and user-specific features like watch history and a personalized watchlist.

## Features Implemented
*   **Front-End Structure**: React Single Page Application (SPA) with routing for different sections.
*   **Navigation**: `Header` component with navigation links ("Streaming", "Discover") and a responsive side menu.
*   **Home Page**:
    *   **Hero Section**: Dynamic featured content display with "Watch Now" button, bookmark icon for "My List", and navigation dots. Prioritizes "How to Train Your Dragon" for demonstration.
    *   **Content Carousels**:
        *   "Continue Watching": Displays content with progress bars and episode information (dummy data).
        *   "Live Sports": Displays live event cards with "LIVE" tags (dummy data).
        *   "Trending": Toggle for "Day" and "Week" trending content from TMDB.
        *   "Netflix Picks", "Prime Shows", "Marvel Studios", "CW": Dynamically fetched content from TMDB based on production companies, with "Movies" and "TV Shows" toggles for studio-specific carousels.
        *   "Emotional Journeys": Dynamically fetched content from TMDB using the "Drama" genre.
*   **Content Pages**:
    *   `Movies.tsx` and `TVShows.tsx`: Display content from TMDB with genre filtering.
    *   `Streaming.tsx`: Polished page with hero/banner and demo live stream cards.
    *   `Discover.tsx`: A filtering hub with content type, genre, year, and sort-by options, including "Anime" (Animation genre).
*   **Search Functionality**: `SearchResults.tsx` groups results by type (Movies, TV Shows) and handles "no results found."
*   **Details Page (`Details.tsx`)**:
    *   Displays full content details including title, year, genre, rating, and plot.
    *   "Watch Now" button links to the player page.
    *   **Recommendations**: "More Like This" section powered by TMDB's recommendations API, displayed in a scrollable carousel using `ContentCarousel`.
    *   **Cast & Crew**: Fetches and displays cast and crew details from TMDB, presented in scrollable lists using reusable `PersonCard` components.
    *   **Loading State**: Implements a skeleton loader for a smoother user experience during data fetching.
*   **Player Page (`Player.tsx`)**:
    *   Modern video player with HLS.js support for `.m3u8` streams and `<iframe>` support for embed URLs.
    *   Back button for navigation.
    *   Initializes `hls.js` and includes a reminder to install it (`npm install hls.js`).
    *   Adds content to "Watch History" upon viewing.
*   **Subtitles Support**: Dynamically loads and displays `.vtt` subtitles for HLS streams (dummy subtitle URLs used for now).
*   **Monetization**: Placeholder `AdBanner.tsx` component integrated into Home and Details pages.
*   **Watch History**:
    *   `WatchHistory.tsx` page to view recently watched content.
    *   `watchHistory` state in `useStore.ts` with `localStorage` persistence.
    *   "Clear All" button to clear history.
*   **My List (Watchlist)**:
    *   `myList` state in `useStore.ts` with `localStorage` persistence.
    *   `addToMyList` and `removeFromMyList` actions.
    *   Bookmark icon in `HeroSection.tsx` to toggle content in/out of "My List".
    *   `MyList.tsx` page to display bookmarked content.
    *   "Clear All" button for "My List".

## Technologies Used
*   **Front-end**: React (with TypeScript)
*   **Styling**: Tailwind CSS
*   **State Management**: Zustand
*   **Routing**: React Router DOM
*   **Video Playback**: HLS.js (for HLS streams)
*   **API**: The Movie Database (TMDB) API

## Setup Instructions

### Prerequisites
*   Node.js (LTS version recommended)
*   npm or yarn

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-repo/nunflix-clone.git
    cd nunflix-clone
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```
    You might also need to install `hls.js` if it's not automatically installed:
    ```bash
    npm install hls.js
    # or
    yarn add hls.js
    ```

3.  **Set up TMDB API Key**:
    The project uses the TMDB API. Ensure your TMDB API key is available in `src/store/useStore.ts` (currently hardcoded as `4314ec40a0c67a8501b5b69e830c09d1`). In a production environment, this should be an environment variable.

4.  **Run the application**:
    ```bash
    npm start
    # or
    yarn start
    ```
    The application will typically open in your browser at `http://localhost:3000`.

## Future Enhancements
(Based on initial architectural analysis from `Indeed.md` and ongoing plans)
*   **User Authentication**: Implement user login/registration.
*   **Backend Integration**: Connect to a Node.js/Laravel backend for dynamic content management, user profiles, and more robust data handling.
*   **External Video Source Integration**: Implement a more sophisticated system for managing and integrating external video sources (cyberlockers, direct links) including robust error handling and fallback mechanisms.
*   **Advanced Search Filters**: Expand search capabilities with more granular filtering options (e.g., release year range, cast, crew).
*   **Personalized Recommendations**: Implement a recommendation engine based on user viewing habits.
*   **User Profiles & Playlists**: Allow users to create multiple profiles and curate custom playlists.
*   **Comments & Ratings**: Enable users to comment on and rate content.
*   **Live Streaming Features**: Enhance live sports section with real-time updates and more detailed event information.
*   **Payment Gateway Integration**: For subscription models or premium content.
*   **Containerization**: Dockerize the application for easier deployment.
*   **CI/CD Pipeline**: Set up automated deployment workflows.
*   **Optimized Performance**: Implement further performance optimizations for large datasets and heavy traffic.

Feel free to explore the codebase and contribute!
