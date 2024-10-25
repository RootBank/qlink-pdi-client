/* eslint-disable indent */
// src/factories/PayrollDeductionFactory.ts

import { Connection } from '../services/Connection';
import { DeductionType } from '../enums/DeductionType';
import { SEPDIPayrollDeduction } from '../models/SEPDIPayrollDeduction';
import { FEPDIPayrollDeduction } from '../models/FEPDIPayrollDeduction';
import {
  PayrollDeductionFields,
  SEPDIPayrollDeductionFields,
  FEPDIPayrollDeductionFields
} from '../types';
import { QLinkError } from '../errors';

export class PayrollDeductionFactory {
  static create(
    connection: Connection,
    type: DeductionType,
    fields: PayrollDeductionFields
  ) {
    switch (type) {
      case DeductionType.SEPDI:
        return new SEPDIPayrollDeduction(
          connection,
          fields as SEPDIPayrollDeductionFields
        );
      case DeductionType.FEPDI:
        return new FEPDIPayrollDeduction(
          connection,
          fields as FEPDIPayrollDeductionFields
        );
      default:
        throw new QLinkError(`Unsupported deduction type: ${type}`);
    }
  }

  static createAll(
    connection: Connection,
    type: DeductionType,
    data: SEPDIPayrollDeductionFields[] | FEPDIPayrollDeductionFields[]
  ) {
    if (
      type === DeductionType.SEPDI &&
      data.every(item => this.isSEPDIFields(item))
    ) {
      return data.map(fields =>
        this.create(connection, type, fields as SEPDIPayrollDeductionFields)
      );
    } else if (
      type === DeductionType.FEPDI &&
      data.every(item => this.isFEPDIFields(item))
    ) {
      return data.map(fields =>
        this.create(connection, type, fields as FEPDIPayrollDeductionFields)
      );
    } else {
      throw new QLinkError(`Invalid data for deduction type: ${type}`);
    }
  }

  private static isSEPDIFields(
    fields: PayrollDeductionFields
  ): fields is SEPDIPayrollDeductionFields {
    return 'employeeNumber' in fields && 'deductionType' in fields;
  }

  private static isFEPDIFields(
    fields: PayrollDeductionFields
  ): fields is FEPDIPayrollDeductionFields {
    return 'employeeNumber' in fields && 'deductionType' in fields;
  }
}
