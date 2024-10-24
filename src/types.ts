import { TransactionType } from './enums/TransactionType';
import { PaymentType } from './enums/PaymentType';

export interface Header {
  transactionType: TransactionType;
  paymentType: PaymentType;
  institution: number;
  username: string;
  password: string;
  key?: string;
  salaryMonth?: string;
}

export interface Payload {
  [key: string]: string | number; // Arbitrary key-value pairs for payload
}

// Main QLink Request Model (main logical entity)
export interface QLinkRequest {
  header: Header;
  data: Payload;
}

// Bulk QLink Request Model (for multiple transactions)
export interface BulkQLinkRequest {
  header: Header;
  data: Payload[];
}

export interface InsurancePayrollDeduction {
  employeeId: string; // EMPL_NO: Unique identifier for the employee
  surname: string; // SURNAME: Employee's surname
  initials: string; // INITIALS: Employee's initials
  idNumber: string; // IDNO: Employee's ID number
  referenceNumber: string; // REFERENCE_NO: Insurance policy or reference number
  amount: number; // AMOUNT: Deduction amount
  deductionType: string; // DEDUCT_TYPE: Type of deduction (insurance-related)
  startDate: string; // START_DATE: Start date of deduction (YYYYMMDD)
  endDate?: string; // END_DATE: Optional end date (YYYYMMDD)
}

// Bulk Insurance Payroll Deduction Request Model
export interface BulkInsurancePayrollDeductionRequest {
  header: Header;
  deductions: InsurancePayrollDeduction[];
}
