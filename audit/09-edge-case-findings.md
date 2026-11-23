# 09 — Edge-Case and Reliability Findings

| Area | Result | Evidence / limitation |
|---|---|---|
| Direct case-study routes | Verified in follow-up | Four routes returned HTTP 200 and rendered. Earlier CDP command timeouts are recorded separately from successful page timing. |
| Missing route | Not tested | No guessed URLs were requested. |
| Rapid clicks/navigation | Not tested | Avoided to keep traffic low-impact. |
| Forms | Partial | Native Contact constraints tested on detached inputs. Whitespace-only required text passes. Custom validation, error display, and backend behavior are Not Tested. |
| Category filters | Reproduced in headless Brave | Each category left all 13 cards listed. No-results and other browsers are Not Tested. |
| Slow/failed network | Not tested | No network emulation completed. |
| Small viewports/zoom | Partial | Index and Contact checked at 375, 768, and 1440 CSS px. Zoom and physical touch are Not Tested. |
| Sampled public links | Verified in sample | Four published detail routes and Contact → Services reached content. Careers → Full Stack Developer Intern resolved via web retrieval. All four Products fragment targets existed. No broken destination confirmed in this sample. Remaining card/role destinations and third-party links are Not Tested. |
