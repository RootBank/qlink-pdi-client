import { serializeFEPDIPayrollDeductionToXML } from '../serialization/FEPDISerializer';
import { FEPDIPayrollDeductionFields } from '../types';
import { Connection } from './Connection';
import { QLinkError } from '../errors';

export class FEPDIPayrollDeduction {
  private connection: Connection;
  private fields: Partial<FEPDIPayrollDeductionFields>;

  constructor(
    connection: Connection,
    fields: Partial<FEPDIPayrollDeductionFields> = {}
  ) {
    this.connection = connection;
    this.fields = fields;
  }

  setField<K extends keyof FEPDIPayrollDeductionFields>(
    key: K,
    value: FEPDIPayrollDeductionFields[K]
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
  }

  toXML(): string {
    this.validate();
    return serializeFEPDIPayrollDeductionToXML(
      this.fields as FEPDIPayrollDeductionFields
    );
  }

  async save(): Promise<void> {
    this.validate();

    await this.connection.sendRequest({
      header: this.connection.connectionConfig,
      data: this
    });
  }

  static async saveAll(
    connection: Connection,
    data: FEPDIPayrollDeductionFields[]
  ): Promise<void> {
    const bulkDeductions = data.map(
      fields => new FEPDIPayrollDeduction(connection, fields)
    );
    await connection.sendBulkRequest({
      header: connection.connectionConfig,
      data: bulkDeductions
    });
  }
}
