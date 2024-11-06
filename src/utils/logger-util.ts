/* eslint-disable no-unused-vars */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  ERROR = 2
}

export class Logger {
  private logLevel: LogLevel;
  private static instance: Logger;

  private constructor(level: LogLevel = LogLevel.ERROR) {
    this.logLevel = this.parseLogLevel(process.env.QLINK_LOG_LEVEL || 'ERROR');
  }

  private parseLogLevel(level: string): LogLevel {
    switch (level.toUpperCase()) {
      case 'DEBUG':
        return LogLevel.DEBUG;
      case 'INFO':
        return LogLevel.INFO;
      case 'ERROR':
      default:
        return LogLevel.ERROR;
    }
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  // Helper to mask sensitive information in both JSON and XML
  private maskSensitiveInfo(data: string | object): string {
    let dataString = typeof data === 'string' ? data : JSON.stringify(data);

    // XML masking
    dataString = dataString
      .replace(/<USER>.*?<\/USER>/gi, '<USER>*******</USER>')
      .replace(/<PSWD>.*?<\/PSWD>/gi, '<PSWD>*******</PSWD>')
      .replace(/<IDNO>.*?<\/IDNO>/gi, '<IDNO>*******</IDNO>')
      .replace(/<SURNAME>.*?<\/SURNAME>/gi, '<SURNAME>*******</SURNAME>')
      .replace(/<EMPL_NO>.*?<\/EMPL_NO>/gi, '<EMPL_NO>*******</EMPL_NO>')
      .replace(/<EMPLNO>.*?<\/EMPLNO>/gi, '<EMPLNO>*******</EMPLNO>');

    // JSON masking
    dataString = dataString
      .replace(/"username":\s*".*?"/gi, '"username": "*******"')
      .replace(/"password":\s*".*?"/gi, '"password": "*******"')
      .replace(/"idNumber":\s*".*?"/gi, '"idNumber": "*******"')
      .replace(/"surname":\s*".*?"/gi, '"surname": "*******"')
      .replace(/"employeeNumber":\s*".*?"/gi, '"employeeNumber": "*******"');

    return dataString;
  }

  async log(
    messageLevel: LogLevel,
    message: string,
    details?: any
  ): Promise<void> {
    if (messageLevel >= this.logLevel) {
      // Mask sensitive info in message and details
      const maskedMessage = this.maskSensitiveInfo(message);
      const maskedDetails = details ? this.maskSensitiveInfo(details) : '';

      // Log the message with masked information
      const logMessage = `[${LogLevel[messageLevel]}]: ${maskedMessage}` +
        (maskedDetails ? ` | Details: ${maskedDetails}` : '');

      console.log(logMessage);
    }
  }

  debug(message: string, details?: any): void {
    this.log(LogLevel.DEBUG, message, details);
  }

  info(message: string, details?: any): void {
    this.log(LogLevel.INFO, message, details);
  }

  error(message: string, errorDetails?: any): void {
    this.log(LogLevel.ERROR, message, errorDetails);
  }
}
