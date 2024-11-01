import { TranType } from '../enums/TranType';
import { SEPDIPayrollDeductionFields } from '../types';
import { js2xml } from 'xml-js';
import { formatCentsToCharString } from '../utils/stringHelpers'

// SEPDI = General deductions, e.g. Insurance, Unions.
export function serializeSEPDIPayrollDeductionToXML(
  fields: SEPDIPayrollDeductionFields
): string {
  const options = { compact: true, ignoreComment: true, spaces: 4 };
  const sepdiData = {
    DATA: {
      ADMIN_COST: fields.adminCost || '',
      AMOUNT: formatCentsToCharString(fields.amount),
      APP_CODE: fields.appCode || '',
      ARR_INSTALLMENT: fields.arrInstallment || '',
      BALANCE: formatCentsToCharString(fields.balance),
      CORR_REF_NO: fields.corrRefNo || '',
      DEDUCT_TYPE: fields.deductionType,
      EMPL_NO: fields.employeeNumber,
      END_DATE: fields.endDate || '',
      ERR_CODE: fields.errorCode || '',
      FLAG: fields.flag || '',
      IDNO: fields.idNumber || '',
      INFL_UPD: fields.inflationUpdate || '',
      INITIALS: fields.initials || '',
      INT_PAYABLE: fields.interestPayable || '',
      INTERMEDIARY_ID: fields.intermediaryId || '',
      LOAN_AMNT: formatCentsToCharString(fields.loanAmount),
      NEW_DEDUCT_TYPE: fields.newDeductType || '',
      NRR_NUBMER: fields.nrrNumber || '',
      OLD_EMPL_NO: fields.oldEmployeeNumber || '',
      PERCENTAGE: formatCentsToCharString(fields.percentage, 5),
      REFERENCE_NO: fields.referenceNumber,
      RES_NUMBER: fields.resNumber || '',
      START_DATE: fields.startDate,
      SURNAME: fields.surname,
      TRANTYPE: fields.transactionType || TranType.NONE
    }
  };
  return js2xml(sepdiData, options);
}
