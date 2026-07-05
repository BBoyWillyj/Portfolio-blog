import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { AuthProvider } from '@/hooks/useAuth';
import '@/styles/global.css';

// Optimize fonts natively using Next.js Built-in Font Pipeline
const sansFont = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const monoFont = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

// Production SEO Config Framework (Server Component Layer)
export const metadata: Metadata = {
  title: {
    template: '%s | Joshua Oluwafeidabira Williams Portfolio',
    default: 'Joshua Oluwafeidabira Williams | Premium Full-Stack Portfolio & CMS',
  },
  description: 'Production-grade software engineering portfolio and Medium-style blogging application.',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${sansFont.variable} ${monoFont.variable}`}>
      <body className="bg-brand-background text-brand-foreground antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <main className="flex-grow">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}