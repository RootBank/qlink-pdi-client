import { Connection } from './models/Connection';
import { DeductionType } from './enums/DeductionType';
import { PayrollDeductionFactory } from './factories/PayrollDeductionFactory';
import { PayrollIdentifier } from './enums/PayrollIdentifier';
import { TransactionType } from './enums/TransactionType';
import { CommunicationTest } from './models/CommunicationTest';
import { Employee } from './models/Employee';

async function run() {
  // find an employee
  const employeeConnection = new Connection({
    transaction_type: TransactionType.EMPLOYEE_ENQUIRIES,
    institution: 1234,
    payrollIdentifier: PayrollIdentifier.ESKOM,
    username: 'testUser',
    password: 'testPassword'
  });
  const employee = new Employee(employeeConnection, {
    employeeNumber: '12345',
    idNumber: '54321'
  });
  const foundEmployee = await employee.find();
  console.log(foundEmployee);

  // Define connection configuration
  const test_connection = new Connection({
    transaction_type: TransactionType.COMMUNICATION_TEST,
    institution: 1234,
    payrollIdentifier: PayrollIdentifier.ESKOM,
    username: 'testUser',
    password: 'testPassword'
  });
  const comms_test = new CommunicationTest(test_connection);
  comms_test.save();

  // Define connection configuration
  const connection = new Connection({
    transaction_type: TransactionType.Q_LINK_TRANSACTIONS,
    institution: 1234,
    payrollIdentifier: PayrollIdentifier.ESKOM,
    username: 'testUser',
    password: 'testPassword',
    effectiveSalaryMonth: '202501'
  });

  // Single SEPDI Deduction using only compulsory fields
  const sepdiFields = {
    employeeNumber: '12345',
    amount: 500,
    deductionType: '01',
    startDate: '20250101',
    surname: 'Doe',
    referenceNumber: 'REF123'
  };
  const sepdiDeduction = PayrollDeductionFactory.create(
    connection,
    DeductionType.SEPDI,
    sepdiFields
  );

  await sepdiDeduction.save();

  // Bulk FEPDI Deductions using only compulsory fields
  const bulkFepdiFields = [
    {
      employeeNumber: '12345',
      amount: 500,
      deductionType: '01',
      startDate: '20250101',
      surname: 'Doe',
      referenceNumber: 'REF123'
    },
    {
      employeeNumber: '67890',
      amount: 300,
      deductionType: '02',
      startDate: '20250101',
      surname: 'Smith',
      referenceNumber: 'REF456'
    }
  ];
  const fepdiDeductions = PayrollDeductionFactory.createAll(
    connection,
    DeductionType.FEPDI,
    bulkFepdiFields
  );
  await connection.sendBulkRequest({
    header: connection.connectionConfig,
    data: fepdiDeductions
  });
}

// Run the async function
run();
