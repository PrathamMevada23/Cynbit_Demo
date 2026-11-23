import type { ReactNode } from "react";

export function PageHeading({ label, title, children }: { label: string; title: string; children: ReactNode }) {
  return <section className="page-heading">
    <p className="eyebrow">{label}</p>
    <h1>{title}</h1>
    <p className="page-intro">{children}</p>
  </section>;
}
