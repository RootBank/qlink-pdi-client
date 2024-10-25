import { FEPDIPayrollDeductionFields } from '../types';
import { js2xml } from 'xml-js';

// FEPDI = Financial. Please refer to the FEPDI layout document.
export function serializeFEPDIPayrollDeductionToXML(
  fields: FEPDIPayrollDeductionFields
): string {
  const options = { compact: true, ignoreComment: true, spaces: 4 };
  const sepdiData = {
    DATA: {
      ADDITIONAL_PAYMENTS: fields.additionalPayments || '',
      AMOUNT: fields.amount.toString(),
      APP_CODE: fields.appCode || '',
      CAPITAL_AND_INTEREST: fields.capitalAndInterest || '',
      CAPITAL_REMUNERATION: fields.capitalRemuneration || '',
      DEPARTMENT_NO: fields.departmentNumber || '',
      DEDUCT_TYPE: fields.deductionType,
      EMPL_NO: fields.employeeNumber,
      END_DATE: fields.endDate || '',
      ERR_CODE: fields.errorCode || '',
      FIXED_INTEREST: fields.fixedInterest || '',
      FUEL_ALLOWANCE: fields.fuelAllowance || '',
      HUNDERD_PERCENT_BOND: fields.hundredPercentBond || '',
      IDNO: fields.idNumber || '',
      INITIALS: fields.initials || '',
      INTERMEDIARY_ID: fields.intermediaryId || '',
      INT_RATE: fields.interestRate || '',
      LOCATION: fields.location || '',
      LOAN_AMNT: fields.loanAmount || '',
      MAINT_ALLOWANCE_CAT: fields.maintenanceAllowanceCategory || '',
      MAINT_DEDUCTION_CAT: fields.maintenanceDeductionCategory || '',
      MAINTENANCE: fields.maintenance || '',
      MAINTENANCE_ALLOWANCE: fields.maintenanceAllowance || '',
      PAY_DATE: fields.payDate || '',
      REFERENCE_NO: fields.referenceNumber,
      REGISTRATION_DATE: fields.registrationDate || '',
      START_DATE: fields.startDate,
      SURNAME: fields.surname,
      TERM: fields.term || '',
      TRANTYPE: fields.transactionType || ''
    }
  };
  return js2xml(sepdiData, options);
}
