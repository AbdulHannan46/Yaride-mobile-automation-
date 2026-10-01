export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent';

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  trace: -1,
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4,
};

class Logger {
  private currentLevel: LogLevel = 'info';

  constructor() {
    const envLevel = process.env.LOG_LEVEL?.toLowerCase() as LogLevel;
    if (envLevel && envLevel in LOG_LEVEL_PRIORITY) {
      this.currentLevel = envLevel;
    }
  }

  public setLevel(level: LogLevel): void {
    this.currentLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    if (this.currentLevel === 'silent') return false;
    return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[this.currentLevel];
  }

  private formatMessage(level: LogLevel, context: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] [${context}] ${this.maskSensitive(message)}`;
  }

  /**
   * Masks sensitive credentials like passwords, tokens, or authorization headers.
   */
  public maskSensitive(message: string): string {
    return message.replace(
      /(password|token|secret|authorization)\s*[:=]\s*['"]?([^\s,'"]+)['"]?/gi,
      '$1=***REDACTED***'
    );
  }

  public trace(context: string, message: string): void {
    if (this.shouldLog('trace')) {
      console.trace(this.formatMessage('trace', context, message));
    }
  }

  public debug(context: string, message: string): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', context, message));
    }
  }

  public info(context: string, message: string): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', context, message));
    }
  }

  public warn(context: string, message: string): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', context, message));
    }
  }

  public error(context: string, message: string, error?: unknown): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', context, message));
      if (error) {
        if (error instanceof Error) {
          console.error(`Stack: ${error.stack}`);
        } else {
          console.error('Details:', error);
        }
      }
    }
  }
}

export const logger = new Logger();
