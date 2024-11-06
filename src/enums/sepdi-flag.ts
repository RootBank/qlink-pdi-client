/**
 * Enum for SEPDI Flag values based on institution type and mandate requirements.
 */
export enum SEPDIFlag {
  UNKNOWN = "",
  /**
   * "P" - Paper mandate for insurance institutions. Used when the stop order mandate is on paper.
   */
  PAPER_MANDATE = "P",

  /**
   * " " (Space) - Equivalent to "P" for paper mandate, where no specific flag is needed.
   */
  SPACE_MANDATE = " ",

  /**
   * "V" - Voice recording mandate for insurance institutions.
   * Used when the deduction code holder is registered for voice recording on:
   *  - New business.
   *  - Updates (QUPD) if the QADD was uploaded by voice mandate.
   *  - New business and updates if the holder is registered for voice recording regardless of QADD flag.
   */
  VOICE_RECORDING = "V",

  /**
   * "C" - Converted from debit order to stop order with a voice recording mandate.
   * Used when the collection method has changed to stop order with a voice recording mandate.
   */
  DEBIT_TO_STOP_ORDER_CONVERSION = "C",

  /**
   * "E" - Electronic signature mandate for insurance institutions.
   * Used when the deduction code holder is registered for electronic signatures.
   */
  ELECTRONIC_SIGNATURE = "E",

  /**
   * Financial Institutions and Educational Institutions
   * "Y" - Loan amount includes insurance. Compulsory for financial and educational institutions.
   */
  LOAN_WITH_INSURANCE = "Y",

  /**
   * "N" - Default value indicating loan amount does not include insurance.
   * Compulsory for financial and educational institutions.
   */
  LOAN_WITHOUT_INSURANCE = "N",

  /**
   * Only applicable to the National Student Financial Aid Scheme (NSFAS):
   * "U" - For NSFAS: Update allowed; the amount may automatically increase.
   */
  NSFAS_UPDATE_ALLOWED = "U",

  /**
   * "D" - For NSFAS: Deduct only; the amount may not increase.
   */
  NSFAS_DEDUCT_ONLY = "D",

  /**
   * "F" - For NSFAS: Fixed amount for a set period.
   */
  NSFAS_FIXED_AMOUNT = "F",

  /**
   * "A" - For NSFAS: Negotiated fixed amount.
   */
  NSFAS_NEGOTIATED_AMOUNT = "A",

  /**
   * "I" - For NSFAS: Amount increases with CPI (Consumer Price Index).
   */
  NSFAS_INCREASE_WITH_CPI = "I"
}
