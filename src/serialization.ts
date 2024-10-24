import { QLinkRequest, Header, Payload } from './types'; // Use the core models

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
