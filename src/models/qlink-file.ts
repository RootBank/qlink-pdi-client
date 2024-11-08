import { EmployeeQueryParameter, SEPDIPayrollDeductionFields, Configuration, CreateInsurancePayrollDeductionFields, DeleteInsurancePayrollDeductionFields, UpdateReferenceFields, UpdateAmountFields } from '../types';
import { Logger } from '../utils/logger-util';
import { SEPDIPayrollDeduction } from './sepdi-payroll-deduction';
import { QLinkRequest } from './qlink-request';
import { Employee } from './government-employee';
import { TranType } from '../enums/tran-type';
import { formatDate, IdFromBirthDate, nullDate } from '../utils/date-helpers';
import { EmployeeStatus } from '../enums/employee-status';
import { MandateCapture } from '../enums/sepdi-flag';
import { QLinkError } from '../errors';
import { QLinkClient } from './qlink-client';

const logger = Logger.getInstance();

export class QLinkFile {
  private readonly qlinkClient: QLinkClient;

  constructor(configuration: Configuration) {
    logger.debug('Initializing QLinkFile...');
    const config: Configuration = {
      baseUrl: configuration.baseUrl || 'https://s3.amazonaws.com/test-bucket',
      username: configuration.username,
      password: configuration.password,
      institution: configuration.institution,
    }
    this.qlinkClient = new QLinkClient(config)
  }

  public async sendBulkRequest(request: QLinkRequest): Promise<string> {
    const fileData = request.toFile();

    logger.info('Creating QLink file');
    logger.info(fileData);
    logger.debug(`\nRequest File:\n${fileData}`);
    return fileData;
  }

  public async createInsurancePayrollDeduction(params: CreateInsurancePayrollDeductionFields): Promise<QLinkRequest> {
    try {
      logger.debug(`Creating new deduction on ${params.payrollIdentifier} Payroll...`);
      logger.debug(`Finding employee: ${params.employeeNumber}`);
      const employee = await this.qlinkClient.queryEmployeeInfo({ employeeNumber: params.employeeNumber, payrollIdentifier: params.payrollIdentifier, idNumber: params.idNumber })
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

      const newPayrollDeduction = new SEPDIPayrollDeduction(this.qlinkClient, deductionFields).lazySave();
      return newPayrollDeduction;
    } catch (error: any) {
      logger.error("new SEPDI Deduction failed", error);
      throw new QLinkError(`new SEPDI Deduction failed. ${error.message}`);
    }
  }

  public async updateDeductionAmount(params: UpdateAmountFields): Promise<QLinkRequest> {
    try {
      logger.debug(`Finding employee: ${params.employeeNumber}`);
      const employee = await this.qlinkClient.queryEmployeeInfo({ employeeNumber: params.employeeNumber, payrollIdentifier: params.payrollIdentifier, idNumber: params.idNumber })
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
      const newPayrollDeduction = new SEPDIPayrollDeduction(this.qlinkClient, deductionFields).lazySave();
      logger.debug("SEPDI Deduction successfully updated");
      return newPayrollDeduction;
    } catch (error: any) {
      logger.error("SEPDI Deduction update failed", error);
      throw new QLinkError(`SEPDI Deduction update failed. ${error.message}`);
    }
  }

  public async updateDeductionReferences(params: UpdateReferenceFields): Promise<QLinkRequest> {
    try {
      logger.debug(`Finding employee: ${params.employeeNumber}`);
      const employee = await this.qlinkClient.queryEmployeeInfo({ employeeNumber: params.employeeNumber, payrollIdentifier: params.payrollIdentifier, idNumber: params.idNumber })
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
      const newPayrollDeduction = new SEPDIPayrollDeduction(this.qlinkClient, deductionFields).lazySave();
      logger.debug("SEPDI Deduction successfully fixed");
      return newPayrollDeduction;
    } catch (error: any) {
      logger.error("SEPDI Deduction fix failed", error);
      throw new QLinkError(`SEPDI Deduction fix failed. ${error.message}`);
    }
  }

  public async deleteDeduction(params: DeleteInsurancePayrollDeductionFields): Promise<QLinkRequest> {
    try {
      logger.debug(`Finding employee: ${params.employeeNumber}`);
      const employee = await this.qlinkClient.queryEmployeeInfo({ employeeNumber: params.employeeNumber, payrollIdentifier: params.payrollIdentifier, idNumber: params.idNumber })
      logger.debug(`Found employee: ${employee.employeeNumber}`);
      if (employee.empStatus != EmployeeStatus.CURRENT) {
        throw new QLinkError(`Employee (${employee.employeeNumber}) is not currently employed: ${employee.empStatus} ${employee.empStatusReason}`);
      }

      const deductionFields: SEPDIPayrollDeductionFields = {
        amount: params.amount,
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
      const deduction = new SEPDIPayrollDeduction(this.qlinkClient, deductionFields).lazySave();
      logger.debug("SEPDI Deduction successfully deleted");
      return deduction;
    } catch (error: any) {
      logger.error("SEPDI Deduction deletion failed", error);
      throw new QLinkError(`SEPDI Deduction deletion failed. ${error.message}`);
    }
  }
}
