'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardBody,
  Button,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/react';
import { mealPlanApi, recipesApi } from '@/lib/api';
import { MealPlan, Recipe, MealType } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { format, startOfWeek, addDays } from 'date-fns';

export default function MealPlanPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMealType, setSelectedMealType] = useState(MealType.LUNCH);
  const [selectedRecipeId, setSelectedRecipeId] = useState('');
  const [weekStart, setWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchMealPlans();
    fetchRecipes();
  }, [weekStart, isAuthenticated]);

  const fetchMealPlans = async () => {
    try {
      const start = format(weekStart, 'yyyy-MM-dd');
      const end = format(addDays(weekStart, 6), 'yyyy-MM-dd');
      const data = await mealPlanApi.getAll(start, end);
      setMealPlans(data);
    } catch (error) {
      console.error('Error fetching meal plans:', error);
    }
  };

  const fetchRecipes = async () => {
    try {
      const data = await recipesApi.getAll({ limit: 100 });
      setRecipes(data.recipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const handleAddMeal = async () => {
    if (!selectedRecipeId || !selectedDate) return;

    try {
      await mealPlanApi.create({
        recipeId: selectedRecipeId,
        date: selectedDate,
        mealType: selectedMealType,
      });
      fetchMealPlans();
      onClose();
      setSelectedRecipeId('');
      setSelectedDate('');
    } catch (error) {
      console.error('Error adding meal plan:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await mealPlanApi.delete(id);
      fetchMealPlans();
    } catch (error) {
      console.error('Error deleting meal plan:', error);
    }
  };

  const getMealsForDay = (dayIndex: number, mealType: MealType) => {
    const date = format(addDays(weekStart, dayIndex), 'yyyy-MM-dd');
    return mealPlans.filter(
      (mp) =>
        format(new Date(mp.date), 'yyyy-MM-dd') === date &&
        mp.mealType === mealType
    );
  };

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Meal Plan</h1>
        <div className="flex gap-2">
          <Button onPress={() => setWeekStart(addDays(weekStart, -7))}>
            Previous Week
          </Button>
          <Button
            onPress={() =>
              setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))
            }
          >
            This Week
          </Button>
          <Button onPress={() => setWeekStart(addDays(weekStart, 7))}>
            Next Week
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {days.map((day, index) => (
          <Card key={index}>
            <CardBody className="p-2">
              <h3 className="font-bold text-center mb-2">
                {format(day, 'EEE')}
                <br />
                {format(day, 'MMM d')}
              </h3>

              {['BREAKFAST', 'LUNCH', 'DINNER'].map((mealType) => (
                <div key={mealType} className="mb-3">
                  <p className="text-xs font-semibold mb-1">{mealType}</p>
                  {getMealsForDay(index, mealType as MealType).map((mp) => (
                    <div
                      key={mp.id}
                      className="bg-gray-100 dark:bg-gray-800 p-2 rounded mb-1 text-xs"
                    >
                      <p className="font-medium">{mp.recipe.title}</p>
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        onPress={() => handleDelete(mp.id)}
                        className="mt-1 text-xs"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    size="sm"
                    variant="flat"
                    onPress={() => {
                      setSelectedDate(format(day, 'yyyy-MM-dd'));
                      setSelectedMealType(mealType as MealType);
                      onOpen();
                    }}
                    className="w-full text-xs"
                  >
                    + Add
                  </Button>
                </div>
              ))}
            </CardBody>
          </Card>
        ))}
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Add Meal</ModalHeader>
          <ModalBody>
            <Select
              label="Recipe"
              placeholder="Select a recipe"
              onChange={(e) => setSelectedRecipeId(e.target.value)}
            >
              {recipes.map((recipe) => (
                <SelectItem key={recipe.id} textValue={recipe.id}>
                  {recipe.title}
                </SelectItem>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleAddMeal}>
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
