import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/site/navbar';
import { Footer } from '@/components/site/footer';
import { Toaster } from '@/components/ui/sonner';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#070b16' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://echotab.app'),
  title: {
    default: 'EchoTab — AI-powered memory for your browser',
    template: '%s · EchoTab',
  },
  description:
    'EchoTab turns your browser history, bookmarks, tabs, and notes into an intelligent searchable memory. Search naturally, organize automatically, and stay private.',
  keywords: [
    'EchoTab',
    'browser extension',
    'Chrome extension',
    'AI search',
    'semantic search',
    'browser history',
    'smart bookmarks',
    'knowledge timeline',
  ],
  authors: [{ name: 'Saahas Ludhra' }],
  openGraph: {
    title: 'EchoTab — AI-powered memory for your browser',
    description:
      'Turn your browser history, bookmarks, tabs, and notes into an intelligent searchable memory.',
    type: 'website',
    siteName: 'EchoTab',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EchoTab — AI-powered memory for your browser',
    description:
      'Turn your browser history, bookmarks, tabs, and notes into an intelligent searchable memory.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
          >
            Skip to content
          </a>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
