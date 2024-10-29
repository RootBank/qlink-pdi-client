import { TransactionType } from './enums/TransactionType';
import { PayrollIdentifier } from './enums/PayrollIdentifier';

export interface QLinkRequest<T> {
  header: ConnectionFields;
  data: T;
}

export interface BulkQLinkRequest<T> {
  header: ConnectionFields;
  data: T[];
}

// Header-specific fields
export interface ConnectionFields {
  transaction_type: TransactionType; // (TRX)
  institution: number; // Client Identifier (INST)
  payrollIdentifier: PayrollIdentifier; // Payroll Identifier (PAY)
  username: string; // Username issued by Q LINK (USER)
  password: string; // Password (PSWD)
  effectiveSalaryMonth?: string; // Salary month in CCYYMM format (SALMON)
  key?: string; // (KEY) Optional client-specific transaction key. Q LINK does not use the value of the KEY. If a key was entered, the key is returned with the reply of the request and is solely for the use of the client to link the packet sent with the reply received
}

export type PayrollDeductionFields =
  | SEPDIPayrollDeductionFields
  | FEPDIPayrollDeductionFields;

// SEPDI-specific fields
export interface SEPDIPayrollDeductionFields {
  amount: number; // cents The monthly amount to be deducted.
  balance?: string; // cents The total outstanding amount owed by the employee
  corrRefNo?: string; // only for QFIX for the Correct Reference Number
  deductionType: string;
  employeeNumber: string; // Unique salary reference number that identifies the employee in the payroll. The value placed in this field must be identical to the number that appears on the latest payroll information, including leading 0's, if applicable.
  endDate?: string; // CCYYMMDD || 00000000. Compulsory for QDEL. For PERSAL and DOD the end date on a QDEL transaction must be the last day of the month previous to the effective salary month.
  errorCode?: string;
  flag?: string; // For Insurance Institutions -- see enums SEPDIFlag
  idNumber?: string; // The identity number of the employee. If the ID number is not known, the date of birth must be supplied in the format YYMMDD followed by seven 0's. In the case of some payrolls, for instance PERSAL, the ID Number is compulsory and must be supplied.
  inflationUpdate?: string; // (Y/N). This field is used in a QUPD transaction and can have the value Y or N to indicate that the amount change was done for inflationary purposes or not. When omitted, it is deemed to be N.
  initials?: string; // Initials of the employee (no spaces or special characters are allowed)
  intermediaryId?: string;
  newDeductType?: string; // only for QFIX for the Correct Reference Number
  referenceNumber: string; // 20 character max. A unique number that identifies the transaction (for example an insurance policy number, medical aid membership number, a financial institution's loan account number, etc.). When an existing deduction is amended, deleted etc., the Reference Number provided must be identical to the number that appears on the Q LINK system, including leading 0's or any other characters, if applicable.
  startDate: string; // CCYYMMDD || 00000000 for QDEL. The start date is the effective date for the specific transaction. Rules will be applied according to payroll requirements. • For PERSAL and DOD payrolls the start date must always be the first day of the effective salary month.
  surname: string; // character set: [A-Z\s] only
  transactionType?: string;

  // unlikely meeded for Insurnace and PERSAL.
  adminCost?: string; // Not in use.
  interestPayable?: string; // Not in use.
  oldEmployeeNumber?: string; // Not in use.
  loanAmount?: string;
  percentage?: string; // This field is payroll specific and can be supplied instead of an amount where the deduction is based on a percentage of a value determined by the payroll.
  resNumber?: string;
  nrrNumber?: string;
  appCode?: string; // Compulsory for the DOD payroll (payroll identifier = 2)
  arrInstallment?: string; // Only applicable to Medical Institutions on PERSAL:
}

// FEPDI-specific fields
export interface FEPDIPayrollDeductionFields {
  additionalPayments?: string;
  amount: number;
  appCode?: string;
  capitalAndInterest?: string;
  capitalRemuneration?: string;
  departmentNumber?: string;
  deductionType: string;
  employeeNumber: string;
  endDate?: string;
  errorCode?: string;
  fixedInterest?: string;
  fuelAllowance?: string;
  hundredPercentBond?: string;
  idNumber?: string;
  initials?: string;
  intermediaryId?: string;
  interestRate?: string;
  location?: string;
  loanAmount?: string;
  maintenanceAllowanceCategory?: string;
  maintenanceDeductionCategory?: string;
  maintenance?: string;
  maintenanceAllowance?: string;
  payDate?: string;
  referenceNumber: string;
  registrationDate?: string;
  startDate: string;
  surname: string;
  term?: string;
  transactionType?: string;
}

export interface EmployeeFields {
  employeeNumber: string; // EMPL_NO (request)
  idNumber?: string;
  referenceNumber?: string;

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

// Request fields
//compulsory <EMPL_NO>22510816</EMPL_NO>
//optional <IDNO>5910140573081</IDNO>
//optional <REFERENCE_NO></REFERENCE_NO>

// Response fields
//<EMPLNO>80223923</EMPLNO>
// <PAYBUR>NUC</PAYBUR>
// <BIRTHDATE>19660406</BIRTHDATE>
// <APP_CODE>01</APP_CODE>
// <PAY_ORG>P7 LIMPOPO PROVINCE PUBLIC WORKS</PAY_ORG>
// <TEMP_IND>P</TEMP_IND>
// <RESIGNATION_DATE/>
// <EMP_STATUS>0</EMP_STATUS>
// <EMP_STATUS_RSN>0</EMP_STATUS_RSN>
// <IDNO>5604065669080</IDNO>
// <EMP_NAME>LM PHAHLAMOHLAKA</EMP_NAME>
// <PAY_POINT>824320</PAY_POINT>
// <CONTACT_PERSON>THE PAY MASTER</CONTACT_PERSON>
// <ADDRESS1>PRIVATE BAG X61</ADDRESS1>
// <ADDRESS2>LEBOWAKGOMO</ADDRESS2>
// <ADDRESS3/>
// <ADDRESS4/>
// <POSTAL_CODE>0737</POSTAL_CODE>
// <TELEPHONE>0002951000</TELEPHONE>
