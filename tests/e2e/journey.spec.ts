import { randomUUID } from "node:crypto";
import { expect, test } from "@playwright/test";
import postgres from "postgres";
import { demoInquiry } from "../../lib/contracts";

const cloudCase = "cloud-collaboration";
const contextUrl = `/contact?service=cloud&project=${cloudCase}`;

test("service discovery, detail, contextual inquiry and a real PostgreSQL receipt", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "See relevant work for Cloud" }).click();
  await expect(page).toHaveURL(/case-studies\?service=cloud$/);
  await expect(page.getByRole("status")).toHaveText("2 demonstration cases");
  await page.getByRole("link", { name: "Read case study: Cloud collaboration platform" }).click();
  await expect(page.getByRole("heading", { name: "Evidence status" })).toBeVisible();
  await page.getByRole("link", { name: "Discuss a similar project" }).click();
  await expect(page).toHaveURL(url => url.pathname === "/contact"
    && url.searchParams.get("service") === "cloud" && url.searchParams.get("project") === cloudCase);
  await expect(page.getByLabel("Service", { exact: true })).toHaveValue("cloud");
  await expect(page.getByLabel("Case study", { exact: true })).toHaveValue(cloudCase);
  await page.reload();
  await expect(page.getByLabel("Case study", { exact: true })).toHaveValue(cloudCase);
  await page.goBack();
  await expect(page.getByRole("heading", { name: "Cloud collaboration platform" })).toBeVisible();
  await page.goForward();
  await expect(page.getByLabel("Service", { exact: true })).toHaveValue("cloud");
  await page.getByRole("button", { name: "Use sample details" }).click();
  const responsePromise = page.waitForResponse(response => response.url().endsWith("/api/inquiries"));
  await page.getByRole("button", { name: "Send demo inquiry" }).click();
  const response = await responsePromise;
  expect(response.status()).toBe(201);
  const { receipt } = await response.json();
  await expect(page.getByRole("heading", { name: "Demo inquiry saved" })).toBeFocused();
  await expect(page.getByText(receipt.id)).toBeVisible();
  const sql = postgres(process.env.DATABASE_URL!, { max: 1, prepare: false });
  try {
    const rows = await sql`select service, project from inquiries where id = ${receipt.id}`;
    expect([...rows]).toEqual([{ service: "cloud", project: cloudCase }]);
  } finally {
    await sql.end();
  }
});

