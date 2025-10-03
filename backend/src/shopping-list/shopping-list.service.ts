import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GenerateShoppingListDto } from './dto/generate-shopping-list.dto';

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

@Injectable()
export class ShoppingListService {
  constructor(private prisma: PrismaService) {}

  async get(userId: string) {
    let shoppingList = await this.prisma.shoppingList.findUnique({
      where: { userId },
      include: {
        items: true,
      },
    });

    if (!shoppingList) {
      shoppingList = await this.prisma.shoppingList.create({
        data: {
          userId,
        },
        include: {
          items: true,
        },
      });
    }

    return shoppingList;
  }

  async generate(userId: string, dto: GenerateShoppingListDto) {
    // Get or create shopping list
    let shoppingList = await this.prisma.shoppingList.findUnique({
      where: { userId },
    });

    if (!shoppingList) {
      shoppingList = await this.prisma.shoppingList.create({
        data: { userId },
      });
    }

    // Delete old items
    await this.prisma.shoppingItem.deleteMany({
      where: { shoppingListId: shoppingList.id },
    });

    // Get all meal plans in date range
    const mealPlans = await this.prisma.mealPlan.findMany({
      where: {
        userId,
        date: {
          gte: new Date(dto.startDate),
          lte: new Date(dto.endDate),
        },
      },
      include: {
        recipe: true,
      },
    });

    // Collect and group ingredients
    const ingredientsMap = new Map<string, { amount: number; unit: string }>();

    for (const mealPlan of mealPlans) {
  const ingredients = mealPlan.recipe.ingredients as unknown as Ingredient[];
  
  for (const ingredient of ingredients) {
    const key = `${ingredient.name.toLowerCase()}-${ingredient.unit.toLowerCase()}`;
    
    if (ingredientsMap.has(key)) {
      const existing = ingredientsMap.get(key);
      if (existing) {
        existing.amount += ingredient.amount;
      }
    } else {
      ingredientsMap.set(key, {
        amount: ingredient.amount,
        unit: ingredient.unit,
      });
    }
  }
}

    // Create shopping items
    const items = await Promise.all(
      Array.from(ingredientsMap.entries()).map(([key, value]) => {
        const name = key.split('-')[0];
        return this.prisma.shoppingItem.create({
          data: {
            shoppingListId: shoppingList.id,
            ingredient: name,
            amount: value.amount,
            unit: value.unit,
            checked: false,
          },
        });
      }),
    );

    return {
      ...shoppingList,
      items,
    };
  }

  async toggleItem(itemId: string, userId: string) {
    const item = await this.prisma.shoppingItem.findUnique({
      where: { id: itemId },
      include: {
        shoppingList: true,
      },
    });

    if (!item) {
      throw new NotFoundException('Shopping item not found');
    }

    if (item.shoppingList.userId !== userId) {
      throw new NotFoundException('Shopping item not found');
    }

    return this.prisma.shoppingItem.update({
      where: { id: itemId },
      data: {
        checked: !item.checked,
      },
    });
  }
}