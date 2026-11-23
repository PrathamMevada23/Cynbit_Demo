import { listProjects } from "@/lib/catalog";
import { slugSchema } from "@/lib/contracts";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const slug = slugSchema.safeParse((await params).slug);
  if (!slug.success) return Response.json({ message: "Case study not found." }, { status: 404 });
  try {
    const [project] = await listProjects({ slug: slug.data });
    return project ? Response.json({ project }) : Response.json({ message: "Case study not found." }, { status: 404 });
  } catch {
    return Response.json({ message: "The project is temporarily unavailable." }, { status: 503 });
  }
}
