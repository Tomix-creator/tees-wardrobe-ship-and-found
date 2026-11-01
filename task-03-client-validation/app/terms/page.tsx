import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Privacy Notice",
};

export default function TermsPage() {
  return (
    <div
      className="container"
      style={{ paddingTop: "var(--space-xl)", paddingBottom: "var(--space-2xl)" }}
    >
      <h1
        className="type-headline-large"
        style={{
          margin: 0,
          color: "var(--color-role-on-surface)",
          letterSpacing: "var(--type-headline-large-letter-spacing)",
        }}
      >
        Terms and Privacy Notice
      </h1>
      <p
        className="type-body-large"
        style={{
          marginTop: "var(--space-lg)",
          color: "var(--color-role-on-surface)",
        }}
      >
        These terms are being prepared from a published template and will appear
        here before launch.
      </p>
    </div>
  );
}

