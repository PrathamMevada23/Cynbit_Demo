# Cynbit Client Experience 2.0 — Final Project Scope

## Decision

Recommend **MVP B as a narrow, standalone client journey**. Start with the Case Study Explorer as the first deliverable and add two small entry and exit points. A visitor selects a service, sees relevant work, and opens an accessible inquiry with the selected service and project already attached. The reusable catalog is the core of either option. The contextual handoff is the additional capability that makes B worth building.

| Criterion | A. Focused Case Study Explorer | B. Integrated client journey |
|---|---|---|
| Business impact | Helps users find and evaluate relevant work once they reach the portfolio. | Helps prospects connect capabilities to evidence and carry their intent into inquiry. Effects on leads or conversion remain unmeasured. |
| Engineering depth | Structured catalog, search and filters, accessible details, read API. | Shares the catalog and adds validated cross-route context, accessible form state, a write endpoint, and a stored demo receipt. |
| Evidence quality | Strongest on four sampled detail pages. Filter behavior is browser-scoped. | Builds on the same evidence plus the observed gap between service content, project details, and generic Contact. Existing discovery and product flows are addressed in the journey audit. |
| Feasibility before 25 November 2026 | Higher. Estimated 5–8 focused hours for a deployable slice, including QA and deployment. | Conditional. Estimated 9–14 focused hours including QA and deployment with seeded data and a working deployment account. Use A if the release gate fails. |

Effort ranges are planning estimates. The brief lists **25 November 2026 at 03:11**. The timezone and effective submission cutoff remain unverified. Confirm the cutoff before allocating build time. [Journey evidence](FINAL_USER_JOURNEY_AUDIT.md)

## Priorities

| Priority | Scope | Release condition |
|---|---|---|
| P0 | Three service entry points covering AI automation, software engineering, and cloud. Four clearly labelled seeded case studies. Search, service filters, result count and empty state. Case detail with challenge, approach, outcome and evidence status. Contextual inquiry with editable service, optional project, name, email and project brief. Shared client/server validation and a persisted synthetic inquiry receipt. | A prospect can complete service → relevant case → contextual inquiry on the deployed demo. Project and service survive reload and back navigation, and the receipt reflects the validated context. |
| P1 | Add approved project media or source links where available. Improve keyboard and responsive details flagged in testing. Add an optional path from the explorer back to service selection. | Add only after the P0 path passes and the release window allows it. Basic keyboard operation, focus and responsive readability remain P0. |
| P2 | Product-specific handoffs, editor accounts, staff review or CRM/email delivery, real lead reporting, and broader content migration. | Requires a separate owner decision and operational integration. |

The service entry can be a small capability selector. An independent prototype can reuse a simple visual vocabulary while clearly identifying itself as a demonstration. Use labelled synthetic or approved case data. Keep the first release to the single client journey.

## Data and route contract

| Piece | P0 contract |
|---|---|
| Catalog | Service records with stable slugs. Case records with a slug, service mappings, summary, challenge, approach and evidence status. Source URL and media are optional. Seed the service-to-project mappings explicitly, including at least one project that matches two services. |
| Discovery | `/case-studies?service=cloud&q=collaboration` carries a shareable filter. The catalog read API returns matching published records. Detail lookups resolve by case slug. |
| Inquiry | `/contact?service=cloud&project=cloud-collaboration` carries identifiers only. The server resolves display labels. Direct access works with blank optional context. Invalid slugs or mismatched service/project pairs show a clear way to reset the context. |
| Persistence | One create endpoint validates trimmed required fields, email, context and length bounds on the server. Store synthetics with an ID and timestamp, with repeat clicks prevented in the UI and duplicates handled by an idempotency key. Use storage that persists across requests in the chosen deployment. |
| Demo boundary | Use synthetic fixture submissions for a public backend demo, or restrict write access to an evaluator environment. Treat console logs and receipts as operational data and keep personal details out of URLs, analytics, and logs. |

## Acceptance and release gate

1. From any service, one **See relevant work** action opens the filtered explorer. From one known seeded case, one **Discuss a similar project** action brings the matching labels into the inquiry form. Changing the service explicitly clears an incompatible project and communicates the change.
2. Keyboard users can operate search, filters, case links, and inquiry controls. Results and validation feedback are announced. The first invalid field can be focused. At 375, 768, and 1440 CSS px, filter controls, card categories and form messages remain readable.
3. Reload and back navigation preserve URL-based discovery and inquiry context. Empty hits give a reset action. Unknown context and unavailable evidence do not produce broken links or misleading claims.
4. Empty or whitespace-only name and brief and malformed email fail on client and server. A valid synthetic request is stored once and the confirmation identifies the selected service and project. Simulated request failure preserves input and offers retry.
5. Record steps, task completion and context re-entry for the same service-to-inquiry scenario on the current site and the prototype. Track whether the visitor can reach relevant work and whether both identifiers arrive without re-entry. Treat this as task-level evidence, with production conversion left unmeasured.

Build the explorer first so it can ship independently. Reassess after the catalog, filters, and detail are in a working deployment. Continue with B only if the contextual handoff, durable demo write, and keyboard/mobile QA fit before the confirmed cutoff. Otherwise ship A and reserve time for testing, deployment, and the assessment walkthrough.
