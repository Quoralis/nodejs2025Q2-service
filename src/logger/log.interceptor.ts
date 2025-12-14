import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LoggingService } from './log.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, query, body } = req;
    const start = Date.now();

    this.logger.info(
      `Request ${method} ${url} query=${JSON.stringify(query)} body=${JSON.stringify(body)}`,
    );

    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse();
        const duration = Date.now() - start;
        this.logger.info(
          `Response ${method} ${url} status=${res.statusCode} duration=${duration}ms`,
        );
      }),
    );
  }
}
