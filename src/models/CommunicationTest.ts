import { Connection } from './Connection';
import { Logger } from '../utils/Logger';
import Config from '../config';
import { QLinkError } from '../errors';

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
    const responseData = await this.connection.sendRequest(requestData);
    logger.debug(responseData)

    const srcIpMatch = responseData.match(/<SRC_IP>(.*?)<\/SRC_IP>/);
    const msgMatch = responseData.match(/<MSG>(.*?)<\/MSG>/);

    if (!srcIpMatch || !msgMatch) {
      logger.error('Failed to parse Communication Test response');
      throw new QLinkError('Failed to parse Communication Test response');
    }

    const srcIp = srcIpMatch[1];
    const msg = msgMatch[1];

    logger.debug(`Communication Test Response - SRC_IP: ${srcIp}, MSG: ${msg}`);
  }
}
