/* eslint-disable no-unused-vars */
export enum EmployeeStatusReason {
  CURRENT = 0,
  SERVICE_TERMINATED = 1,
  ABSCONDED = 2,
  LEAVE_WITHOUT_PAY = 3,
  REVERSED = 4,
  SICK_LEAVE_WITHOUT_FULL_PAY = 5,
  SUSPENDED = 6,
  LEAVE_WITHOUT_PAY_AGAIN = 7, // To differentiate from the earlier 'Leave without pay' defined twice in the docs
  CURRENT_SUSPENDED = 8,
  NO_SUPPLEMENTARY_PAYMENT = 9
}
