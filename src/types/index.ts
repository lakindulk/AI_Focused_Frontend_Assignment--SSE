export interface Recipe {
  id: string;
  title: string;
  description: string;
  image?: string;
  cookingTime: number;
  prepTime?: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  servings: number;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  ingredients: Ingredient[];
  instructions: string[];
  dietaryTags: string[];
  cuisineType?: string;
  aiTip?: string;
  aiMatchScore?: number;
  matchReasons?: string[];
  aiInsights?: AIInsight[];
  createdAt?: string;
}

export interface Ingredient {
  name: string;
  amount: string;
  unit?: string;
  optional?: boolean;
}

export interface AIInsight {
  type: 'nutrition' | 'substitution' | 'tip' | 'healthier';
  title: string;
  content: string;
  icon?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  recipeContext?: string;
  createdAt: number;
  updatedAt: number;
}

export interface MealPlan {
  id: string;
  weekStartDate: string;
  days: MealPlanDay[];
  totalCalories?: number;
  createdAt: number;
}

export interface MealPlanDay {
  day: string;
  breakfast: Recipe | null;
  lunch: Recipe | null;
  dinner: Recipe | null;
  snack?: Recipe | null;
}

export interface UserPreferences {
  dietaryRestrictions: string[];
  allergies: string[];
  calorieTarget?: number;
  cookingTimeMax?: number;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  cuisinePreferences: string[];
}

export interface SearchFilters {
  ingredients: string[];
  dietaryTags: string[];
  maxCookingTime?: number;
  maxCalories?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  cuisineType?: string;
  query?: string;
}

export interface AIResponse<T> {
  data: T;
  provider: string;
  model: string;
  tokensUsed?: number;
}

export interface AIConfig {
  provider: string;
  apiKey: string;
  model: string;
  baseUrl: string;
}
