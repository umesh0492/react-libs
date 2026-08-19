/**
 * @umesh0492/react-libs — Export Utilities
 *
 * Client-side CSV, XLSX, and PDF export from in-memory data arrays.
 * Framework-agnostic — no React dependencies.
 *
 * For large/server-side exports, use downloadFromBackend() instead to stream
 * the file through the platform's Express proxy.
 *
 * Dependencies (peer): xlsx, jspdf, jspdf-autotable
 * These are already present in client-web and admin-web.
 */

export type ExportFormat = "csv" | "xlsx" | "pdf";

export interface ExportColumn {
  /** Column display header */
  header: string;
  /** Key in each data row object */
  key: string;
}

export interface ExportOptions {
  columns?: ExportColumn[];
  /** PDF page orientation (default: landscape) */
  pdfOrientation?: "portrait" | "landscape";
  /** PDF title text (default: filename) */
  pdfTitle?: string;
}

/**
 * Export data from an in-memory array to CSV, XLSX, or PDF.
 *
 * @example
 * exportData(orders, "purchase-orders", "xlsx", {
 *   columns: [
 *     { header: "PO Number", key: "poNumber" },
 *     { header: "Partner",    key: "partnerName" },
 *     { header: "Amount",    key: "totalAmount" },
 *   ]
 * })
 */
export async function exportData(
  data: Record<string, unknown>[],
  filename: string,
  format: ExportFormat = "csv",
  options: ExportOptions = {}
): Promise<void> {
  if (!data || !data.length) {
    console.warn("exportData: empty data array — nothing to export");
    return;
  }

  const keys = options.columns ? options.columns.map((c) => c.key) : Object.keys(data[0]);
  const headers = options.columns ? options.columns.map((c) => c.header) : keys;

  if (format === "csv") {
    const rows: string[] = [
      headers.map((h) => `"${String(h).replace(/"/g, '""')}"`).join(","),
      ...data.map((row) =>
        keys
          .map((k) => {
            // eslint-disable-next-line security/detect-object-injection
            const val = row[k];
            const str = val == null ? "" : String(val);
            return `"${str.replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ];
    triggerDownload(new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" }), `${filename}.csv`);
    return;
  }

  if (format === "xlsx") {
    // Use Function indirection to fully bypass Vite/Rollup static import analysis.
    const XLSX = await (new Function('m', 'return import(m)'))('xlsx');
    // eslint-disable-next-line security/detect-object-injection
    const wsData = [headers, ...data.map((row) => keys.map((k) => row[k]))];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${filename}.xlsx`);
    return;
  }

  if (format === "pdf") {
    // Use Function indirection to fully bypass Vite/Rollup static import analysis.
    const dynImport = new Function('m', 'return import(m)');
    const { default: jsPDF }   = await dynImport('jspdf');
    const { default: autoTable } = await dynImport('jspdf-autotable');
    const orientation = options.pdfOrientation ?? "landscape";
    const doc = new jsPDF(orientation);
    const title = options.pdfTitle ?? filename.replace(/_/g, " ").toUpperCase();
    doc.text(title, 14, 15);
    autoTable(doc, {
      head: [headers],
      // eslint-disable-next-line security/detect-object-injection
      body: data.map((row) => keys.map((k) => (row[k] == null ? "" : String(row[k])))),
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [15, 23, 42] },
    });
    doc.save(`${filename}.pdf`);
  }
}

/**
 * Download a file from the backend via the Express proxy.
 * The token is passed as a query param so Chrome's `download` attribute works.
 *
 * @example
 * await downloadFromBackend("/api/export/partners", "partners", { status: "active" })
 */
export async function downloadFromBackend(
  endpoint: string,
  filename: string,
  queryParams: Record<string, string> = {},
  tokenKey = "auth_jwt"
): Promise<void> {
  const token = localStorage.getItem(tokenKey) || localStorage.getItem("jwt") || "";
  if (!token) throw new Error("Not authenticated — please log in again.");
  
  // Resolve absolute backend URL in production since window.location routes internally
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const meta = import.meta as any;
  const _env = (meta?.env || {}) as Record<string, string | boolean>;
  const apiBase = _env.PROD ? (_env.VITE_API_URL || "") : "";
  const fullEndpoint = endpoint.startsWith("http") ? endpoint : `${apiBase}${endpoint}`;

  // SECURE DOWNLOAD: Use fetch with Authorization header to avoid token leakage in logs/history
  const response = await fetch(`${fullEndpoint}?${new URLSearchParams(queryParams).toString()}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) throw new Error(`Download failed: ${response.statusText}`);

  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  link.remove();
  window.URL.revokeObjectURL(downloadUrl);
}

/** Backward-compatible shorthand */
export function exportToCSV(data: Record<string, unknown>[], filename: string): void {
  void exportData(data, filename, "csv");
}

// ─── Internal ─────────────────────────────────────────────────────────────────

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 200);
}
