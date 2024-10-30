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

  private maskSensitiveInfo(message: string): string {
    return message
      .replace(/<USER>.*?<\/USER>/, '<USER>*******</USER>')
      .replace(/<PSWD>.*?<\/PSWD>/, '<PSWD>*******</PSWD>');
  }

  async log(
    messageLevel: LogLevel,
    message: string,
    details?: any
  ): Promise<void> {
    if (messageLevel >= this.logLevel) {
      let logMessage = `[${LogLevel[messageLevel]}]: ${this.maskSensitiveInfo(message)}`;
      if (details) {
        const maskedDetails = typeof details === 'string'
          ? this.maskSensitiveInfo(details)
          : JSON.stringify(details);
        logMessage += ` | Details: ${maskedDetails}`;
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
