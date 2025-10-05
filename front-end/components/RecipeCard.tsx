"use client";

import { Card, CardBody, CardFooter, Image, Chip } from '@heroui/react';
import { Recipe } from '@/types';
import { categoryLabels, difficultyLabels, getImageUrl } from '@/lib/utils';

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <a href={`/recipes/${recipe.id}`}    >
      <Card isPressable isHoverable className="w-full">
        <CardBody className="p-0 w-full ">
          <Image
            src={getImageUrl(recipe.photo)}
            alt={recipe.title}
            removeWrapper
            className="w-full h-48 object-cover max-w-full "
          />
        </CardBody>
        <CardFooter className="flex flex-col items-start gap-2">
          <h3 className="font-bold text-lg">{recipe.title}</h3>
          <div className="flex gap-2 flex-wrap">
            <Chip size="sm" color="primary">
              {categoryLabels[recipe.category]}
            </Chip>
            <Chip size="sm" color="secondary">
              {difficultyLabels[recipe.difficulty]}
            </Chip>
            <Chip size="sm" variant="flat">
              {recipe.cookingTime} min
            </Chip>
          </div>
        </CardFooter>
      </Card>
    </a>
  );
}