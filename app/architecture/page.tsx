'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Network, Code, Server, Database, HardDrive, Search, Monitor,
  MousePointerClick, ArrowRight, Zap, Shield, Layers, Webhook,
  Boxes, Cpu, GitBranch,
} from 'lucide-react';
import { PageHero, Reveal, SectionHeading } from '@/components/site/section';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Layer = {
  id: string;
  name: string;
  icon: typeof Network;
  color: string;
  role: string;
  details: string[];
  tech: string[];
};

const layers: Layer[] = [
  {
    id: 'ui',
    name: 'UI Layer',
    icon: Monitor,
    color: '#3b82f6',
    role: 'The surfaces users touch: the popup, the settings page, and on-page note composer.',
    details: [
      'Popup is the search-first entry point — type a natural query and get ranked results.',
      'Options page manages appearance, intelligence, sessions, shortcuts, privacy, and data.',
      'Content script injects a floating quick-note composer onto any page.',
    ],
    tech: ['HTML', 'CSS', 'Vanilla JS', 'chrome.action'],
  },
  {
    id: 'worker',
    name: 'Background Service Worker',
    icon: Server,
    color: '#06b6d4',
    role: 'The brain. Runs in the background, indexes pages, builds sessions, and answers messages.',
    details: [
      'Listens to tab activation and navigation events to index visited pages.',
      'Generates local extractive summaries on demand.',
      'Detects research sessions from tab-focus patterns and idle gaps.',
      'Hosts the messaging bridge the popup and options talk to.',
    ],
    tech: ['MV3 service worker', 'ES modules', 'chrome.tabs', 'chrome.idle'],
  },
  {
    id: 'content',
    name: 'Content Scripts',
    icon: Code,
    color: '#a855f7',
    role: 'Runs inside web pages to capture text and host the quick-note composer.',
    details: [
      'Collects a high-signal text sample from the page for summarization.',
      'Injects the quick-note floating UI triggered by keyboard shortcut.',
      'Sends page text to the service worker via chrome.runtime messaging.',
    ],
    tech: ['Content scripts', 'DOM APIs', 'Messaging bridge'],
  },
  {
    id: 'search',
    name: 'Search Engine',
    icon: Search,
    color: '#22c55e',
    role: 'A pure-JS semantic ranking engine. No network, no embeddings server.',
    details: [
      'Extracts intent signals: time, topic, and content type from the query.',
      'Scores each page across title, tags, summary, domain, and collection fields.',
      'Returns ranked results with a human-readable match reason.',
      'Includes an extractive summarizer for AI page summaries.',
    ],
    tech: ['Tokenization', 'Signal extraction', 'Weighted scoring', 'Extractive summary'],
  },
  {
    id: 'db',
    name: 'IndexedDB',
    icon: Database,
    color: '#f59e0b',
    role: 'The structured store. Pages, bookmarks, notes, sessions, collections, history.',
    details: [
      'Seven object stores with indexes on url, title, tags, and time fields.',
      'All data stays local to the extension origin — never synced.',
      'Supports bulk add, index queries, and full clear for reset.',
    ],
    tech: ['IndexedDB', '7 object stores', 'Secondary indexes'],
  },
  {
    id: 'storage',
    name: 'chrome.storage.local',
    icon: HardDrive,
    color: '#ef4444',
    role: 'Lightweight key-value store for settings and flags.',
    details: [
      'Holds user preferences: theme, semantic search, retention days, shortcuts.',
      'Tracks first-run seed flag so demo data loads once.',
      'Falls back to localStorage outside the extension context.',
    ],
    tech: ['chrome.storage.local', 'Settings schema', 'Defaults merge'],
  },
];

const apis = [
  { name: 'chrome.tabs', use: 'Index active tabs, detect sessions' },
  { name: 'chrome.history', use: 'Pull browsing history on demand' },
  { name: 'chrome.bookmarks', use: 'Read and create bookmarks' },
  { name: 'chrome.contextMenus', use: 'Right-click save / note / bookmark' },
  { name: 'chrome.commands', use: 'Keyboard shortcuts' },
  { name: 'chrome.idle', use: 'Flush sessions on idle' },
  { name: 'chrome.storage.local', use: 'Persist settings' },
  { name: 'chrome.runtime', use: 'Messaging bridge' },
];

