import React from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

interface NavbarDrawerProps {
  isOpen: boolean;
  navItems: NavItem[];
  isApiKeyConfigured: boolean;
  onClose: () => void;
}

export const NavbarDrawer: React.FC<NavbarDrawerProps> = ({
  isOpen, navItems, isApiKeyConfigured, onClose,
}) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          className="navbar__drawer-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div
          id="navbar-drawer"
          className="navbar__drawer"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="navbar__drawer-header">
            <span className="navbar__logo-text" style={{ fontSize: "20px" }}>
              CookIT Menu
            </span>
            <button className="navbar__drawer-close" onClick={onClose} aria-label="Close menu">
              <FiX />
            </button>
          </div>

          <div className="navbar__drawer-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `navbar__drawer-link ${isActive ? "navbar__drawer-link--active" : ""}`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          <div className="navbar__status" style={{ display: "flex", marginTop: "auto" }}>
            <span className={`navbar__status-dot ${isApiKeyConfigured ? "navbar__status-dot--active" : ""}`} />
            <span>{isApiKeyConfigured ? "AI Online" : "Demo Mode"}</span>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);
