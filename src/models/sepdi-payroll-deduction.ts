import { parseSEPDIPayrollDeductionFromXML } from '../serialization/sepdi-parser';
import { serializeSEPDIPayrollDeductionToXML } from '../serialization/sepdi-serializer';
import { SEPDIPayrollDeductionFields } from '../types';
import { QLinkClient } from './qlink-client';
import { QLinkError } from '../errors';
import { Logger } from '../utils/logger-util';
import { PayrollIdentifier } from '../enums/payroll-identifier';
import { TranType } from '../enums/tran-type';
import { TransactionType } from '../enums/transaction-type';
import { QLinkBase } from './qlink-base';
import { DeductionType } from '../enums/deduction-type';
import { SEPDIFlag } from '../enums/sepdi-flag';
import { QLinkRequest } from './qlink-request';
import { Header } from './header';

const logger = Logger.getInstance();

/**
 * Represents the details required for a SEPDI Payroll Deduction transaction.
 * This class encapsulates all required and optional fields for communicating 
 * payroll deduction details to the Q LINK system.
 */
export class SEPDIPayrollDeduction extends QLinkBase implements SEPDIPayrollDeductionFields {
  public client: QLinkClient;
  public readonly transactionType: TransactionType = TransactionType.Q_LINK_TRANSACTIONS;

  /**
   * Effective salary month in CCYYMM format (SALMON).
   * Example: "202401" for January 2024.
   */
  public effectiveSalaryMonth: string;

  /**
   * Identifier for the payroll to which this deduction applies.
   */
  public payrollIdentifier: PayrollIdentifier;

  /**
   * The monthly amount to be deducted in cents.
   */
  public amount: number;

  /**
   * A unique number that identifies the transaction, such as an insurance policy number or membership ID.
   * Maximum length: 20 characters.
   */
  public referenceNumber: string;

  /**
   * Start date of the deduction in CCYYMMDD format. Use "00000000" for QDEL transactions.
   * - For PERSAL and DOD payrolls, must be the first day of the effective salary month.
   */
  public startDate: string;

  /**
   * Employee's surname. Only uppercase letters and spaces are allowed.
   */
  public surname: string;

  /**
   * Deduction type code associated with the transaction.
   * Example values might be codes for different types of insurance.
   */
  public deductionType: DeductionType;

  /**
   * Transaction type for the deduction, such as QADD for addition.
   */
  public tranType?: TranType;

  /**
   * Unique payroll identifier for the employee, matching the format in the payroll system.
   */
  public employeeNumber: string;

  /**
   * Optional client-specific transaction key, returned unaltered in the Q LINK response.
   */
  public key?: string;

  /**
   * Total outstanding balance owed by the employee, in cents.
   */
  public balance?: string;

  /**
   * Correct reference number used specifically for QFIX transactions.
   */
  public corrRefNo?: string;

  /**
   * End date of the deduction in CCYYMMDD format. Required for QDEL transactions.
   * - For PERSAL and DOD payrolls, must be the last day of the month prior to the effective salary month.
   */
  public endDate?: string;

  /**
   * Error code, if applicable, from Q LINK's response.
   */
  public errorCode?: string;

  /**
   * Indicator flag used by institutions for various operational requirements.
   * Refer to SEPDIFlag enum for specific values.
   */
  public flag: SEPDIFlag;

  /**
   * Employee's identity number. If unknown, use date of birth in YYMMDD format followed by seven zeros.
   * For PERSAL, this field is mandatory.
   */
  public idNumber?: string;

  /**
   * Indicator for inflation-based amount adjustments in QUPD transactions. Values: "Y" or "N".
   */
  public inflationUpdate?: string;

  /**
   * Initials of the employee. No spaces or special characters allowed.
   */
  public initials?: string;

  /**
   * Identifier for the intermediary associated with this transaction.
   */
  public intermediaryId?: string;

  /**
   * Correct deduction type, only for QFIX transactions.
   */
  public newDeductType?: string;

  /**
   * Constructs a new instance of SEPDIPayrollDeductionFields with the required properties.
   * @param effectiveSalaryMonth - Effective salary month in CCYYMM format.
   * @param payrollIdentifier - Identifier for the payroll.
   * @param amount - Monthly deduction amount in cents.
   * @param referenceNumber - Unique reference number for the transaction.
   * @param startDate - Start date for the transaction in CCYYMMDD format.
   * @param surname - Employee's surname.
   * @param deductionType - Deduction type code.
   * @param tranType - Transaction type, such as QADD.
   * @param employeeNumber - Unique payroll identifier for the employee.
   * @param flag - How the payroll mandate is recorded SEPDIFlag enum.
   */
  constructor(
    client: QLinkClient,
    fields: SEPDIPayrollDeductionFields
  ) {
    super();
    this.client = client;
    this.effectiveSalaryMonth = fields.effectiveSalaryMonth;
    this.payrollIdentifier = fields.payrollIdentifier;
    this.amount = fields.amount;
    this.referenceNumber = fields.referenceNumber;
    this.startDate = fields.startDate;
    this.surname = fields.surname;
    this.deductionType = fields.deductionType;
    this.tranType = fields.tranType;
    this.employeeNumber = fields.employeeNumber;
    this.flag = fields.flag;
    this.newDeductType = fields.newDeductType;
    this.intermediaryId = fields.intermediaryId;
    this.initials = fields.initials;
    this.balance = fields.balance;
    this.corrRefNo = fields.corrRefNo;
    this.endDate = fields.endDate;
    this.errorCode = fields.errorCode;
    this.idNumber = fields.idNumber;
    this.inflationUpdate = fields.inflationUpdate;
    this.key = fields.key;
    this.tranType = fields.tranType;
  }

