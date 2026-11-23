export const samples = [
  {
    name: "Complete sample",
    document: "INVOICE\nSupplier: Cedar Office Supply\nInvoice number: INV-1042\nTotal: INR 2450.00",
  },
  {
    name: "Missing invoice number",
    document: "INVOICE\nSupplier: Linden Paper Co.\nReference: SAMPLE-204\nTotal: INR 1875.50",
  },
] as const;

export const intakeFields = [
  { key: "supplier", label: "Supplier", pattern: /^Supplier:[ \t]*(.+)$/im },
  { key: "invoice", label: "Invoice number", pattern: /^Invoice number:[ \t]*(.+)$/im },
  { key: "total", label: "Total", pattern: /^Total:[ \t]*(.+)$/im },
] as const;

export function extractInvoice(document: string) {
  return {
    supplier: document.match(intakeFields[0].pattern)?.[1].trim() ?? "",
    invoice: document.match(intakeFields[1].pattern)?.[1].trim() ?? "",
    total: document.match(intakeFields[2].pattern)?.[1].trim() ?? "",
  };
}

export function validInvoice(fields: ReturnType<typeof extractInvoice>) {
  return fields.supplier.trim().length > 0 && fields.invoice.trim().length > 0
    && /^INR \d{1,9}\.\d{2}$/i.test(fields.total.trim());
}
