// test/models/SEPDIPayrollDeduction.test.ts
import { SEPDIPayrollDeduction } from '../../src/models/SEPDIPayrollDeduction';
import { Connection } from '../../src/models/Connection';
import { QLinkError } from '../../src/errors';
import { parseSEPDIPayrollDeductionFromXML } from '../../src/serialization/SEPDIParser';
import { serializeSEPDIPayrollDeductionToXML } from '../../src/serialization/SEPDISerializer';
import { SEPDIPayrollDeductionFields } from '../../src/types';
import { Logger } from '../../src/utils/Logger';
import { getFutureEffectiveSalaryMonth } from '../testHelpers';
import { PayrollIdentifier } from '../../src/enums/PayrollIdentifier';
import { TransactionType } from '../../src/enums/TransactionType';

jest.mock('../../src/models/Connection');
jest.mock('../../src/serialization/SEPDIParser');
jest.mock('../../src/serialization/SEPDISerializer');
jest.mock('../../src/utils/Logger');

describe('SEPDIPayrollDeduction', () => {
  let connection: Connection;
  let fields: Partial<SEPDIPayrollDeductionFields>;
  let deduction: SEPDIPayrollDeduction;

  beforeEach(() => {
    connection = new Connection({
      transaction_type: TransactionType.Q_LINK_TRANSACTIONS,
      institution: 1,
      payrollIdentifier: PayrollIdentifier.PERSAL,
      username: 'testUser',
      password: 'testPassword',
      effectiveSalaryMonth: getFutureEffectiveSalaryMonth()
    });
    fields = {
      employeeNumber: '12345',
      amount: 500,
      deductionType: '0010',
      surname: 'Doe',
      referenceNumber: 'REF123'
    };
    deduction = new SEPDIPayrollDeduction(connection, fields);
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with provided connection and fields', () => {
      expect(deduction['connection']).toBe(connection);
      expect(deduction.fields).toEqual(fields);
    });
  });

  describe('toXML', () => {
    it('should serialize the fields to XML and log the output', () => {
      (serializeSEPDIPayrollDeductionToXML as jest.Mock).mockReturnValue('<DATA><EMPL_NO>12345</EMPL_NO></DATA>');
      const loggerMock = jest.spyOn(Logger.prototype, 'debug');

      const xml = deduction.toXML();
      expect(xml).toBe('<DATA><EMPL_NO>12345</EMPL_NO></DATA>');
      expect(loggerMock).toHaveBeenCalledWith(expect.stringContaining('Serialized SEPDI Payroll Deduction XML'));
    });

    it('should throw an error if validation fails', () => {
      deduction.setField('employeeNumber', '');  // Invalidate required field
      expect(() => deduction.toXML()).toThrow(QLinkError);
    });
  });

  describe('validate', () => {
    it('should throw an error if employeeNumber is missing', () => {
      deduction.setField('employeeNumber', '');
      expect(() => deduction.validate()).toThrow(QLinkError);
    });

    it('should throw an error if amount is missing or zero', () => {
      deduction.setField('amount', 0);
      expect(() => deduction.validate()).toThrow(QLinkError);
    });

    it('should pass validation if required fields are present', () => {
      expect(() => deduction.validate()).not.toThrow();
    });
  });

  describe('save', () => {
    it('should save the deduction and parse the response', async () => {
      const responseXML = '<QLINK><DATA><EMPL_NO>12345</EMPL_NO><AMOUNT>500</AMOUNT></DATA></QLINK>';
      (connection.sendRequest as jest.Mock).mockResolvedValue(responseXML);
      (parseSEPDIPayrollDeductionFromXML as jest.Mock).mockResolvedValue(deduction);

      const result = await deduction.save();
      expect(connection.sendRequest).toHaveBeenCalled();
      expect(parseSEPDIPayrollDeductionFromXML).toHaveBeenCalledWith(connection, responseXML);
      expect(result).toBe(deduction);
    });

    it('should throw and log an error if save fails', async () => {
      const error = new QLinkError('Failed to save deduction');
      (connection.sendRequest as jest.Mock).mockRejectedValue(error);
      const loggerMock = jest.spyOn(Logger.prototype, 'error');

      await expect(deduction.save()).rejects.toThrow(QLinkError);
      expect(loggerMock).toHaveBeenCalledWith('Failed to save SEPDI Payroll Deduction', error);
    });
  });

  describe('setField', () => {
    it('should update the specified field in fields object', () => {
      deduction.setField('amount', 600);
      expect(deduction.fields.amount).toBe(600);
    });
  });
});
