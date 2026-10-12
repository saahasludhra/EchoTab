'use client';

import { GitBranch, Check } from 'lucide-react';
import { PageHero, Reveal } from '@/components/site/section';
import { Card } from '@/components/ui/card';

const releases = [
  {
    version: '1.0.0',
    date: '2026-07-30',
    tag: 'Initial release',
    added: [
      'Semantic search over browser history with intent-aware ranking (time, topic, type).',
      'Smart collections: auto-grouping of browsing into thematic collections.',
      'AI page summary: local extractive summarization for every indexed page.',
      'Research sessions: automatic detection and capture of focused browsing.',
      'Knowledge timeline: chronological browsing view.',
      'Search history with re-run support.',
      'Quick notes attached to any page via keyboard shortcut.',
      'Favorite pages pinning.',
      'Session replay to reopen a whole research session.',
      'Import & export of all data as JSON.',
      'Dark, light, and system themes.',
      'Privacy mode and incognito exclusion.',
      'Realistic demo data seeded on first install.',
      'Keyboard shortcuts: open search, save page, quick note.',
      'Context menu actions: save, note, smart bookmark.',
      'Full settings page (general, sessions, shortcuts, privacy, about).',
    ],
    fixed: [],
    changed: [],
    known: [
      'Summaries are extractive, not generative.',
      'Semantic matching uses heuristic scoring; embeddings are on the roadmap.',
      'Session detection is time-gap based.',
      'Long pages may truncate captured text at 8000 chars.',
    ],
  },
];

export default function ChangelogPage() {
  return (
    <>
      <PageHero
        eyebrow="Changelog"
        title="What changed, and when"
        description="A transparent record of every EchoTab release."
      />
      <div className="container max-w-3xl py-16">
        <div className="relative space-y-12 border-l border-border pl-8">
          {releases.map((r) => (
            <Reveal key={r.version}>
              <div className="relative">
                <span className="absolute -left-[41px] flex h-7 w-7 items-center justify-center rounded-full border-2 border-border bg-background">
                  <GitBranch className="h-3.5 w-3.5 text-primary" />
                </span>
                <Card className="p-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-display text-2xl font-bold">v{r.version}</h2>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{r.tag}</span>
                    <span className="ml-auto font-mono text-sm text-muted-foreground">{r.date}</span>
                  </div>

                  {r.added.length > 0 && (
                    <div className="mt-6">
                      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-success">Added</h3>
                      <ul className="space-y-2">
                        {r.added.map((a) => (
                          <li key={a} className="flex items-start gap-2.5 text-sm">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                            <span className="text-muted-foreground">{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {r.known.length > 0 && (
                    <div className="mt-6 rounded-lg border border-warning/30 bg-warning/5 p-4">
                      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-warning">Known limitations</h3>
                      <ul className="space-y-1.5">
                        {r.known.map((k) => (
                          <li key={k} className="text-sm text-muted-foreground">• {k}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}
