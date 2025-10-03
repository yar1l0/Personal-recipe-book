import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { MealPlanService } from './meal-plan.service';
import { CreateMealPlanDto } from './dto/create-meal-plan.dto';
import { QueryMealPlanDto } from './dto/query-meal-plan.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('meal-plan')
@UseGuards(JwtAuthGuard)
export class MealPlanController {
  constructor(private mealPlanService: MealPlanService) {}

  @Get()
  findAll(@Req() req, @Query() query: QueryMealPlanDto) {
    return this.mealPlanService.findAll(req.user.id, query);
  }

  @Post()
  create(@Req() req, @Body() dto: CreateMealPlanDto) {
    return this.mealPlanService.create(req.user.id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() req) {
    return this.mealPlanService.delete(id, req.user.id);
  }
}