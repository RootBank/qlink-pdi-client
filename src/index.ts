import { Connection } from './models/Connection';
import { DeductionType } from './enums/DeductionType';
import { PayrollDeductionFactory } from './factories/PayrollDeductionFactory';
import { PayrollIdentifier } from './enums/PayrollIdentifier';
import { TransactionType } from './enums/TransactionType';
import { CommunicationTest } from './models/CommunicationTest';
import { Employee } from './models/Employee';
import Config from './config';

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
    employeeNumber: '12510814',
  });
  const foundEmployee = await employee.find();
  console.log(foundEmployee);

  // Define connection configuration
  // const connection = new Connection({
  //   transaction_type: TransactionType.Q_LINK_TRANSACTIONS,
  //   institution: 1234,
  //   payrollIdentifier: PayrollIdentifier.PERSAL,
  //   username: 'testUser',
  //   password: 'testPassword',
  //   effectiveSalaryMonth: '202501'
  // });

  // // Single SEPDI Deduction using only compulsory fields
  // const sepdiFields = {
  //   employeeNumber: '12345',
  //   amount: 500,
  //   deductionType: '01',
  //   startDate: '20250101',
  //   surname: 'Doe',
  //   referenceNumber: 'REF123'
  // };
  // const sepdiDeduction = PayrollDeductionFactory.create(
  //   connection,
  //   DeductionType.SEPDI,
  //   sepdiFields
  // );

  // await sepdiDeduction.save();
}

// Run the async function
run();
