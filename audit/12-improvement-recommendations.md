# 12 — Final Improvement Shortlist

The [matrix](11-prioritization-matrix.md) ranks three distinct improvements. Feasibility assumes a standalone deployment, a small seeded dataset, and no dependency on Cynbit's production systems. The brief gives 25 November 2026 at 03:11. Its timezone remains unverified.

## 1. Interactive Case Study Explorer — 26/30

- **Evidence.** Three category selections left the 13-card listing unchanged in headless Brave. Four sampled details have first-party outcomes and stock heroes. None includes a product screenshot, live demo, or source for the metrics. One tablet card clips its category text. [Case-study evidence](03-case-study-analysis.md)
- **Business impact.** Prospects can find relevant expertise and see what supports each outcome before reaching out. Conversion impact would need measurement after launch.
- **Technical depth.** Accessible filters and search, shareable query state, a read API, and a relational model for projects, media, outcomes, and source status.
- **Effort and deadline.** Medium. Feasible as a focused gallery and four seeded details with a read API. Editing, authentication, and media upload can follow. Real project evidence depends on owner approval.
- **Success criteria.** Category and text filters return expected records, keyboard controls announce state, project cards remain readable at the three audited widths, and visitors can identify the source status of each displayed outcome.

## 2. Accessible Contact Intake — 24/30

- **Evidence.** Five inquiry controls had empty native label associations. The native validator accepted whitespace-only name and message in detached clones. Custom and server behavior is Not Tested. The support address is shown inside a link that targets the opportunities address. [Contact evidence](02-functional-ux-findings.md)
- **Business impact.** Clear feedback and consistent validation can help prospective clients complete inquiries and can improve the usability of the details they provide. Lead quality and conversion are unmeasured.
- **Technical depth.** Programmatic labels, error summary and inline errors, a shared client/server validation schema, and a demo API storing synthetic inquiries with optional service or product context.
- **Effort and deadline.** Low to medium. Feasible before the stated deadline as one form and endpoint. A CRM integration, live email delivery, or a production migration would expand effort.
- **Success criteria.** Empty-after-trim text and malformed email are rejected, required fields are announced correctly, valid synthetic submissions render confirmation, and network errors preserve the user's entered text.

## 3. Two-Stage Careers Application — 22/30

- **Evidence.** The sampled developer internship asks for date of birth, gender, permanent address, phone and WhatsApp numbers, and profile links in its first application. [Role detail](https://www.cynbit.in/careers/full-stack-developer-intern)
- **Business impact.** A shorter initial step may reduce effort for applicants while preserving basic screening. The hiring team would need to confirm its requirements and measure completion.
- **Technical depth.** Role-aware forms, shared validation, a two-stage application state model, and a synthetic-data review queue.
- **Effort and deadline.** Medium for a one-role demo. Feasible only with a bounded first-stage workflow and demonstration review state. Identity management, document uploads, and real applicant-data integration would need more time and explicit coordination.
- **Success criteria.** Applicants can complete the first stage with an approved minimum set of fields. The prototype records and displays the correct state for a synthetic application and requests any extra information at the appropriate stage.
