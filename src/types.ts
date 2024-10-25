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
  effectiveSalaryMonth: string; // Salary month in CCYYMM format (SALMON)
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
