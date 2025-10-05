'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardBody, Button, Chip, Image } from '@heroui/react';
import { recipesApi } from '@/lib/api';
import { Recipe } from '@/types';
import { categoryLabels, difficultyLabels, getImageUrl } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

export default function RecipeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const user = useAuthStore((state) => state.user);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipe();
  }, [params.id]);

  const fetchRecipe = async () => {
    try {
      const data = await recipesApi.getOne(params.id as string);
      setRecipe(data);
    } catch (error) {
      console.error('Error fetching recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;

    try {
      await recipesApi.delete(params.id as string);
      router.push('/recipes');
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  if (loading) return <div className="container mx-auto p-4">Loading...</div>;
  if (!recipe)
    return <div className="container mx-auto p-4">Recipe not found</div>;

  const isOwner = user?.id === recipe.userId;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <Button variant="flat" onPress={() => router.back()}>
          Back
        </Button>
        {isOwner && (
          <div className="flex gap-2">
            <Button
              color="primary"
              onPress={() => router.push(`/recipes/${recipe.id}/edit`)}
            >
              Edit
            </Button>
            <Button color="danger" onPress={handleDelete}>
              Delete
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardBody className="gap-4">
          {recipe.photo && (
            <Image
              src={getImageUrl(recipe.photo)}
              alt={recipe.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          )}

          <h1 className="text-3xl font-bold">{recipe.title}</h1>

          <div className="flex gap-2 flex-wrap">
            <Chip color="primary">{categoryLabels[recipe.category]}</Chip>
            <Chip color="secondary">{difficultyLabels[recipe.difficulty]}</Chip>
            <Chip variant="flat">{recipe.cookingTime} min</Chip>
            <Chip variant="flat">{recipe.servings} servings</Chip>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">Ingredients</h2>
            <ul className="list-disc list-inside space-y-1">
              {recipe.ingredients.map((ing, index) => (
                <li key={index}>
                  {ing.amount} {ing.unit} {ing.name}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">Instructions</h2>
            <ol className="list-decimal list-inside space-y-2">
              {recipe.instructions.map((step, index) => (
                <li key={index} className="ml-2">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