export default function ArchitecturePage() {
  const [active, setActive] = React.useState<string>('worker');
  const current = layers.find((l) => l.id === active)!;

  return (
    <>
      <PageHero
        eyebrow="Architecture"
        title="How EchoTab is built"
        description="A modern Manifest V3 extension: a service worker, content scripts, a local search engine, and IndexedDB — all talking through a messaging bridge."
      />

      <div className="container py-20">
        {/* Layered diagram */}
        <SectionHeading
          align="left"
          eyebrow="Data flow"
          title="Six layers, one memory"
          description="Click a layer to see what it does and the technologies behind it."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          {/* Stack diagram */}
          <div className="space-y-3">
            {layers.map((l, i) => (
              <Reveal key={l.id} delay={i * 0.04}>
                <button
                  onClick={() => setActive(l.id)}
                  className={cn(
                    'group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all',
                    active === l.id ? 'border-primary/50 bg-primary/5 shadow-glow' : 'border-border hover:border-border/80'
                  )}
                >
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white transition-transform group-hover:scale-105"
                    style={{ background: l.color }}
                  >
                    <l.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{l.name}</p>
                    <p className="line-clamp-1 text-xs text-muted-foreground">{l.role}</p>
                  </div>
                  {i < layers.length - 1 && (
                    <ArrowRight className="hidden h-4 w-4 rotate-90 text-muted-foreground md:block" />
                  )}
                </button>
              </Reveal>
            ))}
          </div>

          {/* Detail panel */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
              >
                <Card className="overflow-hidden">
                  <div
                    className="flex items-center gap-3 px-6 py-5 text-white"
                    style={{ background: `linear-gradient(135deg, ${current.color}, ${current.color}99)` }}
                  >
                    <current.icon className="h-7 w-7" />
                    <div>
                      <h3 className="font-display text-xl font-bold">{current.name}</h3>
                      <p className="text-sm text-white/80">{current.role}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Responsibilities
                    </h4>
                    <ul className="space-y-2.5">
                      {current.details.map((d) => (
                        <li key={d} className="flex items-start gap-2.5 text-sm">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: current.color }} />
                          <span className="text-muted-foreground">{d}</span>
                        </li>
                      ))}
                    </ul>
                    <h4 className="mb-2 mt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Built with
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {current.tech.map((t) => (
                        <span key={t} className="rounded-full border border-border bg-muted/40 px-3 py-1 font-mono text-xs">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Messaging flow */}
        <Reveal className="mt-20">
          <Card className="p-8">
            <SectionHeading
              align="left"
              eyebrow="Messaging bridge"
              title="How the pieces talk"
              description="The popup, options, and content scripts all communicate with the service worker through chrome.runtime messaging."
            />
            <div className="mt-8 flex flex-col items-stretch gap-4 md:flex-row md:items-center">
              {[
                { icon: Monitor, label: 'Popup / Options', sub: 'sends search query' },
                { icon: Webhook, label: 'chrome.runtime', sub: 'message bridge' },
                { icon: Server, label: 'Service Worker', sub: 'queries IndexedDB' },
                { icon: Database, label: 'IndexedDB', sub: 'returns pages' },
              ].map((node, i, arr) => (
                <React.Fragment key={node.label}>
                  <div className="flex flex-1 flex-col items-center rounded-xl border border-border bg-card p-4 text-center">
                    <node.icon className="h-6 w-6 text-primary" />
                    <p className="mt-2 text-sm font-semibold">{node.label}</p>
                    <p className="text-xs text-muted-foreground">{node.sub}</p>
                  </div>
                  {i < arr.length - 1 && (
                    <ArrowRight className="hidden h-5 w-5 shrink-0 text-muted-foreground md:block" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </Card>
        </Reveal>

        {/* Browser APIs */}
        <Reveal className="mt-20">
          <SectionHeading
            eyebrow="Browser APIs"
            title="Permissions, explained"
            description="Every permission EchoTab requests and exactly why it needs it."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {apis.map((a) => (
              <div key={a.name} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                <Boxes className="h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="font-mono text-sm font-semibold">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.use}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Principles */}
        <Reveal className="mt-20">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { icon: Shield, title: 'Privacy by design', desc: 'No network code exists in the extension. Data cannot leave even if it wanted to.' },
              { icon: Zap, title: 'Local-first performance', desc: 'IndexedDB and a pure-JS engine keep queries under 10ms on thousands of pages.' },
              { icon: Layers, title: 'Modular architecture', desc: 'Storage, search, UI, and background are isolated modules with clear contracts.' },
            ].map((p) => (
              <Card key={p.title} className="p-6">
                <p.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-3 font-display font-semibold">{p.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{p.desc}</p>
              </Card>
            ))}
          </div>
        </Reveal>
      </div>
    </>
  );
}
