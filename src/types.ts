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
  adminCost?: string;
  amount: number;
  appCode?: string;
  arrInstallment?: string;
  balance?: string;
  corrRefNo?: string;
  deductionType: string;
  employeeNumber: string;
  endDate?: string;
  errorCode?: string;
  flag?: string;
  idNumber?: string;
  inflationUpdate?: string;
  initials?: string;
  interestPayable?: string;
  intermediaryId?: string;
  loanAmount?: string;
  newDeductType?: string;
  nrrNumber?: string;
  oldEmployeeNumber?: string;
  percentage?: string;
  referenceNumber: string;
  resNumber?: string;
  startDate: string;
  surname: string;
  transactionType?: string;
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
  emplNumber: string; // EMPLNO (response)
  empName?: string;
  empStatus?: string; // Employee status code (e.g., 0 = Current)
  empStatusReason?: string; // Reason for the status (e.g., 0 = Current)
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
