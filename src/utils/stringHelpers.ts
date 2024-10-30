import { QLinkError } from '../errors';
/**
 * Converts a cents amount to a 10-character string with left-zero padding.
 * For example, an input of 500 will return "0000000500".
 * 
 * @param amount - The amount in cents to be formatted.
 * @returns A 10-character string representation of the amount, left-padded with zeros.
 */
export function formatCentsToCharString(amount: string | number | undefined, characterLength: number = 10): string {
  const parsedAmount = parseInt(amount as string, 10) || 0;

  if (!Number.isInteger(parsedAmount)) {
    throw new QLinkError('Amount must be an integer.');
  }
  if (parsedAmount < 0) {
    throw new QLinkError('Amount cannot be negative.');
  }

  return parsedAmount.toString().padStart(characterLength, '0');
}
