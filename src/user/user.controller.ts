import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { BadRequestException } from '@nestjs/common';
import { validate as isUUID } from 'uuid';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAll() {
    return this.userService.findAllUsers();
  }

  @Get(':id')
  @HttpCode(201)
  getOne(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid id');
    }
    return this.userService.findById(id);
  }

  @Post()
  @HttpCode(201)
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @Put(':id')
  @HttpCode(201)
  updatePassword(@Param('id') id: string, @Body() dto: UpdatePasswordDto) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid id');
    }
    return this.userService.updatePassword(id, dto);
  }

  @Delete(':id')
  @HttpCode(201)
  delete(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid id');
    }
    return this.userService.deleteUser(id);
  }
}
