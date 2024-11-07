import axios, { Axios, AxiosError } from 'axios';
import { QLinkError } from '../errors';
import { EmployeeQueryParameter, SEPDIPayrollDeductionFields, Configuration, CreateInsurancePayrollDeductionFields, DeleteInsurancePayrollDeductionFields, UpdateReferenceFields, UpdateAmountFields } from '../types';
import { Logger } from '../utils/logger-util';
import { QLinkStatusCode } from '../enums/qlink-status-code';
import { CommunicationTest } from './communication-test';
import { SEPDIPayrollDeduction } from './sepdi-payroll-deduction';
import { QLinkRequest } from './qlink-request';
import { Employee } from './government-employee';
import { TranType } from '../enums/tran-type';
import { formatDate, IdFromBirthDate, nullDate } from '../utils/date-helpers';
import { EmployeeStatus } from '../enums/employee-status';
import { DeductionType } from '../enums/deduction-type';
import { MandateCapture } from '../enums/sepdi-flag';
import { formatToCharString } from '../utils/string-helpers';

const logger = Logger.getInstance();

export class QLinkClient {
  public readonly baseUrl: string;
  public readonly username: string;
  public readonly password: string;
  public readonly institution: number;
  private readonly axiosInstance: Axios;

  constructor(configuration: Configuration) {
    logger.debug('Initializing QLinkClient...');
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
    } catch (error: any) {
      logger.error("Connection test FAILED", error);
      throw new QLinkError(error.message);
    }
  }

  public async queryEmployeeInfo(params: EmployeeQueryParameter): Promise<Employee> {
    try {
      logger.debug(`Finding Employee on ${params.payrollIdentifier} Payroll...`);
      const employee = await Employee.find(this, params);
      logger.debug("Employee found");
      return employee;
    } catch (error: any) {
      logger.error("Failed to find employee", error);
      throw new QLinkError(`Failed to find employee. ${error.message}`);
    }
  }

  public async createInsurancePayrollDeduction(params: CreateInsurancePayrollDeductionFields): Promise<SEPDIPayrollDeduction> {
    try {
      logger.debug(`Creating new deduction on ${params.payrollIdentifier} Payroll...`);
      logger.debug(`Finding employee: ${params.employeeNumber}`);
      const employee = await this.queryEmployeeInfo({ employeeNumber: params.employeeNumber, payrollIdentifier: params.payrollIdentifier, idNumber: params.idNumber })
      logger.debug(`Found employee: ${employee.employeeNumber}`);
      if (employee.empStatus != EmployeeStatus.CURRENT) {
        throw new QLinkError(`Employee (${employee.employeeNumber}) is not currently employed: ${employee.empStatus} ${employee.empStatusReason}`);
      }

      const deductionFields: SEPDIPayrollDeductionFields = {
        payrollIdentifier: params.payrollIdentifier,
        amount: params.amount,
        deductionType: params.deductionType,
        employeeNumber: params.employeeNumber,
        flag: params.mandateCapturedOn,
        referenceNumber: params.referenceNumber,
        tranType: TranType.NEW_DEDUCTION,
        effectiveSalaryMonth: params.effectiveSalaryMonth ? params.effectiveSalaryMonth : formatDate(params.beginDeductionFrom).ccyyMM,
        startDate: formatDate(params.beginDeductionFrom).ccyyMM01,

        idNumber: params.idNumber ? params.idNumber : IdFromBirthDate(employee.birthDate as string),
        surname: params.surname ? (params.surname) : (employee.surname ? employee.surname : "SURNAME"),
        initials: employee.empName ? employee.empName.split(" ")[0]?.slice(0, 2) : "A A",
        endDate: params.endDate,
      } as SEPDIPayrollDeductionFields

      logger.debug(`Creating SEPDI Deduction for employee: ${JSON.stringify(deductionFields)}`);
      const newPayrollDeduction = await new SEPDIPayrollDeduction(this, deductionFields).save();
      logger.debug("new SEPDI Deduction successfully created");
      return newPayrollDeduction;
    } catch (error: any) {
      logger.error("new SEPDI Deduction failed", error);
      throw new QLinkError(`new SEPDI Deduction failed. ${error.message}`);
    }
  }

  public async updateDeductionAmount(params: UpdateAmountFields): Promise<SEPDIPayrollDeduction> {
    try {
      logger.debug(`Finding employee: ${params.employeeNumber}`);
      const employee = await this.queryEmployeeInfo({ employeeNumber: params.employeeNumber, payrollIdentifier: params.payrollIdentifier, idNumber: params.idNumber })
      logger.debug(`Found employee: ${employee.employeeNumber}`);
      if (employee.empStatus != EmployeeStatus.CURRENT) {
        throw new QLinkError(`Employee (${employee.employeeNumber}) is not currently employed: ${employee.empStatus} ${employee.empStatusReason}`);
      }

      const deductionFields: SEPDIPayrollDeductionFields = {
        payrollIdentifier: params.payrollIdentifier,
        amount: params.amount,
        deductionType: params.deductionType,
        employeeNumber: params.employeeNumber,
        flag: MandateCapture.UNKNOWN,
        referenceNumber: params.referenceNumber,
        tranType: TranType.UPDATE_EXISTING_DEDUCTION,
        effectiveSalaryMonth: params.effectiveSalaryMonth ? params.effectiveSalaryMonth : formatDate(params.beginDeductionFrom).ccyyMM,
        startDate: formatDate(params.beginDeductionFrom).ccyyMM01,

        idNumber: params.idNumber ? params.idNumber : IdFromBirthDate(employee.birthDate as string),
        surname: params.surname ? (params.surname) : (employee.surname ? employee.surname : "SURNAME"),
        initials: employee.empName ? employee.empName.split(" ")[0]?.slice(0, 2) : "A A",
        endDate: params.endDate,
      }

      logger.debug(`Updating SEPDI Deduction for employee: ${JSON.stringify(deductionFields)}`);
      const newPayrollDeduction = await new SEPDIPayrollDeduction(this, deductionFields).save();
      logger.debug("SEPDI Deduction successfully updated");
      return newPayrollDeduction;
    } catch (error: any) {
      logger.error("SEPDI Deduction update failed", error);
      throw new QLinkError(`SEPDI Deduction update failed. ${error.message}`);
    }
  }

  public async updateDeductionReferences(params: UpdateReferenceFields): Promise<SEPDIPayrollDeduction> {
    try {
      logger.debug(`Finding employee: ${params.employeeNumber}`);
      const employee = await this.queryEmployeeInfo({ employeeNumber: params.employeeNumber, payrollIdentifier: params.payrollIdentifier, idNumber: params.idNumber })
      logger.debug(`Found employee: ${employee.employeeNumber}`);
      if (employee.empStatus != EmployeeStatus.CURRENT) {
        throw new QLinkError(`Employee (${employee.employeeNumber}) is not currently employed: ${employee.empStatus} ${employee.empStatusReason}`);
      }

      const deductionFields: SEPDIPayrollDeductionFields = {
        payrollIdentifier: params.payrollIdentifier,
        amount: 0,
        deductionType: params.deductionType,
        flag: MandateCapture.UNKNOWN,
        employeeNumber: params.employeeNumber,
        referenceNumber: params.referenceNumber,
        corrRefNo: params.correctReferenceNumber,
        newDeductType: params.newDeductionType,
        tranType: TranType.CHANGE_REF_OR_DEDUCT_TYPE,
        effectiveSalaryMonth: params.effectiveSalaryMonth ? params.effectiveSalaryMonth : formatDate(params.beginDeductionFrom).ccyyMM,
        startDate: formatDate(params.beginDeductionFrom).ccyyMM01,

        idNumber: params.idNumber ? params.idNumber : IdFromBirthDate(employee.birthDate as string),
        surname: params.surname ? (params.surname) : (employee.surname ? employee.surname : "SURNAME"),
        initials: employee.empName ? employee.empName.split(" ")[0]?.slice(0, 2) : "A A",
        endDate: params.endDate,
      }

      logger.debug(`Fixing SEPDI Deduction for employee: ${JSON.stringify(deductionFields)}`);
      const newPayrollDeduction = await new SEPDIPayrollDeduction(this, deductionFields).save();
      logger.debug("SEPDI Deduction successfully fixed");
      return newPayrollDeduction;
    } catch (error: any) {
      logger.error("SEPDI Deduction fix failed", error);
      throw new QLinkError(`SEPDI Deduction fix failed. ${error.message}`);
    }
  }

  public async deleteDeduction(params: DeleteInsurancePayrollDeductionFields): Promise<SEPDIPayrollDeduction> {
    try {
      logger.debug(`Finding employee: ${params.employeeNumber}`);
      const employee = await this.queryEmployeeInfo({ employeeNumber: params.employeeNumber, payrollIdentifier: params.payrollIdentifier, idNumber: params.idNumber })
      logger.debug(`Found employee: ${employee.employeeNumber}`);
      if (employee.empStatus != EmployeeStatus.CURRENT) {
        throw new QLinkError(`Employee (${employee.employeeNumber}) is not currently employed: ${employee.empStatus} ${employee.empStatusReason}`);
      }

      const deductionFields: SEPDIPayrollDeductionFields = {
        amount: 0,
        payrollIdentifier: params.payrollIdentifier,
        employeeNumber: params.employeeNumber,
        referenceNumber: params.referenceNumber,
        tranType: TranType.DELETION,
        deductionType: params.deductionType,
        flag: MandateCapture.UNKNOWN,
        effectiveSalaryMonth: formatDate(params.cancelDeductionFrom).ccyyMM,
        endDate: formatDate(params.cancelDeductionFrom).ccyyMMLastDayOfPreviousMonth,
        startDate: nullDate(),

        idNumber: params.idNumber ? params.idNumber : IdFromBirthDate(employee.birthDate as string),
        surname: params.surname ? (params.surname) : (employee.surname ? employee.surname : "SURNAME"),
        initials: employee.empName ? employee.empName.split(" ")[0]?.slice(0, 2) : "A A",
      }

      logger.debug(`Deleting SEPDI Deduction for employee: ${JSON.stringify(deductionFields)}`);
      const deduction = await new SEPDIPayrollDeduction(this, deductionFields).save();
      logger.debug("SEPDI Deduction successfully deleted");
      return deduction;
    } catch (error: any) {
      logger.error("SEPDI Deduction deletion failed", error);
      throw new QLinkError(`SEPDI Deduction deletion failed. ${error.message}`);
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
