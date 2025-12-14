import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { randomUUID } from 'crypto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { timeNow } from '../helpers/time.helper';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOneUser(login: string) {
    const user = await this.prisma.user.findUnique({
      where: { login },
    });
    return user;
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async createUser(dto: CreateUserDto) {
    const now = Math.floor(Date.now() / 1000);
    if (!dto.login || !dto.password) {
      throw new HttpException(
        'required login and password in body',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newUser = await this.prisma.user.create({
      data: {
        id: randomUUID(),
        login: dto.login,
        password: dto.password,
        createdAt: now,
        updatedAt: now,
        version: 1,
      },
    });

    const safeUser = { ...newUser };

    delete safeUser.password;
    return safeUser;
  }

  async updatePassword(id: string, dto: UpdatePasswordDto) {
    if (!dto.oldPassword || !dto.newPassword) {
      throw new HttpException('Invalid dto', HttpStatus.BAD_REQUEST);
    }
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (existingUser.password !== dto.oldPassword) {
      throw new HttpException('Password not match', HttpStatus.FORBIDDEN);
    }
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: dto.newPassword,
        updatedAt: timeNow(),
        version: existingUser.version + 1,
      },
    });

    const safeUser = { ...updatedUser };
    delete safeUser.password;
    return safeUser;
  }

  async deleteUser(id: string) {
    const existingUser = await this.prisma.user.findUnique({ where: { id } });

    if (!existingUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.user.delete({ where: { id } });
  }
}
