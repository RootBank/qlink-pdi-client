import { axiosInstance, isAxiosError } from '../axiosConfig';
import { QLinkError } from '../errors';
import { QLinkRequest, BulkQLinkRequest, ConnectionFields } from '../types';
import { serializeHeaderToXML } from '../serialization/HeaderSerializer';
import { Logger } from '../utils/Logger';
import Config from '../config';
import { TransactionType } from '../enums/TransactionType';
import { QLinkStatusCode } from '../enums/QlinkErrorCode';

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
      !password
    ) {
      logger.error('Missing required connection fields');
      throw new QLinkError('All required connection fields must be provided');
    }
    if (transaction_type === TransactionType.Q_LINK_TRANSACTIONS) {
      if (!effectiveSalaryMonth || !/^\d{6}$/.test(effectiveSalaryMonth)) {
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
    const errCodeMatch = responseData.match(/<ERR_CODE>(\d+)<\/ERR_CODE>/);
    const errMsgMatch = responseData.match(/<ERR_MSG>(.*?)<\/ERR_MSG>/);

    const errCodeString = errCodeMatch?.[1];
    const errCode = Number(errCodeString);

    if (isNaN(errCode) || errCode === QLinkStatusCode.Ok) {
      logger.info(`QLink API response successful: Status Code: ${errCodeString || '0'}`);
      return;
    }

    const errMsg = errMsgMatch?.[1] || QLinkStatusCode[errCode as QLinkStatusCode] || 'Unknown error';

    logger.error(`QLink API error: ${errMsg}, Status Code: ${errCodeString}\n${responseData}`);
    throw new QLinkError(`QLink API error: ${errMsg}`, errCode);
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

  public async sendRequest(request: QLinkRequest<any>): Promise<string> {
    const headerXML = this.getSerializedHeaderXML();
    const dataXML = request.data.toXML();
    const xmlData = this.wrapInQLink(headerXML, dataXML);

    logger.info('Sending QLink request');
    logger.debug(`Request XML:\n${xmlData}`);

    try {
      const response = await axiosInstance.post('', xmlData);
      logger.info('Received response from QLink');
      this.handleQLinkResponseErrors(response.data);
      return response.data;
    } catch (error: any) {
      this.handleExceptions(error);
      throw new Error('Request failed and no response was received.');
    }
  }
}
