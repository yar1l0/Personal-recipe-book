"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Select, SelectItem, Input } from '@heroui/react';
import { recipesApi } from '@/lib/api';
import { Recipe, Category, Difficulty } from '@/types';
import RecipeCard from '@/components/RecipeCard';
import { useAuthStore } from '@/store/authStore';

export default function RecipesPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    cookingTime: '',
  });

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (hasHydrated && isAuthenticated) {
      fetchRecipes();
    }
  }, [filters, isAuthenticated, hasHydrated]);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filters.category) params.category = filters.category;
      if (filters.difficulty) params.difficulty = filters.difficulty;
      if (filters.cookingTime) params.cookingTime = parseInt(filters.cookingTime);

      const data = await recipesApi.getAll(params);
      setRecipes(data.recipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!hasHydrated || !isAuthenticated) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Recipes</h1>
        <Button color="primary" onPress={() => router.push('/recipes/new')}>
          Create Recipe
        </Button>
      </div>

      <div className="flex gap-4 mb-6 flex-wrap">
        <Select
          label="Category"
          placeholder="All categories"
          className="max-w-xs"
          selectedKeys={filters.category ? [filters.category] : []}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string;
            setFilters({ ...filters, category: value || '' });
          }}
        >
          {Object.values(Category).map((cat) => (
            <SelectItem key={cat} textValue={cat}>
              {cat}
            </SelectItem>
          ))}
        </Select>

        <Select
          label="Difficulty"
          placeholder="All difficulties"
          className="max-w-xs"
          selectedKeys={filters.difficulty ? [filters.difficulty] : []}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string;
            setFilters({ ...filters, difficulty: value || '' });
          }}
        >
          {Object.values(Difficulty).map((diff) => (
            <SelectItem key={diff} textValue={diff}>
              {diff}
            </SelectItem>
          ))}
        </Select>

        <Input
          type="number"
          label="Max cooking time (min)"
          placeholder="60"
          className="max-w-xs"
          value={filters.cookingTime}
          onChange={(e) => setFilters({ ...filters, cookingTime: e.target.value })}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}