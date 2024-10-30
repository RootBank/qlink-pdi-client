import { Connection } from './models/Connection';
import { DeductionType } from './enums/DeductionType';
import { PayrollDeductionFactory } from './factories/PayrollDeductionFactory';
import { PayrollIdentifier } from './enums/PayrollIdentifier';
import { TransactionType } from './enums/TransactionType';
import { CommunicationTest } from './models/CommunicationTest';
import { Employee } from './models/Employee';
import { SEPDIPayrollDeductionFields } from './types';
import Config from './config';
import { SEPDIFlag } from './enums/SEPDIFlag';
import { TranType } from './enums/TranType';

async function run() {
  // Define connection configuration
  const config = Config.getInstance();
  console.log(config);
  const test_connection = new Connection({
    transaction_type: TransactionType.COMMUNICATION_TEST,
    payrollIdentifier: PayrollIdentifier.PERSAL,
    username: config.qLinkUser,
    password: config.qLinkPassword,
    institution: config.institutionId,
  });
  const comms_test = new CommunicationTest(test_connection);
  comms_test.save();

  // find an employee
  const employeeConnection = new Connection({
    transaction_type: TransactionType.EMPLOYEE_ENQUIRIES,
    payrollIdentifier: PayrollIdentifier.PERSAL,
    username: config.qLinkUser,
    password: config.qLinkPassword,
    institution: config.institutionId,
  });
  const employee = new Employee(employeeConnection, {
    employeeNumber: '82714673',
  });
  const foundEmployee = await employee.find();
  console.log(foundEmployee);

  // Single SEPDI Deduction using only compulsory fields
  const transactionConnection = new Connection({
    transaction_type: TransactionType.Q_LINK_TRANSACTIONS,
    payrollIdentifier: PayrollIdentifier.PERSAL,
    username: config.qLinkUser,
    password: config.qLinkPassword,
    institution: config.institutionId,
    effectiveSalaryMonth: '202512'
  });
  const sepdiFields: SEPDIPayrollDeductionFields = {
    employeeNumber: foundEmployee.employeeNumber || '',
    amount: 500,
    deductionType: DeductionType.SEPDI_INSURANCE_LIFE,
    startDate: '20241201',
    surname: foundEmployee.surname || 'QLINK SURNAME',
    initials: 'Q S',
    idNumber: `${foundEmployee.birthDate?.slice(-6)}0000000`,
    referenceNumber: 'REF123',
    flag: SEPDIFlag.PAPER_MANDATE,
    transactionType: TranType.NEW_DEDUCTION
  };
  const sepdiDeduction = PayrollDeductionFactory.create(
    transactionConnection,
    DeductionType.SEPDI,
    sepdiFields
  );

  await sepdiDeduction.save();
}

// Run the async function
run();
