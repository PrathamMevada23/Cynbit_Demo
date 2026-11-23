import { loadEnvConfig } from "@next/env";
import { database } from "../db/client";
import { cases, caseServices, evidence, services } from "../db/schema";

loadEnvConfig(process.cwd());

const categories = [
  { slug: "ai-automation", name: "AI Automation", description: "Design reliable workflows that put human review where it counts.", sort: 1 },
  { slug: "software-development", name: "Software Development", description: "Build web products and internal platforms around the way people work.", sort: 2 },
  { slug: "cloud", name: "Cloud", description: "Make releases repeatable and give teams a clearer view of their systems.", sort: 3 },
];

const scenarios = [
  {
    slug: "document-intake", title: "Document intake automation", primaryService: "ai-automation",
    mapped: ["ai-automation", "software-development"], sort: 1,
    summary: "A review queue for extracting structured information from incoming documents.",
    challenge: "An operations team in this scenario receives documents in several formats and has to re-key the same fields before review.",
    approach: "Queue documents, extract candidate fields, and send uncertain results to a human review step. Retain the original and keep a history of edits.",
    outcome: "The illustrative workflow separates extraction from approval and gives reviewers a single place to correct fields. No time savings were measured.",
    technologies: ["TypeScript", "PostgreSQL", "Job queue"],
  },
  {
    slug: "operations-workspace", title: "Operations workspace", primaryService: "software-development",
    mapped: ["software-development"], sort: 2,
    summary: "A product workspace that groups work by owner, status, and next action.",
    challenge: "In this scenario, teams track requests in several spreadsheets and cannot easily tell who owns the next step.",
    approach: "Build role-aware queues with shared statuses and a history of changes. Validate assignments at the API boundary.",
    outcome: "The example consolidates requests into one queue and makes the next owner visible. Adoption and throughput were not measured.",
    technologies: ["React", "Next.js", "PostgreSQL"],
  },
  {
    slug: "cloud-collaboration", title: "Cloud collaboration platform", primaryService: "cloud",
    mapped: ["cloud", "software-development"], sort: 3,
    summary: "A shared workspace with background processing and visible system health.",
    challenge: "A fictional collaboration team needs uploads and notifications to stay responsive when demand changes.",
    approach: "Separate interactive requests from background jobs, add retry limits and expose health indicators for the queue and workers.",
    outcome: "The proposed architecture isolates background work and gives operators a way to spot queue delays. No production-scale benchmark was run.",
    technologies: ["Node.js", "PostgreSQL", "Object storage"],
  },
  {
    slug: "release-pipeline", title: "Repeatable release pipeline", primaryService: "cloud",
    mapped: ["cloud"], sort: 4,
    summary: "A versioned deployment workflow with predictable rollback points.",
    challenge: "The fictional team in this scenario deploys by hand and cannot consistently reproduce a previous release.",
    approach: "Package services into versioned images, run automated checks, and define a promotion and rollback workflow.",
    outcome: "The example shows a traceable path from build to release and a defined rollback point. Availability and deploy speed are unmeasured.",
    technologies: ["Docker", "CI/CD", "Infrastructure as code"],
  },
];

async function seed() {
  const { db, client } = database();
  try {
    await db.transaction(async tx => {
      for (const row of categories) {
        await tx.insert(services).values(row).onConflictDoUpdate({ target: services.slug, set: row });
      }
      for (const { mapped, ...scenario } of scenarios) {
        const row = { ...scenario, published: true };
        await tx.insert(cases).values(row).onConflictDoUpdate({ target: cases.slug, set: row });
        await tx.insert(caseServices).values(mapped.map(serviceSlug => ({ caseSlug: row.slug, serviceSlug }))).onConflictDoNothing();
        const source = {
          caseSlug: row.slug,
          kind: "synthetic-scenario" as const,
          description: "Fictional assessment scenario. No client engagement, measured results, or external evidence is represented.",
        };
        await tx.insert(evidence).values(source).onConflictDoUpdate({ target: evidence.caseSlug, set: source });
      }
    });
    console.log("Seeded 3 services and 4 demonstration cases.");
  } finally {
    await client.end();
  }
}

seed().catch(error => { console.error("Seed failed", error instanceof Error ? error.message : "Unknown error"); process.exitCode = 1; });
