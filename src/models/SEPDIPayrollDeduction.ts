import { parseSEPDIPayrollDeductionFromXML } from '../serialization/SEPDIParser';
import { serializeSEPDIPayrollDeductionToXML } from '../serialization/SEPDISerializer';
import { SEPDIPayrollDeductionFields } from '../types';
import { Connection } from './Connection';
import { QLinkError } from '../errors';
import { Logger } from '../utils/Logger';
import { PayrollIdentifier } from '../enums/PayrollIdentifier';
import { TranType } from '../enums/TranType';
import Config from '../config';

const config = Config.getInstance();
const logger = new Logger(config.logLevel);

export class SEPDIPayrollDeduction {
  public connection: Connection;
  public fields: Partial<SEPDIPayrollDeductionFields>;

  constructor(
    connection: Connection,
    fields: Partial<SEPDIPayrollDeductionFields> = {}
  ) {
    this.connection = connection;
    this.fields = fields;
  }

  toXML(): string {
    this.validate();
    const serializedXML = serializeSEPDIPayrollDeductionToXML(
      this.fields as SEPDIPayrollDeductionFields
    );

    logger.debug(`Serialized SEPDI Payroll Deduction XML: ${serializedXML}`);
    return serializedXML;
  }

  setField<K extends keyof SEPDIPayrollDeductionFields>(
    key: K,
    value: SEPDIPayrollDeductionFields[K]
  ) {
    this.fields[key] = value;
  }

  validate(): void {
    if (!this.fields.employeeNumber) {
      throw new QLinkError('Employee Number is required.');
    }
    if (!this.fields.amount || !Number.isInteger(this.fields.amount) || this.fields.amount <= 0) {
      throw new QLinkError('Amount (cents) must be an integer greater than 0');
    }
    if (!this.fields.idNumber) {
      throw new QLinkError('Employee ID number is required. If unknown use last six digits of the employee date of birth with seven trailing 0 padding');
    }
    if (this.fields.idNumber.length != 13) {
      throw new QLinkError('Employee ID number must be 13 chars long.');
    }
    if (this.connection.connectionConfig.payrollIdentifier === PayrollIdentifier.PERSAL) {
      if (!this.fields.startDate) {
        if (this.fields.transactionType === TranType.NEW_DEDUCTION) {
          throw new QLinkError('START_DATE is required for new deductions on PERSAL payroll identifier.');
        }
        throw new QLinkError('START_DATE is required on PERSAL payroll identifier.');
      }
      const startDate = new Date(this.fields.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDate <= today) {
        throw new QLinkError('START_DATE must be in the future.');
      }
      if (startDate.getDate() !== 1) {
        throw new QLinkError('START_DATE must be the first day of the month.');
      }
      if (this.fields.transactionType === TranType.DELETION && this.fields.endDate) {
        const endDate = new Date(this.fields.endDate);

        const lastDayOfMonth = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate();
        if (endDate.getDate() !== lastDayOfMonth) {
          throw new QLinkError('END_DATE must be the last day of the month for DELETION transactions.');
        }
      }
    }
    // Add other validations as necessary
  }

  async save(): Promise<SEPDIPayrollDeduction> {
    this.validate();

    const requestData = {
      header: this.connection.connectionConfig,
      data: this
    };

    logger.debug(
      `Saving SEPDI Payroll Deduction with request data: ${JSON.stringify(requestData)}`
    );
    try {
      const responseXML = await this.connection.sendRequest(requestData);

      return parseSEPDIPayrollDeductionFromXML(this.connection, responseXML);
    } catch (error) {
      logger.error('Failed to save SEPDI Payroll Deduction', error);
      throw error;
    }
  }
}
