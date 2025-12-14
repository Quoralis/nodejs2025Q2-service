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

    const path: string = req.path ?? req.url?.split('?')[0] ?? '';

    if (
      path === '/' ||
      path === '/doc' ||
      path.startsWith('/doc/') ||
      path.startsWith('/auth') ||
      path.startsWith('/user') ||
      path.startsWith('/artist') ||
      path.startsWith('/album') ||
      path.startsWith('/track') ||
      path.startsWith('/favs')
    ) {
      return true;
    }

    const auth = req.headers.authorization;
    if (!auth) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const [type, token] = auth.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization format');
    }

    try {
      req.user = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
