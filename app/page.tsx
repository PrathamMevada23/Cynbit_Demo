import Link from "next/link";
import { FolderSearch, LayoutGrid, MessageSquareText } from "lucide-react";
import { ServiceIcon } from "@/components/service-icon";
import { buttonVariants } from "@/components/ui/button";
import { listServices } from "@/lib/catalog";
import { route } from "@/lib/contracts";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const journey = [
  { title: "Choose a service", copy: "Start with the capability you need.", href: "#services", icon: LayoutGrid },
  { title: "Explore relevant work", copy: "Read an example and assess the approach.", href: "/case-studies", icon: FolderSearch },
  { title: "Discuss your project", copy: "Start a demo inquiry with context attached.", href: "/contact", icon: MessageSquareText },
];

export default async function Home() {
  const services = await listServices();
  return <>
    <section className="hero">
      <div className="shell hero-inner">
        <div>
          <p className="eyebrow hero-label">Independent technical assessment</p>
          <h1>Find the right work.<br /><em>Start the right conversation.</em></h1>
          <p className="hero-copy">Explore Cynbit’s service areas, find relevant demonstration projects, and carry what you discover into a project inquiry.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="#services" className={cn(buttonVariants(), "bg-[#aaf5df] text-[#102725] hover:bg-white")}>Explore services</Link>
            <Link href="/case-studies" className={cn(buttonVariants({ variant: "outline" }), "border-white/30 bg-transparent text-white hover:bg-white/15")}>Browse all cases</Link>
          </div>
        </div>
        <aside aria-label="Explore the client journey" className="journey-panel">
          {journey.map(({ title, copy, href, icon: Icon }) => <Link key={href} href={href} className="journey-step">
            <span className="journey-icon"><Icon aria-hidden="true" size={22} /></span>
            <span><strong>{title}</strong><small>{copy}</small></span>
          </Link>)}
        </aside>
      </div>
    </section>
    <section id="services" className="shell section">
      <div className="section-heading">
        <p className="eyebrow">Services</p>
        <h2>What are you building?</h2>
        <p>Choose an area to see projects that match your priorities.</p>
      </div>
      <div className="service-grid">
        {services.map(service => <article className="paper service-card" key={service.slug}>
          <span className="icon-tile"><ServiceIcon service={service.slug} /></span>
          <h3>{service.name}</h3>
          <p>{service.description}</p>
          <div className="card-actions">
            <Link href={route("/case-studies", { service: service.slug })} aria-label={`See relevant work for ${service.name}`} className={buttonVariants()}>See relevant work</Link>
            <Link href={route("/contact", { service: service.slug })} aria-label={`Discuss ${service.name}`} className={buttonVariants({ variant: "ghost" })}>Discuss this service</Link>
          </div>
        </article>)}
      </div>
    </section>
  </>;
}
