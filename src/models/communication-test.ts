import { QLinkClient } from './qlink-client';
import { Logger } from '../utils/logger-util';
import { QLinkError } from '../errors';
import { TransactionType } from '../enums/transaction-type';
import { QLinkBase } from './qlink-base';
import { Header } from './header';
import { QLinkRequest } from './qlink-request';

const logger = Logger.getInstance();

export class CommunicationTest extends QLinkBase {
  private client: QLinkClient;

  constructor(client: QLinkClient) {
    super();
    this.client = client;
  }

  toXML(): string {
    return '';
  }

  toFile(): string {
    return '';
  }

  async run(): Promise<boolean> {
    const header = new Header(this.client.connectionConfig(), { transactionType: TransactionType.COMMUNICATION_TEST })
    const requestData = new QLinkRequest(header, this)

    logger.debug(`Communication Test with request data: ${JSON.stringify(requestData)}`);

    const responseData = await this.client.sendRequest(requestData);
    logger.debug(responseData)

    this.parse(responseData);
    return true;
  }

  private parse(responseData: string): void {
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
