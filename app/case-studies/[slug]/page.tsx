import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { ServiceIcon } from "@/components/service-icon";
import { listProjects, listServices } from "@/lib/catalog";
import { first, route, slugSchema, type SearchParams } from "@/lib/contracts";
import { publicProofUrl } from "@/lib/evidence";

export const dynamic = "force-dynamic";

export default async function Detail({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<SearchParams> }) {
  const slug = slugSchema.safeParse((await params).slug);
  if (!slug.success) notFound();
  const [[project], services, query] = await Promise.all([listProjects({ slug: slug.data }), listServices(), searchParams]);
  if (!project) notFound();
  const arrivedFrom = first(query.service);
  const selectedService = arrivedFrom && project.services.includes(arrivedFrom) ? arrivedFrom : project.primaryService;
  const service = services.find(item => item.slug === selectedService);
  const proofUrl = publicProofUrl(project.evidence?.proofUrl);
  const demoUrl = project.slug === "document-intake"
    ? route("/demos/document-intake", { service: arrivedFrom, q: first(query.q) })
    : null;

  return <div className="shell inner-page">
    <Link href={route("/case-studies", { service: arrivedFrom, q: first(query.q) })} className="text-link">Back to case studies</Link>
    <section className="detail-hero">
      <p className="eyebrow">{service?.name}</p>
      <h1>{project.title}</h1>
      <p>{project.summary}</p>
      <span className="demo-badge">Demo scenario</span>
    </section>
    <div className="detail-grid">
      <article className="paper content-card">
        {[["Challenge", project.challenge], ["Approach", project.approach], ["Illustrative outcome", project.outcome]].map(([title, copy]) => <section key={title}>
          <h2>{title}</h2><p>{copy}</p>
        </section>)}
      </article>
      <aside className="paper content-card detail-aside">
        <span className="icon-tile"><ServiceIcon service={selectedService} /></span>
        <section>
          <h2>Evidence status</h2>
          {demoUrl && <>
            <p>Try extracting and correcting fields from a sample invoice in this assessment demo.</p>
            <Link href={demoUrl} className={buttonVariants({ variant: "outline", className: "mt-3" })}>Try the live demo</Link>
          </>}
          {proofUrl
            ? <a href={proofUrl} className="text-link mt-2">View project evidence · {new URL(proofUrl).hostname}</a>
            : <p className={demoUrl ? "mt-3" : ""}>No public client proof link is available for this fictional case.</p>}
        </section>
        <section><h2>Technologies</h2><ul className="tags" aria-label="Technologies">{project.technologies.map(tag => <li key={tag}>{tag}</li>)}</ul></section>
        <Link href={route("/contact", { project: project.slug, service: selectedService })} className={buttonVariants()}>Discuss a similar project</Link>
      </aside>
    </div>
  </div>;
}
