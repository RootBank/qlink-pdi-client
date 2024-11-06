import axios, { Axios, AxiosError } from 'axios';
import { QLinkError } from '../errors';
import { EmployeeQueryParameter, SEPDIPayrollDeductionFields, Configuration } from '../types';
import { Logger } from '../utils/logger-util';
import { QLinkStatusCode } from '../enums/qlink-status-code';
import { CommunicationTest } from './communication-test';
import { SEPDIPayrollDeduction } from './sepdi-payroll-deduction';
import { QLinkRequest } from './qlink-request';
import { Employee } from './government-employee';
import { TranType } from '../enums/tran-type';

const logger = Logger.getInstance();

export class QlinkClient {
  public readonly baseUrl: string;
  public readonly username: string;
  public readonly password: string;
  public readonly institution: number;
  private readonly axiosInstance: Axios;

  constructor(configuration: Configuration) {
    logger.debug('Initializing QlinkClient...');
    this.baseUrl = configuration.baseUrl || 'https://govtest.qlink.co.za/cgi-bin/XmlProc';
    this.username = configuration.username;
    this.password = configuration.password;
    this.institution = configuration.institution;
    this.axiosInstance = axios.create({
      baseURL: configuration.baseUrl,
      headers: {
        'Content-Type': 'application/xml'
      },
      timeout: 5000
    });


    this.validateConfig();
  }

  connectionConfig(): Configuration {
    return {
      institution: this.institution,
      username: this.username,
      password: this.password,
      baseUrl: this.baseUrl
    } as Configuration;
  }

  private isAxiosError = (error: unknown): error is AxiosError => {
    return axios.isAxiosError(error);
  };

  private validateConfig(): void {
    logger.debug('Validating connection configuration');
    if (
      !this.username?.trim() ||
      !this.password?.trim() ||
      !this.baseUrl?.trim()
    ) {
      logger.error('Missing required connection fields');
      throw new QLinkError('All required connection fields must be provided');
    }
  }

  public async sendRequest(request: QLinkRequest): Promise<string> {
    const xmlData = request.toXML()

    logger.info('Sending QLink request');
    logger.debug(`Request XML:\n${xmlData}`);

    try {
      const response = await this.axiosInstance.post('', xmlData);
      logger.info('Received response from QLink');
      this.handleQLinkResponseErrors(response.data);
      return response.data;
    } catch (error: any) {
      this.handleExceptions(error);
      throw new Error('Request failed and no response was received.');
    }
  }

  public async testConnection(): Promise<boolean> {
    try {
      logger.debug("Testing Qlink API connection...");
      const isConnected = await new CommunicationTest(this).run();
      logger.debug("Connection status: SUCCESSFULLY CONNECTED");
      return isConnected;
    } catch (error) {
      logger.error("Connection test FAILED", error);
      throw new QLinkError("Connection test failed. Please verify your credentials and endpoint.");
    }
  }

  public async queryEmployeeInfo(params: EmployeeQueryParameter): Promise<Employee> {
    try {
      logger.debug(`Finding Employee on ${params.payrollIdentifier} Payroll...`);
      const employee = await Employee.find(this, params);
      logger.debug("Employee found");
      return employee;
    } catch (error) {
      logger.error("Failed to find employee", error);
      throw new QLinkError("Failed to find employee");
    }
  }

  public async createInsurancePayrollDeduction(params: SEPDIPayrollDeductionFields): Promise<SEPDIPayrollDeduction> {
    try {
      logger.debug(`Creating new deduction on ${params.payrollIdentifier} Payroll...`);
      const isConnected = await new SEPDIPayrollDeduction(this, { ...params, tranType: TranType.NEW_DEDUCTION }).save();
      logger.debug("new SEPDI Deduction successfully created");
      return isConnected;
    } catch (error) {
      logger.error("new SEPDI Deduction failed", error);
      throw new QLinkError("new SEPDI Deduction failed");
    }
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
    if (this.isAxiosError(error)) {
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
}
