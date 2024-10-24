import { js2xml } from 'xml-js';
import {
  QLinkRequest,
  Header,
  Payload,
  BulkInsurancePayrollDeductionRequest,
  BulkQLinkRequest
} from './types';

// QLink-specific header mapping
interface QLinkHDR {
  TRX: number;
  PAY: number;
  INST: number;
  USER: string;
  PSWD: string;
  KEY?: string;
}

// QLink-specific request format
interface QLinkSerializedRequest {
  HDR: QLinkHDR;
  DATA: Payload;
}

// Map core model to QLink header format (abbreviations)
const serializeHeader = (header: Header): QLinkHDR => {
  return {
    TRX: header.transactionType,
    PAY: header.paymentType,
    INST: header.institution,
    USER: header.username,
    PSWD: header.password,
    KEY: header.key || ''
  };
};

// Serialize entire request object (including header and payload)
export const serializeToQLinkFormat = (
  request: QLinkRequest
): QLinkSerializedRequest => {
  return {
    HDR: serializeHeader(request.header),
    DATA: request.data
  };
};

export const convertToXML = (request: QLinkSerializedRequest): string => {
  const options = { compact: true, ignoreComment: true, spaces: 4 };
  // Wrap the HDR and DATA sections inside the QLINK root element
  const qlinkWrappedRequest = {
    QLINK: request
  };

  return js2xml(qlinkWrappedRequest, options);
};

export const convertBulkToXML = (request: BulkQLinkRequest): string => {
  const options = { compact: true, ignoreComment: true, spaces: 4 };

  const data = {
    TXN: request.data.map(transaction => transaction)
  };

  const qlinkWrappedRequest = {
    QLINK: {
      HDR: request.header,
      DATA: data
    }
  };

  return js2xml(qlinkWrappedRequest, options);
};

export const convertInsurancePayrollBulkToXML = (
  request: BulkInsurancePayrollDeductionRequest
): string => {
  const options = { compact: true, ignoreComment: true, spaces: 4 };

  // Wrap each insurance payroll deduction inside a TXN (transaction) tag
  const data = {
    TXN: request.deductions.map(deduction => ({
      EMPL_NO: deduction.employeeId,
      SURNAME: deduction.surname,
      INITIALS: deduction.initials,
      IDNO: deduction.idNumber,
      REFERENCE_NO: deduction.referenceNumber,
      AMOUNT: deduction.amount.toString(), // Assuming no decimal point in amount
      DEDUCT_TYPE: deduction.deductionType,
      START_DATE: deduction.startDate,
      END_DATE: deduction.endDate || ''
    }))
  };

  const qlinkWrappedRequest = {
    QLINK: {
      HDR: request.header,
      DATA: data
    }
  };

  return js2xml(qlinkWrappedRequest, options);
};
