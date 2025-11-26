import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { db } from '../db/db';

@Injectable()
export class UserService {
  findAllUsers() {
    return db.users.map(({ password, ...user }) => {
      password;
      return user;
    });
  }

  findById(id: string) {
    const user = db.users.find((u) => u.id === id);

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const safeUser = { ...user };

    delete safeUser.password;
    return safeUser;
  }
}
