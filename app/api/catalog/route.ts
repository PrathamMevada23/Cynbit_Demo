import { listProjects, listServices } from "@/lib/catalog";
import { catalogQuery } from "@/lib/contracts";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const query = catalogQuery.safeParse({ service: params.get("service") ?? undefined, q: params.get("q") ?? undefined });
  if (!query.success) return Response.json({ message: "Invalid catalog filters." }, { status: 400 });
  try {
    const [services, projects] = await Promise.all([listServices(), listProjects(query.data)]);
    if (query.data.service && !services.some(item => item.slug === query.data.service)) {
      return Response.json({ message: "Unknown service." }, { status: 400 });
    }
    return Response.json({ services, projects });
  } catch {
    return Response.json({ message: "The catalog is temporarily unavailable." }, { status: 503 });
  }
}
