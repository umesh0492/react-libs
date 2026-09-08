// Type definitions for optional peer dependencies used by export-utils.ts
// These packages can be installed in consuming applications when XLSX/PDF export is required.
// They are NOT bundled with @umesh0492/react-libs — they are loaded via dynamic import().

declare module "xlsx" {
  export interface WorkSheet {
    [cell: string]: unknown;
  }
  export interface WorkBook {
    SheetNames: string[];
    Sheets: Record<string, WorkSheet>;
  }
  export interface WritingOptions {
    bookType?: string;
    type?: string;
  }
  export interface XLSXUtils {
    json_to_sheet(data: unknown[]): WorkSheet;
    book_new(): WorkBook;
    book_append_sheet(workbook: WorkBook, worksheet: WorkSheet, name?: string): void;
  }
  export const utils: XLSXUtils;
  export function write(data: WorkBook, options: WritingOptions): ArrayBuffer | Uint8Array | string;
  export function writeFile(data: WorkBook, filename: string, options?: WritingOptions): void;
}

declare module "jspdf" {
  export interface jsPDFOptions {
    orientation?: "p" | "portrait" | "l" | "landscape";
    unit?: "pt" | "px" | "in" | "mm" | "cm" | "ex" | "em" | "pc";
    format?: string | number[];
  }
  export default class jsPDF {
    constructor(options?: jsPDFOptions);
    save(filename: string): void;
    text(text: string | string[], x: number, y: number): void;
    output(type: string): unknown;
  }
}

declare module "jspdf-autotable" {
  export interface UserOptions {
    head?: unknown[][];
    body?: unknown[][];
    foot?: unknown[][];
    startY?: number;
    theme?: "striped" | "grid" | "plain";
  }
  export default function autoTable(doc: unknown, options: UserOptions): void;
}
