"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="shell inner-page">
    <section className="paper empty-state">
      <h1>We couldn’t load this page</h1>
      <p>The catalog may be temporarily unavailable. Try again in a moment.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>Return to services</Link>
      </div>
    </section>
  </div>;
}
