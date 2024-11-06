// /* eslint-disable indent */
// import { ConfigFields } from './types';
// import { LogLevel } from './utils/Logger';
// if (process.env.NODE_ENV !== 'production') {
//   // eslint-disable-next-line no-undef
//   require('dotenv').config();
// }

// class Config implements ConfigFields {
//   private static instance: Config;

//   public baseUrl: string;
//   public username: string;
//   public password: string;
//   public logLevel: LogLevel;
//   public institution: number;

//   private constructor() {
//     this.baseUrl =
//       process.env.Q_LINK_URL || 'https://govtest.qlink.co.za/cgi-bin/XmlProc';
//     this.username = process.env.Q_LINK_USER || 'testUser';
//     this.password = process.env.Q_LINK_PASSWORD || 'testPassword';
//     this.institution = Number(process.env.Q_LINK_INSTITUTION_ID || 9999);
//     this.logLevel = this.parseLogLevel(process.env.Q_LINK_LOG_LEVEL || 'ERROR');
//   }

//   private parseLogLevel(level: string): LogLevel {
//     switch (level.toUpperCase()) {
//       case 'DEBUG':
//         return LogLevel.DEBUG;
//       case 'INFO':
//         return LogLevel.INFO;
//       case 'ERROR':
//       default:
//         return LogLevel.ERROR;
//     }
//   }

//   public static getInstance(): Config {
//     if (!Config.instance) {
//       Config.instance = new Config();
//     }
//     return Config.instance;
//   }
// }

// export default Config;
