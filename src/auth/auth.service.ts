import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Secret } from 'jsonwebtoken';
import { getExpiresIn } from '../helpers/getExpiresIn';

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

    const accessExpiresIn = getExpiresIn(
      process.env.JWT_ACCESS_EXPIRES_IN,
      3600,
    );

    const refreshExpiresIn = getExpiresIn(
      process.env.JWT_REFRESH_EXPIRES_IN,
      86400,
    );

    return {
      accessToken: jwt.sign(payload, accessSecret, {
        expiresIn: accessExpiresIn,
      }),
      refreshToken: jwt.sign(payload, refreshSecret, {
        expiresIn: refreshExpiresIn,
      }),
    };
  }

  async signUp(login: string, password: string) {
    const existing = await this.userService.findOneUser(login);
    if (existing) {
      throw new ForbiddenException('User already exists');
    }

    const saltRounds = Number(process.env.CRYPT_SALT ?? 10);
    const hash = await bcrypt.hash(password, saltRounds);

    await this.userService.createUser({ login, password: hash });

    return { message: 'User created successfully' };
  }


  async refresh(refreshToken: string) {
    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as Secret,
      ) as JwtPayload;

      const accessExpiresIn = getExpiresIn(
        process.env.JWT_ACCESS_EXPIRES_IN,
        3600,
      );

      const refreshExpiresIn = getExpiresIn(
        process.env.JWT_REFRESH_EXPIRES_IN,
        86400,
      );

      const newPayload = {
        userId: payload.userId,
        login: payload.login,
      };

      return {
        accessToken: jwt.sign(
          newPayload,
          process.env.JWT_ACCESS_SECRET as Secret,
          { expiresIn: accessExpiresIn },
        ),
        refreshToken: jwt.sign(
          newPayload,
          process.env.JWT_REFRESH_SECRET as Secret,
          { expiresIn: refreshExpiresIn },
        ),
      };
    } catch {
      throw new ForbiddenException('Invalid refresh token');
    }
  }
}
