# QLink Client Library

This library provides a client for sending requests to the QLink API, specifically supporting payroll deductions (SEPDI, FEPDI) and error handling.

## Prerequisites

To use the `qlink-client-lib`, ensure you have the following environment variables configured in a `.env` file:

```bash
Q_LINK_USER=yourUsername
Q_LINK_PASSWORD=yourPassword
Q_LINK_URL=https://govtest.qlink.co.za/cgi-bin/XmlProc
```

## Usage Example

Here’s how to use the library to establish a connection, send a SEPDI deduction, and perform bulk FEPDI deductions.
Note: All SEPDI and FEPDI transactions types (TRX) must be set to Q_LINK_TRANSACTIONS (5)

### Step-by-Step Example

```typescript
import { Connection } from './services/Connection';
import { DeductionType } from './enums/DeductionType';
import { PayrollDeductionFactory } from './factories/PayrollDeductionFactory';
import { PayrollIdentifier } from './enums/PayrollIdentifier';
import { TransactionType } from './enums/TransactionType';

async function run() {
  // Define connection configuration
  const connection = new Connection({
    transaction_type: TransactionType.COMMUNICATION_TEST,
    institution: 9999,
    payrollIdentifier: PayrollIdentifier.PERSAL,
    username: 'MyUserName',
    password: 'MyPassword',
    effectiveSalaryMonth: '202501'
  });

  // Single SEPDI Deduction
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

  // Bulk FEPDI Deductions
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
```

### Explanation

- **Connection Configuration**: Initializes the connection using `Connection` with environment-based configuration and transaction details.
- **Deduction Creation**: Creates both single and bulk deductions using `PayrollDeductionFactory` and sends them with `save` and `saveAll`.
- **Error Handling**: Wrap calls in try/catch blocks to handle custom `QLinkError` or unexpected errors.

## Development Environment Setup

1. Ensure your public IP address is registered with QLink by running:
   ```bash
   curl ifconfig.me
   ```

2. Set up the development environment:
   ```bash
   curl -o setup-remote-env.sh https://raw.githubusercontent.com/RootBank/qlink-xml-client/refs/heads/main/setup-remote-env.sh
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

Now you’re all set to integrate with the QLink API using `qlink-client-lib`!

# TODO
- Option 7 - Change Password Request:
- Option 8 - UPDATE SEQUENCE NUMBER REQUEST
- Option 9 - Maintenance Fuel Transactions (QFUL) Request:
- Option 10 - Maintenance Transactions Request:
- FEPDI parser
- MEPDI full implementation
- LEPDI full implementation