import React from "react";
import { Link } from "react-router-dom";
import {
  FiSearch, FiMessageSquare, FiCalendar, FiHeart, FiArrowRight,
} from "react-icons/fi";

const FEATURES = [
  {
    icon: <FiSearch size={24} />,
    title: "Smart Recipe Search",
    description: 'Search in plain English. "High-protein dinner under 30 mins" returns perfectly matched recipes instantly.',
    color: "orange",
    link: "/recommendations",
  },
  {
    icon: <FiMessageSquare size={24} />,
    title: "AI Cooking Assistant",
    description: "Chat with your personal chef. Ask about substitutions, techniques, nutrition, and get expert guidance.",
    color: "green",
    link: "/assistant",
  },
  {
    icon: <FiCalendar size={24} />,
    title: "Weekly Meal Planner",
    description: "Generate a personalized 7-day meal plan based on your dietary goals, budget, and taste preferences.",
    color: "blue",
    link: "/meal-planner",
  },
  {
    icon: <FiHeart size={24} />,
    title: "Save Favorites",
    description: "Build your personal cookbook. Save, organize, and filter your favorite recipes for quick access.",
    color: "red",
    link: "/favorites",
  },
];

export const FeaturesSection: React.FC = () => (
  <section className="home-features">
    <div className="home-features__inner">
      <div className="home-section-header">
        <span className="home-section-eyebrow">What CookIT Can Do</span>
        <h2 className="home-section-title">
          Everything You Need
          <br />
          to Cook Smarter
        </h2>
        <p className="home-section-desc">
          CookIT combines intelligent recipe discovery with a conversational cooking
          assistant, giving you a complete cooking companion in one place.
        </p>
      </div>
      <div className="home-features__grid">
        {FEATURES.map((feat) => (
          <Link
            key={feat.title}
            to={feat.link}
            className={`home-feature-card home-feature-card--${feat.color}`}
          >
            <div className="home-feature-card__icon-wrap">{feat.icon}</div>
            <h3 className="home-feature-card__title">{feat.title}</h3>
            <p className="home-feature-card__desc">{feat.description}</p>
            <span className="home-feature-card__cta">
              Explore <FiArrowRight />
            </span>
          </Link>
        ))}
      </div>
    </div>
  </section>
);
