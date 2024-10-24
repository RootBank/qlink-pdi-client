class Config {
  private static instance: Config;

  public readonly qLinkUrl: string;
  public readonly qLinkUser: string;
  public readonly qLinkPassword: string;
  public institutionId: number;

  // Private constructor to ensure Singleton pattern
  private constructor() {
    if (process.env.NODE_ENV !== 'production') {
      // Only load dotenv in non-production environments
      import('dotenv').then(dotenv => {
        dotenv.config();
      });
    }

    this.qLinkUrl =
      process.env.Q_LINK_URL || 'https://govtest.qlink.co.za/cgi-bin/XmlProc';
    this.qLinkUser = process.env.Q_LINK_USER || 'testUser';
    this.qLinkPassword = process.env.Q_LINK_PASSWORD || 'testPassword';
    this.institutionId = Number(process.env.Q_LINK_INSTITUTION_ID || 9999);
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }
}

export default Config;
