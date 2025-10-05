import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { QueryRecipesDto } from './dto/query-recipes.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('recipes')
export class RecipesController {
  constructor(private recipesService: RecipesService) {}

  @Get()
  findAll(@Query() query: QueryRecipesDto) {
    return this.recipesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/recipes',
        filename: (req, file, cb) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  create(
    @Req() req,
    @Body('title') title: string,
    @Body('category') category: string,
    @Body('difficulty') difficulty: string,
    @Body('cookingTime') cookingTime: string,
    @Body('servings') servings: string,
    @Body('ingredients') ingredients: string,
    @Body('instructions') instructions: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const dto = {
      title,
      category: category as any,
      difficulty: difficulty as any,
      cookingTime: parseInt(cookingTime),
      servings: parseInt(servings),
      ingredients: JSON.parse(ingredients),
      instructions: JSON.parse(instructions),
    };
    const photo = file ? `uploads/recipes/${file.filename}` : undefined;
    return this.recipesService.create(req.user.id, dto as any, photo);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/recipes',
        filename: (req, file, cb) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  update(
    @Param('id') id: string,
    @Req() req,
    @Body('title') title?: string,
    @Body('category') category?: string,
    @Body('difficulty') difficulty?: string,
    @Body('cookingTime') cookingTime?: string,
    @Body('servings') servings?: string,
    @Body('ingredients') ingredients?: string,
    @Body('instructions') instructions?: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const dto: any = {};
    if (title) dto.title = title;
    if (category) dto.category = category;
    if (difficulty) dto.difficulty = difficulty;
    if (cookingTime) dto.cookingTime = parseInt(cookingTime);
    if (servings) dto.servings = parseInt(servings);
    if (ingredients) dto.ingredients = JSON.parse(ingredients);
    if (instructions) dto.instructions = JSON.parse(instructions);

    const photo = file ? `uploads/recipes/${file.filename}` : undefined;
    return this.recipesService.update(id, req.user.id, dto, photo);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string, @Req() req) {
    return this.recipesService.delete(id, req.user.id);
  }
}
