import {
  QLinkRequest,
  Header,
  Payload,
  BulkQLinkRequest,
  InsurancePayrollDeduction,
  BulkInsurancePayrollDeductionRequest
} from './types';
import {
  sendQLinkRequest,
  sendBulkQLinkRequest,
  sendBulkInsurancePayrollDeductionRequest
} from './services/qlinkService';
import { TransactionType } from './enums/TransactionType';
import { PaymentType } from './enums/PaymentType';
import Config from './config';

const config = Config.getInstance();

const header: Header = {
  transactionType: TransactionType.STOP_ORDER,
  paymentType: PaymentType.DIRECT,
  institution: config.institutionId,
  username: config.qLinkUser,
  password: config.qLinkPassword,
  key: 'XX123YY',
  salaryMonth: '202310' // Example salary month (YYYYMM)
};
console.log(header);
// Single request payload
const payload: Payload = {
  someField: 'Some value',
  anotherField: 42
};

const request: QLinkRequest = {
  header,
  data: payload
};

const bulkPayloads: Payload[] = [
  { someField: 'Bulk value 1', anotherField: 100 },
  { someField: 'Bulk value 2', anotherField: 200 },
  { someField: 'Bulk value 3', anotherField: 300 }
];

// Define the bulk QLink request
const bulkRequest: BulkQLinkRequest = {
  header,
  data: bulkPayloads
};

// Define multiple payroll deductions
const deductions: InsurancePayrollDeduction[] = [
  {
    employeeId: '60175753',
    surname: 'NDLELA',
    initials: 'DG',
    idNumber: '6606110501085',
    referenceNumber: '185109477',
    amount: 15000,
    deductionType: '0010', // Assuming 0010 represents insurance
    startDate: '20230701'
  },
  {
    employeeId: '60175754',
    surname: 'SMITH',
    initials: 'J',
    idNumber: '7501015123083',
    referenceNumber: '185109478',
    amount: 20000,
    deductionType: '0010',
    startDate: '20230701',
    endDate: '20241231' // Optional end date
  }
];

const bulkInsurancePayrollDeductionRequest: BulkInsurancePayrollDeductionRequest =
  {
    header,
    deductions
  };

// Send the single request
sendQLinkRequest(request)
  .then(() => {
    console.log('Single request completed successfully.');
  })
  .catch(error => {
    console.error('Error in single request:', error);
  });

// Send the bulk request
sendBulkQLinkRequest(bulkRequest)
  .then(() => {
    console.log('Bulk request completed successfully.');
  })
  .catch(error => {
    console.error('Error in bulk request:', error);
  });

// Send the bulk payroll deduction request
sendBulkInsurancePayrollDeductionRequest(bulkInsurancePayrollDeductionRequest)
  .then(() => {
    console.log('Bulk request sent successfully.');
  })
  .catch(error => {
    console.error('Error sending bulk request:', error);
  });
