import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { db } from '../db/db';
import { User } from '../types/user.interface';
import { CreateUserDto } from './dto/createUser.dto';
import { randomUUID } from 'crypto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { timeNow } from '../helpers/time.helper';

@Injectable()
export class UserService {
  findAllUsers() {
    return db.users.map(
      ({ id, login, createdAt, updatedAt, version }: User) => ({
        id,
        login,
        createdAt,
        updatedAt,
        version,
      }),
    );
  }

  findById(id: string) {
    const user = db.users.find((u) => u.id === id);

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const safeUser = { ...user };

    delete safeUser.password;
    return safeUser;
  }

  createUser(dto: CreateUserDto) {
    if (!dto.login || !dto.password) {
      throw new HttpException(
        'required login and password in body',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newUser: User = {
      id: randomUUID(),
      login: dto.login,
      password: dto.password,
      createdAt: timeNow(),
      updatedAt: timeNow(),
      version: 1,
    };
    db.users.push(newUser);
    const safeUser = { ...newUser };

    delete safeUser.password;
    return safeUser;
  }

  updatePassword(id: string, dto: UpdatePasswordDto) {
    const user = db.users.find((u) => u.id === id);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    if (user.password !== dto.oldPassword)
      throw new HttpException('Password not match', HttpStatus.FORBIDDEN);
    user.password = dto.newPassword;
    user.updatedAt = timeNow();
    user.version = user.version + 1;
    const safeUser = { ...user };

    delete safeUser.password;
    return safeUser;
  }

  deleteUser(id: string) {
    const indexUser = db.users.findIndex((u) => u.id === id);
    if (indexUser === -1)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    db.users.splice(indexUser, 1);
  }
}
