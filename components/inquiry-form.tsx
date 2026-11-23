"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { CircleCheck, ClipboardList } from "lucide-react";
import type { ProjectOption, Service } from "@/lib/catalog";
import { demoInquiry, inquirySchema, isDemoInquiry, route } from "@/lib/contracts";
import { Button, buttonVariants } from "./ui/button";
import { fieldStyle, Input } from "./ui/input";

type TextField = "name" | "email" | "brief";
type IssueField = TextField | "service" | "project";
type FieldErrors = Partial<Record<IssueField, string>>;
type Receipt = { id: string; createdAt: string; service: string | null; project: string | null };
type Context = { service: string; project: string };

export function InquiryForm({ initial, services, projects }: {
  initial: Context & { valid: boolean };
  services: Service[];
  projects: ProjectOption[];
}) {
  const [context, setContext] = useState<Context>(initial);
  const [values, setValues] = useState({ name: "", email: "", brief: "" });
  const [notice, setNotice] = useState(initial.valid ? "" : "An unavailable or incompatible selection was cleared. Choose an available service and project.");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const inquiryAttempt = useRef<{ payload: string; key: string } | null>(null);
  const submitting = useRef(false);
  const confirmation = useRef<HTMLHeadingElement>(null);
  const currentService = (value: string | null) => services.find(item => item.slug === value)?.name ?? "None selected";
  const currentProject = (value: string | null) => projects.find(item => item.slug === value)?.title ?? "None selected";
  const available = projects.filter(item => !context.service || item.services.includes(context.service));

  function changeContext(next: Context) {
    setContext(next);
    setErrors(previous => ({ ...previous, project: undefined, service: undefined }));
    window.history.replaceState(null, "", route("/contact", next));
  }

  function update(field: TextField, value: string) {
    setValues(previous => ({ ...previous, [field]: value }));
    setErrors(previous => ({ ...previous, [field]: undefined }));
  }

  function showErrors(next: FieldErrors, copy: string) {
    setErrors(next);
    setMessage(copy);
    const first = (["service", "project", "name", "email", "brief"] as const).find(field => next[field]);
    if (first) requestAnimationFrame(() => document.getElementById(first)?.focus());
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || receipt) return;
    setMessage("");
    const checked = inquirySchema.safeParse({ ...values, service: context.service, project: context.project });
    if (!checked.success) {
      const next: FieldErrors = {};
      for (const issue of checked.error.issues) {
        const name = issue.path[0] as IssueField;
        if (name && !next[name]) next[name] = issue.message;
      }
      showErrors(next, "Check the highlighted fields.");
      return;
    }
    if (!isDemoInquiry(checked.data)) {
      setMessage("Use the sample details below. This demo only accepts the provided synthetic contact and brief.");
      return;
    }
    const payload = JSON.stringify(checked.data);
    if (inquiryAttempt.current?.payload !== payload) {
      inquiryAttempt.current = { payload, key: crypto.randomUUID() };
    }
    submitting.current = true;
    setPending(true);
    setErrors({});
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": inquiryAttempt.current.key },
        body: payload,
      });
      const result = await response.json() as { receipt?: Receipt; message?: string; fields?: Partial<Record<IssueField, string[]>> };
      if (!response.ok || !result.receipt) {
        const next: FieldErrors = {};
        for (const [field, messages] of Object.entries(result.fields ?? {})) {
          if (messages?.[0]) next[field as IssueField] = messages[0];
        }
        showErrors(next, result.message ?? "The request could not be saved. Try again.");
        return;
      }
      setReceipt(result.receipt);
      requestAnimationFrame(() => confirmation.current?.focus());
    } catch {
      setMessage("The request could not be confirmed. Your details are still here. Try again.");
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  const described = (field: IssueField) => ({
    "aria-invalid": Boolean(errors[field]),
    "aria-describedby": errors[field] ? field + "-error" : undefined,
  });
  const errorText = (field: IssueField) => errors[field] && <p className="field-error" id={field + "-error"}>{errors[field]}</p>;

  if (receipt) return <section className="paper content-card receipt" aria-labelledby="receipt-title">
    <span className="icon-tile"><CircleCheck aria-hidden="true" /></span>
    <h2 ref={confirmation} tabIndex={-1} id="receipt-title">Demo inquiry saved</h2>
    <p>PostgreSQL recorded your synthetic inquiry. You can use this receipt to confirm the handoff.</p>
    <dl className="receipt-details">
      <div><dt>Reference</dt><dd className="font-mono break-all">{receipt.id}</dd></div>
      <div><dt>Service</dt><dd>{currentService(receipt.service)}</dd></div>
      <div><dt>Project</dt><dd>{currentProject(receipt.project)}</dd></div>
      <div><dt>Saved at (UTC)</dt><dd>{new Date(receipt.createdAt).toISOString()}</dd></div>
    </dl>
    <Link href="/case-studies" className={buttonVariants({ variant: "outline" })}>Back to case studies</Link>
  </section>;

  return <div className="form-layout">
    <form className="paper content-card inquiry-form" aria-label="Demo project inquiry" noValidate onSubmit={submit}>
      <fieldset disabled={pending}>
        <legend>Project context</legend>
        <p className="form-help">Change either selection, or leave the context blank.</p>
        {notice && <p className="notice" role="status">{notice}</p>}
        <div className="form-grid">
          <div><label className="field-label" htmlFor="service">Service</label>
            <select className={fieldStyle} id="service" value={context.service} {...described("service")} onChange={event => {
              const service = event.target.value;
              const compatible = !service || !context.project || projects.some(p => p.slug === context.project && p.services.includes(service));
              setNotice(compatible ? "" : "The previous project was cleared because it doesn’t match this service.");
              changeContext({ service, project: compatible ? context.project : "" });
            }}>
              <option value="">No service selected</option>
              {services.map(item => <option value={item.slug} key={item.slug}>{item.name}</option>)}
            </select>{errorText("service")}</div>
          <div><label className="field-label" htmlFor="project">Case study</label>
            <select className={fieldStyle} id="project" value={context.project} {...described("project")} onChange={event => {
              setNotice("");
              changeContext({ ...context, project: event.target.value });
            }}>
              <option value="">No case study selected</option>
              {available.map(item => <option value={item.slug} key={item.slug}>{item.title}</option>)}
            </select>{errorText("project")}</div>
        </div>
      </fieldset>
      <fieldset disabled={pending}>
        <legend>Sample details</legend>
        <p className="form-help">Use the example provided for this assessment. All three details are required.</p>
        <Button variant="outline" type="button" onClick={() => { setValues({ ...demoInquiry }); setErrors({}); setMessage(""); }}>Use sample details</Button>
        <div className="form-grid mt-4">
          <div><label className="field-label" htmlFor="name">Name</label>
            <Input id="name" required autoComplete="off" maxLength={80} value={values.name} {...described("name")} onChange={event => update("name", event.target.value)} />
            {errorText("name")}</div>
          <div><label className="field-label" htmlFor="email">Email</label>
            <Input id="email" type="email" required autoComplete="off" maxLength={120} value={values.email} {...described("email")} onChange={event => update("email", event.target.value)} />
            {errorText("email")}</div>
        </div>
        <label className="field-label mt-4" htmlFor="brief">Project brief</label>
        <textarea className={fieldStyle} id="brief" required rows={4} maxLength={1500} value={values.brief} {...described("brief")} onChange={event => update("brief", event.target.value)} />
        {errorText("brief")}
      </fieldset>
      {message && <p className="notice notice-error" role="alert">{message}</p>}
      <Button disabled={pending} type="submit">{pending ? "Saving inquiry…" : "Send demo inquiry"}</Button>
    </form>
    <aside className="paper content-card form-aside" aria-label="Current inquiry context">
      <span className="icon-tile"><ClipboardList aria-hidden="true" /></span>
      <h2>Your inquiry</h2>
      <dl className="receipt-details" aria-live="polite">
        <div><dt>Service</dt><dd>{currentService(context.service)}</dd></div>
        <div><dt>Case study</dt><dd>{currentProject(context.project)}</dd></div>
      </dl>
      <p>This independent assessment stores a synthetic receipt for the walkthrough. Use the sample details instead of personal information.</p>
    </aside>
  </div>;
}
