import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: 'Tee’s Wardrobe — Bespoke & Ready-to-Wear Fashion',
    template: '%s | Tee’s Wardrobe',
  },
  description: 'Bespoke & ready-to-wear clothing tailored for you.',
  keywords: ['Tee’s Wardrobe', 'ready-to-wear', 'bespoke fashion', 'bubu gowns', 'two-piece sets', 'kimonos'],
  openGraph: {
    title: 'Tee’s Wardrobe',
    description: 'Bespoke & ready-to-wear clothing tailored for you.',
    type: 'website',
    locale: 'en_NG',
    siteName: 'Tee’s Wardrobe',
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
        <div className="app-shell">
          {children}
        </div>
      </body>
    </html>
  );
}
