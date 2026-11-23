"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { route } from "@/lib/contracts";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function SearchBox({ service, q }: { service: string; q: string }) {
  const router = useRouter();
  return <form className="search-box" role="search" aria-label="Search case studies" action="/case-studies" onSubmit={event => {
    event.preventDefault();
    const value = String(new FormData(event.currentTarget).get("q") ?? "").trim();
    router.push(route("/case-studies", { service, q: value }), { scroll: false });
  }}>
    <label htmlFor="case-search" className="field-label">Search case studies</label>
    <div className="flex gap-2">
      <Input id="case-search" type="search" name="q" maxLength={100} defaultValue={q} placeholder="Title, topic, or technology" />
      {service && <input type="hidden" name="service" value={service} />}
      <Button type="submit"><Search aria-hidden="true" /> Search</Button>
    </div>
  </form>;
}
