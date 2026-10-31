import type { Metadata } from 'next';
import Link from 'next/link';

const TAGLINE = 'Bespoke clothing, one order at a time.';

export const metadata: Metadata = {
  description: TAGLINE,
  keywords: [
    'Tee’s Wardrobe',
    'bespoke clothing',
    'ready-to-wear',
    'Nigerian fashion',
    'custom garments',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Tee’s Wardrobe',
    description: TAGLINE,
    url: '/',
    siteName: 'Tee’s Wardrobe',
    type: 'website',
    locale: 'en_NG',
    images: [
      {
        url: '/og',
        width: 1200,
        height: 630,
        alt: 'Tee’s Wardrobe',
      },
    ],
  },
};

export default function HomePage() {
  return (
    <div className="container" style={{ paddingBottom: 'var(--space-2xl)' }}>
      <main>
        <section
          style={{
            paddingTop: 'var(--space-2xl)',
            paddingBottom: 'var(--space-xl)',
          }}
        >
          <h1
            className="type-display-large"
            style={{
              margin: 0,
              maxWidth: '11ch',
              fontSize:
                'clamp(var(--type-headline-large-font-size), 10vw, var(--type-display-large-font-size))',
              lineHeight: 1.4,
              letterSpacing: '-0.04em',
              color: 'var(--color-role-on-surface)',
            }}
          >
            Every order, written down once.
          </h1>
          <p
            className="type-body-large"
            style={{
              margin: 0,
              marginTop: 'var(--space-md)',
              color: 'var(--color-role-field-outline)',
            }}
          >
            {TAGLINE}
          </p>
          <div style={{ marginTop: 'var(--space-lg)' }}>
            <Link
              href="/orders/new"
              className="btn btn-primary"
              style={{ display: 'inline-block' }}
            >
              New order
            </Link>
          </div>
        </section>
      </main>

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
          &copy; 2026 Tee’s Wardrobe.
        </p>
      </footer>
    </div>
  );
}
