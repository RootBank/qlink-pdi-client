// test/models/Employee.test.ts
import { Employee } from '../../src/models/Employee';
import { Connection } from '../../src/models/Connection';
import { QLinkError } from '../../src/errors';
import { Logger } from '../../src/utils/Logger';
import Config from '../../src/config';
import { parseEmployeeFromXML } from '../../src/serialization/EmployeeParser';
import { PayrollIdentifier } from '../../src/enums/PayrollIdentifier';
import { TransactionType } from '../../src/enums/TransactionType';

jest.mock('../../src/config', () => ({
  getInstance: jest.fn().mockReturnValue({
    qLinkUrl: 'https://test.url',
    qLinkUser: 'testUser',
    qLinkPassword: 'testPassword',
    institutionId: 9999,
    logLevel: 0,
  })
}));
jest.mock('../../src/utils/Logger', () => {
  return {
    Logger: jest.fn().mockImplementation(() => ({
      debug: jest.fn(),
      info: jest.fn(),
      error: jest.fn()
    }))
  };
});
jest.mock('../../src/serialization/EmployeeParser');

const mockConfig = Config.getInstance();

describe('Employee', () => {
  let mockConfig;
  let logger: Logger;
  let mockConnection: Connection;
  let employee: Employee;

  beforeEach(() => {
    jest.clearAllMocks();

    mockConfig = Config.getInstance();
    logger = new Logger(mockConfig.logLevel);

    mockConnection = new Connection({
      transaction_type: TransactionType.EMPLOYEE_ENQUIRIES,
      institution: 1,
      payrollIdentifier: PayrollIdentifier.PERSAL,
      username: 'MyUserName',
      password: 'MyPassword',
      effectiveSalaryMonth: '202501',

    });

    employee = new Employee(mockConnection, { employeeNumber: '12510814' });
  });

  it('should throw an error if employee number is missing', () => {
    const employee = new Employee(mockConnection, {});
    expect(() => employee.validate()).toThrow(QLinkError);
  });

  it('should correctly handle Employee Option 1 (only employee number)', async () => {
    const employee = new Employee(mockConnection, {
      employeeNumber: '12510814'
    });
    const responseXML = `
      <QLINK>
        <DATA>
          <EMPLNO>12510814</EMPLNO>
          <PAYBUR>NAT</PAYBUR>
          <BIRTHDATE>19551014</BIRTHDATE>
          <APP_CODE>01</APP_CODE>
          <EMP_STATUS>0</EMP_STATUS>
          <EMP_STATUS_RSN>0</EMP_STATUS_RSN>
        </DATA>
      </QLINK>`;

    mockConnection.sendRequest = jest.fn().mockResolvedValue(responseXML);
    (parseEmployeeFromXML as jest.Mock).mockReturnValue(employee);

    const result = await employee.find();
    expect(result).toBe(employee);
    expect(mockConnection.sendRequest).toHaveBeenCalled();
  });

  it('should correctly handle Employee Option 2 (employee number and ID)', async () => {
    const employee = new Employee(mockConnection, {
      employeeNumber: '22510816',
      idNumber: '5910140573081'
    });
    const responseXML = `
      <QLINK>
        <DATA>
          <EMPLNO>22510816</EMPLNO>
          <PAYBUR>NAT</PAYBUR>
          <BIRTHDATE>19561014</BIRTHDATE>
          <APP_CODE>01</APP_CODE>
          <EMP_STATUS>0</EMP_STATUS>
          <EMP_STATUS_RSN>0</EMP_STATUS_RSN>
          <IDNO>5910140573081</IDNO>
        </DATA>
      </QLINK>`;

    mockConnection.sendRequest = jest.fn().mockResolvedValue(responseXML);
    (parseEmployeeFromXML as jest.Mock).mockReturnValue(employee);

    const result = await employee.find();
    expect(result).toBe(employee);
    expect(mockConnection.sendRequest).toHaveBeenCalled();
  });

  it('should correctly handle Employee Option 3 (employee number, ID, and reference)', async () => {
    const employee = new Employee(mockConnection, {
      employeeNumber: '80223924',
      idNumber: '5604065669080',
      referenceNumber: '77006429'
    });
    const responseXML = `
      <QLINK>
        <DATA>
          <EMPLNO>80223923</EMPLNO>
          <PAYBUR>NUC</PAYBUR>
          <BIRTHDATE>19660406</BIRTHDATE>
          <APP_CODE>01</APP_CODE>
          <EMP_STATUS>0</EMP_STATUS>
          <EMP_STATUS_RSN>0</EMP_STATUS_RSN>
          <IDNO>5604065669080</IDNO>
          <EMP_NAME>LM PHAHLAMOHLAKA</EMP_NAME>
          <PAY_POINT>824320</PAY_POINT>
        </DATA>
      </QLINK>`;

    mockConnection.sendRequest = jest.fn().mockResolvedValue(responseXML);
    (parseEmployeeFromXML as jest.Mock).mockReturnValue(employee);

    const result = await employee.find();
    expect(result).toBe(employee);
    expect(mockConnection.sendRequest).toHaveBeenCalled();
  });

  xit('should log request data during the find operation', async () => {
    const employee = new Employee(mockConnection, {
      employeeNumber: '12510814'
    });
    const responseXML = `<QLINK><DATA></DATA></QLINK>`;

    mockConnection.sendRequest = jest.fn().mockResolvedValue(responseXML);
    (parseEmployeeFromXML as jest.Mock).mockReturnValue(employee);

    const debugSpy = jest.spyOn(logger, 'debug');

    await employee.find();
    expect(debugSpy).toHaveBeenCalledWith(
      expect.stringContaining('Find employe with request data:')
    );
  });
});
