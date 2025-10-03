import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Category, Difficulty, MealType } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const categoryLabels: Record<Category, string> = {
  [Category.BREAKFAST]: 'Breakfast',
  [Category.LUNCH]: 'Lunch',
  [Category.DINNER]: 'Dinner',
  [Category.DESSERT]: 'Dessert',
};

export const difficultyLabels: Record<Difficulty, string> = {
  [Difficulty.EASY]: 'Easy',
  [Difficulty.MEDIUM]: 'Medium',
  [Difficulty.HARD]: 'Hard',
};

export const mealTypeLabels: Record<MealType, string> = {
  [MealType.BREAKFAST]: 'Breakfast',
  [MealType.LUNCH]: 'Lunch',
  [MealType.DINNER]: 'Dinner',
};

export const getImageUrl = (path?: string) => {
  if (!path) return '/placeholder-recipe.jpg';
  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  return `${baseURL}/${path}`;
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};