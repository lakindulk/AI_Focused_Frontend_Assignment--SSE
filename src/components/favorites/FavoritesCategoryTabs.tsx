import React from "react";

interface FavoritesCategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onSelect: (cat: string) => void;
}

export const FavoritesCategoryTabs: React.FC<FavoritesCategoryTabsProps> = ({
  categories, activeCategory, onSelect,
}) => (
  <div className="favs-categories">
    {categories.map((cat) => (
      <button
        key={cat}
        type="button"
        className={`favs-category-btn ${activeCategory === cat ? "favs-category-btn--active" : ""}`}
        onClick={() => onSelect(cat)}
      >
        {cat}
      </button>
    ))}
  </div>
);
