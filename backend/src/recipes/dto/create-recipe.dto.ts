import { IsString, IsEnum, IsInt, Min, IsArray, ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Category, Difficulty } from '@prisma/client';

class IngredientDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(0)
  amount: number;

  @IsString()
  unit: string;
}

export class CreateRecipeDto {
  @IsString()
  title: string;

  @IsEnum(Category)
  category: Category;

  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @IsInt()
  @Min(1)
  cookingTime: number;

  @IsInt()
  @Min(1)
  servings: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  ingredients: IngredientDto[];

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  instructions: string[];
}