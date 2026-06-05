import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { MdOutlineAutoAwesome } from "react-icons/md";

export const BottomCTA: React.FC = () => (
  <section className="home-bottom-cta">
    <div className="home-bottom-cta__inner">
      <div className="home-bottom-cta__glow" aria-hidden="true" />
      <MdOutlineAutoAwesome className="home-bottom-cta__icon" />
      <h2 className="home-bottom-cta__title">Ready to Cook Something Amazing?</h2>
      <p className="home-bottom-cta__desc">
        Join thousands of home cooks discovering better meals with AI assistance.
      </p>
      <div className="home-bottom-cta__actions">
        <Link to="/recommendations" className="home-cta-btn home-cta-btn--filled">
          Explore Recipes <FiArrowRight />
        </Link>
        <Link to="/assistant" className="home-cta-btn home-cta-btn--light">
          Chat with CookIT
        </Link>
      </div>
    </div>
  </section>
);
