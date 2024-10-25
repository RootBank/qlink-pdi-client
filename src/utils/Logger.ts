/* eslint-disable no-unused-vars */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  ERROR = 2
}

export class Logger {
  private logLevel: LogLevel;

  constructor(level: LogLevel = LogLevel.ERROR) {
    this.logLevel = level;
  }

  async log(
    messageLevel: LogLevel,
    message: string,
    details?: any
  ): Promise<void> {
    if (messageLevel >= this.logLevel) {
      let logMessage = `[${LogLevel[messageLevel]}]: ${message}`;
      if (details) {
        logMessage += ` | Details: ${typeof details === 'object' ? JSON.stringify(details) : details}`;
      }
      console.log(logMessage);
    }
  }

  debug(message: string): void {
    this.log(LogLevel.DEBUG, message);
  }

  info(message: string): void {
    this.log(LogLevel.INFO, message);
  }

  error(message: string, errorDetails?: any): void {
    this.log(LogLevel.ERROR, message, errorDetails);
  }
}
