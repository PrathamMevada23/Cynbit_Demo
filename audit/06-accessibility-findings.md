# 06 — Accessibility Findings

## Evidence boundary

Public DOM inspection shows one `h1` on the homepage and descriptive alt text for observed case-study images. Automated scanning, keyboard traversal, focus visibility, contrast calculation, screen-reader testing, zoom testing, and reduced-motion checks were not completed.

## Observations

| Item | Status | Evidence |
|---|---|---|
| Homepage primary heading | Observed | One visible `h1` was present in inspected DOM. |
| Case-study imagery alt text | Observed | Cards included descriptive strings naming study, organisation, and category. |
| Form email semantics | Observed | Newsletter input had `type=email` and `required`. |
| WCAG conformance | Not tested | The above samples cannot establish conformance. |

Follow-up DOM inspection on Contact found no native associated labels on any of the five inquiry fields despite visible field captions. Assistive-technology names and error announcements are Not Tested. On the case-study index, category buttons did not expose `aria-pressed` or `aria-selected` in the sampled DOM. The selected-state announcement is Not Tested. These observations do not establish overall WCAG conformance.
