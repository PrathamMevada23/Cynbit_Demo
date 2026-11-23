# 04 — Performance Analysis

**Environment:** 23 November 2026 IST, headless Brave (Chromium 158) on macOS, local connection without intentional throttling. Timings use DevTools Protocol Network events and the browser's Navigation Timing and Paint Timing entries. The two index runs each started with a fresh temporary profile. The subsequent direct visits could reuse connections and assets. A document request is distinct from an in-app route change.

| Direct route | TTFB | Document response end | DOMContentLoaded end | FCP | Load event end | HTTP |
|---|---:|---:|---:|---:|---:|---:|
| Case-study index, fresh profile 1 | 136 | 1,353 | 1,661 | 2,096 | 2,260 | 200 |
| Case-study index, fresh profile 2 | 246 | 1,493 | 1,802 | 1,812 | 2,660 | 200 |
| WizHealth | 50 | 812 | 865 | 872 | 918 | 200 |
| Cloudy Tales | 249 | 1,486 | 1,783 | 1,796 | 2,383 | 200 |
| Evento | 98 | 1,268 | 1,366 | 1,352 | 1,518 | 200 |
| Marketing Addict | 74 | 721 | 816 | 808 | 904 | 200 |
| Services | 74 | 102 | 153 | 148 | 226 | 200 |
| Products | 88 | 494 | 595 | 568 | 650 | 200 |
| Careers | 77 | 778 | 876 | 864 | 930 | 200 |
| Contact | 73 | 98 | 126 | 184 | 215 | 200 |
| Products, fresh profile CTA check | 260 | 316 | 627 | 640 | 1,124 | 200 |
| Services, CTA check | 80 | 127 | 207 | 168 | 268 | 200 |

Values are milliseconds from navigation start, rounded. TTFB is `responseStart`, including any connection setup after navigation starts. Document response end is elapsed time to the end of the HTML response. LCP, TBT, CLS, INP, homepage timings, throttle and Lighthouse runs are Not Tested.

| In-page movement | Time to target URL and heading | Network observation |
|---|---:|---|
| Case-study index → WizHealth | 1,574 ms | Same document. Target route fetch returned 200. DevTools recorded 481 ms to response headers for the fetch. |
| Contact → Services | 89 ms | Same document. No matching post-click fetch was captured before the target appeared. |

Click measurements include browser-control overhead and polling at approximately 80 ms. They describe when the target URL and heading were observed, with no claim about long-term site speed.

The Services discovery button did not reach Contact during the 15-second click observation. Its intended destination and any local panel behavior remain unverified. This attempt is excluded from successful navigation timings. See [selected DevTools evidence](evidence/performance/devtools-followup.json).

## Passive delivery evidence

Homepage HTTP response: `200`, `server: Vercel`, `x-vercel-cache: HIT`, `x-nextjs-prerender: 1`, `content-length: 101009`, and `cache-control: public, max-age=0, must-revalidate`.

The public homepage DOM referenced multiple Next.js JavaScript chunks, Google Tag Manager, Google Fonts, and a texture and avatar images fetched via third parties. This identifies candidates for later measurement, not a demonstrated performance problem.

## Conclusion

The reported 30–60 second delay was not reproduced in successful measurements. The original in-app browser returned a CDP command timeout after roughly 21 seconds. An early follow-up Cloudy Tales navigation also reached its 10-second command deadline before a usable page timing was collected. An independent tab later loaded Cloudy Tales in 2.38 seconds. Those timeouts are missing measurements. The successful cases do not isolate the cause of either timeout or rule out intermittent delays under untested conditions. Performance optimization remains below the shortlist.
