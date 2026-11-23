"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { extractInvoice, intakeFields, samples, validInvoice } from "@/lib/intake-demo";

export function IntakeDemo() {
  const [sampleIndex, setSampleIndex] = useState(1);
  const [review, setReview] = useState<ReturnType<typeof extractInvoice> | null>(null);
  const [approved, setApproved] = useState(false);
  const [message, setMessage] = useState("");
  const sample = samples[sampleIndex];

  function reset() {
    setReview(null);
    setApproved(false);
    setMessage("");
  }

  return <div className="detail-grid">
    <section className="paper content-card">
      <h2>Sample document</h2>
      <div>
        <label className="field-label" htmlFor="demo-sample">Choose an invoice</label>
        <select id="demo-sample" className="min-h-11 w-full rounded-lg border border-border bg-white px-3" value={sampleIndex} onChange={event => {
          setSampleIndex(Number(event.target.value));
          reset();
        }}>
          {samples.map((item, index) => <option key={item.name} value={index}>{item.name}</option>)}
        </select>
      </div>
      <pre className="wrap-anywhere whitespace-pre-wrap rounded-lg bg-accent p-4 text-sm">{sample.document}</pre>
      <Button className="justify-self-start" onClick={() => {
        const fields = extractInvoice(sample.document);
        setReview(fields);
        setApproved(false);
        setMessage(validInvoice(fields) ? "Fields extracted. Review them before approval." : "Fields extracted. Complete the missing information before approval.");
      }}>Extract fields</Button>
    </section>
    <section className="paper content-card">
      <h2>Review extracted fields</h2>
      {message && <p className="notice" role="status">{message}</p>}
      {review ? <form className="grid gap-4" onSubmit={event => {
        event.preventDefault();
        if (!validInvoice(review)) {
          setMessage("Approval needs a supplier, an invoice number, and a total in the format INR 0.00.");
          return;
        }
        setApproved(true);
        setMessage("Sample invoice approved.");
      }}>
        {intakeFields.map(({ key, label }) => <div key={key}>
          <label className="field-label" htmlFor={`invoice-${key}`}>{label}</label>
          <Input id={`invoice-${key}`} value={review[key]} disabled={approved} maxLength={96} onChange={event => {
            setReview({ ...review, [key]: event.target.value });
            setMessage("");
          }} />
        </div>)}
        <div className="flex flex-wrap gap-2">
          {!approved && <Button type="submit">Approve invoice</Button>}
          <Button type="button" variant="outline" onClick={reset}>Reset demo</Button>
        </div>
      </form> : <p>Extract the fields to start reviewing the sample.</p>}
    </section>
  </div>;
}
