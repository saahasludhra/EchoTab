'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  BookOpen, Download, Keyboard, Shield, AlertTriangle, Map,
  Puzzle, Code2, Server, Database, Search, ArrowRight, Check,
} from 'lucide-react';
import { PageHero, Reveal, SectionHeading } from '@/components/site/section';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const sections = [
  { id: 'install', label: 'Installation', icon: Download },
  { id: 'features', label: 'Features', icon: Puzzle },
  { id: 'permissions', label: 'Permissions', icon: Shield },
  { id: 'apis', label: 'Browser APIs', icon: Code2 },
  { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: Keyboard },
  { id: 'privacy', label: 'Privacy', icon: Shield },
  { id: 'faq', label: 'FAQ', icon: BookOpen },
  { id: 'limitations', label: 'Known Limitations', icon: AlertTriangle },
  { id: 'roadmap', label: 'Future Roadmap', icon: Map },
];

const permissions = [
  { name: 'storage', why: 'Save your settings locally with chrome.storage.local.' },
  { name: 'history', why: 'Optionally read browser history to index past visits.' },
  { name: 'bookmarks', why: 'Read and create smart bookmarks.' },
  { name: 'tabs', why: 'Index the active tab and detect research sessions.' },
  { name: 'activeTab', why: 'Access the current page title and URL on demand.' },
  { name: 'contextMenus', why: 'Add right-click "Save to EchoTab" actions.' },
  { name: 'commands', why: 'Register keyboard shortcuts for search, save, and note.' },
  { name: '<all_urls>', why: 'Content scripts run on every page to capture text and host the note composer. No data is sent anywhere.' },
];

const shortcuts = [
  { keys: 'Ctrl+Shift+E', mac: '⌘⇧E', action: 'Open the EchoTab search popup' },
  { keys: 'Ctrl+Shift+S', mac: '⌘⇧S', action: 'Save the current page to your memory' },
  { keys: 'Ctrl+Shift+N', mac: '⌘⇧N', action: 'Open the quick-note composer on the current page' },
];

const faqs = [
  { q: 'Does EchoTab send my data anywhere?', a: 'No. EchoTab makes zero network requests. Everything is stored in IndexedDB and chrome.storage.local on your device. There are no servers, no analytics, and no accounts.' },
  { q: 'Is my browsing indexed in incognito mode?', a: 'No. Incognito visits are excluded by default, and the extension does not operate in incognito contexts unless you explicitly allow it.' },
  { q: 'How does the "AI" work without a server?', a: 'EchoTab uses a local scoring engine: it extracts intent signals (time, topic, type) from your query, then weights each page across its title, tags, summary, domain, and collection. Summaries are extractive — it selects the most informative sentences from the page text.' },
  { q: 'Can I export my data?', a: 'Yes. Go to Settings → Privacy & Data → Export JSON. Your entire memory is exported as a portable JSON file you can back up or move.' },
  { q: 'Will it slow down my browser?', a: 'No. The service worker is event-driven and sleeps when idle. Search runs against local IndexedDB indexes and completes in milliseconds.' },
  { q: 'Does it work in Edge?', a: 'Yes. Any Chromium-based browser (Chrome, Edge, Brave, Arc, Vivaldi) v108+ supports loading EchoTab unpacked.' },
];

