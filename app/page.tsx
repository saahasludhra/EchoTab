'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  Sparkles,
  Shield,
  Bookmark,
  Clock,
  StickyNote,
  Layers,
  Zap,
  ArrowRight,
  Check,
  Brain,
  Network,
  Lock,
} from 'lucide-react';
import { Reveal, SectionHeading, Eyebrow } from '@/components/site/section';
import { SearchPreview } from '@/components/site/search-preview';
import { DownloadButton } from '@/components/site/download-button';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const features = [
  {
    icon: Search,
    title: 'Semantic search',
    desc: 'Search by meaning, not keywords. Ask in plain English and get the right page.',
  },
  {
    icon: Layers,
    title: 'Smart collections',
    desc: 'Browsing is auto-grouped into themes — Frontend, AI Research, Coursework.',
  },
  {
    icon: Brain,
    title: 'AI page summaries',
    desc: 'A local summary is generated for every page you visit, instantly searchable.',
  },
  {
    icon: Clock,
    title: 'Research sessions',
    desc: 'Focused browsing is detected and saved as a replayable session.',
  },
  {
    icon: Bookmark,
    title: 'Smart bookmarks',
    desc: 'Replace folder trees with a memory that understands context.',
  },
  {
    icon: StickyNote,
    title: 'Quick notes',
    desc: 'Attach notes to any page with a keyboard shortcut. They search too.',
  },
];