  toXML(): string {
    this.validate();
    const serializedXML = serializeSEPDIPayrollDeductionToXML(this);

    logger.debug(`Serialized SEPDI Payroll Deduction XML: ${serializedXML}`);
    return serializedXML;
  }

  validate(): void {
    if (!this.employeeNumber) {
      throw new QLinkError('Employee Number is required.');
    }
    if (!this.amount || !Number.isInteger(this.amount) || this.amount <= 0) {
      throw new QLinkError('Amount (cents) must be an integer greater than 0');
    }
    if (!this.idNumber) {
      throw new QLinkError('Employee ID number is required. If unknown use last six digits of the employee date of birth with seven trailing 0 padding');
    }
    if (this.idNumber.length != 13) {
      throw new QLinkError('Employee ID number must be 13 chars long.');
    }
    if (!this.effectiveSalaryMonth || !/^\d{6}$/.test(this.effectiveSalaryMonth)) {
      logger.error('Invalid effective salary month format');
      throw new QLinkError(
        'Effective Salary Month (SALMON) must be in CCYYMM format'
      );
    }
    const currentYearMonth = new Date()
      .toISOString()
      .slice(0, 7)
      .replace('-', '');
    if (this.effectiveSalaryMonth < currentYearMonth) {
      logger.error('Effective Salary Month is in the past');
      throw new QLinkError(
        'Effective Salary Month (SALMON) date must not be in the past'
      );
    }

    if (this.payrollIdentifier === PayrollIdentifier.PERSAL) {
      if (!this.startDate) {
        if (this.tranType === TranType.NEW_DEDUCTION) {
          throw new QLinkError('START_DATE is required for new deductions on PERSAL payroll identifier.');
        }
        throw new QLinkError('START_DATE is required on PERSAL payroll identifier.');
      }
      if (this.startDate.length != 8) {
        throw new QLinkError('START_DATE is must in format CCYYMMDD.');
      }
      if (!this.endDate) {
        this.endDate = '00000000'; // default end date.
      }
      try {
        if (this.tranType !== TranType.DELETION) {
          const startDate = new Date(`${this.startDate.slice(0, 4)}-${this.startDate.slice(4, 6)}-${this.startDate.slice(6, 8)}`);

          if (isNaN(startDate.getTime())) {
            throw new RangeError('Invalid START_DATE format.');
          }

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (startDate <= today) {
            throw new QLinkError('START_DATE must be in the future.');
          }
          if (startDate.getDate() !== 1) {
            throw new QLinkError('START_DATE must be the first day of the month.');
          }
        }
        if (this.tranType === TranType.DELETION) {
          if (!this.endDate) {
            throw new QLinkError('END_DATE is required as CCYYMMDD || 00000000');
          }
          if (this.endDate) {
            const endDate = new Date(`${this.endDate.slice(0, 4)}-${this.endDate.slice(4, 6)}-${this.endDate.slice(6, 8)}`);

            if (isNaN(endDate.getTime())) {
              throw new RangeError('Invalid END_DATE format.');
            }

            const lastDayOfMonth = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate();
            if (endDate.getDate() !== lastDayOfMonth) {
              throw new QLinkError('END_DATE must be the last day of the month for DELETION transactions.');
            }
          }
        }
      } catch (error) {
        if (error instanceof RangeError) {
          throw new QLinkError(`Date parsing error: ${error.message}`);
        } else if (error instanceof QLinkError) {
          console.error(`${error.message}`);
          throw error;
        } else {
          console.error('An unexpected error occurred during validation', error);
          throw error;
        }
      }
    }
    // Add other validations as necessary
  }

  async save(): Promise<SEPDIPayrollDeduction> {
    this.validate();

    const header = new Header(this.client.connectionConfig(), { transactionType: this.transactionType, effectiveSalaryMonth: this.effectiveSalaryMonth, payrollIdentifier: this.payrollIdentifier });

    const requestData = new QLinkRequest(header, this);

    logger.debug(`Saving SEPDI Payroll Deduction with request data: ${JSON.stringify(requestData)}`);
    try {
      const responseXML = await this.client.sendRequest(requestData);

      const parsedFields = await parseSEPDIPayrollDeductionFromXML(responseXML);
      return new SEPDIPayrollDeduction(this.client, parsedFields)
    } catch (error) {
      logger.error('Failed to save SEPDI Payroll Deduction', error);
      throw error;
    }
  }
}
