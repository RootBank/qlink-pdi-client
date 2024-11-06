import { EmployeeQueryParameter } from '../types';
import { QLinkClient } from './qlink-client';
import { QLinkError } from '../errors';
import { Logger } from '../utils/logger-util';
import { serializeEmployeeQueryParametersToXML } from '../serialization/employee-serializer';
import { parseEmployeeFromXML } from '../serialization/employee-parser';
import { EmployeeStatus } from '../enums/employee-status';
import { EmployeeStatusReason } from '../enums/employee-status-reason';
import { TransactionType } from '../enums/transaction-type';
import { PayrollIdentifier } from '../enums/payroll-identifier';
import { QLinkBase } from './qlink-base';
import { Header } from './header';
import { QLinkRequest } from './qlink-request';

const logger = Logger.getInstance();

export class Employee extends QLinkBase implements EmployeeQueryParameter {
  employeeNumber: string; // used for querying in EmployeeQueryParameter
  idNumber?: string; // used for querying in EmployeeQueryParameter
  referenceNumber?: string; // used for querying in EmployeeQueryParameter
  payrollIdentifier: PayrollIdentifier;

  address1?: string;
  address2?: string;
  address3?: string;
  address4?: string;
  appCode?: string;
  birthDate?: string;
  contactPerson?: string;
  emplNumber?: string; // EMPLNO (response)
  empName?: string;
  empStatus?: EmployeeStatus; // Employee status code (e.g., 0 = Current)
  empStatusReason?: EmployeeStatusReason; // Reason for the status (e.g., 0 = Current)
  intermediaryId?: string;
  loanAmount?: string;
  newDeductType?: string;
  nrrNumber?: string;
  oldEmployeeNumber?: string;
  payOrg?: string; // Payroll organization
  payPoint?: string; // Pay point code
  payBur?: string; // Payroll bureau (e.g., NUC)
  percentage?: string;
  postalCode?: string;
  resignationDate?: string;
  surname?: string;
  telephone?: string;
  tempInd?: string; // Temporary status indicator (e.g., P)

  constructor(queryParameters: EmployeeQueryParameter, fields: Partial<Employee> = {}) {
    super();
    this.employeeNumber = queryParameters.employeeNumber;
    this.payrollIdentifier = queryParameters.payrollIdentifier;
    this.idNumber = queryParameters.idNumber;
    this.referenceNumber = queryParameters.referenceNumber;
    Object.assign(this, fields);
  }

  private validate(): Employee {
    if (!this.employeeNumber) {
      throw new QLinkError('Employee Number is required');
    }
    return this
  }

  toXML(): string {
    this.validate();
    return serializeEmployeeQueryParametersToXML({ employeeNumber: this.employeeNumber, payrollIdentifier: this.payrollIdentifier, idNumber: this.idNumber, referenceNumber: this.referenceNumber });
  }

  static async find(client: QLinkClient, queryParams: EmployeeQueryParameter): Promise<Employee> {
    const header = new Header(client.connectionConfig(), { transactionType: TransactionType.EMPLOYEE_ENQUIRIES, payrollIdentifier: queryParams.payrollIdentifier });
    const data = new Employee(queryParams);
    const requestData = new QLinkRequest(header, data);

    logger.debug(
      `Find employee with request data: ${JSON.stringify(requestData)}`
    );
    const responseXML = await client.sendRequest(requestData);
    logger.debug(
      `Found employe with response data: ${JSON.stringify(responseXML)} `
    );
    const employeeFields = await parseEmployeeFromXML(responseXML);
    return new Employee({ ...employeeFields }, { ...employeeFields });
  }
}
