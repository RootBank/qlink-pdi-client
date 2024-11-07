![Node LTS](https://img.shields.io/badge/node-%3E%3D%2020.0.0-brightgreen)
![License](https://img.shields.io/github/license/RootBank/qlink-pdi-client)

# QLink Payroll Deduction Interface (PDI) QLinkClient Library

This library provides a client for sending requests to the QLink API, specifically supporting payroll deductions (SEPDI, FEPDI) and error handling.

## Prerequisites

To use the `qlink-pdi-client`, ensure you have the following environment variables configured in a `.env` file:

```bash
QLINK_USER=yourUsername
QLINK_PASSWORD=yourPassword
QLINK_URL=https://govtest.qlink.co.za/cgi-bin/XmlProc
QLINK_INSTITUTION_ID=9999
QLINK_LOG_LEVEL=DEBUG
```

## Usage Example

Here’s how to use the library to establish a connection, send a SEPDI deduction, and perform bulk FEPDI deductions.
Note: All SEPDI and FEPDI transactions types (TRX) must be set to Q_LINK_TRANSACTIONS (5)

### Step-by-Step Example

```typescript

import dotenv from 'dotenv';
import { Configuration, CreateInsurancePayrollDeductionFields, DeductionType, DeleteInsurancePayrollDeductionFields, MandateCapture, PayrollIdentifier, QLinkClient, UpdateAmountFields, UpdateReferenceFields } from 'qlink-pdi-client';

dotenv.config();

const main = async () => {
  const qlink = new QLinkClient(
    {
      institution: Number(process.env.QLINK_INSTITUTION_ID),
      password: process.env.QLINK_PASSWORD,
      username: process.env.QLINK_USERNAME,
      baseUrl: process.env.QLINK_URL,
    } as Configuration
  )

  await qlink.testConnection();

  const governmentEmployeeNumber = "84177942";
  const employee = await qlink.queryEmployeeInfo({ employeeNumber: governmentEmployeeNumber, payrollIdentifier: PayrollIdentifier.PERSAL });
  console.log(employee);

  const beginDeductionFrom = new Date("2024-12");
  let amount: number = 10000;
  let refNumber: string = "ASQ6543FHAHDCS1";
  const deductionFields: CreateInsurancePayrollDeductionFields = {
    employeeNumber: governmentEmployeeNumber,
    amount: amount,
    beginDeductionFrom: beginDeductionFrom,
    referenceNumber: refNumber,
    deductionType: DeductionType.SEPDI_INSURANCE_LIFE,
    payrollIdentifier: PayrollIdentifier.PERSAL,
    mandateCapturedOn: MandateCapture.PAPER_MANDATE,
  }
  const results1 = await qlink.createInsurancePayrollDeduction(deductionFields);
  console.log(results1);

  amount += 10000;
  const updateDeductionFields: UpdateAmountFields = {
    employeeNumber: governmentEmployeeNumber,
    amount: amount,
    beginDeductionFrom: beginDeductionFrom,
    referenceNumber: refNumber,
    deductionType: DeductionType.SEPDI_INSURANCE_LIFE,
    payrollIdentifier: PayrollIdentifier.PERSAL,
  }
  console.log(updateDeductionFields);
  const results2 = await qlink.updateDeductionAmount(updateDeductionFields);
  console.log(results2);

  refNumber = "A222222";
  const fixDeductionFields: UpdateReferenceFields = {
    employeeNumber: governmentEmployeeNumber,
    amount: amount,
    beginDeductionFrom: beginDeductionFrom,
    referenceNumber: refNumber,
    deductionType: DeductionType.SEPDI_INSURANCE_LIFE,
    payrollIdentifier: PayrollIdentifier.PERSAL,
  }
  console.log(fixDeductionFields);
  const results3 = await qlink.updateDeductionReferences(fixDeductionFields);
  console.log(results3);

  const delDeductionFields: DeleteInsurancePayrollDeductionFields = {
    employeeNumber: governmentEmployeeNumber,
    payrollIdentifier: PayrollIdentifier.PERSAL,
    referenceNumber: refNumber,
    amount: amount,
    cancelDeductionFrom: beginDeductionFrom,
    deductionType: DeductionType.SEPDI_INSURANCE_LIFE,
  }
  console.log(delDeductionFields);
  const results4 = await qlink.deleteDeduction(delDeductionFields);
  console.log(results4);
};

main();
```

### Explanation

- **QLinkClient Configuration**: Initializes the connection using `QLinkClient` with environment-based configuration and transaction details. `QlinkClient` exposes service methods for retrieving employee information and managing payroll deductions.
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
QLINK_USER=yourUsername
QLINK_PASSWORD=yourPassword
QLINK_URL=https://govtest.qlink.co.za/cgi-bin/XmlProc
QLINK_INSTITUTION_ID=9999
QLINK_LOG_LEVEL=DEBUG
```

Now you’re all set to integrate with the QLink API using `qlink-pdi-client`!
