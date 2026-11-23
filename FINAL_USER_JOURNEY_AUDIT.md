# Cynbit Client Experience 2.0 — User Journey Audit

On 23 November 2026 IST, the follow-up used ordinary public page visits and pointer interactions in a fresh headless Brave profile at 1440 CSS px. It focused on how service and project selections carry across pages. Previous audits supply the four-detail case-study sample and responsive findings. Contact validation was checked on detached copies of the live controls. Production submissions, server-side acceptance, post-submit feedback, and actual conversion are Not Tested. [Earlier audit](AUDIT_SUMMARY.md) · [Consolidated issues](audit/10-consolidated-issues.md) · [Prioritization](audit/11-prioritization-matrix.md)

## Journey A — Services to relevant work

**Current workflow.** Services presents AI automation, a combined software/cloud offering, and marketing. The repeated **Inquire** buttons initiate a discovery request. A verified click on the AI button left the URL on Services and surfaced the discovery form. In a fresh visit, a verified click on the software/cloud button produced the same form. The form includes Company Size and Service Needed. Service Needed was blank after the software/cloud click. For completed work, the page body has no direct case-study link. Hovering **Expertise** and clicking **Case Studies** opened the unfiltered `/case-studies` index with all 13 cards and no service in the URL. [Services](https://www.cynbit.in/services)

**Friction and consequence.** The same Inquire label in different sections suggests the chosen capability might carry through. In the software/cloud sample the visitor must select it again. Visitors who want examples before contacting Cynbit need to leave the service content, locate the general portfolio, and identify relevant work there. This can make it harder to match the team's past delivery to the visitor's needs. The impact on actual inquiries is unmeasured.

**Proposed improvement.** Give each service a **See relevant work** link to a filtered explorer and a **Discuss this service** link to an inquiry with the service selected. Keep the context visible and editable.

**Full-stack requirements.** Use stable service slugs and explicit service-to-project mappings. Validate context on the catalog read path and again when writing an inquiry. Derive displayed labels from catalog records.

**Risks and dependencies.** A project can span multiple services. Define the mappings and keep the arriving service active where it is compatible with the project. Use approved mappings or label seeded mappings as examples. The exact behavior of the remaining service buttons and their preselection is Not Tested.

**Acceptance tests.** Each service has a working link that opens only its mapped projects, including a shared project in both appropriate lists. Direct inquiry selects the originating service. Refresh, back navigation, and shared links preserve valid context. Unknown or removed slugs offer a clear reset.

## Journey B — Case studies to inquiry

**Current workflow.** The index listed 13 cards, four category controls, and no search control in its main content. A verified click on **Cloud Strategy** left all 13 cards present after two seconds. **All Success Stories** retained its visual selection. The user could still open Cloudy Tales by clicking its card. From that detail, the header Contact link opened plain `/contact`, and all five fields were blank. The detail body offered the index and two related studies as its only links. The index also exposes a generic **Consult Our Experts** link to `/contact` in its markup. [Case-study index](https://www.cynbit.in/case-studies) · [Cloudy Tales](https://www.cynbit.in/case-studies/cloudy-tales-collaboration)

**Friction and consequence.** The observed filter gives no effective shortcut to cloud work in the tested browser. The four previously sampled details, including Cloudy Tales, name projects and report outcomes. They use stock hero imagery and expose no live demo, product screenshot, outcome source, or external project reference in their article bodies. Prospects who decide to inquire have to communicate the project and service again. This may reduce inquiry specificity or make project evidence harder to evaluate. Actual conversion and independently verified client outcomes remain unmeasured. [Four-detail case-study analysis](audit/03-case-study-analysis.md)

**Proposed improvement.** Make category and service filters reliable, add text search, and show outcome sources or evidence status. Add **Discuss a similar project** on each detail and preserve the service selected in Journey A. Offer approved screenshots or links when available.

**Full-stack requirements.** Provide a small catalog read API over structured service, case, outcome and evidence records. Share search and filter state in the URL. Pass only canonical service and project slugs to inquiry and validate the pair on the server.

**Risks and dependencies.** Project-specific media, client references, and published figures depend on content approval. Cross-browser filter behavior remains Not Tested. Keep link availability and evidence status explicit for each case.

**Acceptance tests.** Each filter shows the expected records and selected state. Search handles a known match and an empty result. A case links directly to inquiry with both labels visible, and the inquiry retains them on refresh. A missing media asset or evidence source produces an understandable state. A historical project with no approved external link presents its available evidence without a dead CTA.

## Journey C — Contact and conversion

**Current workflow.** The main form requires name, email, and message. Company and industry are optional. It has no dedicated service, product, or project selector. Contact opened blank from the Cloudy Tales header link and the Products **Speak to an Architect** CTA. Products also has a separate demo form. Its **Schedule Tour** for TenantEase and **Audit Reputation Architecture** for Revio both moved to `#inquiry`, and the visible submit button still read **Request Studio Demo** after each verified click. The Services discovery form examined in Journey A includes a service selector, with no software/cloud preselection observed. [Contact](https://www.cynbit.in/contact) · [Products](https://www.cynbit.in/products)

**Friction and consequence.** The five Contact controls had no associated native labels or explicit ARIA labels. In Chromium's accessibility tree their names matched the placeholder examples. Native validation rejected empty required values and a malformed email. Detached clones accepted spaces as a valid name and message. The placeholder-derived names, manual context entry, and product demo mismatch can make it harder to understand a field or trust that the right request will reach the team. Actual error rates, lead quality, custom validation, assistive technology behavior beyond Chromium's accessibility tree, and product submission routing are Not Tested. [Earlier form findings](audit/02-functional-ux-findings.md)

**Proposed improvement.** Build one concise contextual inquiry for the MVP with persistent labels, readable inline errors, and editable service/project context. Keep name, email, and project brief as the required inputs. Offer the standalone inquiry with blank optional context. Treat product-specific wiring as follow-up.

**Full-stack requirements.** Use a shared schema for trim, required fields, email and length bounds. Validate and resolve context on the server. Persist one demo request and show a receipt only after successful storage. Preserve form values on recoverable errors.

**Risks and dependencies.** Owner review is needed before collecting real client details or connecting existing inquiry channels. A public assessment demo can use fixed synthetic submissions. Production submission and custom-error behavior remain Not Tested.

**Acceptance tests.** Every field is named by its persistent caption. Empty and whitespace-only name or brief and malformed email fail both validation layers. A synthetic request stores exactly one record with the correct service/project pair. A failed request preserves values. An incompatible project selection is cleared with an explanation when the service changes.

## How to measure the improvement

Use a repeatable task with the same goal on both sites. Find a relevant cloud case, open it, and reach an inquiry for similar work. Record calls to action taken, whether the case was found, and how many context fields require re-entry. The observed Cloudy Tales → Contact handoff carried zero of the two desired context fields. The proposed targets are one action from a service to filtered work, one action from a detail to inquiry, and both fields present on arrival. Test with keyboard and the three audited CSS widths. Report the task result separately from any future production conversion metric. [Final project scope](FINAL_PROJECT_SCOPE.md)
