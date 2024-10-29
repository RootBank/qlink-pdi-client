import { EmployeeFields } from '../types';
import { Connection } from './Connection';
import { QLinkError } from '../errors';
import { Logger } from '../utils/Logger';
import Config from '../config';
import { serializeEmployeeToXML } from '../serialization/EmployeeSerializer';
import { parseEmployeeFromXML } from '../serialization/EmployeeParser';
import { EmployeeStatus } from '../enums/EmployeeStatus';
import { EmployeeStatusReason } from '../enums/EmployeeStatusReason';

const config = Config.getInstance();
const logger = new Logger(config.logLevel);

export class Employee {
  private connection: Connection;
  public fields: Partial<EmployeeFields>;

  constructor(connection: Connection, fields: Partial<EmployeeFields> = {}) {
    this.connection = connection;
    this.fields = fields;
  }

  setField<K extends keyof EmployeeFields>(key: K, value: EmployeeFields[K]) {
    this.fields[key] = value;
  }

  validate(): void {
    if (!this.fields.employeeNumber) {
      throw new QLinkError('Employee Number is required');
    }
  }

  toXML(): string {
    this.validate();
    return serializeEmployeeToXML(this.fields as EmployeeFields);
  }

  async find(): Promise<Employee> {
    const requestData = {
      header: this.connection.connectionConfig,
      data: this
    };

    logger.debug(
      `Find employee with request data: ${JSON.stringify(requestData)}`
    );
    const responseXML = await this.connection.sendRequest(requestData);
    logger.debug(
      `Found employe with response data: ${JSON.stringify(responseXML)}`
    );
    return parseEmployeeFromXML(this.connection, responseXML);
  }

  get employeeNumber(): string | undefined {
    return this.fields.employeeNumber;
  }
  set employeeNumber(value: string | undefined) {
    this.fields.employeeNumber = value;
  }

  get idNumber(): string | undefined {
    return this.fields.idNumber;
  }
  set idNumber(value: string | undefined) {
    this.fields.idNumber = value;
  }

  get referenceNumber(): string | undefined {
    return this.fields.referenceNumber;
  }
  set referenceNumber(value: string | undefined) {
    this.fields.referenceNumber = value;
  }

  get address1(): string | undefined {
    return this.fields.address1;
  }
  set address1(value: string | undefined) {
    this.fields.address1 = value;
  }

  get address2(): string | undefined {
    return this.fields.address2;
  }
  set address2(value: string | undefined) {
    this.fields.address2 = value;
  }

  get address3(): string | undefined {
    return this.fields.address3;
  }
  set address3(value: string | undefined) {
    this.fields.address3 = value;
  }

  get address4(): string | undefined {
    return this.fields.address4;
  }
  set address4(value: string | undefined) {
    this.fields.address4 = value;
  }

  get appCode(): string | undefined {
    return this.fields.appCode;
  }
  set appCode(value: string | undefined) {
    this.fields.appCode = value;
  }

  get birthDate(): string | undefined {
    return this.fields.birthDate;
  }
  set birthDate(value: string | undefined) {
    this.fields.birthDate = value;
  }

  get contactPerson(): string | undefined {
    return this.fields.contactPerson;
  }
  set contactPerson(value: string | undefined) {
    this.fields.contactPerson = value;
  }

  get emplNumber(): string | undefined {
    return this.fields.emplNumber;
  }
  set emplNumber(value: string | undefined) {
    this.fields.emplNumber = value;
  }

  get empName(): string | undefined {
    return this.fields.empName;
  }
  set empName(value: string | undefined) {
    this.fields.empName = value;
  }

  get empStatus(): number | undefined {
    return this.fields.empStatus;
  }
  get empStatusDescription(): string | undefined {
    return this.fields.empStatus !== undefined
      ? EmployeeStatus[this.fields.empStatus]
      : undefined;
  }
  set empStatus(value: number | undefined) {
    this.fields.empStatus = value;
  }

  get empStatusReason(): number | undefined {
    return this.fields.empStatusReason;
  }
  get empStatusReasonDescription(): string | undefined {
    return this.fields.empStatusReason !== undefined
      ? EmployeeStatusReason[this.fields.empStatusReason]
      : undefined;
  }
  set empStatusReason(value: number | undefined) {
    this.fields.empStatusReason = value;
  }

  get intermediaryId(): string | undefined {
    return this.fields.intermediaryId;
  }
  set intermediaryId(value: string | undefined) {
    this.fields.intermediaryId = value;
  }

  get loanAmount(): string | undefined {
    return this.fields.loanAmount;
  }
  set loanAmount(value: string | undefined) {
    this.fields.loanAmount = value;
  }

  get newDeductType(): string | undefined {
    return this.fields.newDeductType;
  }
  set newDeductType(value: string | undefined) {
    this.fields.newDeductType = value;
  }

  get nrrNumber(): string | undefined {
    return this.fields.nrrNumber;
  }
  set nrrNumber(value: string | undefined) {
    this.fields.nrrNumber = value;
  }

  get oldEmployeeNumber(): string | undefined {
    return this.fields.oldEmployeeNumber;
  }
  set oldEmployeeNumber(value: string | undefined) {
    this.fields.oldEmployeeNumber = value;
  }

  get payOrg(): string | undefined {
    return this.fields.payOrg;
  }
  set payOrg(value: string | undefined) {
    this.fields.payOrg = value;
  }

  get payPoint(): string | undefined {
    return this.fields.payPoint;
  }
  set payPoint(value: string | undefined) {
    this.fields.payPoint = value;
  }

  get payBur(): string | undefined {
    return this.fields.payBur;
  }
  set payBur(value: string | undefined) {
    this.fields.payBur = value;
  }

  get percentage(): string | undefined {
    return this.fields.percentage;
  }
  set percentage(value: string | undefined) {
    this.fields.percentage = value;
  }

  get postalCode(): string | undefined {
    return this.fields.postalCode;
  }
  set postalCode(value: string | undefined) {
    this.fields.postalCode = value;
  }

  get resignationDate(): string | undefined {
    return this.fields.resignationDate;
  }
  set resignationDate(value: string | undefined) {
    this.fields.resignationDate = value;
  }

  get surname(): string | undefined {
    return this.fields.surname;
  }
  set surname(value: string | undefined) {
    this.fields.surname = value;
  }

  get telephone(): string | undefined {
    return this.fields.telephone;
  }
  set telephone(value: string | undefined) {
    this.fields.telephone = value;
  }

  get tempInd(): string | undefined {
    return this.fields.tempInd;
  }
  set tempInd(value: string | undefined) {
    this.fields.tempInd = value;
  }
}
