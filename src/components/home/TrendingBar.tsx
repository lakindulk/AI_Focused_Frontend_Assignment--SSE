import React from "react";
import { FiTrendingUp } from "react-icons/fi";
import { trendingSearches } from "@/services/mockData";

interface TrendingBarProps {
  onSearch: (term: string) => void;
}

export const TrendingBar: React.FC<TrendingBarProps> = ({ onSearch }) => (
  <div className="home-trending">
    <span className="home-trending__title">
      <FiTrendingUp className="home-trending__icon" />
      Trending
    </span>
    <div className="home-trending__list">
      <div className="home-trending__track">
        {trendingSearches.map((item, idx) => (
          <span
            key={idx}
            role="button"
            tabIndex={0}
            className="home-trending__item"
            onClick={() => onSearch(item)}
            onKeyDown={(e) => e.key === "Enter" && onSearch(item)}
          >
            {item}
          </span>
        ))}
        {trendingSearches.map((item, idx) => (
          <span key={`dup-${idx}`} className="home-trending__item" aria-hidden="true">
            {item}
          </span>
        ))}
      </div>
    </div>
  </div>
);
