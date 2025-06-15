import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import SideMenu from './components/SideMenu';
import Home from './pages/Home';
import Movies from './pages/Movies';
import TVShows from './pages/TVShows';
import SearchResults from './pages/SearchResults';
import Details from './pages/Details';
import Player from './pages/Player';
import Streaming from './pages/Streaming';
import Discover from './pages/Discover';
import WatchHistory from './pages/WatchHistory';
import MyList from './pages/MyList';

const App: React.FC = () => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header toggleSideMenu={toggleSideMenu} />
      <SideMenu isOpen={isSideMenuOpen} onClose={toggleSideMenu} />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/tv-shows" element={<TVShows />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/details/:id" element={<Details />} />
          <Route path="/player/:id" element={<Player />} />
          <Route path="/streaming" element={<Streaming />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/watch-history" element={<WatchHistory />} />
          <Route path="/my-list" element={<MyList />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
