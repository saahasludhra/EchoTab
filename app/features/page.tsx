'use client';

import Link from 'next/link';
import {
  Search, Layers, Brain, Clock, Bookmark, StickyNote, History,
  Star, RefreshCw, Settings, Keyboard, Shield, Download, Upload,
  Moon, Tag, ArrowRight, Zap, FileText, BookMarked,
} from 'lucide-react';
import { PageHero, Reveal, SectionHeading } from '@/components/site/section';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DownloadButton } from '@/components/site/download-button';

const groups = [
  {
    name: 'Search & Intelligence',
    color: 'from-primary/20 to-accent/10',
    features: [
      { icon: Search, title: 'Semantic Search', desc: 'Type natural sentences like "the React article I read yesterday." EchoTab ranks results by meaning, recency, topic, and content type — not just keyword matches.' },
      { icon: Brain, title: 'AI Page Summary', desc: 'Every page you visit gets a local extractive summary. Summaries are indexed, so you can search the gist of what you read, not just the title.' },
      { icon: History, title: 'Search History', desc: 'Your past queries are saved and re-runnable. Find that thing you found last week, again.' },
      { icon: Tag, title: 'Smart Tagging', desc: 'Pages are auto-tagged by domain, topic, and type so filtering is one click away.' },
    ],
  },
  {
    name: 'Organization',
    color: 'from-accent/20 to-chart-5/10',
    features: [
      { icon: Layers, title: 'Smart Collections', desc: 'Browsing is automatically grouped into thematic collections — Frontend Fundamentals, AI Research, CS Coursework — based on the topics you actually read.' },
      { icon: Bookmark, title: 'Smart Bookmarking', desc: 'Replace brittle folder trees with a contextual memory. Save a page and EchoTab connects it to related pages automatically.' },
      { icon: Clock, title: 'Knowledge Timeline', desc: 'See your browsing as a chronological timeline. Scroll back through what you learned and when.' },
      { icon: Star, title: 'Favorite Pages', desc: 'Pin pages you keep returning to. Favorites are surfaced first in relevant searches.' },
    ],
  },
  {
    name: 'Sessions & Notes',
    color: 'from-success/20 to-primary/10',
    features: [
      { icon: Clock, title: 'Research Sessions', desc: 'When you focus on a topic across several tabs, EchoTab detects it and saves the whole session with a generated summary.' },
      { icon: RefreshCw, title: 'Session Replay', desc: 'Reopen an entire research session at once — every tab, restored in context.' },
      { icon: StickyNote, title: 'Quick Notes', desc: 'Attach notes to any page with a keyboard shortcut. Notes are searchable alongside pages.' },
      { icon: FileText, title: 'Reading History', desc: 'A dedicated view of what you read, how long you spent, and how often you returned.' },
    ],
  },
  {
    name: 'Control & Privacy',
    color: 'from-warning/20 to-destructive/10',
    features: [
      { icon: Settings, title: 'Settings', desc: 'A full settings page: appearance, intelligence, sessions, shortcuts, privacy, and data management.' },
      { icon: Keyboard, title: 'Keyboard Shortcuts', desc: 'Open search, save a page, or drop a quick note without touching the mouse.' },
      { icon: Shield, title: 'Privacy Controls', desc: 'Privacy mode pauses indexing instantly. Incognito is excluded by default. Nothing leaves your device.' },
      { icon: Download, title: 'Import & Export', desc: 'Your data is open JSON. Export your entire memory and take it anywhere.' },
      { icon: Moon, title: 'Dark Mode', desc: 'Dark, light, or follow your system — across the popup and the settings page.' },
    ],
  },
];

const allCount = groups.reduce((a, g) => a + g.features.length, 0);

export default function FeaturesPage() {
  return (
    <>
      <PageHero
        eyebrow={`${allCount} features · 4 systems`}
        title="Everything your browser forgot to remember"
        description="EchoTab is a complete memory layer for your browser — search, organize, summarize, and replay, all on-device."
      >
        <DownloadButton size="lg" />
        <Link href="/demo">
          <Button variant="outline" size="lg">Try the live demo</Button>
        </Link>
      </PageHero>

      <div className="container space-y-24 py-20">
        {groups.map((group, gi) => (
          <section key={group.name}>
            <SectionHeading
              align="left"
              eyebrow={<span className="font-mono normal-case">0{gi + 1}</span>}
              title={group.name}
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {group.features.map((f, i) => (
                <Reveal key={f.title} delay={(i % 2) * 0.06}>
                  <Card className={`group h-full bg-gradient-to-br ${group.color} p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-glow`}>
                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-background/60 text-primary ring-1 ring-border transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <f.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                  </Card>
                </Reveal>
              ))}
            </div>
          </section>
        ))}

        <Reveal>
          <Card className="flex flex-col items-center justify-between gap-6 border-primary/20 p-10 md:flex-row md:p-12">
            <div>
              <h3 className="font-display text-2xl font-bold">Ready to remember everything?</h3>
              <p className="mt-2 text-muted-foreground">Download the extension and load it in Chrome or Edge in under two minutes.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <DownloadButton size="lg" />
              <Link href="/install">
                <Button variant="outline" size="lg" className="gap-2">
                  Install guide <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </Reveal>
      </div>
    </>
  );
}
