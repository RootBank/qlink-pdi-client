import { Header } from '../models/header';
import { js2xml } from 'xml-js';

export function serializeHeaderToXML(fields: Header): string {
  const options = { compact: true, ignoreComment: true, spaces: 4 };
  const headerData = {
    HDR: {
      TRX: fields.transactionType,
      INST: fields.institution,
      PAY: fields.payrollIdentifier,
      USER: fields.username,
      PSWD: fields.password,
      SALMON: fields.effectiveSalaryMonth,
      KEY: fields.key
    }
  };
  return js2xml(headerData, options);
}
