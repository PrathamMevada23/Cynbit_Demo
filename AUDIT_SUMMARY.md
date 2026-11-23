# Cynbit Technologies Website Audit

**Audit date** — 23 November 2026 IST  
**Scope** — Public site review and low-volume browser measurements. Production form outcomes and active security testing are outside the audit scope.

## Findings

- Four case-study details across software, cloud, and marketing name the projects and report outcomes. Their article bodies offer stock hero images and related-study links. No sample included a product screenshot, live demo, external client reference, or source for the reported metrics. [Case-study analysis](audit/03-case-study-analysis.md)
- The three category buttons left all 13 cards listed in the headless Brave interaction sample. At 768px, category text is clipped in the second card. The 375px, 768px, and 1440px samples showed no page-level horizontal overflow on the index or Contact. [Responsive findings](audit/05-responsive-findings.md)
- Twelve successful direct navigation measurements had load events between 0.22 and 2.66 seconds. Two verified in-site transitions reached the destination heading in 1.57 seconds and 0.09 seconds. The reported 30–60 second delay remains unverified. Browser command timeouts yielded no usable page measurement. [Performance analysis](audit/04-performance-analysis.md)
- Services has generic inquiry CTAs and no case-study links in its main content. Products routes its three product CTAs to a shared inquiry section. Contact lacks native field-label associations and accepts whitespace-only required text under native validation. Careers exposes 20 role links, and the sampled internship application requests extensive personal information up front. [Functional and UX findings](audit/02-functional-ux-findings.md)

## Final shortlist

| Rank | Improvement | Score | Basis |
|---|---|---:|---|
| 1 | Interactive Case Study Explorer | **26/30** | Fixes project discovery and makes evidence easier to inspect across multiple services. |
| 2 | Accessible Contact Intake | **24/30** | Addresses observed native validation and labelling gaps with a scoped end-to-end inquiry demo. |
| 3 | Two-Stage Careers Application | **22/30** | Demonstrates a shorter first step and staged intake. Success depends on confirming hiring requirements. |

Recommend the **Interactive Case Study Explorer**. Scope the MVP to an accessible index with search and working filters, four seeded details, labelled outcome sources, and optional approved media or links. Store the structured records behind a read API. Evaluate the prototype by checking category counts, matching results, usable cards at 375/768/1440px, and how quickly visitors can find relevant work and its supporting evidence. [Scoring matrix](audit/11-prioritization-matrix.md) · [Shortlist and effort](audit/12-improvement-recommendations.md) · [MVP blueprint](audit/13-recommended-project-blueprint.md)

Feasibility assumes a standalone demo and the timeframe stated in the brief. The deadline timezone remains unverified. Real client assets and claims require approved source material. Use clearly labelled sample content when approval is unavailable.

## Test coverage and limits

The audit covered the homepage, case-study index, four linked details, Services, Products, Contact, Careers, one linked job detail, and earlier public robots and sitemap header checks. The sampled published routes resolved. The case-study and contact layouts were checked at three CSS viewports in Brave. Contact validation used detached copies of live fields, with no production submission.

Not Tested: remaining links and detail pages, physical mobile devices, Safari/Firefox, Lighthouse, throttled timings, screen-reader interaction, custom and server-side form validation, submission feedback, and the actual business effect of the proposed improvements.
