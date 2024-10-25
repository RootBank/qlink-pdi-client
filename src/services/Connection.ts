import { axiosInstance, isAxiosError } from '../axiosConfig';
import { QLinkError } from '../errors';
import { QLinkRequest, BulkQLinkRequest, ConnectionFields } from '../types';
import { serializeHeaderToXML } from '../serialization/HeaderSerializer';
import { Logger } from '../utils/Logger';
import Config from '../config';

const config = Config.getInstance();
const logger = new Logger(config.logLevel);

export class Connection {
  private config: ConnectionFields;

  constructor(fields: ConnectionFields) {
    this.config = fields;
    logger.debug('Initializing Connection with provided fields');
    this.validateConfig();
  }

  public get connectionConfig(): ConnectionFields {
    return this.config;
  }

  private validateConfig(): void {
    const {
      transaction_type,
      institution,
      payrollIdentifier,
      username,
      password,
      effectiveSalaryMonth
    } = this.config;

    logger.debug('Validating connection configuration');
    if (
      !transaction_type ||
      !institution ||
      !payrollIdentifier ||
      !username ||
      !password ||
      !effectiveSalaryMonth
    ) {
      logger.error('Missing required connection fields');
      throw new QLinkError('All required connection fields must be provided');
    }
    if (!/^\d{6}$/.test(effectiveSalaryMonth)) {
      logger.error('Invalid effective salary month format');
      throw new QLinkError(
        'Effective Salary Month (SALMON) must be in CCYYMM format'
      );
    }
    const currentYearMonth = new Date()
      .toISOString()
      .slice(0, 7)
      .replace('-', '');
    if (effectiveSalaryMonth < currentYearMonth) {
      logger.error('Effective Salary Month is in the past');
      throw new QLinkError(
        'Effective Salary Month (SALMON) date must not be in the past'
      );
    }
  }

  private wrapInQLink(headerXML: string, dataXML: string): string {
    logger.debug(
      `Wrapping header and data XML in QLINK tags\n<QLINK>${headerXML}${dataXML}</QLINK>`
    );
    return `<QLINK>${headerXML}${dataXML}</QLINK>`;
  }

  private getSerializedHeaderXML(): string {
    logger.debug('Serializing header to XML');
    return serializeHeaderToXML(this.config);
  }

  private handleQLinkResponseErrors(responseData: string): void {
    if (responseData.includes('<ERR_CODE>')) {
      const errCode = responseData.match(/<ERR_CODE>(\d+)<\/ERR_CODE>/)?.[1];
      const errMsg = responseData.match(/<ERR_MSG>(.*?)<\/ERR_MSG>/)?.[1];

      logger.error(`QLink API error: ${errMsg}, Status Code: ${errCode}`);
      throw new QLinkError(
        `QLink API error: ${errMsg || 'Unknown error'}`,
        Number(errCode)
      );
    }
  }

  private handleExceptions(error: any): void {
    if (isAxiosError(error)) {
      const statusCode = error.response?.status;
      const message = error.response?.data || error.message;
      logger.error(
        `HTTP error occurred. Status: ${statusCode}, Message: ${message}`
      );
      throw new QLinkError(`HTTP error: ${message}`, statusCode);
    } else if (error instanceof QLinkError) {
      logger.error(
        `QLink Error: ${error.message}, Status Code: ${error.statusCode}`
      );
      throw error;
    } else {
      logger.error('Unexpected error:', error);
      throw new QLinkError('Unexpected error occurred', 500);
    }
  }

  public async sendRequest(request: QLinkRequest<any>): Promise<void> {
    const headerXML = this.getSerializedHeaderXML();
    const dataXML = request.data.toXML();
    const xmlData = this.wrapInQLink(headerXML, dataXML);

    logger.info('Sending QLink request');
    logger.debug(`Request XML: ${xmlData}`);

    try {
      const response = await axiosInstance.post('', xmlData);
      logger.info('Received response from QLink');
      this.handleQLinkResponseErrors(response.data);
    } catch (error: any) {
      this.handleExceptions(error);
    }
  }

  public async sendBulkRequest(request: BulkQLinkRequest<any>): Promise<void> {
    const headerXML = this.getSerializedHeaderXML();
    const bulkDataXML = request.data.map(item => item.toXML()).join('');
    const xmlData = this.wrapInQLink(headerXML, bulkDataXML);

    logger.info('Sending bulk QLink request');
    logger.debug(`Bulk Request XML: ${xmlData}`);

    try {
      const response = await axiosInstance.post('', xmlData);
      logger.info('Received response from QLink for bulk request');
      this.handleQLinkResponseErrors(response.data);
    } catch (error: any) {
      this.handleExceptions(error);
    }
  }
}