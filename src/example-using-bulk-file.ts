import { DeductionType } from "./enums/deduction-type";
import { PayrollIdentifier } from "./enums/payroll-identifier";
import { MandateCapture } from "./enums/sepdi-flag";
import { QLinkClient } from "./models/qlink-client";
import { QLinkFile } from "./models/qlink-file";
import { QLinkRequest } from "./models/qlink-request";
import { Configuration, CreateInsurancePayrollDeductionFields, DeleteInsurancePayrollDeductionFields, UpdateAmountFields, UpdateReferenceFields } from "./types";
import dotenv from 'dotenv';

dotenv.config();

const main = async () => {
  const qlink = new QLinkFile(
    {
      institution: Number(process.env.QLINK_INSTITUTION_ID),
      password: process.env.QLINK_PASSWORD,
      username: process.env.QLINK_USERNAME,
      baseUrl: process.env.QLINK_URL,
    } as Configuration
  )

  const beginDeductionFrom = new Date("2024-12");
  const deductionFields1: CreateInsurancePayrollDeductionFields = {
    employeeNumber: "84177942",
    amount: 10000,
    beginDeductionFrom: beginDeductionFrom,
    referenceNumber: "ASQ6543FHAHDCS1",
    deductionType: DeductionType.SEPDI_INSURANCE_LIFE,
    payrollIdentifier: PayrollIdentifier.PERSAL,
    mandateCapturedOn: MandateCapture.PAPER_MANDATE,
  }
  const results1 = await qlink.createInsurancePayrollDeduction(deductionFields1);
  console.log(results1);

  const deductionFields2: CreateInsurancePayrollDeductionFields = {
    employeeNumber: "84325933",
    amount: 200200,
    beginDeductionFrom: beginDeductionFrom,
    referenceNumber: "AAAAADDDDDDDD",
    deductionType: DeductionType.SEPDI_INSURANCE_LIFE,
    payrollIdentifier: PayrollIdentifier.PERSAL,
    mandateCapturedOn: MandateCapture.PAPER_MANDATE,
  }
  const results2 = await qlink.createInsurancePayrollDeduction(deductionFields2);
  console.log(results2);

  const request = new QLinkRequest(results1.header, [results1, results2]);
  qlink.sendBulkRequest(request)
};

main();
