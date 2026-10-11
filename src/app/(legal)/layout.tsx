import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./legal.module.css";

// Read-only surface: full white canvas, black text, one readable column.
// Keep this exception local; the rest of Zenoba retains its dark identity.
export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.page}>
      <div className={styles.column}>
        <nav aria-label="Back navigation" className={styles.back}>
          <Link href="/">Back to Zenoba</Link>
        </nav>
        <main id="legal-content" className={styles.document}>
          {children}
        </main>
        <nav aria-label="Legal documents" className={styles.related}>
          <Link href="/terms">Terms</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
        </nav>
      </div>
    </div>
  );
}
