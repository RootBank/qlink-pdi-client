import { PayrollIdentifier } from '../../src/enums/PayrollIdentifier';
import { TransactionType } from '../../src/enums/TransactionType';
import { serializeHeaderToXML } from '../../src/serialization/HeaderSerializer';
import { ConnectionFields } from '../../src/types';
import { getFutureEffectiveSalaryMonth } from '../testHelpers';

describe('serializeHeaderToXML', () => {
  it('should serialize ConnectionFields with required fields only', () => {
    const connectionFields: ConnectionFields = {
      transaction_type: TransactionType.COMMUNICATION_TEST,
      institution: 9999,
      payrollIdentifier: PayrollIdentifier.PERSAL,
      username: 'testUser',
      password: 'testPassword'
    };

    const xml = serializeHeaderToXML(connectionFields);
    const expectedXML = `<HDR>
    <TRX>6</TRX>
    <INST>9999</INST>
    <PAY>${PayrollIdentifier.PERSAL}</PAY>
    <USER>testUser</USER>
    <PSWD>testPassword</PSWD>
    <SALMON/>
    <KEY/>
</HDR>`;

    expect(xml.trim()).toBe(expectedXML.trim());
  });

  it('should serialize ConnectionFields with all fields present', () => {
    const connectionFields: ConnectionFields = {
      transaction_type: TransactionType.COMMUNICATION_TEST,
      institution: 9999,
      payrollIdentifier: PayrollIdentifier.PERSAL,
      username: 'testUser',
      password: 'testPassword',
      effectiveSalaryMonth: getFutureEffectiveSalaryMonth(),
      key: 'customKey123'
    };

    const xml = serializeHeaderToXML(connectionFields);
    const expectedXML = `<HDR>
    <TRX>6</TRX>
    <INST>9999</INST>
    <PAY>${PayrollIdentifier.PERSAL}</PAY>
    <USER>testUser</USER>
    <PSWD>testPassword</PSWD>
    <SALMON>${getFutureEffectiveSalaryMonth()}</SALMON>
    <KEY>customKey123</KEY>
</HDR>`;

    expect(xml.trim()).toBe(expectedXML.trim());
  });

  it('should handle missing optional fields (effectiveSalaryMonth and key)', () => {
    const connectionFields: ConnectionFields = {
      transaction_type: TransactionType.COMMUNICATION_TEST,
      institution: 9999,
      payrollIdentifier: PayrollIdentifier.PERSAL,
      username: 'testUser',
      password: 'testPassword',
      effectiveSalaryMonth: '' // Explicitly setting empty string for clarity
    };

    const xml = serializeHeaderToXML(connectionFields);
    const expectedXML = `<HDR>
    <TRX>6</TRX>
    <INST>9999</INST>
    <PAY>${PayrollIdentifier.PERSAL}</PAY>
    <USER>testUser</USER>
    <PSWD>testPassword</PSWD>
    <SALMON/>
    <KEY/>
</HDR>`;

    expect(xml.trim()).toBe(expectedXML.trim());
  });
});
