import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  getMe(@Req() req) {
    return this.usersService.getMe(req.user.id);
  }

  @Put('me')
  updateMe(@Req() req, @Body() dto: UpdateUserDto) {
    return this.usersService.updateMe(req.user.id, dto);
  }
}