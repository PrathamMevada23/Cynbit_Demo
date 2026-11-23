import { describe, expect, it } from "vitest";
import { catalogQuery, demoInquiry, inquirySchema, isDemoInquiry, route } from "@/lib/contracts";
import { resolveContext } from "@/lib/context";

describe("route and inquiry contracts", () => {
  it("encodes a shareable query and omits empty values", () => {
    expect(route("/case-studies", { service: "cloud", q: "jobs & queue", unused: "" }))
      .toBe("/case-studies?service=cloud&q=jobs+%26+queue");
    expect(catalogQuery.parse({ q: " jobs " })).toEqual({ q: "jobs", service: "" });
  });

  it("rejects malformed filter values", () => {
    expect(catalogQuery.safeParse({ service: "../cloud" }).success).toBe(false);
    expect(catalogQuery.safeParse({ q: "x".repeat(101) }).success).toBe(false);
  });

  it("trims required fields and rejects invalid and whitespace-only values", () => {
    const bad = inquirySchema.safeParse({ name: "  ", email: "invalid", brief: "    " });
    expect(bad.success).toBe(false);
    if (!bad.success) expect(bad.error.issues.map(issue => issue.path[0])).toEqual(["name", "email", "brief"]);
    expect(inquirySchema.parse({ ...demoInquiry, name: " Alex Example ", email: "ALEX@example.invalid" }))
      .toEqual({ ...demoInquiry, service: "", project: "" });
  });

  it("permits only the specific synthetic fixture for public writes", () => {
    expect(isDemoInquiry(inquirySchema.parse(demoInquiry))).toBe(true);
    expect(isDemoInquiry(inquirySchema.parse({ ...demoInquiry, email: "another@example.invalid" }))).toBe(false);
    expect(inquirySchema.safeParse({ ...demoInquiry, extra: "unexpected" }).success).toBe(false);
  });
});

describe("project context", () => {
  const services = [{ slug: "cloud", name: "Cloud", description: "", sort: 1 }, { slug: "ai", name: "AI", description: "", sort: 2 }];
  const projects = [{ slug: "workspace", title: "Workspace", services: ["cloud"] }];

  it("preserves a compatible pair and allows optional context", () => {
    expect(resolveContext("cloud", "workspace", services, projects)).toEqual({ valid: true, service: "cloud", project: "workspace" });
    expect(resolveContext("", "", services, projects)).toEqual({ valid: true, service: "", project: "" });
    expect(resolveContext("", "workspace", services, projects)).toEqual({ valid: true, service: "", project: "workspace" });
  });

  it("clears stale or incompatible URL context", () => {
    expect(resolveContext("ai", "workspace", services, projects)).toEqual({ valid: false, service: "ai", project: "" });
    expect(resolveContext("gone", "workspace", services, projects)).toEqual({ valid: false, service: "", project: "" });
  });
});
