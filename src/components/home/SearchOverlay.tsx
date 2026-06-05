import React from "react";

interface SearchOverlayProps {
  isSearching: boolean;
  searchingFor: string;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isSearching, searchingFor }) => {
  if (!isSearching) return null;
  return (
    <div
      className="home-search-overlay"
      role="status"
      aria-live="assertive"
      aria-label="Searching recipes"
    >
      <div className="home-search-overlay__inner">
        <div className="home-search-overlay__scene">
          {["🥕", "🧅", "🌿", "🍅", "🫑", "🧄"].map((emoji, i) => (
            <span
              key={i}
              className="home-search-overlay__food"
              style={{ "--delay": `${i * 0.3}s` } as React.CSSProperties}
              aria-hidden="true"
            >
              {emoji}
            </span>
          ))}
          <div className="home-search-overlay__pot-wrap" aria-hidden="true">
            <div className="home-search-overlay__steam">
              <span /><span /><span />
            </div>
            <span className="home-search-overlay__pot">🍳</span>
          </div>
        </div>
        {searchingFor && (
          <p className="home-search-overlay__query">"{searchingFor}"</p>
        )}
        <h2 className="home-search-overlay__text">Cooking up your recipes…</h2>
        <div className="home-search-overlay__dots" aria-hidden="true">
          <span /><span /><span />
        </div>
      </div>
    </div>
  );
};
