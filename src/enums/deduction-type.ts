/* eslint-disable no-unused-vars */
/**
 * Enum for SEPDI Deduction Types with descriptions and institution types.
 */
export enum DeductionType {
  UNKNOWN = "",
  // Insurance: Life Insurance
  SEPDI_INSURANCE_LIFE = "0010",

  // Insurance: Annuity Insurance
  SEPDI_INSURANCE_ANNUITY = "0011",

  // Insurance: Short term Insurance
  SEPDI_INSURANCE_SHORT_TERM = "0012",

  // Trade Union membership
  TRADE_UNION_MEMBERSHIP = "0028",

  // Tuition fees for Educational Institutions
  EDUCATIONAL_TUITION_FEES = "0041",

  // Insurance: Annuity (group) Insurance
  SEPDI_INSURANCE_GROUP_ANNUITY = "0055",

  // Insurance: Funeral Insurance
  SEPDI_INSURANCE_FUNERAL = "0056",

  // Insurance: Group (funeral) Insurance
  SEPDI_INSURANCE_GROUP_FUNERAL = "0057",

  // Insurance: Maturity Insurance
  SEPDI_INSURANCE_MATURITY = "0058",

  // Insurance: Group Insurance
  SEPDI_INSURANCE_GROUP = "0059",

  // Insurance: Disability Insurance
  SEPDI_INSURANCE_DISABILITY = "0060",

  // Insurance: Bond Insurance
  SEPDI_INSURANCE_BOND = "0061",

  // Insurance: Group (Short term) Insurance
  SEPDI_INSURANCE_GROUP_SHORT_TERM = "0070",

  // Insurance: Group (life) Insurance
  SEPDI_INSURANCE_GROUP_LIFE = "0071",

  // Insurance: Medical Insurance
  SEPDI_INSURANCE_MEDICAL = "0116",

  // Educator Union membership
  EDUCATOR_UNION_MEMBERSHIP = "0192",

  // Insurance: Legal Insurance
  SEPDI_INSURANCE_LEGAL = "0201",

  // Insurance: Short Term Subsidised Motor Vehicle Insurance
  SEPDI_INSURANCE_SHORT_TERM_SUBSIDISED_MOTOR = "0235",

  // Insurance: Subsidised Transport Buy up
  SEPDI_INSURANCE_SUBSIDISED_TRANSPORT_BUY_UP = "0260",

  // Insurance: Credit Life Subsidised Transport
  SEPDI_INSURANCE_CREDIT_LIFE_SUBSIDISED_TRANSPORT = "0263",

  // Insurance: GMVS Top Up
  SEPDI_INSURANCE_GMVS_TOP_UP = "1015"
}