test("search and service filters combine, survive reload and recover from empty", async ({ page }) => {
  await page.goto("/case-studies");
  await expect(page.getByRole("status")).toHaveText("4 demonstration cases");
  await page.getByRole("link", { name: "Software Development", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("3 demonstration cases");
  const search = page.getByRole("searchbox", { name: "Search case studies", exact: true });
  await search.fill("collaboration");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("1 demonstration case");
  await page.reload();
  await expect(search).toHaveValue("collaboration");
  await expect(page.getByRole("link", { name: "Software Development", exact: true })).toHaveAttribute("aria-current", "true");
  await search.fill("no such topic");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("heading", { name: "No matching projects" })).toBeVisible();
  await page.getByRole("link", { name: "Clear filters" }).click();
  await expect(page.getByRole("status")).toHaveText("4 demonstration cases");
});

test("edited inquiry context survives reload and clears incompatible projects", async ({ page }) => {
  await page.goto(contextUrl);
  await page.getByLabel("Service", { exact: true }).selectOption("software-development");
  await expect(page.getByLabel("Case study", { exact: true })).toHaveValue(cloudCase);
  await page.reload();
  await expect(page.getByLabel("Service", { exact: true })).toHaveValue("software-development");
  await page.getByLabel("Service", { exact: true }).selectOption("ai-automation");
  await expect(page.getByLabel("Case study", { exact: true })).toHaveValue("");
  await expect(page.getByRole("status")).toContainText("previous project was cleared");
  await page.goto(`/contact?service=ai-automation&project=${cloudCase}`);
  await expect(page.getByRole("status")).toContainText("incompatible selection was cleared");
});

test("client validation focuses the first problem, and failed requests preserve inputs", async ({ page }) => {
  await page.goto(contextUrl);
  await page.getByRole("button", { name: "Send demo inquiry" }).click();
  const alert = page.getByRole("form", { name: "Demo project inquiry" }).getByRole("alert");
  await expect(alert).toHaveText("Check the highlighted fields.");
  await expect(page.getByLabel("Name", { exact: true })).toBeFocused();
  await page.getByRole("button", { name: "Use sample details" }).click();
  await page.route("**/api/inquiries", route => route.abort("failed"), { times: 1 });
  await page.getByRole("button", { name: "Send demo inquiry" }).click();
  await expect(alert).toContainText("Your details are still here");
  await expect(page.getByLabel("Project brief")).toHaveValue(demoInquiry.brief);
  await expect(page.getByLabel("Case study", { exact: true })).toHaveValue(cloudCase);
  await page.getByRole("button", { name: "Send demo inquiry" }).click();
  await expect(page.getByRole("heading", { name: "Demo inquiry saved" })).toBeVisible();
});

test("catalog errors and literal search retain correct semantics", async ({ request, page }) => {
  const catalog = await request.get("/api/catalog?service=cloud&q=postgresql");
  expect(catalog.status()).toBe(200);
  expect((await catalog.json()).projects.map((p: { slug: string }) => p.slug)).toEqual([cloudCase]);
  const percent = await request.get("/api/catalog?q=%25");
  expect((await percent.json()).projects).toEqual([]);
  expect((await request.get("/api/catalog?service=nonexistent")).status()).toBe(400);
  expect((await request.get("/api/case-studies/missing")).status()).toBe(404);
  expect((await request.get(`/api/case-studies/${cloudCase}`)).status()).toBe(200);
  await page.goto("/case-studies?service=nonexistent");
  await expect(page.getByRole("heading", { name: "This filter is unavailable" })).toBeVisible();
  await page.goto("/case-studies/missing");
  await expect(page.getByRole("heading", { name: "This page isn’t available" })).toBeVisible();
});

test("API rejects invalid, non-fixture and mismatched payloads and deduplicates concurrent writes", async ({ request }) => {
  const valid = { ...demoInquiry, service: "cloud", project: cloudCase };
  const post = (data: typeof valid, key = randomUUID()) => request.post("/api/inquiries", { headers: { "Idempotency-Key": key }, data });
  expect((await post({ ...valid, name: "   ", email: "nope" })).status()).toBe(422);
  expect((await post({ ...valid, email: "other@example.invalid" })).status()).toBe(422);
  expect((await post({ ...valid, service: "ai-automation" })).status()).toBe(422);
  const key = randomUUID();
  const [one, two] = await Promise.all([post(valid, key), post(valid, key)]);
  expect([one.status(), two.status()].sort()).toEqual([200, 201]);
  expect((await one.json()).receipt.id).toBe((await two.json()).receipt.id);
  expect((await post({ ...valid, project: "release-pipeline" }, key)).status()).toBe(409);
  const sql = postgres(process.env.DATABASE_URL!, { max: 1, prepare: false });
  try {
    const result = await sql`select count(*)::int as rows from inquiries where idempotency_key = ${key}`;
    expect(result[0].rows).toBe(1);
  } finally {
    await sql.end();
  }
});

test("key surfaces fit at 375, 768 and 1440 CSS pixels", async ({ page }) => {
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 920 });
    for (const path of ["/", "/case-studies?service=cloud", contextUrl]) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  }
});

test("write restrictions and durable quota still allow a safe replay", async ({ request }) => {
  const endpoint = "/api/inquiries";
  const key = randomUUID();
  const headers = { "Idempotency-Key": key };
  const data = { ...demoInquiry, service: "cloud", project: cloudCase };
  expect((await request.post(endpoint, { headers: { ...headers, Origin: "https://example.invalid" }, data })).status()).toBe(403);
  expect((await request.post(endpoint, { headers: { ...headers, "Content-Type": "text/plain" }, data })).status()).toBe(415);
  const first = await request.post(endpoint, { headers, data });
  expect(first.status()).toBe(201);
  let limited = false;
  for (let index = 0; index < 9; index++) {
    const attempt = await request.post(endpoint, { headers: { "Idempotency-Key": randomUUID() }, data });
    if (attempt.status() === 429) {
      expect(Number(attempt.headers()["retry-after"])).toBeGreaterThan(0);
      limited = true;
      break;
    }
    expect(attempt.status()).toBe(201);
  }
  expect(limited).toBe(true);
  const replay = await request.post(endpoint, { headers, data });
  expect(replay.status()).toBe(200);
  expect((await replay.json()).receipt.id).toBe((await first.json()).receipt.id);
});
