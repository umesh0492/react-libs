import * as React from "react";
import { Wallet, TrendingUp, TrendingDown, ExternalLink } from "lucide-react";
import { formatCurrency, formatDate } from "../../../lib/formatters";
import { Badge } from "./badge";
import { cn } from "../../../lib/utils";

export interface LedgerEntry {
  key?: string;
  grn_id?: string;
  grn_number?: string;
  invoice_id?: string;
  date: string;
  description: string;
  type: "DR" | "CR";
  amount: number;
  bill_status?: string;
  status?: string;
}

export interface PaymentLedgerProps extends React.HTMLAttributes<HTMLDivElement> {
  ledgerEntries: LedgerEntry[];
  totalDR?: number;
  totalCR?: number;
  net?: number;
  netLabel?: string;
  showFooter?: boolean;
  onGRNClick?: (grnId: string) => void;
  onInvoiceClick?: (invoiceId: string) => void;
  maskFormatter?: (val: string) => string;
}

const BILL_BADGE: Record<string, string> = {
  BILLED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
  PARTIALLY_BILLED: "bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300",
  RECEIVED: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  CANCELLED: "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  SETTLED: "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300",
};

export function PaymentLedger({
  ledgerEntries = [],
  totalDR = 0,
  totalCR = 0,
  net = 0,
  netLabel = "Net Payable",
  showFooter = true,
  onGRNClick,
  onInvoiceClick,
  maskFormatter,
  className,
  ...props
}: PaymentLedgerProps) {
  const entries = [...(ledgerEntries || [])];
  entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const activeEntries = entries.filter(
    (e) =>
      (e.status || "").toUpperCase() !== "CANCELLED" &&
      (e.bill_status || "").toUpperCase() !== "CANCELLED"
  );

  const activeDR = activeEntries
    .filter((e) => e.type === "DR")
    .reduce((s, e) => s + e.amount, 0);
  const activeCR = activeEntries
    .filter((e) => e.type === "CR")
    .reduce((s, e) => s + e.amount, 0);

  const effectiveDR = activeDR > 0 ? activeDR : totalDR;
  const effectiveCR = activeCR > 0 ? activeCR : totalCR;
  const effectiveNet = effectiveDR - effectiveCR;

  const fmt = (val: number) => {
    const formatted = formatCurrency(val);
    if (maskFormatter) return maskFormatter(formatted);
    return formatted;
  };

  if (entries.length === 0) {
    return (
      <div className="py-16 flex flex-col items-center justify-center text-center">
        <Wallet className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
        <p className="text-slate-700 dark:text-slate-200 font-semibold text-base">
          Ledger is empty
        </p>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">
          Bills and payment vouchers will appear here once processed.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)} {...props}>
      <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200/80 dark:bg-slate-950 dark:border-slate-800">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-500 uppercase tracking-wide">
                Date
              </th>
              <th className="px-4 py-3 font-semibold text-slate-500 uppercase tracking-wide">
                Description / Reference
              </th>
              <th className="px-3 py-3 font-semibold text-slate-500 uppercase tracking-wide text-center">
                Type
              </th>
              <th className="px-4 py-3 font-semibold text-slate-500 uppercase tracking-wide text-right">
                Debit (DR)
              </th>
              <th className="px-4 py-3 font-semibold text-slate-500 uppercase tracking-wide text-right">
                Credit (CR)
              </th>
              <th className="px-3 py-3 font-semibold text-slate-500 uppercase tracking-wide text-center">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {entries.map((entry, idx) => {
              const isCancelled =
                (entry.status || "").toUpperCase() === "CANCELLED" ||
                (entry.bill_status || "").toUpperCase() === "CANCELLED";

              return (
                <tr
                  key={entry.key || idx}
                  className={cn(
                    "hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors",
                    isCancelled && "opacity-45 bg-slate-50/30 line-through"
                  )}
                >
                  <td className="px-4 py-3 whitespace-nowrap text-slate-600 dark:text-slate-300 font-mono">
                    {formatDate(entry.date)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <span>{entry.description}</span>
                      {entry.grn_id && onGRNClick && (
                        <button
                          type="button"
                          onClick={() => onGRNClick(entry.grn_id!)}
                          className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
                        >
                          <ExternalLink className="h-3 w-3 inline" />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span
                      className={cn(
                        "inline-block rounded px-2 py-0.5 text-[10px] font-extrabold",
                        entry.type === "DR"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                          : "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300"
                      )}
                    >
                      {entry.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {entry.type === "DR" ? fmt(entry.amount) : "—"}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {entry.type === "CR" ? fmt(entry.amount) : "—"}
                  </td>
                  <td className="px-3 py-3 text-center">
                    {entry.bill_status || entry.status ? (
                      <span
                        className={cn(
                          "inline-block rounded px-2 py-0.5 text-[10px] font-bold",
                          BILL_BADGE[entry.bill_status || entry.status || ""] ||
                            "bg-slate-100 text-slate-600"
                        )}
                      >
                        {(entry.bill_status || entry.status)?.replace("_", " ")}
                      </span>
                    ) : (
                      "Active"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showFooter && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
              Total Debits (DR)
            </span>
            <span className="text-base font-extrabold text-slate-900 dark:text-slate-100 font-mono">
              {fmt(effectiveDR)}
            </span>
          </div>
          <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
              Total Credits (CR)
            </span>
            <span className="text-base font-extrabold text-slate-900 dark:text-slate-100 font-mono">
              {fmt(effectiveCR)}
            </span>
          </div>
          <div className="rounded-xl border border-indigo-200/80 bg-indigo-50/50 p-3.5 dark:border-indigo-900/50 dark:bg-indigo-950/40 shadow-xs">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
              {netLabel}
            </span>
            <span className="text-base font-extrabold text-indigo-700 dark:text-indigo-300 font-mono">
              {fmt(effectiveNet)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
