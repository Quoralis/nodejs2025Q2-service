import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const path = req.originalUrl.split('?')[0];

    if (
      path === '/' ||
      path === '/doc' ||
      path.startsWith('/doc') ||
      path.startsWith('/auth')
    ) {
      return true;
    }

    const auth = req.headers.authorization;
    if (!auth) {
      throw new UnauthorizedException();
    }

    const [type, token] = auth.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException();
    }

    try {
      jwt.verify(token, process.env.JWT_ACCESS_SECRET ?? 'secret');
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
