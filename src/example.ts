import { DeductionType } from "./enums/deduction-type";
import { PayrollIdentifier } from "./enums/payroll-identifier";
import { MandateCapture } from "./enums/sepdi-flag";
import { QLinkClient } from "./models/qlink-client";
import { Configuration, CreateInsurancePayrollDeductionFields } from "./types";
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
  // const employee = await qlink.queryEmployeeInfo({ employeeNumber: governmentEmployeeNumber, payrollIdentifier: PayrollIdentifier.PERSAL });

  const beginDeductionFrom = new Date("2024-12");
  const deductionFields = {
    employeeNumber: governmentEmployeeNumber,
    amount: 10000,
    beginDeductionFrom: beginDeductionFrom,
    referenceNumber: "ASQ6543FHAHDCS1",
    deductionType: DeductionType.SEPDI_INSURANCE_LIFE,
    payrollIdentifier: PayrollIdentifier.PERSAL,
    mandateCapturedOn: MandateCapture.PAPER_MANDATE,
  } as CreateInsurancePayrollDeductionFields
  await qlink.createInsurancePayrollDeduction(deductionFields);

  // await qlink.updateInsurancePayrollDeduction(deductionFields);
};

main();
