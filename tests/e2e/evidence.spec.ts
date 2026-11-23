import { expect, test } from "@playwright/test";

test("case evidence opens the live demo and supports a human correction", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 850 });
  await page.goto("/case-studies/document-intake?service=ai-automation");
  await page.getByRole("link", { name: "Try the live demo" }).click();
  await expect(page.getByRole("heading", { name: "Document intake demo", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Extract fields" }).click();
  await expect(page.getByLabel("Supplier")).toHaveValue("Linden Paper Co.");
  await expect(page.getByLabel("Invoice number")).toHaveValue("");
  await page.getByRole("button", { name: "Approve invoice" }).click();
  await expect(page.getByRole("status")).toContainText("Approval needs");
  await page.getByLabel("Invoice number").fill("SAMPLE-204");
  await page.getByRole("button", { name: "Approve invoice" }).click();
  await expect(page.getByRole("status")).toHaveText("Sample invoice approved.");
  await page.getByRole("button", { name: "Reset demo" }).click();
  await expect(page.getByLabel("Invoice number")).toHaveCount(0);
  await page.getByRole("link", { name: "Back to Document intake automation" }).click();
  await expect(page).toHaveURL(/\/case-studies\/document-intake\?service=ai-automation$/);
});
