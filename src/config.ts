/* eslint-disable indent */
import { LogLevel } from './utils/Logger';
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line no-undef
  require('dotenv').config();
}

class Config {
  private static instance: Config;

  public readonly qLinkUrl: string;
  public readonly qLinkUser: string;
  public readonly qLinkPassword: string;
  public readonly logLevel: LogLevel;
  public readonly institutionId: number;

  private constructor() {
    this.qLinkUrl =
      process.env.Q_LINK_URL || 'https://govtest.qlink.co.za/cgi-bin/XmlProc';
    this.qLinkUser = process.env.Q_LINK_USER || 'testUser';
    this.qLinkPassword = process.env.Q_LINK_PASSWORD || 'testPassword';
    this.institutionId = Number(process.env.Q_LINK_INSTITUTION_ID || 9999);
    this.logLevel = this.parseLogLevel(process.env.Q_LINK_LOG_LEVEL || 'ERROR');
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

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }
}

export default Config;
