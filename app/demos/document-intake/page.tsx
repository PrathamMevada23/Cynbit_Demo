import type { Metadata } from "next";
import Link from "next/link";
import { IntakeDemo } from "@/components/intake-demo";
import { PageHeading } from "@/components/page-heading";
import { first, route, type SearchParams } from "@/lib/contracts";

export const metadata: Metadata = { title: "Document intake demo" };

export default async function DocumentIntakeDemo({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  return <div className="shell inner-page">
    <Link className="text-link mb-4" href={route("/case-studies/document-intake", { service: first(params.service), q: first(params.q) })}>Back to Document intake automation</Link>
    <PageHeading label="Interactive assessment demo" title="Document intake demo">Use a fictional invoice to see rule-based text extraction, human review, and approval. Changes stay in this browser session.</PageHeading>
    <IntakeDemo />
  </div>;
}
