import { EmployeeFields } from '../types';
import { js2xml } from 'xml-js';

export function serializeEmployeeToXML(fields: EmployeeFields): string {
  const options = { compact: true, ignoreComment: true, spaces: 4 };
  const sepdiData = {
    DATA: {
      EMPL_NO: fields.employeeNumber,
      IDNO: fields.idNumber || '',
      REFERENCE_NO: fields.referenceNumber
    }
  };
  return js2xml(sepdiData, options);
}
