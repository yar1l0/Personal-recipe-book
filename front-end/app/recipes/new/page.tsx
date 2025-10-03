"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, Input, Button, Select, SelectItem, Textarea } from '@heroui/react';
import { recipesApi } from '@/lib/api';
import { Category, Difficulty } from '@/types';

export default function NewRecipePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: Category.LUNCH,
    difficulty: Difficulty.MEDIUM,
    cookingTime: '',
    servings: '',
    ingredients: [{ name: '', amount: '', unit: '' }],
    instructions: [''],
  });

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { name: '', amount: '', unit: '' }],
    });
  };

  const removeIngredient = (index: number) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index),
    });
  };

  const updateIngredient = (index: number, field: string, value: string) => {
    const updated = [...formData.ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, ingredients: updated });
  };

  const addInstruction = () => {
    setFormData({ ...formData, instructions: [...formData.instructions, ''] });
  };

  const removeInstruction = (index: number) => {
    setFormData({
      ...formData,
      instructions: formData.instructions.filter((_, i) => i !== index),
    });
  };

  const updateInstruction = (index: number, value: string) => {
    const updated = [...formData.instructions];
    updated[index] = value;
    setFormData({ ...formData, instructions: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('difficulty', formData.difficulty);
    data.append('cookingTime', formData.cookingTime);
    data.append('servings', formData.servings);
    data.append('ingredients', JSON.stringify(
      formData.ingredients.map(ing => ({
        name: ing.name,
        amount: parseInt(ing.amount),
        unit: ing.unit,
      }))
    ));
    data.append('instructions', JSON.stringify(formData.instructions));
    if (photo) {
      data.append('photo', photo);
    }

    setLoading(true);
    try {
      await recipesApi.create(data);
      router.push('/recipes');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Create Recipe</h1>
      <Card>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
              required
            >
              {Object.values(Category).map((cat) => (
                <SelectItem key={cat} textValue={cat}>
                  {cat}
                </SelectItem>
              ))}
            </Select>

            <Select
              label="Difficulty"
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as Difficulty })}
              required
            >
              {Object.values(Difficulty).map((diff) => (
                <SelectItem key={diff} textValue={diff}>
                  {diff}
                </SelectItem>
              ))}
            </Select>

            <Input
              label="Cooking Time (minutes)"
              type="number"
              value={formData.cookingTime}
              onChange={(e) => setFormData({ ...formData, cookingTime: e.target.value })}
              required
            />

            <Input
              label="Servings"
              type="number"
              value={formData.servings}
              onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
              required
            />

            <div>
              <label className="text-sm font-medium mb-2 block">Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">Ingredients</label>
                <Button size="sm" onPress={addIngredient}>
                  Add
                </Button>
              </div>
              {formData.ingredients.map((ing, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    placeholder="Name"
                    value={ing.name}
                    onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                    required
                  />
                  <Input
                    placeholder="Amount"
                    type="number"
                    value={ing.amount}
                    onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                    required
                  />
                  <Input
                    placeholder="Unit"
                    value={ing.unit}
                    onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                    required
                  />
                  <Button size="sm" color="danger" onPress={() => removeIngredient(index)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">Instructions</label>
                <Button size="sm" onPress={addInstruction}>
                  Add
                </Button>
              </div>
              {formData.instructions.map((instruction, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Textarea
                    placeholder={`Step ${index + 1}`}
                    value={instruction}
                    onChange={(e) => updateInstruction(index, e.target.value)}
                    required
                  />
                  <Button size="sm" color="danger" onPress={() => removeInstruction(index)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex gap-2">
              <Button type="submit" color="primary" isLoading={loading}>
                Create Recipe
              </Button>
              <Button variant="flat" onPress={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}