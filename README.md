![Node LTS](https://img.shields.io/badge/node-%3E%3D%2020.0.0-brightgreen)
![License](https://img.shields.io/github/license/RootBank/qlink-pdi-client)

# QLink Payroll Deduction Interface (PDI) QlinkClient Library

This library provides a client for sending requests to the QLink API, specifically supporting payroll deductions (SEPDI, FEPDI) and error handling.

## Prerequisites

To use the `qlink-pdi-client`, ensure you have the following environment variables configured in a `.env` file:

```bash
Q_LINK_USER=yourUsername
Q_LINK_PASSWORD=yourPassword
Q_LINK_URL=https://govtest.qlink.co.za/cgi-bin/XmlProc
Q_LINK_INSTITUTION_ID=9999
Q_LINK_LOG_LEVEL=DEBUG
```

## Usage Example

Here’s how to use the library to establish a connection, send a SEPDI deduction, and perform bulk FEPDI deductions.
Note: All SEPDI and FEPDI transactions types (TRX) must be set to Q_LINK_TRANSACTIONS (5)

### Step-by-Step Example

```typescript
import { QlinkClient } from './models/qlink-client';
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
  const test_connection = new QlinkClient({
    transaction_type: TransactionType.COMMUNICATION_TEST,
    payrollIdentifier: PayrollIdentifier.PERSAL,
    username: config.qLinkUser,
    password: config.qLinkPassword,
    institution: config.institutionId,
  });
  const comms_test = new CommunicationTest(test_connection);
  comms_test.save();

  // find an employee
  const employeeQlinkClient = new QlinkClient({
    transaction_type: TransactionType.EMPLOYEE_ENQUIRIES,
    payrollIdentifier: PayrollIdentifier.PERSAL,
    username: config.qLinkUser,
    password: config.qLinkPassword,
    institution: config.institutionId,
  });
  const employee = new Employee(employeeQlinkClient, {
    employeeNumber: '82714673',
  });
  const foundEmployee = await employee.find();
  console.log(foundEmployee);

  // Single SEPDI Deduction using only compulsory fields
  const transactionQlinkClient = new QlinkClient({
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
    transactionQlinkClient,
    DeductionType.SEPDI,
    sepdiFields
  );

  await sepdiDeduction.save();
}

// Run the async function
run();
```

### Explanation

- **QlinkClient Configuration**: Initializes the connection using `QlinkClient` with environment-based configuration and transaction details.
- **Deduction Creation**: Creates both single and bulk deductions using `PayrollDeductionFactory` and sends them with `save`.
- **Error Handling**: Wrap calls in try/catch blocks to handle custom `QLinkError` or unexpected errors.

## Development Environment Setup

1. Ensure your public IP address is registered with QLink by running:
   ```bash
   curl ifconfig.me
   ```

2. Set up the development environment:
   ```bash
   curl -o setup-remote-env.sh https://raw.githubusercontent.com/RootBank/qlink-pdi-client/refs/heads/main/setup-remote-env.sh
   chmod +x setup-remote-env.sh
   sudo ./setup-remote-env.sh
   ```

3. Configure SSH access for your remote EC2 environment:
   ```bash
   # ~/.ssh/config
   Host sandbox-dev
       HostName <ip address> # from private subnet
       User ec2-user
       IdentityFile ~/.ssh/id_ed25519
       ProxyJump sandbox-jumphost

   Host sandbox-jumphost
       HostName <ip address> # from public subnet
       User ec2-user
       IdentityFile ~/.ssh/id_ed25519
       ForwardAgent yes
   ```

## Design Notes

1. **Human-Readable Models**: Models are designed with human-readable names (e.g., `institution`, `transactionType`) for code clarity.
2. **Explicit Serialization**: Conversion to QLink’s format happens at the serialization stage, ensuring business logic remains readable.
3. **Separated Concerns**: Business logic, core models, and serialization are distinct for maintainability.
4. **Error Handling**: Custom errors are used for handling QLink-specific and HTTP errors gracefully.

## Example Environment Variables

Make sure to include these environment variables in your `.env` file:

```bash
Q_LINK_USER=yourUsername
Q_LINK_PASSWORD=yourPassword
Q_LINK_URL=https://govtest.qlink.co.za/cgi-bin/XmlProc
Q_LINK_INSTITUTION_ID=9999
Q_LINK_LOG_LEVEL=DEBUG
```

Now you’re all set to integrate with the QLink API using `qlink-pdi-client`!
