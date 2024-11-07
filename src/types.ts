import { TransactionType } from './enums/transaction-type';
import { PayrollIdentifier } from './enums/payroll-identifier';
import { TranType } from './enums/tran-type';
import { DeductionType } from './enums/deduction-type';
import { MandateCapture, SEPDIFlag } from './enums/sepdi-flag';

/**
 * Configuration required for establishing a connection with the Q LINK API.
 * Each property in this interface provides a specific part of the connection details, 
 * including credentials and institutional identifiers.
 */
export interface Configuration {
  /**
   * Username issued by Q LINK.
   * - Represents the `USER` field in the Q LINK API.
   * - Used as the primary credential for API authentication.
   * - Must be a non-empty string provided by Q LINK for each authorised user.
   */
  username: string;

  /**
   * Password associated with the `username`.
   * - Represents the `PSWD` field in the Q LINK API.
   * - Serves as the secure credential for authenticating requests alongside the `username`.
   * - Must be a non-empty string; keep confidential to prevent unauthorised access.
   */
  password: string;

  /**
   * Base URL for the Q LINK API.
   * - Specifies the root URL for sending API requests, adaptable to different environments (e.g., test, staging, production).
   * - Must be a fully-qualified URL (e.g., `https://govtest.qlink.co.za/cgi-bin/XmlProc`).
   * - Controls the target server for all API requests.
   */
  baseUrl?: string;

  /**
   * Institution ID assigned by Q LINK.
   * - Represents the `INST` field in the Q LINK API.
   * - Used to identify the institution associated with the API request.
   * - Each client has a unique `institution` ID for data separation and client-specific access.
   */
  institution: number;
}

// // Header-specific fields
export interface Header extends Configuration {
  transactionType: TransactionType; // (TRX)
  payrollIdentifier: PayrollIdentifier; // Payroll Identifier (PAY)
  effectiveSalaryMonth: string; // Salary month in CCYYMM format (SALMON)
  key?: string; // (KEY) Optional client-specific transaction key. Q LINK does not use the value of the KEY. If a key was entered, the key is returned with the reply of the request and is solely for the use of the client to link the packet sent with the reply received
  initials?: string; // Initials of the employee (no spaces or special characters are allowed)
}

export interface CreateInsurancePayrollDeductionFields {
  amount: number; // cents The monthly amount to be deducted.
  deductionType: DeductionType; // insurance related codes.
  employeeNumber: string; // Unique salary reference number that identifies the employee in the payroll. The value placed in this field must be identical to the number that appears on the latest payroll information, including leading 0's, if applicable.
  payrollIdentifier: PayrollIdentifier;
  referenceNumber: string; // 20 character max. A unique number that identifies the transaction (for example an insurance policy number, medical aid membership number, a financial institution's loan account number, etc.). When an existing deduction is amended, deleted etc., the Reference Number provided must be identical to the number that appears on the Q LINK system, including leading 0's or any other characters, if applicable.
  mandateCapturedOn: MandateCapture; // For Insurance Institutions -- see enums SEPDIFlag alias MandateCapture
  beginDeductionFrom: Date; // automatically deduces the SALMON and START DATE.
  effectiveSalaryMonth?: string; // Salary month in CCYYMM format (SALMON)
  startDate?: string; // CCYYMMDD || 00000000 for QDEL. The start date is the effective date for the specific transaction. Rules will be applied according to payroll requirements. • For PERSAL and DOD payrolls the start date must always be the first day of the effective salary month.

  idNumber?: string; // The identity number of the employee. If the ID number is not known, the date of birth must be supplied in the format YYMMDD followed by seven 0's. In the case of some payrolls, for instance PERSAL, the ID Number is compulsory and must be supplied.
  surname?: string; // character set: [A-Z\s] only
  endDate?: string; // CCYYMMDD || 00000000. Compulsory for QDEL. For PERSAL and DOD the end date on a QDEL transaction must be the last day of the month previous to the effective salary month.
}

// export interface PremiumHolidayInsurancePayrollDeductionFields {

// }

