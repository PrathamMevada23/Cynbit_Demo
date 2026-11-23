# 02 — Functional and UX Findings

## Confirmed observations

- Homepage navigation exposes company, expertise, BitElevate, blog, and contact destinations; footer also exposes policy and contact links.
- The homepage newsletter control includes a required `email` input with `type="email"` and placeholder `architect@company.com`. Its behavior was not tested because no data was submitted.
- Case-study index cards visibly use “READ FULL STUDY” and point to 13 internal detail routes.

## Findings

| ID | Status | Severity | Finding | Evidence / scope |
|---|---|---:|---|---|
| CYN-001 | Confirmed | Medium | Case-study index lacks observed external/live links. | All 13 project-card anchors resolve to `cynbit.in/case-studies/{slug}`. No client/product URL appeared on the inspected index. |
| CYN-003 | Informational | Low | Newsletter semantics are partially available from markup. | Native email type and `required` are present. Validation, success, error, keyboard flow, and data retention were not tested. |

## Not tested

Header/footer click-through, browser history, duplicate clicks, exhaustive link checking, third-party destinations, and production form outcomes are Not Tested.

## Follow-up on the four primary pages

| Page | Observed behavior and friction | Scope |
|---|---|---|
| [Services](https://www.cynbit.in/services) | Three service families repeat the same Inquire label. Main-content discovery, inquiry, and roadmap controls are buttons with no anchor destinations in the DOM. No service-specific case study is linked from the page body. A verified click on the hero discovery button stayed on Services during a 15-second observation window. | Whether the hero button was intended to open a local panel is unverified. Other button click behavior and preservation of service context are Not Tested. |
| [Contact](https://www.cynbit.in/contact) | The displayed support and opportunities addresses sit in one link targeting the opportunities address. The “Our impact” CTA points to the case-study index while primary navigation has a separate Social Impact destination. View services successfully routed to Services. | The intended “Our impact” destination is unverified. Email and telephone handlers were not launched. |
| [Products](https://www.cynbit.in/products) | The three distinct product CTAs share the `#inquiry` destination. Studio is the initially selected option in the form. All four unique fragment targets exist, and a clicked product CTA updated the URL to `#inquiry`. | Whether each product CTA also selects its matching product is Not Tested. |
| [Careers](https://www.cynbit.in/careers) | 20 role links share the text “View details.” The [sampled role](https://www.cynbit.in/careers/full-stack-developer-intern) opens and presents a four-part application requiring date of birth, gender, both phone and WhatsApp numbers, permanent address, and profile links at the first application stage. The general portfolio CTA leads to Contact. | The initial data request is a potential completion-friction candidate. Operational need for each field, abandonment, and application validation are Not Tested. |

## Contact validation

Browser `ValidityState` was inspected on detached clones of production form inputs. The native required checks reject empty name, email, and message. An invalid email triggers a type mismatch. Whitespace-only name and message pass native validation, and both accept Unicode and a 6,000-character local value without a native length limit. Company and industry are optional. All five live controls had empty native `labels` associations. Custom validation, browser validation messaging during submission, focus behavior, and backend responses are Not Tested.
