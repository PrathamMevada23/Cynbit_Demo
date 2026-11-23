# 10 — Consolidated Issues

| ID | Title | URL | Category | Status | Severity | Evidence | Confidence |
|---|---|---|---|---|---:|---|---|
| CYN-001 | No demo, client confirmation link, or outcome source in sampled case studies | `/case-studies` and four published details | UX / conversion | Confirmed in sample | Medium | Detail bodies linked only to index and related studies. All named projects and presented outcomes. Exact detail URLs in [case-study analysis](03-case-study-analysis.md). | High |
| CYN-002 | Case-study media lacks product screenshots | `/case-studies` and four published details | UX | Confirmed in sample | Medium | All four detail hero images rendered and reused Unsplash sources from the index. | High |
| CYN-003 | Newsletter form needs end-to-end validation assessment | `/` | Functional / UX | Informational | Low | Native `email` type and `required` observed; behavior not tested. | Medium |
| CYN-004 | Reported long navigation delay | Sampled routes in [performance analysis](04-performance-analysis.md) | Reliability / performance | Unverified | Unrated | Twelve successful direct measurements and two successful click measurements. Earlier command timeouts had no usable browser timing. | Low |
| CYN-005 | Category clicks leave all 13 case cards listed | `https://www.cynbit.in/case-studies` | Functional / UX | Reproduced in headless Brave | Medium | Actual pointer hit targets were verified. Observed counts unchanged after Cloud, Digital Marketing, and Software Dev. | Medium across browsers |
| CYN-006 | Contact fields lack native label associations and accept whitespace-only required text | `https://www.cynbit.in/contact` | Accessibility / functional | Confirmed for native behavior | Medium | Five empty native-label lists. Detached required name/message controls accepted three spaces. | High for native behavior |
| CYN-007 | Case card category text clips at tablet width | `https://www.cynbit.in/case-studies` | Responsive UX | Confirmed in sample | Low | [768px screenshot](evidence/screenshots/case-studies-768.png), upper right of second card. | High |
| CYN-008 | First-stage job application requires extensive personal information | `https://www.cynbit.in/careers/full-stack-developer-intern` | UX | Confirmed fields. Potential friction. | Medium | Public role page shows four application sections with required personal, education, and profile fields. | High for fields. Low for abandonment. |

## Reproduction notes

- CYN-001/CYN-002: Open `/case-studies`, inspect the card anchors and image `src` attributes.
- CYN-003: Inspect the homepage newsletter markup only; do not submit it in production.
- CYN-004: See the successful measurements and failed control attempts separately in the performance analysis. The reported long delay remains unverified.
- CYN-005: Open the index at desktop width and select Cloud Strategy. Expect the two cloud cards, then return to All Success Stories. The observed list stayed at 13. Make filtering and selection state testable in the explorer.
- CYN-006: Inspect the five live controls and test detached clones with three spaces in the required text fields. Expect associated labels and rejection of empty-after-trim values. Explicitly associate captions and apply consistent client/server trim validation in a prototype.
- CYN-007: Resize the case index to 768 CSS px. Expect the category to remain readable. Allow the metadata row to wrap or change the card grid breakpoint.
- CYN-008: Open Careers, follow the Full Stack Developer Intern “View details” link, and read the required fields. Evaluate an initial screen with fewer fields and request additional data at a later stage if the hiring process requires it.
