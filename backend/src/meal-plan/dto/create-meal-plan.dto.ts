import { IsString, IsEnum, IsDateString } from 'class-validator';
import { MealType } from '@prisma/client';

export class CreateMealPlanDto {
  @IsString()
  recipeId: string;

  @IsDateString()
  date: string;

  @IsEnum(MealType)
  mealType: MealType;
}