import React from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiArrowRight } from "react-icons/fi";
import { MdOutlineAutoAwesome, MdRocketLaunch } from "react-icons/md";
import { HiSparkles } from "react-icons/hi2";

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Tell AI What You Have",
    description: "Enter ingredients, dietary goals, or cravings in plain language.",
    icon: <FiSearch size={20} />,
  },
  {
    step: "02",
    title: "AI Generates Matches",
    description: "CookIT analyzes your input and returns perfectly matched recipes with nutritional details.",
    icon: <HiSparkles size={20} />,
  },
  {
    step: "03",
    title: "Cook With Confidence",
    description: "Follow step-by-step guidance, ask follow-up questions, and cook amazing meals.",
    icon: <MdRocketLaunch size={20} />,
  },
];

export const HowItWorksSection: React.FC = () => (
  <section className="home-how">
    <div className="home-how__inner">
      <div className="home-section-header">
        <span className="home-section-eyebrow">Simple 3-Step Process</span>
        <h2 className="home-section-title">How CookIT Works</h2>
      </div>
      <div className="home-how__steps">
        {HOW_IT_WORKS.map((step, idx) => (
          <div key={step.step} className="home-how-step">
            <div className="home-how-step__number">{step.step}</div>
            <div className="home-how-step__icon-wrap">{step.icon}</div>
            <h3 className="home-how-step__title">{step.title}</h3>
            <p className="home-how-step__desc">{step.description}</p>
            {idx < HOW_IT_WORKS.length - 1 && (
              <div className="home-how-step__arrow" aria-hidden="true">
                <FiArrowRight />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="home-how__cta">
        <Link
          to="/recommendations"
          className="home-cta-btn home-cta-btn--filled"
          style={{ fontSize: "15px" }}
        >
          <MdOutlineAutoAwesome />
          Start Cooking Now
        </Link>
      </div>
    </div>
  </section>
);
