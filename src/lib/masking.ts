import { formatCurrency, formatNumber } from "./formatters";

export type SensitiveDataType =
  | "FINANCIAL_DATA"
  | "CONTRACT_DATA"
  | "AUDIT_DATA"
  | "PII_DATA";

export interface MaskOptions {
  isMasked?: boolean;
  maskPattern?: string;
  dataType?: SensitiveDataType;
  formatAsCurrency?: boolean;
}

/**
 * Pure utility function to mask sensitive values (financial, personal, or contract details).
 */
export function maskSensitiveValue(
  value: string | number | undefined | null,
  options: MaskOptions = {}
): string {
  const {
    isMasked = false,
    maskPattern = "••••••",
    dataType = "FINANCIAL_DATA",
    formatAsCurrency = true,
  } = options;

  if (value === undefined || value === null) {
    return isMasked ? maskPattern : "—";
  }

  if (isMasked) {
    return maskPattern;
  }

  if (typeof value === "number") {
    if (formatAsCurrency && dataType === "FINANCIAL_DATA") {
      return formatCurrency(value);
    }
    return formatNumber(value);
  }

  return String(value);
}
