export default function Loading() {
  return <div className="shell inner-page">
    <div className="paper empty-state" role="status" aria-live="polite">
      <p>Loading the page…</p>
    </div>
  </div>;
}
