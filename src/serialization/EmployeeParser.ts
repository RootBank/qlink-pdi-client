import { parseStringPromise } from 'xml2js';
import { EmployeeFields } from '../types';
import { Connection } from '../models/Connection';
import { Employee } from '../models/Employee';
import { QLinkError } from '../errors';
import { EmployeeStatusReason } from '../enums/EmployeeStatusReason';
import { EmployeeStatus } from '../enums/EmployeeStatus';

/**
 * Parses XML data into an Employee instance.
 * @param connection - The Connection instance for making requests.
 * @param xmlData - The XML string response from QLink API.
 * @returns {Promise<Employee>} - A promise that resolves to an Employee instance.
 */
export async function parseEmployeeFromXML(
  connection: Connection,
  xmlData: string
): Promise<Employee> {
  try {
    // Convert XML to JSON-like structure
    const parsedData = await parseStringPromise(xmlData, {
      explicitArray: false,
      ignoreAttrs: true
    });

    const empStatusValue = parseInt(parsedData.QLINK?.DATA?.EMP_STATUS || '', 10);
    // eslint-disable-next-line prettier/prettier
    const empStatusReasonValue = parseInt(parsedData.QLINK?.DATA?.EMP_STATUS_RSN || '', 10);

    // Map parsed fields to EmployeeFields
    const employeeFields: Partial<EmployeeFields> = {
      employeeNumber: parsedData.QLINK?.DATA?.EMPLNO || '',
      idNumber: parsedData.QLINK?.DATA?.IDNO || '',
      referenceNumber: parsedData.QLINK?.DATA?.REFERENCE_NO || '',
      appCode: parsedData.QLINK?.DATA?.APP_CODE || '',
      birthDate: parsedData.QLINK?.DATA?.BIRTHDATE || '',
      contactPerson: parsedData.QLINK?.DATA?.CONTACT_PERSON || '',
      empStatus:
        empStatusValue in EmployeeStatus
          ? empStatusValue
          : undefined,
      empStatusReason:
        empStatusReasonValue in EmployeeStatusReason
          ? empStatusReasonValue
          : undefined,
      empName: parsedData.QLINK?.DATA?.EMP_NAME || '',
      payOrg: parsedData.QLINK?.DATA?.PAY_ORG || '',
      payPoint: parsedData.QLINK?.DATA?.PAY_POINT || '',
      payBur: parsedData.QLINK?.DATA?.PAYBUR || '',
      percentage: parsedData.QLINK?.DATA?.PERCENTAGE || '',
      postalCode: parsedData.QLINK?.DATA?.POSTAL_CODE || '',
      resignationDate: parsedData.QLINK?.DATA?.RESIGNATION_DATE || '',
      surname: parsedData.QLINK?.DATA?.SURNAME || '',
      telephone: parsedData.QLINK?.DATA?.TELEPHONE || '',
      tempInd: parsedData.QLINK?.DATA?.TEMP_IND || ''
    };

    // Instantiate and return an Employee with populated fields
    const employee = new Employee(connection, employeeFields);
    return employee;
  } catch (error: any) {
    throw new QLinkError(`Failed to parse Employee XML: ${error.message}`);
  }
}
