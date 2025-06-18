'use client'; // Add this for client-side hooks like useState, useEffect

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router'; // Import useRouter
import styles from './Header.module.css';
import { useAuthStore } from '@/stores/authStore'; // Added for auth state
import BurgerMenuPanel from '../BurgerMenuPanel/BurgerMenuPanel'; // Uncommented
import DropdownPanel, { DropdownLink } from '../DropdownPanel/DropdownPanel'; // Import DropdownPanel

const Header: React.FC = () => { // Re-adding the component definition
  const [show, handleShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false); // State for burger menu
  const [isSearchOpen, setIsSearchOpen] = useState(false); // State for search input visibility
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null); // State for active dropdown
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore(); // Get auth state

  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (dropdownName: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setActiveDropdown(dropdownName);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200); // Small delay to allow moving cursor to dropdown
  };

  const handleDropdownMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
  };


  // Sample data for dropdowns - can be moved to a separate file/constants
  const moviesDropdownItems: DropdownLink[] = [
    { name: 'Trending Movies', href: '/movies/trending' },
    { name: 'Popular Movies', href: '/movies/popular' },
    { name: 'Top Rated', href: '/movies/top_rated' },
    { name: 'Marvel Movies', href: '/movies/marvel' },
  ];
  const showsDropdownItems: DropdownLink[] = [
    { name: 'Popular Shows', href: '/shows/popular' },
    { name: 'Top Rated', href: '/shows/top_rated' },
  ];
  const streamingDropdownItems: DropdownLink[] = [
    { name: 'Netflix', href: '/streaming/netflix' },
    { name: 'Disney+', href: '/streaming/disney+' },
    { name: 'HBO Max', href: '/streaming/hbo_max' },
    { name: 'Apple TV+', href: '/streaming/apple_tv+' },
    { name: 'Prime Video', href: '/streaming/prime_video' },
    { name: 'Hulu', href: '/streaming/hulu' },
  ];
  const discoverDropdownItems: DropdownLink[] = [
    { name: 'Trending Today', href: '/discover' },
  ];

  const transitionNavBar = () => {
    if (window.scrollY > 100) {
      handleShow(true);
    } else {
      handleShow(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', transitionNavBar);
    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('scroll', transitionNavBar);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // Clear search input after submission
    }
  };

  const handleBurgerMenuToggle = () => {
    setIsBurgerMenuOpen(!isBurgerMenuOpen);
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen && searchQuery) { // If closing and there's a query, submit it
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    } else if (isSearchOpen && !searchQuery) { // If closing and no query, just close
      // do nothing, already closing
    }
  };


  return (
    <>
      <div className={`${styles.navbar} ${show ? styles.navbar_black : ''}`}>
        <div className={styles.navLeft}>
          <button onClick={handleBurgerMenuToggle} className={styles.burgerMenuButton}>
            ☰ {/* Unicode Burger Icon */}
          </button>
          <Link href="/" legacyBehavior>
            <a>
              <Image
                src="/nunflix-logo.png"
                alt="Nunflix Logo"
                width={100}
                height={40}
                unoptimized
              />
            </a>
          </Link>
          <nav className={styles.navLinks}>
            <div
              className={styles.navLinkContainer}
              onMouseEnter={() => handleMouseEnter('movies')}
              onMouseLeave={handleMouseLeave}
            >
              <Link href="/movies" legacyBehavior><a className={styles.navLinkItem}>Movies</a></Link>
              {activeDropdown === 'movies' && (
                <DropdownPanel
                  title="Movies"
                  items={moviesDropdownItems}
                  isOpen={activeDropdown === 'movies'}
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onLinkClick={() => setActiveDropdown(null)}
                />
              )}
            </div>
            <div
              className={styles.navLinkContainer}
              onMouseEnter={() => handleMouseEnter('shows')}
              onMouseLeave={handleMouseLeave}
            >
              <Link href="/tv" legacyBehavior><a className={styles.navLinkItem}>Shows</a></Link>
              {activeDropdown === 'shows' && (
                <DropdownPanel
                  title="Shows"
                  items={showsDropdownItems}
                  isOpen={activeDropdown === 'shows'}
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onLinkClick={() => setActiveDropdown(null)}
                />
              )}
            </div>
            <div
              className={styles.navLinkContainer}
              onMouseEnter={() => handleMouseEnter('streaming')}
              onMouseLeave={handleMouseLeave}
            >
              <Link href="/#" legacyBehavior><a className={styles.navLinkItem}>Streaming</a></Link> {/* Placeholder main link */}
              {activeDropdown === 'streaming' && (
                <DropdownPanel
                  title="Streaming"
                  items={streamingDropdownItems}
                  isOpen={activeDropdown === 'streaming'}
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onLinkClick={() => setActiveDropdown(null)}
                />
              )}
            </div>
            <div
              className={styles.navLinkContainer}
              onMouseEnter={() => handleMouseEnter('discover')}
              onMouseLeave={handleMouseLeave}
            >
              <Link href="/#" legacyBehavior><a className={styles.navLinkItem}>Discover</a></Link> {/* Placeholder main link */}
              {activeDropdown === 'discover' && (
                <DropdownPanel
                  title="Discover"
                  items={discoverDropdownItems}
                  isOpen={activeDropdown === 'discover'}
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onLinkClick={() => setActiveDropdown(null)}
                />
              )}
            </div>
          </nav>
        </div>

        <div className={styles.navRight}>
          <div className={styles.searchContainer}>
            <button onClick={handleSearchToggle} className={styles.searchToggleButton}>
              🔍 {/* Unicode Search Icon */}
            </button>
            {isSearchOpen && (
              <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search titles..."
                  className={styles.searchInput}
                  autoFocus
                />
              </form>
            )}
          </div>
          {isAuthenticated ? (
            <Link href="/profile" legacyBehavior>
              <a>
                <Image
                  className={styles.navbar_avatar}
                  src={user?.avatar_url || "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"} // Use user avatar or placeholder
                  alt="Profile Avatar"
                  width={30}
                  height={30}
                  unoptimized
                />
              </a>
            </Link>
          ) : (
            <Link href="/login" legacyBehavior>
              <a className={styles.loginButton}>Login</a>
            </Link>
          )}
        </div>
      </div>
      {isBurgerMenuOpen && <BurgerMenuPanel onClose={handleBurgerMenuToggle} />}
    </>
  );
};

export default Header;
