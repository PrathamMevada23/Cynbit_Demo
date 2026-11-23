# 07 — Passive Security and Privacy Observations

**Method:** Public HTTPS response headers only; 23 November 2026 IST. No exploitability testing was attempted.

| Item | Classification | Evidence / note |
|---|---|---|
| HTTPS/HSTS | Informational | Homepage responded over HTTPS with `strict-transport-security: max-age=63072000`. |
| Hosting indicator | Informational | `server: Vercel` was present. |
| CSP | Potential concern requiring authorization / follow-up | `content-security-policy` was not present in the captured homepage HEAD response. Header absence alone does not establish exploitability or configuration intent. |
| X-Content-Type-Options | Potential concern requiring authorization / follow-up | Not present in captured homepage HEAD response. |
| Referrer-Policy | Potential concern requiring authorization / follow-up | Not present in captured homepage HEAD response. |
| Frame protection | Potential concern requiring authorization / follow-up | Neither `x-frame-options` nor CSP `frame-ancestors` was observed in the captured homepage HEAD response. No embedding test was performed. |
| Cookies | Not tested | No cookie values or attributes were collected. |
| Privacy UI | Not tested | Linked policy pages were not opened. |

These observations are configuration-review prompts, not vulnerability claims.
