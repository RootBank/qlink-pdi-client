import { TranType } from '../enums/tran-type';
import { SEPDIPayrollDeductionFields } from '../types';
import { js2xml } from 'xml-js';
import { formatToCharString } from '../utils/string-helpers'

// SEPDI = General deductions, e.g. Insurance, Unions.
export function serializeSEPDIPayrollDeductionToXML(
  fields: SEPDIPayrollDeductionFields
): string {
  const options = { compact: true, ignoreComment: true, spaces: 4 };
  const sepdiData = {
    DATA: {
      AMOUNT: formatToCharString(fields.amount),
      BALANCE: formatToCharString(fields.balance),
      CORR_REF_NO: fields.corrRefNo,
      DEDUCT_TYPE: fields.deductionType,
      EMPL_NO: fields.employeeNumber,
      END_DATE: fields.endDate,
      ERR_CODE: fields.errorCode,
      FLAG: fields.flag,
      IDNO: fields.idNumber,
      INFL_UPD: fields.inflationUpdate,
      INITIALS: fields.initials,
      INTERMEDIARY_ID: fields.intermediaryId,
      NEW_DEDUCT_TYPE: fields.newDeductType,
      REFERENCE_NO: fields.referenceNumber,
      START_DATE: fields.startDate,
      SURNAME: fields.surname,
      TRANTYPE: fields.tranType || TranType.NONE
    }
  };
  return js2xml(sepdiData, options);
}
