import { Controller, Get, Post, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ShoppingListService } from './shopping-list.service';
import { GenerateShoppingListDto } from './dto/generate-shopping-list.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('shopping-list')
@UseGuards(JwtAuthGuard)
export class ShoppingListController {
  constructor(private shoppingListService: ShoppingListService) {}

  @Get()
  get(@Req() req) {
    return this.shoppingListService.get(req.user.id);
  }

  @Post('generate')
  generate(@Req() req, @Body() dto: GenerateShoppingListDto) {
    return this.shoppingListService.generate(req.user.id, dto);
  }

  @Patch('items/:id/toggle')
  toggleItem(@Param('id') id: string, @Req() req) {
    return this.shoppingListService.toggleItem(id, req.user.id);
  }
}