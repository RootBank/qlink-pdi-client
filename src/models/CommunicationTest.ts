import { Connection } from './Connection';
import { Logger } from '../utils/Logger';
import Config from '../config';

const config = Config.getInstance();
const logger = new Logger(config.logLevel);

export class CommunicationTest {
  private connection: Connection;
  private fields!: {};

  constructor(connection: Connection) {
    this.connection = connection;
  }

  toXML(): string {
    return '';
  }

  async save(): Promise<void> {
    const requestData = {
      header: this.connection.connectionConfig,
      data: this
    };

    logger.debug(
      `Communication Test with request data: ${JSON.stringify(requestData)}`
    );
    await this.connection.sendRequest(requestData);
  }
}
