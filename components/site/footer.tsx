'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Github, Twitter, Mail, ArrowUpRight, ArrowUp } from 'lucide-react';
import { Logo } from '@/components/site/logo';
import { navItems, siteConfig } from '@/lib/site';

export function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const year = new Date().getFullYear();

  // Monitor scroll position to toggle the scroll-to-top button
  useEffect(() => {
    const checkScrollPosition = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', checkScrollPosition);
    return () => window.removeEventListener('scroll', checkScrollPosition);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="relative mt-24 border-t border-border/60 bg-background/40">
      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <Logo className="h-9 w-9" />
              <span className="font-display text-xl font-bold tracking-tight">
                Echo<span className="text-gradient-accent">Tab</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">
              {siteConfig.tagline}. Everything runs locally on your device — your
              browsing never leaves your browser.
            </p>
            <div className="flex items-center gap-2">
              <Link
                href="/contact"
                aria-label="Contact"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail className="h-4 w-4" />
              </Link>
              <a
                href="#"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Product</h3>
            <ul className="space-y-2.5 text-sm">
              {navItems.slice(1, 5).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Resources</h3>
            <ul className="space-y-2.5 text-sm">
              {navItems.slice(5, 9).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Company</h3>
            <ul className="space-y-2.5 text-sm">
              {navItems.slice(9).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                    {item.href === '/creator' && (
                      <ArrowUpRight className="h-3 w-3 opacity-60" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-8 text-sm text-muted-foreground md:flex-row md:items-center">
          <p>
            © {year} EchoTab. Built by {siteConfig.creator.name} & iConifer Web Solutions.
          </p>
          <p className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-success animate-pulse-glow" />
            v{siteConfig.version} · Privacy-first · 100% local
          </p>
        </div>
      </div>

      {/* Floating Scroll-to-Top Button (Bottom-Right Corner) */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background/80 backdrop-blur-md text-foreground shadow-lg shadow-black/20 hover:bg-accent hover:text-accent-foreground transition-all duration-300"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}
    </footer>
  );
}