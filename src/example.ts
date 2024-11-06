import { DeductionType } from "./enums/deduction-type";
import { PayrollIdentifier } from "./enums/payroll-identifier";
import { SEPDIFlag } from "./enums/sepdi-flag";
import { QLinkClient } from "./models/qlink-client";
import { Configuration, SEPDIPayrollDeductionFields } from "./types";
import { formatDate, IdFromBirthDate } from "./utils/date-helpers";
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

  const employee = await qlink.queryEmployeeInfo({ employeeNumber: "84177942", payrollIdentifier: PayrollIdentifier.PERSAL });

  const deductionFields = {
    amount: 10000,
    deductionType: DeductionType.SEPDI_INSURANCE_LIFE,
    employeeNumber: "84177942",
    payrollIdentifier: PayrollIdentifier.PERSAL,
    referenceNumber: "ASQ6543FHAHDCS1",
    startDate: formatDate(new Date(2024, 11, 1)).ccyyMM01,
    surname: employee.surname ? employee.surname : "SURNAME",
    effectiveSalaryMonth: formatDate(new Date(2024, 11, 1)).ccyyMM,
    flag: SEPDIFlag.PAPER_MANDATE,
    idNumber: IdFromBirthDate(employee.birthDate as string),
    initials: employee.empName ? employee.empName.split(" ")[0]?.slice(0, 2) : "A A"
  } as SEPDIPayrollDeductionFields
  await qlink.createInsurancePayrollDeduction(deductionFields);
};

main();
