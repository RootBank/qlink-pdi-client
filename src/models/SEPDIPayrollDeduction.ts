import { serializeSEPDIPayrollDeductionToXML } from '../serialization/SEPDISerializer';
import { SEPDIPayrollDeductionFields } from '../types';
import { Connection } from '../services/Connection';
import { QLinkError } from '../errors';
import { Logger } from '../utils/Logger';
import Config from '../config';

const config = Config.getInstance();
const logger = new Logger(config.logLevel);

export class SEPDIPayrollDeduction {
  private connection: Connection;
  private fields: Partial<SEPDIPayrollDeductionFields>;

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

  async save(): Promise<void> {
    this.validate();

    const requestData = {
      header: this.connection.connectionConfig,
      data: this
    };

    logger.debug(
      `Saving SEPDI Payroll Deduction with request data: ${JSON.stringify(requestData)}`
    );
    await this.connection.sendRequest(requestData);
  }

  static async saveAll(
    connection: Connection,
    data: SEPDIPayrollDeductionFields[]
  ): Promise<void> {
    const bulkDeductions = data.map(
      fields => new SEPDIPayrollDeduction(connection, fields)
    );

    const bulkRequestData = {
      header: connection.connectionConfig,
      data: bulkDeductions
    };

    logger.debug(
      `Saving bulk SEPDI Payroll Deductions with request data: ${JSON.stringify(bulkRequestData)}`
    );
    await connection.sendBulkRequest(bulkRequestData);
  }
}
