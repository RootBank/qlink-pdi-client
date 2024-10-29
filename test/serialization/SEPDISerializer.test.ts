// test/serialization/SEPDIPayrollDeductionSerializer.test.ts
import { serializeSEPDIPayrollDeductionToXML } from '../../src/serialization/SEPDISerializer';
import { SEPDIPayrollDeductionFields } from '../../src/types';
import { TranType } from '../../src/enums/TranType';

describe('serializeSEPDIPayrollDeductionToXML', () => {
  it('should serialize all fields correctly to XML', () => {
    const fields: SEPDIPayrollDeductionFields = {
      adminCost: '50',
      amount: 1000,
      appCode: '01',
      arrInstallment: '20',
      balance: '500',
      corrRefNo: 'CORR001',
      deductionType: '0010',
      employeeNumber: '60175753',
      endDate: '20230701',
      errorCode: '1234',
      flag: 'A',
      idNumber: '6606110501085',
      inflationUpdate: 'Y',
      initials: 'DG',
      interestPayable: '5',
      intermediaryId: 'INT001',
      loanAmount: '10000',
      newDeductType: '0020',
      nrrNumber: 'NRR123',
      oldEmployeeNumber: '60175752',
      percentage: '15',
      referenceNumber: '185109477',
      resNumber: 'RES001',
      startDate: '20220101',
      surname: 'NDLELA',
      transactionType: TranType.NEW_DEDUCTION
    };

    const expectedXML = `
      <DATA>
          <ADMIN_COST>50</ADMIN_COST>
          <AMOUNT>1000</AMOUNT>
          <APP_CODE>01</APP_CODE>
          <ARR_INSTALLMENT>20</ARR_INSTALLMENT>
          <BALANCE>500</BALANCE>
          <CORR_REF_NO>CORR001</CORR_REF_NO>
          <DEDUCT_TYPE>0010</DEDUCT_TYPE>
          <EMPL_NO>60175753</EMPL_NO>
          <END_DATE>20230701</END_DATE>
          <ERR_CODE>1234</ERR_CODE>
          <FLAG>A</FLAG>
          <IDNO>6606110501085</IDNO>
          <INFL_UPD>Y</INFL_UPD>
          <INITIALS>DG</INITIALS>
          <INT_PAYABLE>5</INT_PAYABLE>
          <INTERMEDIARY_ID>INT001</INTERMEDIARY_ID>
          <LOAN_AMNT>10000</LOAN_AMNT>
          <NEW_DEDUCT_TYPE>0020</NEW_DEDUCT_TYPE>
          <NRR_NUBMER>NRR123</NRR_NUBMER>
          <OLD_EMPL_NO>60175752</OLD_EMPL_NO>
          <PERCENTAGE>15</PERCENTAGE>
          <REFERENCE_NO>185109477</REFERENCE_NO>
          <RES_NUMBER>RES001</RES_NUMBER>
          <START_DATE>20220101</START_DATE>
          <SURNAME>NDLELA</SURNAME>
          <TRANTYPE>QADD</TRANTYPE>
      </DATA>`.replace(/\s+/g, '');

    const resultXML = serializeSEPDIPayrollDeductionToXML(fields).replace(
      /\s+/g,
      ''
    );

    expect(resultXML).toBe(expectedXML);
  });

  it('should handle optional fields and set empty values correctly', () => {
    const fields: SEPDIPayrollDeductionFields = {
      amount: 500,
      deductionType: '0010',
      employeeNumber: '60175753',
      referenceNumber: '185109477',
      startDate: '20220101',
      surname: 'NDLELA',
      transactionType: TranType.NONE
    };

    const expectedXML = `
      <DATA>
          <ADMIN_COST/>
          <AMOUNT>500</AMOUNT>
          <APP_CODE/>
          <ARR_INSTALLMENT/>
          <BALANCE/>
          <CORR_REF_NO/>
          <DEDUCT_TYPE>0010</DEDUCT_TYPE>
          <EMPL_NO>60175753</EMPL_NO>
          <END_DATE/>
          <ERR_CODE/>
          <FLAG/>
          <IDNO/>
          <INFL_UPD/>
          <INITIALS/>
          <INT_PAYABLE/>
          <INTERMEDIARY_ID/>
          <LOAN_AMNT/>
          <NEW_DEDUCT_TYPE/>
          <NRR_NUBMER/>
          <OLD_EMPL_NO/>
          <PERCENTAGE/>
          <REFERENCE_NO>185109477</REFERENCE_NO>
          <RES_NUMBER/>
          <START_DATE>20220101</START_DATE>
          <SURNAME>NDLELA</SURNAME>
          <TRANTYPE/>
      </DATA>`.replace(/\s+/g, '');

    const resultXML = serializeSEPDIPayrollDeductionToXML(fields).replace(
      /\s+/g,
      ''
    );

    expect(resultXML).toBe(expectedXML);
  });
});
