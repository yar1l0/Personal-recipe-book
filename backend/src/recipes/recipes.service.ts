import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { QueryRecipesDto } from './dto/query-recipes.dto';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateRecipeDto, photo?: string) {
    return this.prisma.recipe.create({
      data: {
        userId,
        title: dto.title,
        category: dto.category,
        difficulty: dto.difficulty,
        cookingTime: dto.cookingTime,
        servings: dto.servings,
        photo,
        ingredients: dto.ingredients as any,
        instructions: dto.instructions as any,
      },
    });
  }

  async findAll(query: QueryRecipesDto) {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (query.category) where.category = query.category;
  if (query.difficulty) where.difficulty = query.difficulty;
  if (query.cookingTime) where.cookingTime = { lte: query.cookingTime };

  const [recipes, total] = await Promise.all([
    this.prisma.recipe.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    this.prisma.recipe.count({ where }),
  ]);

  return {
    recipes,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

  async findOne(id: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    return recipe;
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateRecipeDto,
    photo?: string,
  ) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
    });

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    if (recipe.userId !== userId) {
      throw new ForbiddenException('You can only update your own recipes');
    }

    // Delete old photo if new one uploaded
    if (photo && recipe.photo) {
      await this.deleteFile(recipe.photo);
    }

    const data: any = { ...dto };
    if (photo) data.photo = photo;

    return this.prisma.recipe.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, userId: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
    });

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    if (recipe.userId !== userId) {
      throw new ForbiddenException('You can only delete your own recipes');
    }

    // Delete photo file
    if (recipe.photo) {
      await this.deleteFile(recipe.photo);
    }

    await this.prisma.recipe.delete({
      where: { id },
    });

    return { message: 'Recipe deleted successfully' };
  }

  private async deleteFile(filePath: string) {
    try {
      const fullPath = path.join(process.cwd(), filePath);
      await fs.unlink(fullPath);
    } catch (error) {
      // Ignore if file doesn't exist
    }
  }
}