export interface DeleteInsurancePayrollDeductionFields {
  // tranType: TranType; // TranType enum:  QDEL
  referenceNumber: string; // 20 character max. A unique number that identifies the transaction (for example an insurance policy number, medical aid membership number, a financial institution's loan account number, etc.). When an existing deduction is amended, deleted etc., the Reference Number provided must be identical to the number that appears on the Q LINK system, including leading 0's or any other characters, if applicable.
  endDate: string; // CCYYMMDD || 00000000. Compulsory for QDEL. For PERSAL and DOD the end date on a QDEL transaction must be the last day of the month previous to the effective salary month.
  employeeNumber: string; // Unique salary reference number that identifies the employee in the payroll. The value placed in this field must be identical to the number that appears on the latest payroll information, including leading 0's, if applicable.
  payrollIdentifier: PayrollIdentifier;
  // startDate?: string; // CCYYMMDD || 00000000 for QDEL. The start date is the effective date for the specific transaction. Rules will be applied according to payroll requirements. • For PERSAL and DOD payrolls the start date must always be the first day of the effective salary month.
  idNumber?: string; // The identity number of the employee. If the ID number is not known, the date of birth must be supplied in the format YYMMDD followed by seven 0's. In the case of some payrolls, for instance PERSAL, the ID Number is compulsory and must be supplied.
  surname?: string; // character set: [A-Z\s] only

  cancelDeductionFrom: Date; // automatically deduces the SALMON and START DATE.
}

export interface UpdateReferenceFields {
  referenceNumber: string; // 20 character max. A unique number that identifies the transaction (for example an insurance policy number, medical aid membership number, a financial institution's loan account number, etc.). When an existing deduction is amended, deleted etc., the Reference Number provided must be identical to the number that appears on the Q LINK system, including leading 0's or any other characters, if applicable.
  employeeNumber: string; // Unique salary reference number that identifies the employee in the payroll. The value placed in this field must be identical to the number that appears on the latest payroll information, including leading 0's, if applicable.
  payrollIdentifier: PayrollIdentifier;
  // tranType: TranType; // TranType enum:  QFIX
  // QFIX: Change the reference number or deduction type of a deduction
  newDeductionType?: string; // only for QFIX 
  correctReferenceNumber?: string; // only for QFIX for the Correct Reference Number

  beginDeductionFrom: Date; // automatically deduces the SALMON and START DATE.
  effectiveSalaryMonth?: string; // Salary month in CCYYMM format (SALMON)
  startDate?: string; // CCYYMMDD || 00000000 for QDEL. The start date is the effective date for the specific transaction. Rules will be applied according to payroll requirements. • For PERSAL and DOD payrolls the start date must always be the first day of the effective salary month.

  idNumber?: string; // The identity number of the employee. If the ID number is not known, the date of birth must be supplied in the format YYMMDD followed by seven 0's. In the case of some payrolls, for instance PERSAL, the ID Number is compulsory and must be supplied.
  surname?: string; // character set: [A-Z\s] only
  endDate?: string; // CCYYMMDD || 00000000. Compulsory for QDEL. For PERSAL and DOD the end date on a QDEL transaction must be the last day of the month previous to the effective salary month.
}
export interface UpdateAmountFields {
  referenceNumber: string; // 20 character max. A unique number that identifies the transaction (for example an insurance policy number, medical aid membership number, a financial institution's loan account number, etc.). When an existing deduction is amended, deleted etc., the Reference Number provided must be identical to the number that appears on the Q LINK system, including leading 0's or any other characters, if applicable.
  // tranType: TranType; // TranType enum: QUPD
  employeeNumber: string; // Unique salary reference number that identifies the employee in the payroll. The value placed in this field must be identical to the number that appears on the latest payroll information, including leading 0's, if applicable.
  payrollIdentifier: PayrollIdentifier;

  // QFIX: Change the reference number or deduction type of a deduction
  // newDeductType?: string; // only for QFIX for the Correct Reference Number
  // corrRefNo?: string; // only for QFIX for the Correct Reference Number

  // QUPD: Update an existing deduction by changing the amount
  inflationUpdate?: string; // (Y/N). This field is used in a QUPD transaction and can have the value Y or N to indicate that the amount change was done for inflationary purposes or not. When omitted, it is deemed to be N.
  amount: number; // cents The monthly amount to be deducted.

  // mandateCapturedOn: MandateCapture; // For Insurance Institutions -- see enums SEPDIFlag alias MandateCapture
  beginDeductionFrom: Date; // automatically deduces the SALMON and START DATE.
  effectiveSalaryMonth?: string; // Salary month in CCYYMM format (SALMON)
  startDate?: string; // CCYYMMDD || 00000000 for QDEL. The start date is the effective date for the specific transaction. Rules will be applied according to payroll requirements. • For PERSAL and DOD payrolls the start date must always be the first day of the effective salary month.

