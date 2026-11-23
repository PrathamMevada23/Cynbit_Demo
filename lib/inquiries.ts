import { createHash } from "node:crypto";
import { and, eq, lt, sql } from "drizzle-orm";
import type { z } from "zod";
import { database } from "@/db/client";
import { cases, caseServices, inquiries, rateWindows, services } from "@/db/schema";
import type { inquirySchema } from "./contracts";

export const WINDOW_SECONDS = 600;
export const CLIENT_LIMIT = 8;
const GLOBAL_LIMIT = 60;
class QuotaExceeded extends Error {}

type Fields = z.output<typeof inquirySchema>;
type Receipt = { id: string; createdAt: string; service: string | null; project: string | null };
type Result =
  | { status: "created" | "replayed"; receipt: Receipt }
  | { status: "limited"; retryAfter: number }
  | { status: "conflict" | "invalid-context" };

export function digest(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

const receiptColumns = {
  id: inquiries.id, createdAt: inquiries.createdAt, service: inquiries.service, project: inquiries.project,
};

export async function saveInquiry(fields: Fields, key: string, clientBucket: string): Promise<Result> {
  const { db } = database();
  const payloadHash = digest(JSON.stringify(fields));
  const now = Math.floor(Date.now() / 1000);
  const window = Math.floor(now / WINDOW_SECONDS);
  return db.transaction<Result>(async tx => {
    // Serialize attempts using the same key, including across serverless instances.
    await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${key}, 0))`);
    const [previous] = await tx.select({ ...receiptColumns, payloadHash: inquiries.payloadHash })
      .from(inquiries).where(eq(inquiries.idempotencyKey, key));
    if (previous) {
      if (previous.payloadHash !== payloadHash) return { status: "conflict" };
      const { id, createdAt, service, project } = previous;
      return { status: "replayed", receipt: { id, createdAt, service, project } };
    }

    for (const [bucket, limit] of [["global", GLOBAL_LIMIT], [clientBucket, CLIENT_LIMIT]] as const) {
      const [usage] = await tx.insert(rateWindows).values({ bucket, window, count: 1 })
        .onConflictDoUpdate({
          target: [rateWindows.bucket, rateWindows.window],
          set: { count: sql`${rateWindows.count} + 1` },
          setWhere: lt(rateWindows.count, limit),
        }).returning({ count: rateWindows.count });
      if (!usage) throw new QuotaExceeded();
    }
    await tx.delete(rateWindows).where(lt(rateWindows.window, window - 1));

    if (fields.service) {
      const [service] = await tx.select({ slug: services.slug }).from(services).where(eq(services.slug, fields.service));
      if (!service) return { status: "invalid-context" };
    }
    if (fields.project) {
      const [project] = await tx.select({ slug: cases.slug }).from(cases)
        .where(and(eq(cases.slug, fields.project), eq(cases.published, true)));
      if (!project) return { status: "invalid-context" };
      if (fields.service) {
        const [mapping] = await tx.select({ slug: caseServices.caseSlug }).from(caseServices)
          .where(and(eq(caseServices.caseSlug, fields.project), eq(caseServices.serviceSlug, fields.service)));
        if (!mapping) return { status: "invalid-context" };
      }
    }

    const [receipt] = await tx.insert(inquiries).values({
      ...fields, service: fields.service || null, project: fields.project || null, idempotencyKey: key, payloadHash,
    }).returning(receiptColumns);
    return { status: "created", receipt };
  }).catch((error: unknown) => {
    if (error instanceof QuotaExceeded) return { status: "limited", retryAfter: WINDOW_SECONDS - now % WINDOW_SECONDS };
    throw error;
  });
}