export default function DocsPage() {
  const [active, setActive] = React.useState('install');

  return (
    <>
      <PageHero
        eyebrow="Documentation"
        title="Everything you need to know"
        description="Installation, features, permissions, browser APIs, shortcuts, privacy, and limitations — all in one place."
      >
        <Link href="/install"><Button variant="outline" size="lg">Installation guide</Button></Link>
        <Link href="/architecture"><Button variant="outline" size="lg">Architecture</Button></Link>
      </PageHero>

      <div className="container py-16">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={() => setActive(s.id)}
                  className={cn(
                    'flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    active === s.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <s.icon className="h-4 w-4 shrink-0" />
                  <span className="hidden lg:inline">{s.label}</span>
                </a>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="min-w-0 space-y-16">
            <DocSection id="install" title="Installation">
              <ol className="space-y-3">
                {[
                  'Download EchoTab.zip from the Download button.',
                  'Extract the ZIP — you get an EchoTab folder containing manifest.json.',
                  'Open chrome://extensions (or edge://extensions).',
                  'Enable Developer mode in the top-right.',
                  'Click "Load unpacked" and select the EchoTab folder.',
                  'Pin EchoTab and press Ctrl+Shift+E to search.',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{i + 1}</span>
                    <span className="text-sm text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-sm text-muted-foreground">
                Need visuals? See the <Link href="/install" className="text-primary hover:underline">interactive installation guide</Link>.
              </p>
            </DocSection>

            <DocSection id="features" title="Features">
              <p className="text-sm text-muted-foreground">
                EchoTab includes {`16+`} features across four systems: search &amp; intelligence, organization, sessions &amp; notes, and control &amp; privacy. See the <Link href="/features" className="text-primary hover:underline">full features page</Link> for details, or <Link href="/demo" className="text-primary hover:underline">try them live</Link>.
              </p>
            </DocSection>

            <DocSection id="permissions" title="Permissions">
              <p className="mb-4 text-sm text-muted-foreground">Each permission is scoped to a specific function. Nothing is sent over the network.</p>
              <div className="space-y-2">
                {permissions.map((p) => (
                  <div key={p.name} className="rounded-xl border border-border bg-card p-4">
                    <p className="font-mono text-sm font-semibold text-primary">{p.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{p.why}</p>
                  </div>
                ))}
              </div>
            </DocSection>

            <DocSection id="apis" title="Browser APIs used">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { icon: Server, name: 'Service Worker', d: 'Background indexing, sessions, messaging' },
                  { icon: Code2, name: 'Content Scripts', d: 'On-page note composer & text capture' },
                  { icon: Database, name: 'IndexedDB', d: 'Structured local storage, 7 stores' },
                  { icon: Search, name: 'Search Engine', d: 'Local semantic ranking + summarizer' },
                ].map((a) => (
                  <div key={a.name} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                    <a.icon className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-sm font-semibold">{a.name}</p>
                      <p className="text-xs text-muted-foreground">{a.d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Full data-flow diagrams on the <Link href="/architecture" className="text-primary hover:underline">architecture page</Link>.
              </p>
            </DocSection>

            <DocSection id="shortcuts" title="Keyboard shortcuts">
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Action</th>
                      <th className="px-4 py-3 text-left font-semibold">Windows / Linux</th>
                      <th className="px-4 py-3 text-left font-semibold">macOS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shortcuts.map((s) => (
                      <tr key={s.action} className="border-t border-border">
                        <td className="px-4 py-3 text-muted-foreground">{s.action}</td>
                        <td className="px-4 py-3"><kbd className="rounded bg-muted px-2 py-1 font-mono text-xs">{s.keys}</kbd></td>
                        <td className="px-4 py-3"><kbd className="rounded bg-muted px-2 py-1 font-mono text-xs">{s.mac}</kbd></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Reassign at chrome://extensions/shortcuts.</p>
            </DocSection>

            <DocSection id="privacy" title="Privacy">
              <ul className="space-y-2.5">
                {[
                  'No network requests at any point.',
                  'All data in IndexedDB + chrome.storage.local on your device.',
                  'Privacy mode pauses indexing instantly.',
                  'Incognito visits are never indexed.',
                  'Export or wipe your memory anytime.',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {t}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                Read the full <Link href="/privacy" className="text-primary hover:underline">privacy promise</Link>.
              </p>
            </DocSection>

            <DocSection id="faq" title="FAQ">
              <div className="space-y-3">
                {faqs.map((f) => (
                  <details key={f.q} className="group rounded-xl border border-border bg-card p-4">
                    <summary className="flex cursor-pointer items-center justify-between font-medium">
                      {f.q}
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
                  </details>
                ))}
              </div>
            </DocSection>

            <DocSection id="limitations" title="Known limitations">
              <ul className="space-y-2.5">
                {[
                  'Summaries are extractive (sentence selection), not generative — no LLM runs locally by default.',
                  'Semantic matching uses lexical + heuristic scoring; a full embedding model is on the roadmap.',
                  'Session detection is time-gap based; tab-tree reconstruction is planned.',
                  'Very long pages may truncate captured text at 8000 characters.',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" /> {t}
                  </li>
                ))}
              </ul>
            </DocSection>

            <DocSection id="roadmap" title="Future roadmap">
              <p className="text-sm text-muted-foreground">
                See the <Link href="/roadmap" className="text-primary hover:underline">roadmap page</Link> for what is planned next, including local embeddings, tab-tree sessions, and a command palette.
              </p>
            </DocSection>
          </div>
        </div>
      </div>
    </>
  );
}

function DocSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="font-display text-2xl font-bold tracking-tight">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
