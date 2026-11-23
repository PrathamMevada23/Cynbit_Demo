import { z } from "zod";

export const slugSchema = z.string().max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const selection = z.union([slugSchema, z.literal("")]).default("");

export const catalogQuery = z.object({
  service: selection,
  q: z.string().trim().max(100).default(""),
});

export const inquirySchema = z.object({
  name: z.string().trim().min(2, "Enter a name with at least two characters.").max(80),
  email: z.string().trim().max(120).pipe(z.email({ error: "Enter a valid email address." })).transform(v => v.toLowerCase()),
  brief: z.string().trim().min(15, "Enter a project brief of at least 15 characters.").max(1500),
  service: selection,
  project: selection,
}).strict();

export const demoInquiry = {
  name: "Alex Example",
  email: "alex@example.invalid",
  brief: "We are exploring a collaboration workspace with dependable background processing.",
};

export function isDemoInquiry(fields: z.output<typeof inquirySchema>) {
  return fields.name === demoInquiry.name && fields.email === demoInquiry.email && fields.brief === demoInquiry.brief;
}

export function route(path: string, values: Record<string, string | undefined> = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) if (value) params.set(key, value);
  return params.size ? path + "?" + params : path;
}

export type SearchParams = Record<string, string | string[] | undefined>;
export function first(value: SearchParams[string]) {
  return Array.isArray(value) ? value[0] : value;
}
