import * as React from "react";
import { Badge } from "./badge";
import { formatCurrency } from "../../../lib/formatters";
import { cn } from "../../../lib/utils";

export interface LineItem {
  id?: string;
  name?: string;
  item_name?: string;
  ean_code?: string;
  hsn_sac_code?: string;
  hsn_code?: string;
  ordered_qty?: number;
  qty?: number;
  received_qty?: number;
  rejected_qty?: number;
  accepted_qty?: number;
  unit?: string;
  base_price?: number;
  unit_price?: number;
  tax_per_unit?: number;
  sgst_rate?: number;
  cgst_rate?: number;
  igst_rate?: number;
  total_tax?: number;
  total_amount?: number;
  bill_status?: string;
}

export interface LineItemsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  items: LineItem[];
  showBillStatus?: boolean;
  showQtyBreakdown?: boolean;
  footerLabel?: string;
  footerTotal?: number;
  emptyMessage?: string;
  isIntraState?: boolean;
  maskFormatter?: (val: string) => string;
}

const BILL_STATUS_STYLE: Record<string, string> = {
  RECEIVED: "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-none",
  BILLED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-none",
  PARTIALLY_BILLED: "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border-none",
  CANCELLED: "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-none",
};

export function LineItemsCard({
  items = [],
  showBillStatus = false,
  showQtyBreakdown = false,
  footerLabel = "Total",
  footerTotal,
  emptyMessage = "No line items available.",
  isIntraState = true,
  maskFormatter,
  className,
  ...props
}: LineItemsCardProps) {
  const fmt = (val?: number) => {
    const formatted = formatCurrency(val ?? 0);
    if (maskFormatter) return maskFormatter(formatted);
    return formatted;
  };

  const grandTotal =
    footerTotal !== undefined
      ? footerTotal
      : items.reduce((sum, it) => sum + (it.total_amount ?? (it.ordered_qty ?? it.qty ?? 0) * (it.base_price ?? it.unit_price ?? 0)), 0);

  if (items.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-slate-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn("overflow-x-auto rounded-xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900", className)} {...props}>
      <table className="w-full text-xs text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200/80 dark:bg-slate-950 dark:border-slate-800">
          <tr>
            <th className="px-4 py-3 font-semibold text-slate-500 uppercase tracking-wide min-w-[140px]">
              Item
            </th>
            <th className="px-3 py-3 font-semibold text-slate-500 uppercase tracking-wide">
              HSN
            </th>
            <th className="px-3 py-3 font-semibold text-slate-500 uppercase tracking-wide text-right">
              Qty
            </th>
            {showQtyBreakdown && (
              <>
                <th className="px-3 py-3 font-semibold text-slate-500 uppercase tracking-wide text-right text-emerald-600">
                  Accepted
                </th>
                <th className="px-3 py-3 font-semibold text-slate-500 uppercase tracking-wide text-right text-rose-600">
                  Rejected
                </th>
              </>
            )}
            <th className="px-3 py-3 font-semibold text-slate-500 uppercase tracking-wide text-right">
              Unit Rate
            </th>
            <th className="px-3 py-3 font-semibold text-slate-500 uppercase tracking-wide text-right">
              Tax
            </th>
            <th className="px-4 py-3 font-semibold text-slate-500 uppercase tracking-wide text-right">
              Total
            </th>
            {showBillStatus && (
              <th className="px-3 py-3 font-semibold text-slate-500 uppercase tracking-wide text-center">
                Bill Status
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {items.map((item, idx) => {
            const qty = item.ordered_qty ?? item.qty ?? 0;
            const unitRate = item.base_price ?? item.unit_price ?? 0;
            const lineTotal = item.total_amount ?? qty * unitRate;

            return (
              <tr key={item.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="px-4 py-3">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    {item.name || item.item_name || "—"}
                  </div>
                  {item.ean_code && (
                    <span className="text-[10px] text-slate-400">
                      EAN: {item.ean_code}
                    </span>
                  )}
                </td>
                <td className="px-3 py-3 font-mono text-slate-600 dark:text-slate-300">
                  {item.hsn_sac_code || item.hsn_code || "—"}
                </td>
                <td className="px-3 py-3 text-right font-semibold text-slate-800 dark:text-slate-200">
                  {qty} {item.unit}
                </td>
                {showQtyBreakdown && (
                  <>
                    <td className="px-3 py-3 text-right font-semibold text-emerald-600">
                      {item.accepted_qty ?? qty}
                    </td>
                    <td className="px-3 py-3 text-right font-semibold text-rose-600">
                      {item.rejected_qty ?? 0}
                    </td>
                  </>
                )}
                <td className="px-3 py-3 text-right font-mono text-slate-700 dark:text-slate-300">
                  {fmt(unitRate)}
                </td>
                <td className="px-3 py-3 text-right font-mono text-slate-500">
                  {item.total_tax ? fmt(item.total_tax) : "—"}
                </td>
                <td className="px-4 py-3 text-right font-bold font-mono text-slate-900 dark:text-slate-100">
                  {fmt(lineTotal)}
                </td>
                {showBillStatus && (
                  <td className="px-3 py-3 text-center">
                    {item.bill_status ? (
                      <span
                        className={cn(
                          "inline-block rounded px-2 py-0.5 text-[10px] font-bold",
                          BILL_STATUS_STYLE[item.bill_status] || "bg-slate-100 text-slate-700"
                        )}
                      >
                        {item.bill_status.replace("_", " ")}
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
        <tfoot className="border-t-2 border-slate-200 bg-slate-50/80 font-bold dark:border-slate-700 dark:bg-slate-950">
          <tr>
            <td colSpan={showQtyBreakdown ? 5 : 3} className="px-4 py-3 text-slate-800 dark:text-slate-200">
              {footerLabel}
            </td>
            <td colSpan={showBillStatus ? 3 : 2} className="px-4 py-3 text-right text-sm font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
              {fmt(grandTotal)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
