import { z } from "zod";
import { inquirySchema, isDemoInquiry } from "@/lib/contracts";
import { digest, saveInquiry } from "@/lib/inquiries";

const MAX_BODY = 8192;

async function readBody(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) return { status: 400 } as const;
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let bytes = 0;
  let body = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_BODY) {
        void reader.cancel().catch(() => {});
        return { status: 413 } as const;
      }
      body += decoder.decode(value, { stream: true });
    }
    return { status: 200, content: JSON.parse(body + decoder.decode()) as unknown } as const;
  } catch {
    return { status: 400 } as const;
  } finally {
    reader.releaseLock();
  }
}

function reply(data: object, status: number, headers: Record<string, string> = {}) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const url = new URL(request.url);
  // Next can use its internal hostname in request.url. The HTTP Host retains the browser's authority.
  const scheme = process.env.VERCEL === "1" ? "https:" : url.protocol;
  const publicOrigin = scheme + "//" + (request.headers.get("host") ?? url.host);
  if (origin && origin !== publicOrigin) return reply({ message: "Use this form from the assessment site." }, 403);
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return reply({ message: "Send a JSON request." }, 415);
  }
  const key = z.uuid().safeParse(request.headers.get("idempotency-key")?.toLowerCase());
  if (!key.success) return reply({ message: "A valid Idempotency-Key is required." }, 400);
  if (Number(request.headers.get("content-length")) > MAX_BODY) return reply({ message: "The request is too large." }, 413);
  const raw = await readBody(request);
  if (raw.status !== 200) return reply({ message: raw.status === 413 ? "The request is too large." : "Send valid JSON." }, raw.status);
  const parsed = inquirySchema.safeParse(raw.content);
  if (!parsed.success) return reply({ message: "Check the highlighted fields.", fields: z.flattenError(parsed.error).fieldErrors }, 422);
  if (!isDemoInquiry(parsed.data)) return reply({ message: "Use the provided sample details. This demo accepts synthetic data only." }, 422);

  // On Vercel use its platform-injected address. Local or unknown hosts share a bucket.
  const address = process.env.VERCEL === "1" ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim() : undefined;
  try {
    const result = await saveInquiry(parsed.data, key.data, "client:" + digest(address || "local"));
    switch (result.status) {
      case "created": return reply({ receipt: result.receipt }, 201);
      case "replayed": return reply({ receipt: result.receipt }, 200);
      case "conflict": return reply({ message: "This request key belongs to different details." }, 409);
      case "invalid-context": return reply({ message: "This project is unavailable for the selected service.", fields: { project: ["Choose a compatible project or clear the project."] } }, 422);
      case "limited": return reply({ message: "The demo submission limit was reached. Try again shortly." }, 429, { "Retry-After": String(result.retryAfter) });
    }
  } catch {
    return reply({ message: "The inquiry could not be saved. Your details are still in the form." }, 503);
  }
}
