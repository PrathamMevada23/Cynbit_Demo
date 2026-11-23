# Cynbit Client Experience 2.0 — Technical Report

## Problem and implementation

The prior audit found a gap between choosing a service, finding relevant work, and starting an inquiry. Services reached the unfiltered 13-card index, the Cloud filter did not change that result in the tested browser, and the sampled case detail opened Contact with neither service nor project carried over. The prototype adds a direct path across each handoff. [User journey audit](../FINAL_USER_JOURNEY_AUDIT.md)

| Step | Project behavior |
|---|---|
| Discover | AI Automation, Software Development, and Cloud link directly to filtered work or a preselected inquiry. |
| Explore | Shareable service/search query parameters drive a PostgreSQL query. A case can belong to multiple services. Four detail pages show approach, illustrative outcomes, tags and evidence status. |
| Inquire | Case detail carries service and project to an editable form. Incompatible project selections clear with a message. Contact fields are labelled, validated, and retained after request failure. |
| Confirm | A receipt is returned only after a PostgreSQL transaction commits. Duplicate retries return the same receipt for the same validated data. |

## Architecture

The Next.js App Router renders catalog pages from the same repository used by the REST Route Handlers. React client components handle search navigation and form feedback. Tailwind and local shadcn/ui primitives provide the UI. Drizzle and postgres.js run on the Node.js runtime. Zod shares the inquiry contract between browser and server.

| Endpoint | Contract |
|---|---|
| `GET /api/catalog?service=cloud&q=collaboration` | Lists services and matching published cases. Invalid filters return 400. |
| `GET /api/case-studies/:slug` | Returns a published case and its evidence metadata, or 404. |
| `POST /api/inquiries` | Requires JSON and a UUID `Idempotency-Key`. Returns 201 for a new row, 200 for replay, 409 for key reuse with changed data, 422 for validation failure, and 429 for quota. Database unavailability returns 503. |

The SQL migration creates services, case studies, mappings, evidence, inquiries, and rate-window tables. The seed explicitly maps four synthetic cases to three service areas. Case and service context remain in the URL through reload. The inquiry stores foreign keys and validates that the case is published and compatible with the service. The composite foreign key enforces the pair when both identifiers are present.

The Document intake case links to an interactive assessment demo that extracts fields from a sample invoice, requires a human correction when a field is missing, and runs approval checks in the browser. Case evidence can also link to a reviewed HTTPS source through the optional `proof_url` column. The seeded fictional cases have no client proof URLs.

## Demo write controls

Only the documented synthetic sample is storable. The route limits JSON body size, validates the provided Origin when present, and validates payload shape and canonical context. The form keeps the same idempotency key when retrying the same payload. A transaction-scoped advisory lock and unique constraint serialize duplicate keys across replicas. New requests use PostgreSQL counters with an 8-per-client and 60-global limit per 10-minute window. Outside Vercel, or when its platform client address is unavailable, callers share a local bucket. The global quota applies independently of that address. Rate buckets store hashes and expire from the table during later submissions. The endpoint provides no listing or admin surface and delivers no email.

This is a synthetic-data assessment. A real deployment accepting leads would need a reviewed collection policy, approved data retention, operational abuse monitoring and a delivery workflow.

## Verification and evaluation

Local verification passed ESLint, TypeScript, 6 Vitest tests, and 8 Playwright tests against the production build and PostgreSQL 17. The browser suite covers filters, search, invalid and missing routes, context on reload and history, escaped search wildcards, field validation, failed-request recovery, concurrent duplicate writes, durable rate limiting, and layouts at 375/768/1440 CSS pixels. It checked the stored receipt and duplicate row count directly in PostgreSQL. A separate local smoke test confirmed that an unconfigured database returns HTTP 503 from the catalog API and displays the page error state. See [README](../README.md) for reproducible commands.

The Cloud scenario is the before/after comparison. The observed production handoff passed **0 of 2** target context fields. The local Playwright walkthrough confirmed **2 of 2** with one action from a service to relevant work, one action from the case detail to inquiry, and a stored receipt. The comparison measures task completion and context carryover. Production conversion and business outcomes remain unmeasured.

## Deployment

The application builds as a standard Next.js Node.js project. Local PostgreSQL is migrated and seeded. Hosted verification awaits a Vercel project, authorized deployment access, and a dedicated managed PostgreSQL connection. The [deployment runbook](../README.md#vercel-deployment) covers secrets, migration, seeding, deployment and public smoke checks.
