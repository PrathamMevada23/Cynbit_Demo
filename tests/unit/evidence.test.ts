import { expect, it } from "vitest";
import { publicProofUrl } from "@/lib/evidence";
import { extractInvoice, samples, validInvoice } from "@/lib/intake-demo";

it("extracts sample fields and requires a missing invoice number before review can finish", () => {
  expect(validInvoice(extractInvoice(samples[0].document))).toBe(true);
  const review = extractInvoice(samples[1].document);
  expect(review).toEqual({ supplier: "Linden Paper Co.", invoice: "", total: "INR 1875.50" });
  expect(validInvoice(review)).toBe(false);
  expect(validInvoice({ ...review, invoice: "SAMPLE-204" })).toBe(true);
  expect(validInvoice({ ...review, invoice: "SAMPLE-204", total: "incorrect" })).toBe(false);
});

it("only renders absolute HTTPS proof URLs without embedded credentials", () => {
  expect(publicProofUrl("https://example.org/work")).toBe("https://example.org/work");
  for (const url of [null, "/case", "http://example.org/work", "javascript:alert(1)", "https://user:secret@example.org/work"]) {
    expect(publicProofUrl(url)).toBeNull();
  }
});
