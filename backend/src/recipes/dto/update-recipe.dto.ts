import { IsString, IsEnum, IsInt, Min, IsArray, ArrayMinSize, ValidateNested, IsOptional } from 'class-validator';
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

export class UpdateRecipeDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsEnum(Category)
  @IsOptional()
  category?: Category;

  @IsEnum(Difficulty)
  @IsOptional()
  difficulty?: Difficulty;

  @IsInt()
  @Min(1)
  @IsOptional()
  cookingTime?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  servings?: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  @IsOptional()
  ingredients?: IngredientDto[];

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsOptional()
  instructions?: string[];
}