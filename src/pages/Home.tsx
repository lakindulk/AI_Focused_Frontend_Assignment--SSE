import React from "react";
import { useNavigate } from "react-router-dom";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useSearchStore } from "@/store/searchStore";
import { HeroSection } from "@/components/home/HeroSection";
import { TrendingBar } from "@/components/home/TrendingBar";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { BottomCTA } from "@/components/home/BottomCTA";

import "./Home.css";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { searchWithQuery } = useSearchStore();

  const handleSearch = async (term: string): Promise<void> => {
    searchWithQuery(term); // fires streaming search in background
    navigate("/recommendations");
  };

  return (
    <PageWrapper className="home-page">
      <HeroSection onSearch={handleSearch} isSearching={false} />
      <TrendingBar onSearch={handleSearch} />
      <FeaturesSection />
      <HowItWorksSection />
      <CategoriesSection onSearch={handleSearch} />
      <BottomCTA />
    </PageWrapper>
  );
};

export default Home;
