# 01 — Website Inventory

**Method:** Public browser DOM inspection, 23 November 2026 IST. “Observed” means visible in the inspected public page; it does not confirm the private implementation.

| Page | URL | Purpose | Primary CTA | Functional elements | Observations |
|---|---|---|---|---|---|
| Homepage | `https://www.cynbit.in/` | Company/service overview | Start discovery; View work | Navigation, links, newsletter email control | Public copy presents AI automation, software development, cloud systems, technical SEO, products, and BitElevate. |
| Case studies | `https://www.cynbit.in/case-studies` | Portfolio index | Read full study; consult experts | 13 internal study links; three category controls | Categories shown: All Success Stories, Software Dev, Cloud Strategy, Digital Marketing. |
| Case-study detail | `/case-studies/{slug}` | Individual project narrative | Explore more work | Outcome section and related links | Four details rendered and inspected. |
| Services | `/services` | AI, software/cloud, and marketing services | Start discovery, Inquire | CTA buttons and capabilities catalog | Rendered HTTP 200. No context-specific case links in main content. |
| Products | `/products` | Cynbit Studio, TenantEase, and Revio | Request a demo | Section links, product choices, shared inquiry form | Rendered HTTP 200. Primary product actions point to the shared inquiry section. |
| Contact | `/contact` | Lead/contact path | Send inquiry | Inquiry form, mail/phone links, service and career paths | Rendered HTTP 200. Native validation sampled locally. |
| Careers | `/careers` | Careers and internships | View details | 20 role links and a general portfolio CTA | Rendered HTTP 200. One role detail also inspected through the published link. |
| BitElevate | `/bitelevate` | Internship programme | Not tested | Linked from header/footer | Not opened. |

## Publicly identifiable technology

- The delivered script and asset paths include `/_next/`; the public response also sends `x-nextjs-prerender`, so the public frontend is consistent with Next.js.
- The homepage response header identifies `server: Vercel`.
- Google Tag Manager (`gtag/js`) and Google-hosted Material Symbols CSS were observed in the delivered homepage DOM.

No inference is made about the private backend, database, CMS, or deployment workflow.
