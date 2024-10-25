import { parseStringPromise } from 'xml2js';
import { EmployeeFields } from '../types';
import { Connection } from '../models/Connection';
import { Employee } from '../models/Employee';
import { QLinkError } from '../errors';

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

    // Map parsed fields to EmployeeFields
    const employeeFields: Partial<EmployeeFields> = {
      employeeNumber: parsedData.DATA?.EMPL_NO || '',
      idNumber: parsedData.DATA?.IDNO || '',
      referenceNumber: parsedData.DATA?.REFERENCE_NO || '',
      appCode: parsedData.DATA?.APP_CODE || '',
      birthDate: parsedData.DATA?.BIRTHDATE || '',
      contactPerson: parsedData.DATA?.CONTACT_PERSON || '',
      empStatus: parsedData.DATA?.EMP_STATUS || '',
      empStatusReason: parsedData.DATA?.EMP_STATUS_RSN || '',
      empName: parsedData.DATA?.EMP_NAME || '',
      payOrg: parsedData.DATA?.PAY_ORG || '',
      payPoint: parsedData.DATA?.PAY_POINT || '',
      payBur: parsedData.DATA?.PAYBUR || '',
      percentage: parsedData.DATA?.PERCENTAGE || '',
      postalCode: parsedData.DATA?.POSTAL_CODE || '',
      resignationDate: parsedData.DATA?.RESIGNATION_DATE || '',
      surname: parsedData.DATA?.SURNAME || '',
      telephone: parsedData.DATA?.TELEPHONE || '',
      tempInd: parsedData.DATA?.TEMP_IND || ''
    };

    // Instantiate and return an Employee with populated fields
    const employee = new Employee(connection, employeeFields);
    return employee;
  } catch (error: any) {
    throw new QLinkError(`Failed to parse Employee XML: ${error.message}`);
  }
}
