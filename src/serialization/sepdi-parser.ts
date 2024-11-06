import { parseStringPromise } from 'xml2js';
import { QLinkError } from '../errors';
import { SEPDIPayrollDeductionFields } from '../types';
import { TranType } from '../enums/tran-type';
import { DeductionType } from '../enums/deduction-type';
import { SEPDIFlag } from '../enums/sepdi-flag';
import { PayrollIdentifier } from '../enums/payroll-identifier';
import { formatToCharString } from '../utils/string-helpers'

/**
 * Parses the XML response to instantiate an SEPDIPayrollDeduction with populated fields.
 * @param xmlData - The XML string response from QLink API.
 * @returns {Promise<SEPDIPayrollDeductionFields>} - A promise that resolves to an SEPDIPayrollDeduction instance.
 */
export async function parseSEPDIPayrollDeductionFromXML(
  xmlData: string
): Promise<SEPDIPayrollDeductionFields> {
  try {
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

    const fields: SEPDIPayrollDeductionFields = {
      effectiveSalaryMonth: rawHeader.SALMON,
      payrollIdentifier: PayrollIdentifier[formatToCharString(rawHeader.PAY, 4) as keyof typeof PayrollIdentifier] ?? PayrollIdentifier.UNKNOWN,
      amount: parseInt(raw.AMOUNT) || 0,
      balance: raw.BALANCE,
      corrRefNo: raw.CORR_REF_NO,
      deductionType: DeductionType[raw.DEDUCT_TYPE as keyof typeof DeductionType] ?? DeductionType.UNKNOWN,
      employeeNumber: raw.EMPL_NO,
      endDate: raw.END_DATE,
      errorCode: raw.ERR_CODE,
      flag: SEPDIFlag[raw.FLAG as keyof typeof SEPDIFlag] ?? SEPDIFlag.UNKNOWN,
      idNumber: raw.IDNO,
      inflationUpdate: raw.INFL_UPD,
      initials: raw.INITIALS,
      intermediaryId: raw.INTERMEDIARY_ID,
      newDeductType: raw.NEW_DEDUCT_TYPE,
      referenceNumber: raw.REFERENCE_NO,
      startDate: raw.START_DATE,
      surname: raw.SURNAME,
      tranType: TranType[raw.TRANTYPE as keyof typeof TranType] ?? TranType.NONE
    };

    return fields;
  } catch (error: any) {
    throw new QLinkError(
      `Failed to parse SEPDI Payroll Deduction XML: ${error.message}`
    );
  }
}
