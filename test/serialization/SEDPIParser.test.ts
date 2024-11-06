// test/serialization/SEPDIPayrollDeductionParser.test.ts
import { parseSEPDIPayrollDeductionFromXML } from '../../src/serialization/SEPDIParser';
import { SEPDIPayrollDeduction } from '../../src/models/SEPDIPayrollDeduction';
import { QlinkClient } from '../../src/models/qlink-client';
import { SEPDIPayrollDeductionFields } from '../../src/types';
import { TransactionType } from '../../src/enums/TransactionType';
import { PayrollIdentifier } from '../../src/enums/PayrollIdentifier';
import { QLinkError } from '../../src/errors';
import { getFutureEffectiveSalaryMonth } from '../testHelpers';

jest.mock('../../src/models/qlink-client');

describe('parseSEPDIPayrollDeductionFromXML', () => {
  let mockQlinkClient: QlinkClient;

  beforeEach(() => {
    mockQlinkClient = new QlinkClient({
      transaction_type: TransactionType.Q_LINK_TRANSACTIONS,
      institution: 1,
      payrollIdentifier: PayrollIdentifier.PERSAL,
      username: 'MyUserName',
      password: 'MyPassword',
      effectiveSalaryMonth: getFutureEffectiveSalaryMonth()
    });
  });

  it('should parse XML correctly into an SEPDIPayrollDeduction instance with expected fields', async () => {
    const xmlData = `
      <QLINK>
        <HDR>
          <TRX>5</TRX>
          <INST>1</INST>
          <PAY>1</PAY>
          <USER>MyUserName</USER>
          <PSWD>MyPassword</PSWD>
          <KEY>XX123YY</KEY>
          <SALMON>${getFutureEffectiveSalaryMonth()}</SALMON>
        </HDR>
        <DATA>
          <TRANTYPE>QADD</TRANTYPE>
          <EMPL_NO>60175753</EMPL_NO>
          <SURNAME>NDLELA</SURNAME>
          <INITIALS>DG</INITIALS>
          <IDNO>6606110501085</IDNO>
          <REFERENCE_NO>185109477</REFERENCE_NO>
          <AMOUNT>15000</AMOUNT>
          <BALANCE></BALANCE>
          <LOAN_AMNT></LOAN_AMNT>
          <START_DATE>20200701</START_DATE>
          <END_DATE></END_DATE>
          <DEDUCT_TYPE>0010</DEDUCT_TYPE>
          <CORR_REF_NO></CORR_REF_NO>
          <PERCENTAGE></PERCENTAGE>
          <RES_NUMBER></RES_NUMBER>
          <NRR_NUMBER></NRR_NUMBER>
          <ERR_CODE>7002</ERR_CODE>
          <APP_CODE></APP_CODE>
          <INTERMEDIARY_ID></INTERMEDIARY_ID>
        </DATA>
      </QLINK>`;

    const deduction = await parseSEPDIPayrollDeductionFromXML(
      mockQlinkClient,
      xmlData
    );

    expect(deduction).toBeInstanceOf(SEPDIPayrollDeduction);
    expect(deduction.fields).toEqual<Partial<SEPDIPayrollDeductionFields>>({
      adminCost: '',
      amount: 15000,
      appCode: '',
      arrInstallment: '',
      balance: '',
      corrRefNo: '',
      deductionType: '0010',
      employeeNumber: '60175753',
      endDate: '',
      errorCode: '7002',
      flag: '',
      idNumber: '6606110501085',
      inflationUpdate: '',
      initials: 'DG',
      interestPayable: '',
      intermediaryId: '',
      loanAmount: '',
      newDeductType: '',
      nrrNumber: '',
      oldEmployeeNumber: '',
      percentage: '',
      referenceNumber: '185109477',
      resNumber: '',
      startDate: '20200701',
      surname: 'NDLELA',
      transactionType: 'QADD',
      last_web_function_log_id: '',
      web_function_log_id: '',
    });
  });
});
