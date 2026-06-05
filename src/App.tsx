import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { MobileNav } from '@/components/layout/MobileNav';
import { Home } from '@/pages/Home';
import { Recommendations } from '@/pages/Recommendations';
import { RecipeDetail } from '@/pages/RecipeDetail';
import { Favorites } from '@/pages/Favorites';
import { Assistant } from '@/pages/Assistant';
import { MealPlanner } from '@/pages/MealPlanner';
import { DesignSystem } from '@/pages/UI/DesignSystem';

export default function App() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/meal-planner" element={<MealPlanner />} />
          <Route path="/design-system" element={<DesignSystem />} />
        </Routes>
      </AnimatePresence>
      <MobileNav />
    </>
  );
}
