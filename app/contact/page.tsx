import type { Metadata } from "next";
import { InquiryForm } from "@/components/inquiry-form";
import { PageHeading } from "@/components/page-heading";
import { listProjects, listServices } from "@/lib/catalog";
import { first, type SearchParams } from "@/lib/contracts";
import { resolveContext } from "@/lib/context";

export const metadata: Metadata = { title: "Project inquiry" };
export const dynamic = "force-dynamic";

export default async function Contact({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const [params, services, projects] = await Promise.all([searchParams, listServices(), listProjects()]);
  const initial = resolveContext(first(params.service) ?? "", first(params.project) ?? "", services, projects);
  return <div className="shell inner-page">
    <PageHeading label="Project inquiry" title="Let’s talk about your project.">Review the service and case you arrived with, then try submitting an example inquiry.</PageHeading>
    <InquiryForm key={JSON.stringify(initial)} initial={initial} services={services}
      projects={projects.map(({ slug, title, services }) => ({ slug, title, services }))} />
  </div>;
}
