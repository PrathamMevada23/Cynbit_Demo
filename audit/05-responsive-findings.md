# 05 — Responsive Findings

## Result

On 23 November 2026 IST, headless Brave (Chromium 158) used CSS viewport overrides at 375×812, 768×1024 and 1440×900. The case-study index was visually checked against screenshots and Contact received a DOM geometry and visible-navigation check. In all six samples, the document scroll width matched the viewport and sampled headings, links, buttons and form controls stayed within its horizontal bounds.

| Viewport | Case-study index | Contact |
|---|---|---|
| [375×812](evidence/screenshots/case-studies-375.png) | Header menu and bottom navigation visible. Filter controls wrap to two rows. Cards begin below the initial view. | Header menu and five-item bottom navigation visible. No horizontal spill in sampled controls. |
| [768×1024](evidence/screenshots/case-studies-768.png) | Header menu and Join Us visible. Filters fit a single row. The second card's category text is visibly clipped at the card's right edge despite no page-level overflow. | Header menu and Join Us visible. No horizontal spill in sampled controls. |
| [1440×900](evidence/screenshots/case-studies-1440.png) | Desktop navigation and all four filter controls visible. The oversized hero pushes project cards below the initial view. | Desktop navigation visible. No horizontal spill in sampled controls. |

Not Tested: 320, 430, and 1024 CSS px, landscape, 200% zoom, physical touch, Safari/Firefox, mobile device-specific rendering, full Contact visual inspection and dropdown interaction.

## Follow-up protocol

For each viewport, record a screenshot and assess horizontal overflow, header/menu visibility, card wrapping, touch-target sizing, text wrapping, and footer overlap. Mark every browser not available as “Not Tested.”
