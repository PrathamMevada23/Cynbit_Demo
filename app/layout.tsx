import type { Metadata } from "next";
import Link from "next/link";
import { Layers3 } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Client Experience 2.0 | Cynbit assessment", template: "%s | Client Experience 2.0" },
  description: "An independent assessment prototype for discovering services, exploring demonstration case studies, and trying a contextual inquiry.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en">
    <body>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <div className="shell nav">
          <Link href="/" className="brand">
            <span className="brand-icon"><Layers3 aria-hidden="true" size={21} /></span>
            <span>Client Experience<span className="brand-version"> 2.0</span><small>Cynbit technical assessment</small></span>
          </Link>
          <nav aria-label="Main navigation" className="nav-links">
            <Link href="/#services">Services</Link>
            <Link href="/case-studies">Case studies</Link>
            <Link href="/contact" className="nav-inquiry">Project inquiry</Link>
          </nav>
        </div>
      </header>
      <main id="main" className="site-main">{children}</main>
      <footer className="site-footer">
        <div className="shell footer-inner">
          <p>Client Experience 2.0</p>
          <p>Independent technical assessment · Synthetic demonstration data</p>
        </div>
      </footer>
    </body>
  </html>;
}
