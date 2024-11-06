import { parseStringPromise } from 'xml2js';
import { QLinkError } from '../errors';
import { EmployeeStatusReason } from '../enums/employee-status-reason';
import { EmployeeStatus } from '../enums/employee-status';
import { PayrollIdentifier } from '../enums/payroll-identifier';
import { formatToCharString } from '../utils/string-helpers'
import { EmployeeFields } from '../types';

/**
 * Parses XML data into an Employee instance.
 * @param connection - The QLinkClient instance for making requests.
 * @param xmlData - The XML string response from QLink API.
 * @returns {Promise<EmployeeFields>} - A promise that resolves to an Employee instance.
 */
export async function parseEmployeeFromXML(
  xmlData: string
): Promise<EmployeeFields> {
  try {
    // Convert XML to JSON-like structure
    const parsedData = await parseStringPromise(xmlData, {
      explicitArray: false,
      ignoreAttrs: true
    });
    const raw = parsedData?.QLINK?.DATA;
    if (!raw) {
      throw new QLinkError(`Failed to parse XML: ${parsedData}`);
    }

    const rawHeader = parsedData?.QLINK?.HDR;
    if (!rawHeader) {
      throw new QLinkError(`Failed to parse XML: ${parsedData}`);
    }

    const empStatusValue = parseInt(raw.EMP_STATUS || '', 10);
    // eslint-disable-next-line prettier/prettier
    const empStatusReasonValue = parseInt(raw.EMP_STATUS_RSN || '', 10);

    let payroll: PayrollIdentifier;
    if (!rawHeader.PAY) {
      payroll = PayrollIdentifier.UNKNOWN
    } else {
      payroll = PayrollIdentifier[formatToCharString(rawHeader.PAY, 4) as keyof typeof PayrollIdentifier]
    }

    // Map parsed fields to EmployeeFields
    const employeeFields: EmployeeFields = {
      payrollIdentifier: payroll,
      employeeNumber: raw.EMPLNO,
      emplNumber: raw.EMPLNO,
      idNumber: raw.IDNO,
      referenceNumber: raw.REFERENCE_NO,
      appCode: raw.APP_CODE,
      birthDate: raw.BIRTHDATE,
      contactPerson: raw.CONTACT_PERSON,
      empStatus:
        empStatusValue in EmployeeStatus
          ? empStatusValue
          : undefined,
      empStatusReason:
        empStatusReasonValue in EmployeeStatusReason
          ? empStatusReasonValue
          : undefined,
      empName: raw.EMP_NAME,
      payOrg: raw.PAY_ORG,
      payPoint: raw.PAY_POINT,
      payBur: raw.PAYBUR,
      percentage: raw.PERCENTAGE,
      postalCode: raw.POSTAL_CODE,
      resignationDate: raw.RESIGNATION_DATE,
      surname: raw.SURNAME,
      telephone: raw.TELEPHONE,
      tempInd: raw.TEMP_IND
    };

    return employeeFields;
  } catch (error: any) {
    throw new QLinkError(`Failed to parse Employee XML: ${error.message}`);
  }
}
