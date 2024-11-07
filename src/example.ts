import { DeductionType } from "./enums/deduction-type";
import { PayrollIdentifier } from "./enums/payroll-identifier";
import { MandateCapture } from "./enums/sepdi-flag";
import { QLinkClient } from "./models/qlink-client";
import { Configuration, CreateInsurancePayrollDeductionFields, DeleteInsurancePayrollDeductionFields, UpdateAmountFields, UpdateReferenceFields } from "./types";
import dotenv from 'dotenv';

dotenv.config();

const main = async () => {
  const qlink = new QLinkClient(
    {
      institution: Number(process.env.QLINK_INSTITUTION_ID),
      password: process.env.QLINK_PASSWORD,
      username: process.env.QLINK_USERNAME,
      baseUrl: process.env.QLINK_URL,
    } as Configuration
  )

  await qlink.testConnection();

  const governmentEmployeeNumber = "84177942";
  const employee = await qlink.queryEmployeeInfo({ employeeNumber: governmentEmployeeNumber, payrollIdentifier: PayrollIdentifier.PERSAL });
  console.log(employee);

  const beginDeductionFrom = new Date("2024-12");
  let amount: number = 10000;
  let refNumber: string = "ASQ6543FHAHDCS1";
  const deductionFields: CreateInsurancePayrollDeductionFields = {
    employeeNumber: governmentEmployeeNumber,
    amount: amount,
    beginDeductionFrom: beginDeductionFrom,
    referenceNumber: refNumber,
    deductionType: DeductionType.SEPDI_INSURANCE_LIFE,
    payrollIdentifier: PayrollIdentifier.PERSAL,
    mandateCapturedOn: MandateCapture.PAPER_MANDATE,
  }
  const results1 = await qlink.createInsurancePayrollDeduction(deductionFields);
  console.log(results1);

  amount += 10000;
  const updateDeductionFields: UpdateAmountFields = {
    employeeNumber: governmentEmployeeNumber,
    amount: amount,
    beginDeductionFrom: beginDeductionFrom,
    referenceNumber: refNumber,
    deductionType: DeductionType.SEPDI_INSURANCE_LIFE,
    payrollIdentifier: PayrollIdentifier.PERSAL,
  }
  console.log(updateDeductionFields);
  const results2 = await qlink.updateDeductionAmount(updateDeductionFields);
  console.log(results2);

  refNumber = "A222222";
  const fixDeductionFields: UpdateReferenceFields = {
    employeeNumber: governmentEmployeeNumber,
    amount: amount,
    beginDeductionFrom: beginDeductionFrom,
    referenceNumber: refNumber,
    deductionType: DeductionType.SEPDI_INSURANCE_LIFE,
    payrollIdentifier: PayrollIdentifier.PERSAL,
  }
  console.log(fixDeductionFields);
  const results3 = await qlink.updateDeductionReferences(fixDeductionFields);
  console.log(results3);

  const delDeductionFields: DeleteInsurancePayrollDeductionFields = {
    employeeNumber: governmentEmployeeNumber,
    payrollIdentifier: PayrollIdentifier.PERSAL,
    referenceNumber: refNumber,
    amount: amount,
    cancelDeductionFrom: beginDeductionFrom,
    deductionType: DeductionType.SEPDI_INSURANCE_LIFE,
  }
  console.log(delDeductionFields);
  const results4 = await qlink.deleteDeduction(delDeductionFields);
  console.log(results4);
};

main();
