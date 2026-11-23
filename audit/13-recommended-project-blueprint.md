# 13 — Recommended Project Blueprint

## Final problem statement

Prospective clients can browse 13 case studies, but the category selections left the complete list visible in the tested browser. The four sampled details report outcomes beside stock hero imagery and provide no project screenshots, live links, or metric sources in their article bodies. The proposed standalone explorer should make relevant work easier to find and make the source of each outcome clear.

## MVP boundary

Include:

- Responsive project gallery with text search and category filters.
- Detail pages for challenge, approach, technology tags, approved/project-specific media, outcomes, and source/verification label.
- Optional live/demo link field that is hidden when unavailable.
- Accessible empty state, loading state, semantic headings, labelled filters, and keyboard support.
- Seeded, explicitly labelled demonstration data.

Exclude:

- Production Cynbit data import, claims, client logos, analytics, login, or deployment to Cynbit infrastructure.
- Any claim that a demo item is an official Cynbit client project.

## User journeys

1. Visitor filters by service category, searches a keyword, opens a study, sees evidence labels and optional verified link.
2. Portfolio editor (optional stretch) creates a draft, supplies fields and media, marks the verification state, and publishes locally.

## Architecture

`React/Next.js UI -> server API -> relational database -> media storage`.

Use a thin repository/service layer so SQLite can power the demo and PostgreSQL can be used for deployment. Store media alt text and attribution alongside assets.

## Suggested data model

- `case_studies`: id, slug, title, category, summary, challenge, solution, status, published_at.
- `outcomes`: id, case_study_id, label, value, provenance (`demo|client-approved|verified-link`), source_url nullable.
- `media`: id, case_study_id, url, alt_text, attribution, kind.
- `project_links`: id, case_study_id, type, url, verification_status.
- `tags`: id, name; `case_study_tags`: case_study_id, tag_id.

## API outline

- `GET /api/case-studies?query=&category=`
- `GET /api/case-studies/:slug`
- Optional protected admin CRUD endpoints for local demonstration only.

## Acceptance criteria

- Each category changes the visible results and exposes the selected state to assistive technology. Combined search and filters return matching records or a clear empty state.
- Card titles and category labels stay readable at 375, 768, and 1440 CSS pixels.
- Detail pages never render a missing or unverified external link as verified.
- Every image has meaningful alt text; all primary actions work by keyboard.
- Seed data is visibly labelled “demonstration data” unless written approval authorizes a real claim.
- Build, lint, unit/component tests, and a deployed independent demo succeed.

## Before/after proof

Use a scripted comparison: finding a relevant project from the current index versus filtering/searching and inspecting provenance in the prototype. Measure task completion steps and record only prototype performance results—do not claim production performance gains without production measurements.

## Technical report outline

Problem and evidence; scope and non-claims; architecture; data model; interface/accessibility; tests; deployment; before/after task walkthrough; limitations; future work.
