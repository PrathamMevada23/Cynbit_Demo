import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return <div className="shell inner-page">
    <section className="paper empty-state">
      <h1>This page isn’t available</h1>
      <p>Browse the catalog to find another demonstration project.</p>
      <Link href="/case-studies" className={buttonVariants()}>Browse case studies</Link>
    </section>
  </div>;
}
