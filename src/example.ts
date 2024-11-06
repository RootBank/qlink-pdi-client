import { DeductionType } from "./enums/deduction-type";
import { PayrollIdentifier } from "./enums/payroll-identifier";
import { SEPDIFlag } from "./enums/sepdi-flag";
import { QLinkClient } from "./models/qlink-client";
import { formatDate } from "./utils/date-helpers";

const qlink = new QLinkClient({ institution: 123, password: "pswd", username: "usr" })

qlink.testConnection();

// c.queryEmployeeInfo({ employeeNumber: "123" })
const deductionFields = {
  amount: 10000,
  deductionType: DeductionType.SEPDI_INSURANCE_LIFE,
  employeeNumber: "123",
  payrollIdentifier: PayrollIdentifier.PERSAL,
  referenceNumber: "my lucky random number",
  startDate: "",
  surname: "SURNAME",
  effectiveSalaryMonth: formatDate(new Date(2024, 10, 1)).ccyyMM,
  flag: SEPDIFlag.PAPER_MANDATE
}
qlink.createInsurancePayrollDeduction(deductionFields);
