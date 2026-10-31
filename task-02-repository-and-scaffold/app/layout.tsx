import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: 'Tee’s Wardrobe — Bespoke & Ready-to-Wear Fashion',
    template: '%s | Tee’s Wardrobe',
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header
          style={{
            borderBottom: '1px solid var(--color-role-field-outline)',
          }}
        >
          <div
            className="container"
            style={{
              paddingTop: 'var(--space-md)',
              paddingBottom: 'var(--space-md)',
            }}
          >
            <Link href="/" className="type-title-large">
              Tee’s Wardrobe
            </Link>
          </div>
        </header>
        <div className="app-shell">
          {children}
        </div>
      </body>
    </html>
  );
}
