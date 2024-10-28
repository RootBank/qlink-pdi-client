// test/serialization/EmployeeSerializer.test.ts
import { serializeEmployeeToXML } from '../../src/serialization/EmployeeSerializer';
import { EmployeeFields } from '../../src/types';

describe('serializeEmployeeToXML', () => {
  it('should serialize EmployeeFields with required fields only', () => {
    const employeeFields: EmployeeFields = {
      employeeNumber: '123456'
    };

    const xml = serializeEmployeeToXML(employeeFields);
    const expectedXML = `<DATA>
    <EMPL_NO>123456</EMPL_NO>
    <IDNO/>
    <REFERENCE_NO/>
</DATA>`;

    expect(xml.trim()).toBe(expectedXML.trim());
  });

  it('should serialize EmployeeFields with all fields present', () => {
    const employeeFields: EmployeeFields = {
      employeeNumber: '123456',
      idNumber: '1234567890123',
      referenceNumber: 'REF123'
    };

    const xml = serializeEmployeeToXML(employeeFields);
    const expectedXML = `<DATA>
    <EMPL_NO>123456</EMPL_NO>
    <IDNO>1234567890123</IDNO>
    <REFERENCE_NO>REF123</REFERENCE_NO>
</DATA>`;

    expect(xml.trim()).toBe(expectedXML.trim());
  });

  it('should serialize EmployeeFields with missing optional fields', () => {
    const employeeFields: EmployeeFields = {
      employeeNumber: '123456',
      referenceNumber: 'REF123'
    };

    const xml = serializeEmployeeToXML(employeeFields);
    const expectedXML = `<DATA>
    <EMPL_NO>123456</EMPL_NO>
    <IDNO/>
    <REFERENCE_NO>REF123</REFERENCE_NO>
</DATA>`;

    expect(xml.trim()).toBe(expectedXML.trim());
  });
});
