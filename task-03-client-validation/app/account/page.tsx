import type { Metadata } from "next";
import { Suspense } from "react";
import AccountForms from "./AccountForms";

export const metadata: Metadata = {
  title: "Account",
};

export default function AccountPage() {
  return (
    <Suspense fallback={<AccountShell />}>
      <AccountForms />
    </Suspense>
  );
}

/** Shown while useSearchParams resolves on first render. */
function AccountShell() {
  return (
    <div
      className="container"
      style={{ paddingTop: "var(--space-xl)", paddingBottom: "var(--space-2xl)" }}
    >
      <div style={{ height: "2rem" }} />
    </div>
  );
}

