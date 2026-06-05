import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useSearchStore } from "@/store/searchStore";
import { HeroSection } from "@/components/home/HeroSection";
import { TrendingBar } from "@/components/home/TrendingBar";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { BottomCTA } from "@/components/home/BottomCTA";
import { SearchOverlay } from "@/components/home/SearchOverlay";

import "./Home.css";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { searchWithQuery } = useSearchStore();
  const [isSearching, setIsSearching] = useState(false);
  const [searchingFor, setSearchingFor] = useState("");

  const handleSearch = async (term: string) => {
    setIsSearching(true);
    setSearchingFor(term);
    try {
      await searchWithQuery(term);
      navigate("/recommendations");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <PageWrapper className="home-page">
      <HeroSection onSearch={handleSearch} isSearching={isSearching} />
      <TrendingBar onSearch={handleSearch} />
      <FeaturesSection />
      <HowItWorksSection />
      <CategoriesSection onSearch={handleSearch} />
      <BottomCTA />
      <SearchOverlay isSearching={isSearching} searchingFor={searchingFor} />
    </PageWrapper>
  );
};

export default Home;
