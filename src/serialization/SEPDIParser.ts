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
      adminCost: parsedData.QLINK?.DATA?.ADMIN_COST || '',
      amount: parseFloat(parsedData.QLINK?.DATA?.AMOUNT) || 0,
      appCode: parsedData.QLINK?.DATA?.APP_CODE || '',
      arrInstallment: parsedData.QLINK?.DATA?.ARR_INSTALLMENT || '',
      balance: parsedData.QLINK?.DATA?.BALANCE || '',
      corrRefNo: parsedData.QLINK?.DATA?.CORR_REF_NO || '',
      deductionType: parsedData.QLINK?.DATA?.DEDUCT_TYPE || '',
      employeeNumber: parsedData.QLINK?.DATA?.EMPL_NO || '',
      endDate: parsedData.QLINK?.DATA?.END_DATE || '',
      errorCode: parsedData.QLINK?.DATA?.ERR_CODE || '',
      flag: parsedData.QLINK?.DATA?.FLAG || '',
      idNumber: parsedData.QLINK?.DATA?.IDNO || '',
      inflationUpdate: parsedData.QLINK?.DATA?.INFL_UPD || '',
      initials: parsedData.QLINK?.DATA?.INITIALS || '',
      interestPayable: parsedData.QLINK?.DATA?.INT_PAYABLE || '',
      intermediaryId: parsedData.QLINK?.DATA?.INTERMEDIARY_ID || '',
      loanAmount: parsedData.QLINK?.DATA?.LOAN_AMNT || '',
      newDeductType: parsedData.QLINK?.DATA?.NEW_DEDUCT_TYPE || '',
      nrrNumber: parsedData.QLINK?.DATA?.NRR_NUMBER || '',
      oldEmployeeNumber: parsedData.QLINK?.DATA?.OLD_EMPL_NO || '',
      percentage: parsedData.QLINK?.DATA?.PERCENTAGE || '',
      referenceNumber: parsedData.QLINK?.DATA?.REFERENCE_NO || '',
      resNumber: parsedData.QLINK?.DATA?.RES_NUMBER || '',
      startDate: parsedData.QLINK?.DATA?.START_DATE || '',
      surname: parsedData.QLINK?.DATA?.SURNAME || '',
      transactionType: parsedData.QLINK?.DATA?.TRANTYPE || '',
      web_function_log_id: parsedData.QLINK?.DATA?.WEB_FUNCTION_LOG_ID || '',
      last_web_function_log_id: parsedData.QLINK?.DATA?.LAST_WEB_FUNCTION_LOG_ID || '',
    };

    // Instantiate and return an SEPDIPayrollDeduction with the populated fields
    return new SEPDIPayrollDeduction(connection, fields);
  } catch (error: any) {
    throw new Error(
      `Failed to parse SEPDI Payroll Deduction XML: ${error.message}`
    );
  }
}
