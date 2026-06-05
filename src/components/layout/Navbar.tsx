import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { FiMenu, FiHome, FiHeart, FiCalendar, FiMessageSquare, FiBookOpen } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { MdOutlineAutoAwesome } from 'react-icons/md';
import { NavbarDrawer } from './NavbarDrawer';
import logoSrc from '@/assets/logo.svg';
import './Navbar.css';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: <FiHome /> },
  { path: '/recommendations', label: 'Recipes', icon: <FiBookOpen /> },
  { path: '/favorites', label: 'Favorites', icon: <FiHeart /> },
  { path: '/meal-planner', label: 'Meal Planner', icon: <FiCalendar /> },
  { path: '/assistant', label: 'Assistant', icon: <FiMessageSquare /> },
];

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();
  const isApiKeyConfigured = !!import.meta.env.VITE_AI_API_KEY;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsDrawerOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
        <a href="#main-content" className="skip-to-content">Skip to content</a>
        <div className="navbar__container">
          <Link to="/" className="navbar__logo">
            <img
              src={logoSrc}
              alt=""
              aria-hidden="true"
              className="navbar__logo-icon"
            />
            <span className="navbar__logo-text">CookIT</span>
          </Link>

          <nav className="navbar__nav">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="navbar__right">
            <div className="navbar__status">
              <span className={`navbar__status-dot ${isApiKeyConfigured ? 'navbar__status-dot--active' : ''}`} />
              <span>{isApiKeyConfigured ? 'AI Connected' : 'Demo Mode'}</span>
              {isApiKeyConfigured && <HiSparkles style={{ color: 'var(--color-accent)', marginLeft: '2px' }} />}
            </div>
            <Link to="/assistant" className="navbar__cta">
              <MdOutlineAutoAwesome />
              Ask AI
            </Link>
            <button
              className="navbar__menu-btn"
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={isDrawerOpen}
              aria-controls="navbar-drawer"
            >
              <FiMenu />
            </button>
          </div>
        </div>
      </header>

      <NavbarDrawer
        isOpen={isDrawerOpen}
        navItems={NAV_ITEMS}
        isApiKeyConfigured={isApiKeyConfigured}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
};
