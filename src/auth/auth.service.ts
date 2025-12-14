import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Secret, SignOptions } from 'jsonwebtoken';

type JwtPayload = {
  userId: string;
  login: string;
};

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async signIn(login: string, password: string) {
    const user = await this.userService.findOneUser(login);

    if (!user) {
      throw new ForbiddenException('Invalid login or password');
    }

    const passMatches = await bcrypt.compare(password, user.password);
    if (!passMatches) {
      throw new ForbiddenException('Invalid login or password');
    }

    const payload: JwtPayload = {
      userId: user.id,
      login: user.login,
    };

    const accessSecret = process.env.JWT_ACCESS_SECRET as Secret;
    const refreshSecret = process.env.JWT_REFRESH_SECRET as Secret;

    if (!accessSecret || !refreshSecret) {
      throw new InternalServerErrorException('JWT secrets are not configured');
    }

    const accessOptions: SignOptions = {
      expiresIn: Number(process.env.JWT_ACCESS_EXPIRES_IN ?? 300),
    };

    const refreshOptions: SignOptions = {
      expiresIn: Number(process.env.JWT_REFRESH_EXPIRES_IN ?? 604800),
    };

    const accessToken = jwt.sign(payload, accessSecret, accessOptions);
    const refreshToken = jwt.sign(payload, refreshSecret, refreshOptions);

    return { accessToken, refreshToken };
  }
  async signUp(login: string, password: string) {
    const existing = await this.userService.findOneUser(login);
    if (existing) {
      throw new ForbiddenException('User already exists');
    }

    const hash = await bcrypt.hash(password, 10);

    await this.userService.createUser({
      login,
      password: hash,
    });

    return { message: 'User created successfully' };
  }

}
