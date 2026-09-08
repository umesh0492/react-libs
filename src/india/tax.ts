/**
 * @file tax.ts — India GST and statutory deduction calculation utilities.
 */

export interface GSTCalculationResult {
  baseAmount: number;
  totalTax: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalPayable: number;
}

/**
 * Calculates GST components based on rate, tax inclusivity, and intra vs inter-state trade.
 *
 * @param amount - Base cost (or tax-inclusive price)
 * @param taxRate - GST rate percentage (e.g. 18 for 18%)
 * @param isIntraState - True if intra-state (split CGST 50% / SGST 50%), false for inter-state (100% IGST)
 * @param isTaxInclusive - True if the provided amount already includes GST
 */
export function calculateGSTSplit(
  amount: number,
  taxRate: number = 18,
  isIntraState: boolean = true,
  isTaxInclusive: boolean = false
): GSTCalculationResult {
  const rate = Math.max(0, taxRate);
  let baseAmount = 0;
  let totalTax = 0;

  if (isTaxInclusive) {
    baseAmount = amount / (1 + rate / 100);
    totalTax = amount - baseAmount;
  } else {
    baseAmount = amount;
    totalTax = amount * (rate / 100);
  }

  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;

  if (isIntraState) {
    cgstAmount = totalTax / 2;
    sgstAmount = totalTax / 2;
  } else {
    igstAmount = totalTax;
  }

  return {
    baseAmount,
    totalTax,
    cgstAmount,
    sgstAmount,
    igstAmount,
    totalPayable: baseAmount + totalTax,
  };
}

/**
 * Calculates Tax Deducted at Source (TDS) on base amount.
 */
export function calculateTDS(baseAmount: number, tdsPercentage: number): number {
  if (tdsPercentage <= 0) return 0;
  return baseAmount * (tdsPercentage / 100);
}
