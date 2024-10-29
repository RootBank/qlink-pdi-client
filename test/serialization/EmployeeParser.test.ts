// test/serialization/EmployeeParser.test.ts

import { parseEmployeeFromXML } from '../../src/serialization/EmployeeParser';
import { Connection } from '../../src/models/Connection';
import { Employee } from '../../src/models/Employee';
import { QLinkError } from '../../src/errors';
import { EmployeeStatusReason } from '../../src/enums/EmployeeStatusReason';
import { EmployeeStatus } from '../../src/enums/EmployeeStatus';
import { PayrollIdentifier } from '../../src/enums/PayrollIdentifier';
import { TransactionType } from '../../src/enums/TransactionType';
import { getFutureEffectiveSalaryMonth } from '../testHelpers'

jest.mock('../../src/models/Connection');

describe('parseEmployeeFromXML', () => {
  let mockConnection: Connection;

  beforeEach(() => {
    mockConnection = new Connection({
      transaction_type: TransactionType.EMPLOYEE_ENQUIRIES,
      institution: 9999,
      payrollIdentifier: PayrollIdentifier.PERSAL,
      username: 'testUser',
      password: 'testPassword',
      effectiveSalaryMonth: getFutureEffectiveSalaryMonth()
    });
  });

  it('should parse XML correctly into an Employee instance with expected fields', async () => {
    const xmlData = `
      <QLINK>
        <DATA>
          <EMPLNO>12510814</EMPLNO>
          <IDNO>5910140573081</IDNO>
          <REFERENCE_NO>REF123</REFERENCE_NO>
          <APP_CODE>01</APP_CODE>
          <BIRTHDATE>19551014</BIRTHDATE>
          <CONTACT_PERSON>John Doe</CONTACT_PERSON>
          <EMP_STATUS>0</EMP_STATUS>
          <EMP_STATUS_RSN>0</EMP_STATUS_RSN>
          <EMP_NAME>SE KUNENE</EMP_NAME>
          <PAY_ORG>P7 LIMPOPO PROVINCE PUBLIC WORKS</PAY_ORG>
          <PAY_POINT>824320</PAY_POINT>
          <PAYBUR>NAT</PAYBUR>
          <PERCENTAGE>100</PERCENTAGE>
          <POSTAL_CODE>0737</POSTAL_CODE>
          <RESIGNATION_DATE>20201231</RESIGNATION_DATE>
          <SURNAME>KUNENE</SURNAME>
          <TELEPHONE>123456789</TELEPHONE>
          <TEMP_IND>P</TEMP_IND>
        </DATA>
      </QLINK>`;

    const employee = await parseEmployeeFromXML(mockConnection, xmlData);

    expect(employee).toBeInstanceOf(Employee);
    expect(employee.fields.employeeNumber).toBe('12510814');
    expect(employee.fields.idNumber).toBe('5910140573081');
    expect(employee.fields.referenceNumber).toBe('REF123');
    expect(employee.fields.appCode).toBe('01');
    expect(employee.fields.birthDate).toBe('19551014');
    expect(employee.fields.contactPerson).toBe('John Doe');
    expect(employee.fields.empStatus).toBe(EmployeeStatus.CURRENT);
    expect(employee.fields.empStatusReason).toBe(EmployeeStatusReason.CURRENT);
    expect(employee.fields.empName).toBe('SE KUNENE');
    expect(employee.fields.payOrg).toBe('P7 LIMPOPO PROVINCE PUBLIC WORKS');
    expect(employee.fields.payPoint).toBe('824320');
    expect(employee.fields.payBur).toBe('NAT');
    expect(employee.fields.percentage).toBe('100');
    expect(employee.fields.postalCode).toBe('0737');
    expect(employee.fields.resignationDate).toBe('20201231');
    expect(employee.fields.surname).toBe('KUNENE');
    expect(employee.fields.telephone).toBe('123456789');
    expect(employee.fields.tempInd).toBe('P');
  });

  // Additional tests for other scenarios
});
