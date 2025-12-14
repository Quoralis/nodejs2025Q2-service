import { Module } from '@nestjs/common';
import { LoggingService } from './log.service';

@Module({
  providers: [LoggingService],
  exports: [LoggingService],
})
export class LoggerModule {}
