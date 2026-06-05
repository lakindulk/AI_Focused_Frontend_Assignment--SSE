import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBookOpen } from 'react-icons/fi';
import { RecipeCard } from './RecipeCard';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Recipe } from '@/types';
import './RecipeGrid.css';

const COOKING_MESSAGES = [
  'Searching recipes…',
  'Cooking up your results…',
  'AI is thinking…',
  'Tasting for quality…',
  'Almost ready…',
];

const FOOD_EMOJIS = ['🥕', '🧅', '🌿', '🍅', '🫑', '🧄', '🌶️', '🥦'];

const CookingLoader: React.FC = () => {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setMsgIdx((i) => (i + 1) % COOKING_MESSAGES.length);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="recipe-grid__cooking-loader" role="status" aria-label="Searching recipes">
      <div className="recipe-grid__cooking-scene">
        {FOOD_EMOJIS.slice(0, 6).map((emoji, i) => (
          <span
            key={i}
            className="recipe-grid__food-float"
            style={{ '--float-delay': `${i * 0.28}s`, '--float-pos': `${12 + i * 13}%` } as React.CSSProperties}
            aria-hidden="true"
          >
            {emoji}
          </span>
        ))}

        <div className="recipe-grid__cooking-pot" aria-hidden="true">
          <span className="recipe-grid__pot-emoji">🍳</span>
          <div className="recipe-grid__steam">
            <span /><span /><span />
          </div>
        </div>
      </div>

      <p className="recipe-grid__cooking-msg">
        {COOKING_MESSAGES[msgIdx]}
      </p>

      <div className="recipe-grid__cooking-dots" aria-hidden="true">
        <span /><span /><span />
      </div>
    </div>
  );
};

interface RecipeGridProps {
  recipes: Recipe[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptyTitle?: string;
  onEmptyAction?: () => void;
  emptyActionLabel?: string;
}

export const RecipeGrid: React.FC<RecipeGridProps> = ({
  recipes,
  isLoading = false,
  emptyMessage = "We couldn't find any recipes. Try adjusting your ingredients or preferences.",
  emptyTitle = "No Recipes Found",
  onEmptyAction,
  emptyActionLabel,
}) => {
  if (isLoading) {
    return <CookingLoader />;
  }

  if (!recipes || recipes.length === 0) {
    return (
      <EmptyState
        icon={<FiBookOpen />}
        title={emptyTitle}
        description={emptyMessage}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: 'easeOut' } },
  };

  return (
    <motion.div
      className="recipe-grid"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {recipes.map((recipe) => (
        <motion.div key={recipe.id} variants={itemVariants}>
          <RecipeCard recipe={recipe} />
        </motion.div>
      ))}
    </motion.div>
  );
};
