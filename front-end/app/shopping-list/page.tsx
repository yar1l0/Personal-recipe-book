'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, Button, Checkbox, Input } from '@heroui/react';
import { shoppingListApi } from '@/lib/api';
import { ShoppingList } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { format, addDays } from 'date-fns';

export default function ShoppingListPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(
    format(addDays(new Date(), 7), 'yyyy-MM-dd')
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchShoppingList();
  }, [isAuthenticated]);

  const fetchShoppingList = async () => {
    setLoading(true);
    try {
      const data = await shoppingListApi.get();
      setShoppingList(data);
    } catch (error) {
      console.error('Error fetching shopping list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await shoppingListApi.generate(startDate, endDate);
      setShoppingList(data);
    } catch (error) {
      console.error('Error generating shopping list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (itemId: string) => {
    try {
      await shoppingListApi.toggleItem(itemId);
      fetchShoppingList();
    } catch (error) {
      console.error('Error toggling item:', error);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Shopping List</h1>

      <Card className="mb-6">
        <CardBody className="gap-4">
          <h2 className="text-xl font-bold">Generate from Meal Plan</h2>
          <div className="flex gap-4">
            <Input
              type="date"
              label="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              type="date"
              label="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <Button color="primary" onPress={handleGenerate} isLoading={loading}>
            Generate Shopping List
          </Button>
        </CardBody>
      </Card>

      {loading && <p>Loading...</p>}

      {!loading && shoppingList && (
        <Card>
          <CardBody>
            {shoppingList.items.length === 0 ? (
              <p className="text-center text-gray-500">
                No items in shopping list. Generate one from your meal plan.
              </p>
            ) : (
              <div className="space-y-2">
                {shoppingList.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <Checkbox
                      isSelected={item.checked}
                      onValueChange={() => handleToggle(item.id)}
                    />
                    <div
                      className={`flex-1 ${item.checked ? 'line-through text-gray-400' : ''}`}
                    >
                      <span className="font-medium">{item.ingredient}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        {item.amount} {item.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
