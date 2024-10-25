import { parseStringPromise } from 'xml2js';
import { SEPDIPayrollDeductionFields } from '../types';
import { SEPDIPayrollDeduction } from '../models/SEPDIPayrollDeduction';
import { Connection } from '../models/Connection';

/**
 * Parses the XML response to instantiate an SEPDIPayrollDeduction with populated fields.
 * @param connection - The Connection instance used to make the request.
 * @param xmlData - The XML string response from QLink API.
 * @returns {Promise<SEPDIPayrollDeduction>} - A promise that resolves to an SEPDIPayrollDeduction instance.
 */
export async function parseSEPDIPayrollDeductionFromXML(
  connection: Connection,
  xmlData: string
): Promise<SEPDIPayrollDeduction> {
  try {
    // Parse the XML string into a JSON-like object
    const parsedData = await parseStringPromise(xmlData, {
      explicitArray: false,
      ignoreAttrs: true
    });

    // Map the parsed fields to SEPDIPayrollDeductionFields
    const fields: Partial<SEPDIPayrollDeductionFields> = {
      adminCost: parsedData.DATA?.ADMIN_COST || '',
      amount: parseFloat(parsedData.DATA?.AMOUNT) || 0,
      appCode: parsedData.DATA?.APP_CODE || '',
      arrInstallment: parsedData.DATA?.ARR_INSTALLMENT || '',
      balance: parsedData.DATA?.BALANCE || '',
      corrRefNo: parsedData.DATA?.CORR_REF_NO || '',
      deductionType: parsedData.DATA?.DEDUCT_TYPE || '',
      employeeNumber: parsedData.DATA?.EMPL_NO || '',
      endDate: parsedData.DATA?.END_DATE || '',
      errorCode: parsedData.DATA?.ERR_CODE || '',
      flag: parsedData.DATA?.FLAG || '',
      idNumber: parsedData.DATA?.IDNO || '',
      inflationUpdate: parsedData.DATA?.INFL_UPD || '',
      initials: parsedData.DATA?.INITIALS || '',
      interestPayable: parsedData.DATA?.INT_PAYABLE || '',
      intermediaryId: parsedData.DATA?.INTERMEDIARY_ID || '',
      loanAmount: parsedData.DATA?.LOAN_AMNT || '',
      newDeductType: parsedData.DATA?.NEW_DEDUCT_TYPE || '',
      nrrNumber: parsedData.DATA?.NRR_NUMBER || '',
      oldEmployeeNumber: parsedData.DATA?.OLD_EMPL_NO || '',
      percentage: parsedData.DATA?.PERCENTAGE || '',
      referenceNumber: parsedData.DATA?.REFERENCE_NO || '',
      resNumber: parsedData.DATA?.RES_NUMBER || '',
      startDate: parsedData.DATA?.START_DATE || '',
      surname: parsedData.DATA?.SURNAME || '',
      transactionType: parsedData.DATA?.TRANTYPE || ''
    };

    // Instantiate and return an SEPDIPayrollDeduction with the populated fields
    return new SEPDIPayrollDeduction(connection, fields);
  } catch (error: any) {
    throw new Error(
      `Failed to parse SEPDI Payroll Deduction XML: ${error.message}`
    );
  }
}
