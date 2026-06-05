import React from "react";
import { FiSearch } from "react-icons/fi";
import { Input } from "@/components/ui/Input";

type SortOption = "recent" | "name" | "calories" | "time";

interface FavoritesFilterBarProps {
  searchQuery: string;
  sortBy: SortOption;
  onSearchChange: (val: string) => void;
  onSortChange: (val: SortOption) => void;
}

export const FavoritesFilterBar: React.FC<FavoritesFilterBarProps> = ({
  searchQuery, sortBy, onSearchChange, onSortChange,
}) => (
  <div className="favs-controls">
    <div className="favs-search-bar">
      <Input
        icon={<FiSearch />}
        placeholder="Search saved recipes..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>

    <div className="favs-sort">
      <span className="favs-sort__label">Sort by:</span>
      <select
        className="favs-sort__select"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
      >
        <option value="recent">Recently Added</option>
        <option value="name">Name</option>
        <option value="calories">Calories</option>
        <option value="time">Cooking Time</option>
      </select>
    </div>
  </div>
);
