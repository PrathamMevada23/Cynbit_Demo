import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { ServiceIcon } from "@/components/service-icon";
import { listProjects, listServices } from "@/lib/catalog";
import { first, route, slugSchema, type SearchParams } from "@/lib/contracts";

export const dynamic = "force-dynamic";

export default async function Detail({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<SearchParams> }) {
  const slug = slugSchema.safeParse((await params).slug);
  if (!slug.success) notFound();
  const [[project], services, query] = await Promise.all([listProjects({ slug: slug.data }), listServices(), searchParams]);
  if (!project) notFound();
  const arrivedFrom = first(query.service);
  const selectedService = arrivedFrom && project.services.includes(arrivedFrom) ? arrivedFrom : project.primaryService;
  const service = services.find(item => item.slug === selectedService);

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
        <section><h2>Evidence status</h2><p>{project.evidence?.description ?? "No evidence record is available."}</p></section>
        <section><h2>Technologies</h2><ul className="tags" aria-label="Technologies">{project.technologies.map(tag => <li key={tag}>{tag}</li>)}</ul></section>
        <Link href={route("/contact", { project: project.slug, service: selectedService })} className={buttonVariants()}>Discuss a similar project</Link>
      </aside>
    </div>
  </div>;
}
