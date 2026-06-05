import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiHeart, FiCalendar, FiBookOpen } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import './MobileNav.css';

export const MobileNav: React.FC = () => {
  return (
    <nav className="mobile-nav">
      <div className="mobile-nav__container">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `mobile-nav__link ${isActive ? 'mobile-nav__link--active' : ''}`
          }
        >
          <FiHome className="mobile-nav__icon" />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/recommendations"
          className={({ isActive }) =>
            `mobile-nav__link ${isActive ? 'mobile-nav__link--active' : ''}`
          }
        >
          <FiBookOpen className="mobile-nav__icon" />
          <span>Recipes</span>
        </NavLink>

        <NavLink
          to="/assistant"
          className={({ isActive }) =>
            `mobile-nav__link mobile-nav__link--ai ${isActive ? 'mobile-nav__link--active' : ''}`
          }
        >
          <div className="mobile-nav__ai-btn-wrapper">
            <div className="mobile-nav__ai-btn">
              <HiSparkles />
            </div>
            <span className="mobile-nav__ai-label">Assistant</span>
          </div>
        </NavLink>

        <NavLink
          to="/favorites"
          className={({ isActive }) =>
            `mobile-nav__link ${isActive ? 'mobile-nav__link--active' : ''}`
          }
        >
          <FiHeart className="mobile-nav__icon" />
          <span>Favorites</span>
        </NavLink>

        <NavLink
          to="/meal-planner"
          className={({ isActive }) =>
            `mobile-nav__link ${isActive ? 'mobile-nav__link--active' : ''}`
          }
        >
          <FiCalendar className="mobile-nav__icon" />
          <span>Planner</span>
        </NavLink>
      </div>
    </nav>
  );
};