const stats = [
  { value: '100%', label: 'Local & private' },
  { value: '15+', label: 'Features' },
  { value: '0', label: 'Network calls' },
  { value: 'MV3', label: 'Manifest V3' },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-aurora opacity-80" />
        <div className="absolute inset-0 bg-grid mask-fade-b opacity-25" />
        <div className="container relative pt-20 pb-16 md:pt-28 md:pb-24">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <Eyebrow>
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-glow" />
                v1.0.0 · Privacy-first browser memory
              </Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
                Your browser,
                <br />
                <span className="text-gradient">but with a memory.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
                EchoTab turns your history, bookmarks, tabs, and notes into an
                intelligent, searchable memory. Search naturally. Organize
                automatically. Stay completely private.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <DownloadButton size="lg" />
                <Link href="/demo">
                  <Button variant="outline" size="lg" className="gap-2">
                    Try the live demo
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-4 text-sm text-muted-foreground">
                No account needed · Works in Chrome &amp; Edge · 100% on-device
              </p>
            </Reveal>
          </div>

          {/* Interactive search showcase */}
          <Reveal delay={0.25} className="mt-16">
            <div className="mx-auto flex max-w-5xl flex-col items-center">
              <div className="mb-5 flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-accent" />
                Watch it search — or type your own query
              </div>
              <SearchPreview />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats band */}
      <section className="border-y border-border/40 bg-background/40">
        <div className="container py-10">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.05}>
                <div className="text-center">
                  <div className="font-display text-3xl font-bold text-gradient md:text-4xl">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Problem → solution */}
      <section className="container py-24">
        <SectionHeading
          eyebrow="Why EchoTab"
          title="Bookmarks forgot why you saved them"
          description="You visit hundreds of pages a week. Weeks later, you remember the idea — not the URL. EchoTab bridges that gap with a memory that understands what you read."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <Reveal>
            <Card className="h-full border-destructive/20 bg-destructive/5 p-8">
              <h3 className="mb-4 flex items-center gap-2 font-display text-xl font-semibold">
                <span className="text-destructive">Without EchoTab</span>
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {[
                  'Endless bookmark folders you never reopen',
                  'Browser history you scroll and never find',
                  'You forget the article existed',
                  'No context for why a page mattered',
                  'Tabs lost when the session ends',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-destructive/60" />
                    {t}
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
          <Reveal delay={0.1}>
            <Card className="h-full border-success/20 bg-success/5 p-8">
              <h3 className="mb-4 flex items-center gap-2 font-display text-xl font-semibold">
                <span className="text-success">With EchoTab</span>
              </h3>
              <ul className="space-y-3 text-sm text-foreground">
                {[
                  '“Show me the React article I read yesterday”',
                  'Auto-organized into collections',
                  'AI summary of every page',
                  'Research sessions you can replay',
                  'Notes that search like the pages',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    {t}
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* Features grid */}
      <section className="border-y border-border/40 bg-background/40">
        <div className="container py-24">
          <SectionHeading
            eyebrow="Features"
            title="A full memory stack for your browser"
            description="Sixteen features that work together as one cohesive system."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 0.05}>
                <Card className="group h-full p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-glow">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </Card>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1} className="mt-10 text-center">
            <Link href="/features">
              <Button variant="outline" className="gap-2">
                Explore all features
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Privacy */}
      <section className="container py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Privacy-first"
              title={
                <>
                  Your browsing never
                  <br />
                  leaves your browser
                </>
              }
              description="No accounts. No servers. No analytics. EchoTab runs entirely on your device using IndexedDB and local storage. Your memory is yours alone."
            />
            <Reveal delay={0.1} className="mt-8 space-y-4">
              {[
                { icon: Lock, t: 'Zero network requests', d: 'Nothing is sent anywhere, ever.' },
                { icon: Shield, t: 'Privacy mode', d: 'Pause indexing instantly with one toggle.' },
                { icon: Network, t: 'Export anytime', d: 'Your data is portable JSON, not a walled garden.' },
              ].map((item) => (
                <div key={item.t} className="flex items-start gap-3">
                  <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-success/10 text-success">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">{item.t}</p>
                    <p className="text-sm text-muted-foreground">{item.d}</p>
                  </div>
                </div>
              ))}
            </Reveal>
            <Reveal delay={0.15} className="mt-8">
              <Link href="/privacy">
                <Button variant="ghost" className="gap-2">
                  Read the privacy promise
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <div className="relative">
              <div className="absolute -inset-4 bg-aurora opacity-40 blur-2xl" />
              <Card className="relative overflow-hidden p-8">
                <div className="flex items-center gap-3 border-b border-border pb-4">
                  <Shield className="h-8 w-8 text-success" />
                  <div>
                    <p className="font-display font-semibold">Privacy status</p>
                    <p className="text-xs text-muted-foreground">Active protection</p>
                  </div>
                  <span className="ml-auto inline-flex h-2.5 w-2.5 rounded-full bg-success animate-pulse-glow" />
                </div>
                <div className="mt-4 space-y-3">
                  {[
                    ['Data location', 'On this device'],
                    ['Network calls', '0'],
                    ['Accounts required', 'None'],
                    ['Incognito tracked', 'Never'],
                    ['Export format', 'Open JSON'],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-center justify-between rounded-lg bg-background/40 px-4 py-2.5 text-sm"
                    >
                      <span className="text-muted-foreground">{k}</span>
                      <span className="font-medium text-success">{v}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Architecture teaser */}
      <section className="border-y border-border/40 bg-background/40">
        <div className="container py-24">
          <SectionHeading
            eyebrow="Under the hood"
            title="Engineered like a real product"
            description="Manifest V3, a service worker, content scripts, IndexedDB, and a local search engine — all built with modern architecture."
          />
          <Reveal delay={0.1} className="mt-12">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                'Service Worker',
                'Content Scripts',
                'IndexedDB',
                'chrome.storage',
                'Context Menus',
                'Commands API',
                'Semantic Engine',
                'MV3',
              ].map((t, i) => (
                <motion.span
                  key={t}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-full border border-border bg-card px-4 py-2 font-mono text-xs text-muted-foreground"
                >
                  {t}
                </motion.span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.15} className="mt-10 text-center">
            <Link href="/architecture">
              <Button variant="outline" className="gap-2">
                Explore the architecture
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-24">
        <Reveal>
          <Card className="relative overflow-hidden border-primary/20 p-12 text-center shadow-glow md:p-20">
            <div className="absolute inset-0 bg-aurora opacity-50" />
            <div className="relative">
              <Zap className="mx-auto h-10 w-10 text-accent" />
              <h2 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Give your browser a memory
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Download EchoTab, load it unpacked, and start searching your
                browsing in under two minutes.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <DownloadButton size="lg" />
                <Link href="/install">
                  <Button variant="outline" size="lg">
                    Installation guide
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </Reveal>
      </section>
    </>
  );
}
