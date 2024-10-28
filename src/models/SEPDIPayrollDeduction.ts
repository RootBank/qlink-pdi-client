import { parseSEPDIPayrollDeductionFromXML } from '../serialization/SEPDIParser';
import { serializeSEPDIPayrollDeductionToXML } from '../serialization/SEPDISerializer';
import { SEPDIPayrollDeductionFields } from '../types';
import { Connection } from './Connection';
import { QLinkError } from '../errors';
import { Logger } from '../utils/Logger';
import Config from '../config';

const config = Config.getInstance();
const logger = new Logger(config.logLevel);

export class SEPDIPayrollDeduction {
  private connection: Connection;
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
      throw new QLinkError('Employee ID is required');
    }
    if (!this.fields.amount || this.fields.amount <= 0) {
      throw new QLinkError('Amount must be greater than 0');
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