  idNumber?: string; // The identity number of the employee. If the ID number is not known, the date of birth must be supplied in the format YYMMDD followed by seven 0's. In the case of some payrolls, for instance PERSAL, the ID Number is compulsory and must be supplied.
  surname?: string; // character set: [A-Z\s] only
  endDate?: string; // CCYYMMDD || 00000000. Compulsory for QDEL. For PERSAL and DOD the end date on a QDEL transaction must be the last day of the month previous to the effective salary month.
}

// SEPDI-specific fields
export interface SEPDIPayrollDeductionFields {
  effectiveSalaryMonth: string; // Salary month in CCYYMM format (SALMON)
  payrollIdentifier: PayrollIdentifier;
  amount: number; // cents The monthly amount to be deducted.
  referenceNumber: string; // 20 character max. A unique number that identifies the transaction (for example an insurance policy number, medical aid membership number, a financial institution's loan account number, etc.). When an existing deduction is amended, deleted etc., the Reference Number provided must be identical to the number that appears on the Q LINK system, including leading 0's or any other characters, if applicable.
  startDate: string; // CCYYMMDD || 00000000 for QDEL. The start date is the effective date for the specific transaction. Rules will be applied according to payroll requirements. • For PERSAL and DOD payrolls the start date must always be the first day of the effective salary month.
  surname: string; // character set: [A-Z\s] only
  deductionType: DeductionType; // insurance related codes.
  tranType?: TranType; // TranType enum QADD
  employeeNumber: string; // Unique salary reference number that identifies the employee in the payroll. The value placed in this field must be identical to the number that appears on the latest payroll information, including leading 0's, if applicable.
  flag: SEPDIFlag; // For Insurance Institutions -- see enums SEPDIFlag
  key?: string; // (KEY) Optional client-specific transaction key. Q LINK does not use the value of the KEY. If a key was entered, the key is returned with the reply of the request and is solely for the use of the client to link the packet sent with the reply received

  balance?: string; // cents The total outstanding amount owed by the employee
  corrRefNo?: string; // only for QFIX for the Correct Reference Number
  endDate?: string; // CCYYMMDD || 00000000. Compulsory for QDEL. For PERSAL and DOD the end date on a QDEL transaction must be the last day of the month previous to the effective salary month.
  errorCode?: string;
  idNumber?: string; // The identity number of the employee. If the ID number is not known, the date of birth must be supplied in the format YYMMDD followed by seven 0's. In the case of some payrolls, for instance PERSAL, the ID Number is compulsory and must be supplied.
  inflationUpdate?: string; // (Y/N). This field is used in a QUPD transaction and can have the value Y or N to indicate that the amount change was done for inflationary purposes or not. When omitted, it is deemed to be N.
  initials?: string; // Initials of the employee (no spaces or special characters are allowed)
  intermediaryId?: string;
  newDeductType?: string; // only for QFIX for the Correct Reference Number

  // unlikely meeded for Insurnace and PERSAL.
  // adminCost?: string; // Not in use.
  // interestPayable?: string; // Not in use.
  // oldEmployeeNumber?: string; // Not in use.
  // loanAmount?: string;
  // percentage?: string; // This field is payroll specific and can be supplied instead of an amount where the deduction is based on a percentage of a value determined by the payroll.
  // resNumber?: string;
  // nrrNumber?: string;
  // appCode?: string; // Compulsory for the DOD payroll (payroll identifier = 2)
  // arrInstallment?: string; // Only applicable to Medical Institutions on PERSAL:
  // web_function_log_id?: string;
  // last_web_function_log_id?: string;
}

export interface EmployeeFields extends EmployeeQueryParameter, EmployeeResponseFields { }

export interface EmployeeQueryParameter {
  employeeNumber: string;
  payrollIdentifier: PayrollIdentifier;
  idNumber?: string;
  referenceNumber?: string;
}

export interface EmployeeResponseFields {
  // Fields typically found in responses
  address1?: string;
  address2?: string;
  address3?: string;
  address4?: string;
  appCode?: string;
  birthDate?: string;
  contactPerson?: string;
  emplNumber?: string; // EMPLNO (response)
  empName?: string;
  empStatus?: number; // Employee status code (e.g., 0 = Current)
  empStatusReason?: number; // Reason for the status (e.g., 0 = Current)
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
}
