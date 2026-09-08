// Type shims for optional peer dependencies used by export-utils.ts
// These packages can be installed in consuming applications when XLSX/PDF export is required.
// They are NOT bundled with @umesh0492/react-libs — they are loaded via dynamic import().

declare module "xlsx" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any;
  export = content;
}

declare module "jspdf" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any;
  export default content;
}

declare module "jspdf-autotable" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any;
  export default content;
}
