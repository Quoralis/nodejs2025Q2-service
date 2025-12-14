import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

@Injectable()
export class LoggingService {
  private readonly level: LogLevel;
  private readonly logToFile: boolean;
  private readonly logFile: string;
  private readonly maxSizeBytes: number;

  private readonly priorities: Record<LogLevel, number> = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  };

  constructor() {
    this.level = (process.env.LOG_LEVEL as LogLevel) ?? 'info';
    this.logToFile = process.env.LOG_TO_FILE === 'true';

    const file = process.env.LOG_FILE ?? 'logs/app.log';
    this.logFile = path.isAbsolute(file)
      ? file
      : path.join(process.cwd(), file);

    const maxKb = Number(process.env.LOG_FILE_MAX_SIZE_KB ?? 256);
    this.maxSizeBytes = maxKb * 1024;

    if (this.logToFile) {
      fs.mkdirSync(path.dirname(this.logFile), { recursive: true });
    }
  }

  info(message: string) {
    this.write('info', message);
  }

  warn(message: string) {
    this.write('warn', message);
  }

  debug(message: string) {
    this.write('debug', message);
  }

  error(message: string, stack?: unknown) {
    this.write(
      'error',
      stack ? `${message}\n${this.format(stack)}` : message,
    );
  }

  private write(level: LogLevel, message: string) {
    if (this.priorities[level] > this.priorities[this.level]) return;

    const line = `${new Date().toISOString()} [${level.toUpperCase()}] ${message}\n`;

    if (this.logToFile) {
      this.rotateIfNeeded(line);
      fs.appendFileSync(this.logFile, line);
    } else {
      process.stdout.write(line);
    }
  }

  private rotateIfNeeded(nextLine: string) {
    if (!fs.existsSync(this.logFile)) return;

    const size = fs.statSync(this.logFile).size;
    if (size + Buffer.byteLength(nextLine) <= this.maxSizeBytes) return;

    const rotated = `${this.logFile}.1`;
    if (fs.existsSync(rotated)) fs.unlinkSync(rotated);
    fs.renameSync(this.logFile, rotated);
  }

  private format(value: unknown): string {
    if (value instanceof Error) {
      return value.stack ?? value.message;
    }
    return JSON.stringify(value);
  }
}
