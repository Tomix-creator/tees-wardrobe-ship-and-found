import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container" style={{ paddingBottom: 'var(--space-2xl)' }}>
      {/* Header */}
      <header
        style={{
          paddingTop: 'var(--space-xl)',
          paddingBottom: 'var(--space-lg)',
          borderBottom: '1px solid var(--color-role-field-outline)',
          marginBottom: 'var(--space-lg)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1
              className="type-headline-large"
              style={{
                margin: 0,
                color: 'var(--color-role-on-surface)',
                letterSpacing: 'var(--type-headline-large-letter-spacing)',
              }}
            >
              Tee’s Wardrobe
            </h1>
            <p
              className="type-label-medium"
              style={{
                margin: 0,
                marginTop: 'var(--space-3xs)',
                color: 'var(--color-role-field-outline)',
              }}
            >
              Bespoke &amp; ready-to-wear clothing tailored for you
            </p>
          </div>
          <span
            className="type-label-small"
            style={{
              padding: 'var(--space-3xs) var(--space-xs)',
              borderRadius: 'var(--space-2xs)',
              backgroundColor: 'var(--color-role-surface)',
              border: '1px solid var(--color-role-field-outline)',
              color: 'var(--color-role-on-surface)',
            }}
          >
            Scaffold v0.1
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Scaffolding Status Card */}
        <section
          className="shadow-soft"
          style={{
            backgroundColor: 'var(--color-role-surface)',
            borderRadius: 'var(--space-xs)',
            border: '1px solid var(--color-role-field-outline)',
            padding: 'var(--space-lg)',
            marginBottom: 'var(--space-lg)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', marginBottom: 'var(--space-xs)' }}>
            <span
              style={{
                width: 'var(--space-xs)',
                height: 'var(--space-xs)',
                borderRadius: '50%',
                backgroundColor: 'var(--color-role-success)',
                display: 'inline-block',
              }}
            />
            <h2
              className="type-title-medium"
              style={{
                margin: 0,
                color: 'var(--color-role-on-surface)',
              }}
            >
              Task Two Initial Scaffold
            </h2>
          </div>
          <p
            className="type-body-medium"
            style={{
              margin: 0,
              marginBottom: 'var(--space-md)',
              color: 'var(--color-role-on-surface)',
            }}
          >
            This minimal home screen establishes the Next.js with TypeScript foundation for Tee’s Wardrobe. It strictly consumes design system tokens for colors, typography, shadows, and spacing.
          </p>
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-sm)',
              flexWrap: 'wrap',
            }}
          >
            <span
              className="type-label-small"
              style={{
                padding: 'var(--space-3xs) var(--space-xs)',
                borderRadius: 'var(--space-2xs)',
                backgroundColor: 'var(--color-role-primary)',
                color: 'var(--color-role-on-primary)',
              }}
            >
              Next.js 15 App Router
            </span>
            <span
              className="type-label-small"
              style={{
                padding: 'var(--space-3xs) var(--space-xs)',
                borderRadius: 'var(--space-2xs)',
                border: '1px solid var(--color-role-field-outline)',
                color: 'var(--color-role-on-surface)',
              }}
            >
              React 19 &amp; TypeScript
            </span>
            <span
              className="type-label-small"
              style={{
                padding: 'var(--space-3xs) var(--space-xs)',
                borderRadius: 'var(--space-2xs)',
                border: '1px solid var(--color-role-field-outline)',
                color: 'var(--color-role-on-surface)',
              }}
            >
              Tokens &amp; Spacing CSS
            </span>
          </div>
        </section>

        {/* Action Row */}
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <Link href="/orders/new" className="btn btn-primary" style={{ display: 'inline-block' }}>
            New order
          </Link>
        </div>

        {/* Planned Product Modules (Minimal Scaffold Stubs) */}
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-md)',
          }}
        >
          <div
            className="shadow-soft"
            style={{
              backgroundColor: 'var(--color-role-surface)',
              border: '1px solid var(--color-role-field-outline)',
              borderRadius: 'var(--space-xs)',
              padding: 'var(--space-md)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3xs)' }}>
              <h3
                className="type-title-small"
                style={{
                  margin: 0,
                  color: 'var(--color-role-on-surface)',
                }}
              >
                Order Tracking &amp; Inquiries
              </h3>
              <span
                className="type-label-small"
                style={{
                  padding: 'var(--space-3xs) var(--space-xs)',
                  borderRadius: 'var(--space-2xs)',
                  border: '1px solid var(--color-role-field-outline)',
                  color: 'var(--color-role-field-outline)',
                }}
              >
                Planned Feature
              </span>
            </div>
            <p
              className="type-body-small"
              style={{
                margin: 0,
                marginBottom: 'var(--space-md)',
                color: 'var(--color-role-on-surface)',
              }}
            >
              Proposed functionality: tracking order status, calculating remaining balance with courier fee quoting, and recording payment dates. Intentionally not implemented in this initial scaffold.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'center' }}>
              <button
                type="button"
                className="btn btn-primary"
                disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
                aria-disabled="true"
              >
                Order Tracking (Planned)
              </button>
              <span
                className="type-label-small"
                style={{ color: 'var(--color-role-field-outline)' }}
              >
                No active forms or database
              </span>
            </div>
          </div>

          <div
            className="shadow-soft"
            style={{
              backgroundColor: 'var(--color-role-surface)',
              border: '1px solid var(--color-role-field-outline)',
              borderRadius: 'var(--space-xs)',
              padding: 'var(--space-md)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3xs)' }}>
              <h3
                className="type-title-small"
                style={{
                  margin: 0,
                  color: 'var(--color-role-on-surface)',
                }}
              >
                Ready-to-Wear &amp; Made-to-Order
              </h3>
              <span
                className="type-label-small"
                style={{
                  padding: 'var(--space-3xs) var(--space-xs)',
                  borderRadius: 'var(--space-2xs)',
                  border: '1px solid var(--color-role-field-outline)',
                  color: 'var(--color-role-field-outline)',
                }}
              >
                Planned Feature
              </span>
            </div>
            <p
              className="type-body-small"
              style={{
                margin: 0,
                marginBottom: 'var(--space-md)',
                color: 'var(--color-role-on-surface)',
              }}
            >
              Proposed functionality: catalog browsing for kimonos, two-piece sets, and bubu gowns, plus custom measurement intake. Deferred to later development tasks.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'center' }}>
              <button
                type="button"
                className="btn btn-outline"
                disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
                aria-disabled="true"
              >
                Catalog (Planned)
              </button>
              <span
                className="type-label-small"
                style={{ color: 'var(--color-role-field-outline)' }}
              >
                No active catalog
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          marginTop: 'var(--space-xl)',
          paddingTop: 'var(--space-md)',
          borderTop: '1px solid var(--color-role-field-outline)',
          textAlign: 'center',
        }}
      >
        <p
          className="type-body-small"
          style={{
            margin: 0,
            color: 'var(--color-role-field-outline)',
          }}
        >
          &copy; 2026 Tee’s Wardrobe. Scaffolding Phase &bull; All styling governed by design tokens.
        </p>
      </footer>
    </div>
  );
}
