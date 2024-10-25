import { ConnectionFields } from '../types';
import { js2xml } from 'xml-js';

export function serializeHeaderToXML(fields: ConnectionFields): string {
  const options = { compact: true, ignoreComment: true, spaces: 4 };
  const headerData = {
    HDR: {
      TRX: fields.transaction_type,
      INST: fields.institution.toString(),
      PAY: fields.payrollIdentifier,
      USER: fields.username,
      PSWD: fields.password,
      SALMON: fields.effectiveSalaryMonth,
      KEY: fields.key || ''
    }
  };
  return js2xml(headerData, options);
}
