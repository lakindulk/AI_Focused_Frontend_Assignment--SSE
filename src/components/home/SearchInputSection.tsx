import React from "react";
import { FiMic, FiMicOff, FiZap, FiCamera, FiAlertCircle } from "react-icons/fi";
import { Input } from "@/components/ui/Input";
import { quickIngredients } from "@/services/mockData";

type PickerSource = "ingredient" | "image" | null;

interface SearchInputSectionProps {
  query: string;
  setQuery: (q: string) => void;
  isSearching: boolean;
  isListening: boolean;
  pickerSource: PickerSource;
  activeIngredient: string | null;
  imageInputRef: React.RefObject<HTMLInputElement>;
  onSubmit: (e: React.SyntheticEvent) => void;
  onVoiceSearch: () => void;
  onIngredientAdd: (tag: string) => void;
  onImageFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  voiceError?: string | null;
}

export const SearchInputSection: React.FC<SearchInputSectionProps> = ({
  query, setQuery, isSearching, isListening, pickerSource, activeIngredient,
  imageInputRef, onSubmit, onVoiceSearch, onIngredientAdd, onImageFileChange,
  voiceError,
}) => (
  <form onSubmit={onSubmit} className="home-search-wrapper">
    {/* Screen-reader-only live region announces voice listening state */}
    <div
      aria-live="assertive"
      aria-atomic="true"
      className="sr-only"
    >
      {isListening ? 'Listening… speak your search.' : ''}
    </div>

    <div className="home-search-input-row">
      <Input
        isSearch
        placeholder="Try: 'high protein dinner under 30 mins'…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="home-search-input-field"
        aria-label="Search recipes"
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="home-img-file-input"
        onChange={onImageFileChange}
        aria-label="Upload or take a photo of ingredients"
      />
      <button
        type="button"
        onClick={() => imageInputRef.current?.click()}
        className={`home-img-btn${pickerSource === "image" ? " home-img-btn--active" : ""}`}
        title="Take photo or upload ingredients"
        aria-label="Take photo or upload ingredients"
      >
        <FiCamera aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onVoiceSearch}
        className={`voice-search-btn ${isListening ? "voice-search-btn--listening" : ""}`}
        aria-label={isListening ? "Stop voice search" : "Start voice search"}
        aria-pressed={isListening}
      >
        {isListening ? <FiMicOff aria-hidden="true" /> : <FiMic aria-hidden="true" />}
      </button>
      <button
        type="submit"
        className="home-search-btn"
        disabled={!query.trim() || isSearching}
        aria-label="Search recipes"
      >
        <FiZap aria-hidden="true" /> Search
      </button>
    </div>

    {/* Voice permission / error message */}
    {voiceError && (
      <div className="voice-search-error" role="alert">
        <FiAlertCircle aria-hidden="true" />
        <span>{voiceError}</span>
      </div>
    )}

    <div className="home-quick-tags">
      <span className="home-quick-tags__label" id="quick-tags-label">Add ingredient:</span>
      <div
        className="home-quick-tags__container"
        role="group"
        aria-labelledby="quick-tags-label"
      >
        {quickIngredients.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => onIngredientAdd(tag)}
            className={`home-quick-tag${activeIngredient === tag ? " home-quick-tag--active" : ""}`}
            aria-pressed={activeIngredient === tag}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  </form>
);
