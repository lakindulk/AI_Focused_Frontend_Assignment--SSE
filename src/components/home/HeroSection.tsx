import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiStar } from "react-icons/fi";
import { MdOutlineAutoAwesome } from "react-icons/md";
import { HiSparkles } from "react-icons/hi2";
import { useSearchStore } from "@/store/searchStore";
import { generateRecipes, analyzeImageForRecipes } from "@/services/aiService";
import { compressImage } from "@/utils";
import { SearchInputSection } from "./SearchInputSection";
import { IngredientPicker } from "./IngredientPicker";
import type { Recipe } from "@/types";

const SUBTITLES = [
  "Find recipes based on ingredients you have.",
  "Ask for substitution tips or nutritional facts.",
  "Generate customized weekly meal plans with AI.",
  "Get step-by-step cooking guidance in real time.",
];

type PickerSource = "ingredient" | "image" | null;

interface HeroSectionProps {
  onSearch: (term: string) => Promise<void>;
  isSearching: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, isSearching }) => {
  const { query, setQuery, storeResults } = useSearchStore();
  const [subtitle, setSubtitle] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [pickerSource, setPickerSource] = useState<PickerSource>(null);
  const [activeIngredient, setActiveIngredient] = useState<string | null>(null);
  const [pickerRecipes, setPickerRecipes] = useState<Recipe[]>([]);
  const [isPickerLoading, setIsPickerLoading] = useState(false);
  const [detectedIngredients, setDetectedIngredients] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const generationRef = useRef(0);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let loopIdx = 0, charIdx = 0, isDeleting = false;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const current = SUBTITLES[loopIdx];
      if (isDeleting) { setSubtitle(current.substring(0, charIdx - 1)); charIdx--; }
      else { setSubtitle(current.substring(0, charIdx + 1)); charIdx++; }
      let delay = 55;
      if (!isDeleting && charIdx === current.length) { delay = 2800; isDeleting = true; }
      else if (isDeleting && charIdx === 0) { isDeleting = false; loopIdx = (loopIdx + 1) % SUBTITLES.length; delay = 400; }
      else if (isDeleting) { delay = 28; }
      timer = setTimeout(tick, delay);
    };
    tick();
    return () => clearTimeout(timer);
  }, []);

  const openPicker = () =>
    setTimeout(() => pickerRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 120);

  const closePicker = () => {
    setPickerSource(null);
    setActiveIngredient(null);
    setPickerRecipes([]);
    setDetectedIngredients([]);
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleSearchSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    await onSearch(query);
  };

  const handleIngredientAdd = async (ingredient: string) => {
    if (pickerSource === "ingredient" && activeIngredient === ingredient && pickerRecipes.length > 0 && !isPickerLoading) {
      closePicker();
      return;
    }
    const gen = ++generationRef.current;
    setPickerSource("ingredient");
    setActiveIngredient(ingredient);
    setPickerRecipes([]);
    setDetectedIngredients([]);
    setImagePreview(null);
    setIsPickerLoading(true);
    openPicker();
    try {
      const recipes = await generateRecipes(ingredient);
      if (gen !== generationRef.current) return;
      setPickerRecipes(recipes);
      storeResults(recipes);
    } finally {
      if (gen === generationRef.current) setIsPickerLoading(false);
    }
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    const gen = ++generationRef.current;
    setPickerSource("image");
    setActiveIngredient(null);
    setPickerRecipes([]);
    setDetectedIngredients([]);
    setIsPickerLoading(true);
    openPicker();
    try {
      const { base64, mimeType } = await compressImage(file);
      if (gen !== generationRef.current) return;
      const { detectedIngredients: found, recipes } = await analyzeImageForRecipes(base64, mimeType);
      if (gen !== generationRef.current) return;
      setDetectedIngredients(found);
      setPickerRecipes(recipes);
      storeResults(recipes);
    } finally {
      if (gen === generationRef.current) setIsPickerLoading(false);
    }
  };

  const handleVoiceSearch = () => {
    setVoiceError(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsListening(true);
      setTimeout(() => { setQuery("healthy high protein salmon dinner"); setIsListening(false); }, 2000);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setIsListening(true);
    recognition.onerror = (event: any) => {
      setIsListening(false);
      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        setVoiceError('Microphone access denied. Please allow microphone access in your browser settings.');
      } else if (event.error === 'no-speech') {
        setVoiceError('No speech detected. Please try again.');
      } else if (event.error === 'network') {
        setVoiceError('Network error during voice recognition. Please check your connection.');
      }
    };
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      setVoiceError(null);
      setQuery(event.results[0][0].transcript);
    };
    if (isListening) recognition.stop();
    else recognition.start();
  };

  return (
    <section className="home-hero">
      <div className="home-hero__stripe-bg" aria-hidden="true" />
      <div className="home-hero__glow home-hero__glow--1" aria-hidden="true" />
      <div className="home-hero__glow home-hero__glow--2" aria-hidden="true" />

      <div className="home-hero__inner">
        <div className="home-hero__figure home-hero__figure--left" aria-hidden="true">
          <div className="home-hero__fig-frame">
            <img
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=520&fit=crop&q=80"
              alt=""
              className="home-hero__fig-img"
              loading="eager"
            />
          </div>
          <div className="home-stat-badge home-stat-badge--customers">
            <span className="home-stat-badge__emoji">😊</span>
            <div className="home-stat-badge__info">
              <span className="home-stat-badge__num">50k+</span>
              <span className="home-stat-badge__label">Happy Cooks</span>
            </div>
          </div>
        </div>

        <div className="home-hero__text">
          <div className="home-hero__eyebrow">
            <span className="home-hero__eyebrow-dot" aria-hidden="true" />
            AI-Powered Cooking
            <span className="home-hero__eyebrow-badge">BETA</span>
          </div>
          <h1 className="home-hero__title">
            Your <span className="home-hero__title-light">Personal</span>
            <br />
            <span className="home-hero__title-outline">AI</span>{" "}
            <span className="home-hero__title-accent">Chef</span>
            <br />
            Always <strong>Ready</strong>
          </h1>
          <p className="home-hero__subtitle">
            {subtitle}
            <span className="home-hero__cursor" aria-hidden="true">|</span>
          </p>

          <SearchInputSection
            query={query}
            setQuery={setQuery}
            isSearching={isSearching}
            isListening={isListening}
            pickerSource={pickerSource}
            activeIngredient={activeIngredient}
            imageInputRef={imageInputRef}
            onSubmit={handleSearchSubmit}
            onVoiceSearch={handleVoiceSearch}
            onIngredientAdd={handleIngredientAdd}
            onImageFileChange={handleImageFileChange}
            voiceError={voiceError}
          />

          {pickerSource && (
            <IngredientPicker
              pickerRef={pickerRef}
              pickerSource={pickerSource}
              imagePreview={imagePreview}
              isPickerLoading={isPickerLoading}
              detectedIngredients={detectedIngredients}
              activeIngredient={activeIngredient}
              pickerRecipes={pickerRecipes}
              onClose={closePicker}
            />
          )}

          <div className="home-cta-row">
            <Link to="/recommendations" className="home-cta-btn home-cta-btn--outline">
              Browse Recipes <FiArrowRight />
            </Link>
            <Link to="/assistant" className="home-cta-btn home-cta-btn--filled">
              <MdOutlineAutoAwesome /> Ask AI Chef
            </Link>
          </div>

          <div className="home-trust-row">
            <span className="home-trust-item">
              <FiStar className="home-trust-icon" />
              4.9 rating
            </span>
            <span className="home-trust-sep" />
            <span className="home-trust-item">500+ AI recipes</span>
            <span className="home-trust-sep" />
            <span className="home-trust-item">Free to use</span>
          </div>
        </div>

        <div className="home-hero__figure home-hero__figure--right" aria-hidden="true">
          <div className="home-hero__fig-frame home-hero__fig-frame--short">
            <img
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=460&fit=crop&q=80"
              alt=""
              className="home-hero__fig-img"
              loading="eager"
            />
          </div>
          <div className="home-stat-badge home-stat-badge--recipes">
            <span className="home-stat-badge__emoji">🍽️</span>
            <div className="home-stat-badge__info">
              <span className="home-stat-badge__num">500+</span>
              <span className="home-stat-badge__label">AI Recipes</span>
            </div>
          </div>
          <div className="home-ai-badge">
            <HiSparkles />
            <span>AI Powered</span>
          </div>
        </div>
      </div>
    </section>
  );
};
