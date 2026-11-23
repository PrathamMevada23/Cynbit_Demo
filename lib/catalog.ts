import { and, asc, eq, exists, ilike, inArray, or, sql } from "drizzle-orm";
import { database } from "@/db/client";
import { cases, caseServices, evidence, services } from "@/db/schema";

export type Service = typeof services.$inferSelect;
export type Project = typeof cases.$inferSelect & { services: string[]; evidence: typeof evidence.$inferSelect | null };
export type ProjectOption = Pick<Project, "slug" | "title" | "services">;

export function listServices() {
  return database().db.select().from(services).orderBy(asc(services.sort));
}

export async function listProjects({ service = "", q = "", slug = "" } = {}): Promise<Project[]> {
  const { db } = database();
  const literal = "%" + q.replace(/[\\%_]/g, "\\$&") + "%";
  const rows = await db.select({ project: cases, source: evidence })
    .from(cases)
    .leftJoin(evidence, eq(evidence.caseSlug, cases.slug))
    .where(and(
      eq(cases.published, true),
      slug ? eq(cases.slug, slug) : undefined,
      service ? exists(db.select({ slug: caseServices.caseSlug }).from(caseServices)
        .where(and(eq(caseServices.caseSlug, cases.slug), eq(caseServices.serviceSlug, service)))) : undefined,
      q ? or(ilike(cases.title, literal), ilike(cases.summary, literal), ilike(sql`array_to_string(${cases.technologies}, ' ')`, literal)) : undefined
    )).orderBy(asc(cases.sort));
  if (rows.length === 0) return [];
  const mappings = await db.select().from(caseServices).where(inArray(caseServices.caseSlug, rows.map(row => row.project.slug)));
  return rows.map(row => ({
    ...row.project,
    evidence: row.source,
    services: mappings.filter(link => link.caseSlug === row.project.slug).map(link => link.serviceSlug),
  }));
}
