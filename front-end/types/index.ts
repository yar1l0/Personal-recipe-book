export enum Category {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
  DESSERT = 'DESSERT',
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export enum MealType {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
}

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface Recipe {
  id: string;
  userId: string;
  title: string;
  category: Category;
  difficulty: Difficulty;
  cookingTime: number;
  servings: number;
  photo?: string;
  ingredients: Ingredient[];
  instructions: string[];
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name?: string;
    email: string;
  };
}

export interface RecipesResponse {
  recipes: Recipe[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MealPlan {
  id: string;
  userId: string;
  recipeId: string;
  date: string;
  mealType: MealType;
  createdAt: string;
  recipe: Recipe;
}

export interface ShoppingItem {
  id: string;
  shoppingListId: string;
  ingredient: string;
  amount: number;
  unit: string;
  checked: boolean;
}

export interface ShoppingList {
  id: string;
  userId: string;
  items: ShoppingItem[];
}