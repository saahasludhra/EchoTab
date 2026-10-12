'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Map, CheckCircle2, Circle, ArrowRight, Sparkles, Brain, Layers,
  Search, Cpu, Zap, GitBranch, Users,
} from 'lucide-react';
import { PageHero, Reveal, SectionHeading } from '@/components/site/section';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Item = { title: string; desc: string };
type Phase = {
  status: 'done' | 'next' | 'planned';
  title: string;
  date: string;
  icon: typeof Map;
  items: Item[];
};

const phases: Phase[] = [
  {
    status: 'done',
    title: 'v1.0 — Foundation',
    date: 'Shipped',
    icon: CheckCircle2,
    items: [
      { title: 'Semantic search engine', desc: 'Intent-aware local ranking by time, topic, and type.' },
      { title: 'Smart collections', desc: 'Auto-grouping browsing into themes.' },
      { title: 'AI page summaries', desc: 'Extractive local summarization.' },
      { title: 'Research sessions', desc: 'Detection, capture, and replay.' },
      { title: 'Quick notes & favorites', desc: 'Searchable notes and pinned pages.' },
      { title: 'Privacy controls', desc: 'Privacy mode, incognito exclusion, export.' },
    ],
  },
  {
    status: 'next',
    title: 'v1.1 — Intelligence',
    date: 'Next up',
    icon: Brain,
    items: [
      { title: 'Local embeddings', desc: 'Run a small embedding model in-browser via WebAssembly for true vector semantic search.' },
      { title: 'Incremental re-indexing', desc: 'Re-score only changed pages for faster updates.' },
      { title: 'Natural-language collections', desc: 'Ask "group my AI reading" and EchoTab builds the collection dynamically.' },
      { title: 'Cross-device sync (opt-in)', desc: 'End-to-end encrypted sync between your browsers — never on a plain server.' },
    ],
  },
  {
    status: 'planned',
    title: 'v1.2 — Power features',
    date: 'Planned',
    icon: Zap,
    items: [
      { title: 'Command palette', desc: 'A Raycast-style command palette over pages, notes, sessions, and actions.' },
      { title: 'Tab-tree sessions', desc: 'Reconstruct the actual tab ancestry tree, not just time gaps.' },
      { title: 'Annotation highlights', desc: 'Highlight text on any page and search your highlights.' },
      { title: 'Scheduled digests', desc: 'Weekly "what you learned" summary generated locally.' },
    ],
  },
  {
    status: 'planned',
    title: 'v1.3 — Platform',
    date: 'Planned',
    icon: Layers,
    items: [
      { title: 'Firefox port', desc: 'Bring EchoTab to Firefox via WebExtension APIs.' },
      { title: 'Plugin API', desc: 'Let developers add custom indexers and collection rules.' },
      { title: 'Knowledge graph view', desc: 'Visualize how pages, notes, and sessions connect.' },
      { title: 'Public stats dashboard', desc: 'See your reading trends over time — all local.' },
    ],
  },
];

const statusStyle = {
  done: { ring: 'border-success/40 bg-success/5', badge: 'bg-success/10 text-success', dot: 'bg-success' },
  next: { ring: 'border-primary/40 bg-primary/5', badge: 'bg-primary/10 text-primary', dot: 'bg-primary' },
  planned: { ring: 'border-border bg-card', badge: 'bg-muted text-muted-foreground', dot: 'bg-muted-foreground' },
};

export default function RoadmapPage() {
  return (
    <>
      <PageHero
        eyebrow="Roadmap"
        title="Where EchoTab is going"
        description="A transparent look at what shipped, what is next, and what is planned."
      />

      <div className="container py-20">
        {/* Legend */}
        <Reveal className="mb-12 flex flex-wrap items-center justify-center gap-6">
          {[
            { label: 'Shipped', s: 'done' as const },
            { label: 'Next up', s: 'next' as const },
            { label: 'Planned', s: 'planned' as const },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-2 text-sm">
              <span className={cn('h-2.5 w-2.5 rounded-full', statusStyle[l.s].dot)} />
              <span className="text-muted-foreground">{l.label}</span>
            </div>
          ))}
        </Reveal>

        <div className="relative mx-auto max-w-3xl">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 h-full w-px bg-border md:left-1/2" />

          <div className="space-y-12">
            {phases.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.05}>
                <div className={cn('relative flex', i % 2 === 0 ? 'md:justify-start' : 'md:justify-end')}>
                  {/* dot */}
                  <span className={cn('absolute left-4 top-6 z-10 h-3 w-3 -translate-x-1/2 rounded-full ring-4 ring-background md:left-1/2', statusStyle[p.status].dot)} />
                  <Card className={cn('ml-12 w-full p-6 md:ml-0 md:w-[calc(50%-2rem)]', statusStyle[p.status].ring)}>
                    <div className="flex items-center gap-3">
                      <p.icon className="h-5 w-5 text-primary" />
                      <h3 className="font-display text-lg font-bold">{p.title}</h3>
                      <span className={cn('ml-auto rounded-full px-2.5 py-0.5 text-[11px] font-medium', statusStyle[p.status].badge)}>
                        {p.date}
                      </span>
                    </div>
                    <ul className="mt-4 space-y-3">
                      {p.items.map((item) => (
                        <li key={item.title} className="flex items-start gap-2.5">
                          {p.status === 'done' ? (
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                          ) : (
                            <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40" />
                          )}
                          <div>
                            <p className="text-sm font-medium">{item.title}</p>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-16">
          <Card className="flex flex-col items-center gap-4 p-10 text-center">
            <Sparkles className="h-8 w-8 text-accent" />
            <h3 className="font-display text-2xl font-bold">The north star</h3>
            <p className="max-w-xl text-muted-foreground">
              A browser that genuinely remembers what you learn — privately, locally,
              and intelligently. Every roadmap item serves that goal.
            </p>
          </Card>
        </Reveal>
      </div>
    </>
  );
}
