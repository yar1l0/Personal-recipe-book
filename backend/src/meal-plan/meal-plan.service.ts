import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMealPlanDto } from './dto/create-meal-plan.dto';
import { QueryMealPlanDto } from './dto/query-meal-plan.dto';

@Injectable()
export class MealPlanService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateMealPlanDto) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: dto.recipeId },
    });

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    return this.prisma.mealPlan.create({
      data: {
        userId,
        recipeId: dto.recipeId,
        date: new Date(dto.date),
        mealType: dto.mealType,
      },
      include: {
        recipe: true,
      },
    });
  }

  async findAll(userId: string, query: QueryMealPlanDto) {
    const { startDate, endDate } = query;

    return this.prisma.mealPlan.findMany({
      where: {
        userId,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: {
        recipe: true,
      },
      orderBy: [{ date: 'asc' }, { mealType: 'asc' }],
    });
  }

  async delete(id: string, userId: string) {
    const mealPlan = await this.prisma.mealPlan.findUnique({
      where: { id },
    });

    if (!mealPlan) {
      throw new NotFoundException('Meal plan entry not found');
    }

    if (mealPlan.userId !== userId) {
      throw new ForbiddenException('You can only delete your own meal plans');
    }

    await this.prisma.mealPlan.delete({
      where: { id },
    });

    return { message: 'Meal plan entry deleted successfully' };
  }
}