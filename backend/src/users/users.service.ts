import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateMe(userId: string, dto: UpdateUserDto) {
    if (dto.email) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          email: dto.email,
          NOT: { id: userId },
        },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    const data: any = {};

    if (dto.email) data.email = dto.email;
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        updatedAt: true,
      },
    });
  }
}