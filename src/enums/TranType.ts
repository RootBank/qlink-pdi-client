/* eslint-disable no-unused-vars */

// Note: These are only valid for TRX 5 (TransactionType: Q_LINK_TRANSACTIONS)
export enum TranType {
  NONE = "",
  NEW_DEDUCTION = "QADD",
  ENQUIRE_QADD_AFFORDABILITY = "QANA",
  ENQUIRE_QUPD_AFFORDABILITY = "QANU",
  DELETION = "QDEL",
  UPDATE_EXISTING_DEDUCTION = "QUPD",
  // from SEPDI File Format documentation
  CHANGE_REF_OR_DEDUCT_TYPE = "QFIX",
  NEW_PREMIUM_HOLIDAY = "QPHA",
  CANCEL_PREMIUM_HOLIDAY = "QPHC",
  UPDATE_PREMIUM_HOLIDAY_END_DATE = "QPHU",
}
