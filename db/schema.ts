import { pgTable, text, integer, boolean, primaryKey, timestamp, uuid, foreignKey } from "drizzle-orm/pg-core";

export const services = pgTable("services", {
  slug: text().primaryKey(),
  name: text().notNull(),
  description: text().notNull(),
  sort: integer().notNull(),
});

export const cases = pgTable("case_studies", {
  slug: text().primaryKey(),
  title: text().notNull(),
  summary: text().notNull(),
  challenge: text().notNull(),
  approach: text().notNull(),
  outcome: text().notNull(),
  technologies: text().array().notNull(),
  primaryService: text("primary_service").notNull().references(() => services.slug),
  published: boolean().notNull().default(false),
  sort: integer().notNull(),
});

export const caseServices = pgTable("case_services", {
  caseSlug: text("case_slug").notNull().references(() => cases.slug),
  serviceSlug: text("service_slug").notNull().references(() => services.slug),
}, t => [primaryKey({ columns: [t.caseSlug, t.serviceSlug] })]);

export const evidence = pgTable("case_evidence", {
  caseSlug: text("case_slug").primaryKey().references(() => cases.slug),
  kind: text({ enum: ["synthetic-scenario"] }).notNull(),
  description: text().notNull(),
  proofUrl: text("proof_url"),
});

export const inquiries = pgTable("inquiries", {
  id: uuid().defaultRandom().primaryKey(),
  idempotencyKey: uuid("idempotency_key").notNull().unique(),
  payloadHash: text("payload_hash").notNull(),
  name: text().notNull(),
  email: text().notNull(),
  brief: text().notNull(),
  service: text().references(() => services.slug),
  project: text().references(() => cases.slug),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
}, t => [foreignKey({ columns: [t.project, t.service], foreignColumns: [caseServices.caseSlug, caseServices.serviceSlug] })]);

export const rateWindows = pgTable("inquiry_rate_windows", {
  bucket: text().notNull(),
  window: integer().notNull(),
  count: integer().notNull(),
}, t => [primaryKey({ columns: [t.bucket, t.window] })]);
