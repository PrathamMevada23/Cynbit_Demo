import type { Metadata } from "next";
import Link from "next/link";
import { FolderSearch } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { SearchBox } from "@/components/search-box";
import { ServiceIcon } from "@/components/service-icon";
import { buttonVariants } from "@/components/ui/button";
import { listProjects, listServices } from "@/lib/catalog";
import { catalogQuery, first, route, type SearchParams } from "@/lib/contracts";

export const metadata: Metadata = { title: "Case studies" };
export const dynamic = "force-dynamic";

export default async function Explorer({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const parsed = catalogQuery.safeParse({ service: first(params.service), q: first(params.q) });
  const services = await listServices();
  const { service, q } = parsed.success ? parsed.data : { service: "", q: "" };
  const invalid = !parsed.success || Boolean(service && !services.some(item => item.slug === service));
  const projects = invalid ? [] : await listProjects({ service, q });
  const categories = [{ slug: "", name: "All services" }, ...services];

  return <div className="shell inner-page">
    <PageHeading label="Project library" title="Explore case studies">Filter by service or search for a specific approach. Every case is a clearly labelled demonstration scenario.</PageHeading>
    <section className="paper filters" aria-label="Filter projects">
      <SearchBox key={q} service={invalid ? "" : service} q={q} />
      <nav className="filter-links" aria-label="Filter by service">
        {categories.map(item => <Link key={item.slug} scroll={false}
          href={route("/case-studies", { q, service: item.slug })}
          aria-current={!invalid && service === item.slug ? "true" : undefined}>{item.name}</Link>)}
      </nav>
    </section>
    <p role="status" aria-live="polite" className="result-count">
      {invalid ? "Unavailable filter" : `${projects.length} demonstration ${projects.length === 1 ? "case" : "cases"}`}
    </p>
    {projects.length === 0 ? <section className="paper empty-state">
      <FolderSearch aria-hidden="true" />
      <h2>{invalid ? "This filter is unavailable" : "No matching projects"}</h2>
      <p>{invalid ? "Reset the filters and choose an available service." : "Try another search or browse all services."}</p>
      <Link href="/case-studies" className={buttonVariants({ variant: "outline" })}>Clear filters</Link>
    </section> : <div className="project-grid">
      {projects.map(project => <article className="paper project-card" key={project.slug}>
        <div className="project-card-top">
          <span className="icon-tile"><ServiceIcon service={project.primaryService} /></span>
          <span className="demo-badge">Demo scenario</span>
        </div>
        <p className="project-category">{services.filter(item => project.services.includes(item.slug)).map(item => item.name).join(" · ")}</p>
        <h2><Link href={route(`/case-studies/${project.slug}`, { service, q })}>{project.title}</Link></h2>
        <p>{project.summary}</p>
        <ul className="tags" aria-label="Technologies">{project.technologies.map(tag => <li key={tag}>{tag}</li>)}</ul>
        <Link className="text-link" href={route(`/case-studies/${project.slug}`, { service, q })} aria-label={`Read case study: ${project.title}`}>Read case study</Link>
      </article>)}
    </div>}
  </div>;
}
