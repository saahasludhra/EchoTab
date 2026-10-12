'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Layers, Clock, StickyNote, Star, Settings, Sparkles,
  ArrowRight, ExternalLink, X, RefreshCw, ChevronRight, Brain,
  History, BookMarked, Download, Upload, Moon, Sun, Shield,
} from 'lucide-react';
import { PageHero, Reveal } from '@/components/site/section';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  demoPages, demoCollections, demoSessions, demoNotes,
  timeAgo, searchExamples, type DemoPage,
} from '@/lib/demo-data';
import { search, summarize, type SearchResult } from '@/lib/search';

type View = 'search' | 'collections' | 'sessions' | 'notes' | 'recent' | 'favorites' | 'summary' | 'settings';

export default function DemoPage() {
  const [view, setView] = React.useState<View>('search');
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [selectedPage, setSelectedPage] = React.useState<DemoPage | null>(null);
  const [summary, setSummary] = React.useState('');
  const [theme, setTheme] = React.useState<'dark' | 'light'>('dark');
  const [activeCollection, setActiveCollection] = React.useState<string | null>(null);

  const runSearch = React.useCallback((q: string) => {
    setQuery(q);
    setResults(search(q, demoPages, { limit: 10 }));
  }, []);

  const openSummary = (page: DemoPage) => {
    setSelectedPage(page);
    setSummary(summarize(page.summary + ' ' + page.summary, 3));
    setView('summary');
  };

  const navItems: { id: View; label: string; icon: typeof Search }[] = [
    { id: 'search', label: 'Search', icon: Search },
    { id: 'collections', label: 'Collections', icon: Layers },
    { id: 'sessions', label: 'Sessions', icon: Clock },
    { id: 'notes', label: 'Notes', icon: StickyNote },
    { id: 'recent', label: 'Recent', icon: History },
    { id: 'favorites', label: 'Favorites', icon: Star },
    { id: 'summary', label: 'AI Summary', icon: Brain },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const isDark = theme === 'dark';

  return (
    <>
      <PageHero
        eyebrow="Live demo"
        title="Explore EchoTab without installing"
        description="A fully interactive simulation of the extension. Search, browse collections, replay sessions, read AI summaries, and tweak settings — all in your browser."
      />

      <div className="container py-12">
        {/* Simulated browser frame */}
        <Reveal>
          <div
            className={cn(
              'mx-auto max-w-5xl overflow-hidden rounded-2xl border shadow-2xl transition-colors',
              isDark ? 'border-border bg-card text-card-foreground' : 'border-slate-200 bg-white text-slate-900'
            )}
          >
            {/* Browser chrome */}
            <div className={cn('flex items-center gap-2 border-b px-4 py-3', isDark ? 'border-border bg-muted/30' : 'border-slate-200 bg-slate-50')}>
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-destructive/70" />
                <span className="h-3 w-3 rounded-full bg-warning/70" />
                <span className="h-3 w-3 rounded-full bg-success/70" />
              </div>
              <div className={cn('mx-auto flex w-full max-w-md items-center gap-2 rounded-full px-4 py-1.5 text-xs', isDark ? 'bg-background/60 text-muted-foreground' : 'bg-white text-slate-500 border border-slate-200')}>
                <span className="h-2 w-2 rounded-full bg-success" />
                chrome-extension://echotab/demo
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>

            {/* Extension body */}
            <div className={cn('grid min-h-[560px] md:grid-cols-[180px_1fr]', isDark ? '' : '')}>
              {/* Sidebar */}
              <nav className={cn('flex flex-row gap-1 overflow-x-auto border-r p-2 md:flex-col md:overflow-visible', isDark ? 'border-border' : 'border-slate-200')}>
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setView(item.id); setActiveCollection(null); }}
                    className={cn(
                      'flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      view === item.id
                        ? (isDark ? 'bg-primary/15 text-primary' : 'bg-blue-50 text-blue-600')
                        : (isDark ? 'text-muted-foreground hover:bg-muted hover:text-foreground' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900')
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="hidden md:inline">{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* Content */}
              <div className={cn('overflow-y-auto p-4 md:p-6', isDark ? '' : 'bg-slate-50/50')}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={view + (activeCollection ?? '')}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {view === 'search' && (
                      <SearchView query={query} results={results} onSearch={runSearch} onOpen={openSummary} isDark={isDark} />
                    )}
                    {view === 'collections' && (
                      <CollectionsView
                        active={activeCollection}
                        setActive={setActiveCollection}
                        onOpen={openSummary}
                        isDark={isDark}
                      />
                    )}
                    {view === 'sessions' && <SessionsView onOpen={openSummary} isDark={isDark} />}
                    {view === 'notes' && <NotesView isDark={isDark} />}
                    {view === 'recent' && <RecentView onOpen={openSummary} isDark={isDark} />}
                    {view === 'favorites' && <FavoritesView onOpen={openSummary} isDark={isDark} />}
                    {view === 'summary' && (
                      <SummaryView page={selectedPage} summary={summary} isDark={isDark} onBack={() => setView('search')} />
                    )}
                    {view === 'settings' && <SettingsView isDark={isDark} setTheme={setTheme} theme={theme} />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            This is a simulation with realistic demo data.{' '}
            <a href="/install" className="text-primary hover:underline">Install the real extension</a>{' '}
            to use it with your actual browsing.
          </p>
        </Reveal>
      </div>
    </>
  );
}

/* ---------- Sub-views ---------- */

function SearchView({ query, results, onSearch, onOpen, isDark }: {
  query: string; results: SearchResult[];
  onSearch: (q: string) => void; onOpen: (p: DemoPage) => void; isDark: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className={cn('flex items-center gap-3 rounded-xl px-4 py-3 ring-1', isDark ? 'bg-background/60 ring-border' : 'bg-white ring-slate-200')}>
        <Search className="h-5 w-5 shrink-0 text-primary" />
        <input
          autoFocus
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search your browser memory…"
          className={cn('w-full bg-transparent text-sm outline-none', isDark ? 'placeholder:text-muted-foreground' : 'placeholder:text-slate-400')}
        />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {searchExamples.map((ex) => (
          <button
            key={ex}
            onClick={() => onSearch(ex)}
            className={cn('rounded-full border px-2.5 py-1 text-[11px] transition-colors', isDark ? 'border-border text-muted-foreground hover:text-foreground' : 'border-slate-200 text-slate-500 hover:text-slate-900')}
          >
            {ex}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {!query && (
          <EmptyState icon={Search} text="Start typing to search your memory" isDark={isDark} />
        )}
        {query && results.length === 0 && (
          <EmptyState icon={Search} text="No matches. Try a suggested query." isDark={isDark} />
        )}
        {results.map((r) => (
          <DemoResultCard key={r.page.id} result={r} onOpen={onOpen} isDark={isDark} />
        ))}
      </div>
    </div>
  );
}

function DemoResultCard({ result, onOpen, isDark }: { result: SearchResult; onOpen: (p: DemoPage) => void; isDark: boolean }) {
  return (
    <div
      onClick={() => onOpen(result.page)}
      className={cn('group flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all', isDark ? 'border-transparent hover:border-border hover:bg-background/60' : 'border-transparent hover:border-slate-200 hover:bg-white')}
    >
      <img src={result.page.favIcon} alt="" className="mt-0.5 h-7 w-7 rounded-md bg-muted" onError={(e) => ((e.target as HTMLImageElement).style.visibility = 'hidden')} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{result.page.title}</p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{result.page.domain} · {timeAgo(result.page.visitedAt)}</p>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground/80">{result.page.summary}</p>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {result.page.tags.slice(0, 4).map((t) => (
            <span key={t} className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">{t}</span>
          ))}
        </div>
        {result.reasons.length > 0 && (
          <div className="mt-1.5 flex items-center gap-1 text-[10px] font-medium text-accent">
            <Sparkles className="h-3 w-3" /> {result.reasons.join(' · ')}
          </div>
        )}
      </div>
      <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
}

function CollectionsView({ active, setActive, onOpen, isDark }: {
  active: string | null; setActive: (s: string | null) => void;
  onOpen: (p: DemoPage) => void; isDark: boolean;
}) {
  if (active) {
    const pages = demoPages.filter((p) => p.collection === active);
    const col = demoCollections.find((c) => c.name === active);
    return (
      <div className="space-y-4">
        <button onClick={() => setActive(null)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronRight className="h-4 w-4 rotate-180" /> All collections
        </button>
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 rounded-full" style={{ background: col?.color }} />
          <h3 className="font-display text-xl font-bold">{active}</h3>
          <span className="text-sm text-muted-foreground">{pages.length} pages</span>
        </div>
        <div className="space-y-2">
          {pages.map((p) => (
            <DemoResultCard key={p.id} result={{ page: p, score: 0, reasons: [] }} onOpen={onOpen} isDark={isDark} />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <h3 className="font-display text-lg font-bold">Smart Collections</h3>
      <p className="text-sm text-muted-foreground">Browsing auto-grouped by topic.</p>
      {demoCollections.map((c) => {
        const count = demoPages.filter((p) => p.collection === c.name).length;
        return (
          <button
            key={c.id}
            onClick={() => setActive(c.name)}
            className={cn('flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all', isDark ? 'border-border hover:border-primary/40 hover:bg-background/60' : 'border-slate-200 hover:border-blue-300 hover:bg-white')}
          >
            <span className="h-3 w-3 rounded-full" style={{ background: c.color }} />
            <span className="flex-1 font-semibold">{c.name}</span>
            <span className="text-sm text-muted-foreground">{count} pages</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        );
      })}
    </div>
  );
}

function SessionsView({ onOpen, isDark }: { onOpen: (p: DemoPage) => void; isDark: boolean }) {
  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg font-bold">Research Sessions</h3>
      <p className="text-sm text-muted-foreground">Focused browsing, captured automatically.</p>
      {demoSessions.map((s) => (
        <div key={s.id} className={cn('rounded-xl border p-4', isDark ? 'border-border' : 'border-slate-200 bg-white')}>
          <p className="font-semibold">{s.title}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {s.tabCount} tabs · {timeAgo(s.startedAt)} · {Math.round((s.endedAt - s.startedAt) / 60000)}m
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{s.summary}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="rounded bg-accent/10 px-2 py-0.5 text-[10px] text-accent">{s.label}</span>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
              <RefreshCw className="h-3 w-3" /> Replay session
            </Button>
          </div>
          <div className="mt-3 space-y-1.5">
            {s.pageIds.map((id) => {
              const p = demoPages.find((dp) => dp.id === id);
              if (!p) return null;
              return (
                <div key={id} onClick={() => onOpen(p)} className={cn('flex cursor-pointer items-center gap-2 rounded-lg p-2 text-xs transition-colors', isDark ? 'hover:bg-background/60' : 'hover:bg-slate-100')}>
                  <img src={p.favIcon} alt="" className="h-5 w-5 rounded bg-muted" onError={(e) => ((e.target as HTMLImageElement).style.visibility = 'hidden')} />
                  <span className="truncate">{p.title}</span>
                  <ExternalLink className="ml-auto h-3 w-3 text-muted-foreground" />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function NotesView({ isDark }: { isDark: boolean }) {
  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg font-bold">Quick Notes</h3>
      <p className="text-sm text-muted-foreground">Notes attached to pages — searchable too.</p>
      {demoNotes.map((n) => (
        <div key={n.id} className={cn('rounded-xl border p-4', isDark ? 'border-border' : 'border-slate-200 bg-white')}>
          <p className="font-semibold">{n.title}</p>
          <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{n.body}</p>
          <div className="mt-2 flex items-center gap-2">
            {n.tags.map((t) => (
              <span key={t} className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">{t}</span>
            ))}
            <span className="ml-auto text-[10px] text-muted-foreground">{timeAgo(n.createdAt)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function RecentView({ onOpen, isDark }: { onOpen: (p: DemoPage) => void; isDark: boolean }) {
  const pages = [...demoPages].sort((a, b) => b.visitedAt - a.visitedAt);
  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg font-bold">Knowledge Timeline</h3>
      <p className="text-sm text-muted-foreground">Your browsing, chronologically.</p>
      <div className="space-y-2">
        {pages.map((p) => (
          <div key={p.id} className={cn('flex items-start gap-3 rounded-xl border p-3', isDark ? 'border-border' : 'border-slate-200 bg-white')}>
            <div className="flex w-20 shrink-0 flex-col items-end">
              <span className="text-xs font-medium">{timeAgo(p.visitedAt)}</span>
              <span className="text-[10px] text-muted-foreground">{p.visitCount} visits</span>
            </div>
            <div className="h-full w-px bg-border" />
            <img src={p.favIcon} alt="" className="mt-0.5 h-6 w-6 rounded bg-muted" onError={(e) => ((e.target as HTMLImageElement).style.visibility = 'hidden')} />
            <div className="min-w-0 flex-1 cursor-pointer" onClick={() => onOpen(p)}>
              <p className="truncate text-sm font-semibold">{p.title}</p>
              <p className="truncate text-xs text-muted-foreground">{p.domain}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FavoritesView({ onOpen, isDark }: { onOpen: (p: DemoPage) => void; isDark: boolean }) {
  const favs = demoPages.filter((p) => p.visitCount >= 5).slice(0, 6);
  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg font-bold">Favorite Pages</h3>
      <p className="text-sm text-muted-foreground">Pages you keep coming back to.</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {favs.map((p) => (
          <div key={p.id} onClick={() => onOpen(p)} className={cn('flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all', isDark ? 'border-border hover:bg-background/60' : 'border-slate-200 hover:bg-white')}>
            <Star className="h-4 w-4 text-warning" />
            <img src={p.favIcon} alt="" className="h-6 w-6 rounded bg-muted" onError={(e) => ((e.target as HTMLImageElement).style.visibility = 'hidden')} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{p.title}</p>
              <p className="truncate text-xs text-muted-foreground">{p.visitCount} visits</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryView({ page, summary, isDark, onBack }: {
  page: DemoPage | null; summary: string; isDark: boolean; onBack: () => void;
}) {
  if (!page) {
    return <EmptyState icon={Brain} text="Open a page to generate an AI summary" isDark={isDark} />;
  }
  return (
    <div className="space-y-4">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronRight className="h-4 w-4 rotate-180" /> Back
      </button>
      <div className={cn('rounded-xl border p-5', isDark ? 'border-border' : 'border-slate-200 bg-white')}>
        <div className="flex items-center gap-3">
          <img src={page.favIcon} alt="" className="h-8 w-8 rounded-lg bg-muted" onError={(e) => ((e.target as HTMLImageElement).style.visibility = 'hidden')} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{page.title}</p>
            <p className="text-xs text-muted-foreground">{page.domain}</p>
          </div>
        </div>
        <div className="mt-4 rounded-lg bg-primary/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5" /> AI Summary
          </div>
          <p className="text-sm leading-relaxed">{summary}</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {page.tags.map((t) => (
            <span key={t} className="rounded bg-primary/10 px-2 py-0.5 text-[10px] text-primary">{t}</span>
          ))}
          <span className="rounded bg-accent/10 px-2 py-0.5 text-[10px] text-accent">{page.collection}</span>
        </div>
        <div className="mt-4 flex gap-2">
          <a href={page.url} target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline" className="gap-1">Visit page <ExternalLink className="h-3 w-3" /></Button>
          </a>
        </div>
      </div>
    </div>
  );
}

function SettingsView({ isDark, theme, setTheme }: { isDark: boolean; theme: 'dark' | 'light'; setTheme: (t: 'dark' | 'light') => void }) {
  const [toggles, setToggles] = React.useState({
    semanticSearch: true,
    autoSummary: true,
    trackSessions: true,
    privacyMode: false,
  });
  const Toggle = ({ k, label, hint }: { k: keyof typeof toggles; label: string; hint: string }) => (
    <div className={cn('flex items-center justify-between rounded-xl border p-4', isDark ? 'border-border' : 'border-slate-200 bg-white')}>
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <button
        onClick={() => setToggles((t) => ({ ...t, [k]: !t[k] }))}
        className={cn('relative h-6 w-11 rounded-full transition-colors', toggles[k] ? 'bg-primary' : isDark ? 'bg-muted' : 'bg-slate-300')}
      >
        <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform', toggles[k] ? 'translate-x-[22px]' : 'translate-x-0.5')} />
      </button>
    </div>
  );
  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg font-bold">Settings</h3>
      <Toggle k="semanticSearch" label="Semantic search" hint="Rank by meaning, not keywords" />
      <Toggle k="autoSummary" label="Auto page summaries" hint="Generate a local summary per page" />
      <Toggle k="trackSessions" label="Track research sessions" hint="Detect focused browsing" />
      <Toggle k="privacyMode" label="Privacy mode" hint="Pause all indexing" />
      <div className={cn('flex items-center justify-between rounded-xl border p-4', isDark ? 'border-border' : 'border-slate-200 bg-white')}>
        <div>
          <p className="text-sm font-semibold">Theme</p>
          <p className="text-xs text-muted-foreground">Popup & settings appearance</p>
        </div>
        <div className="flex gap-2">
          {(['dark', 'light'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={cn('flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors', theme === t ? 'bg-primary text-primary-foreground' : isDark ? 'bg-muted text-muted-foreground' : 'bg-slate-100 text-slate-500')}
            >
              {t === 'dark' ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />} {t}
            </button>
          ))}
        </div>
      </div>
      <div className={cn('flex items-center justify-between rounded-xl border p-4', isDark ? 'border-border' : 'border-slate-200 bg-white')}>
        <div>
          <p className="text-sm font-semibold">Data</p>
          <p className="text-xs text-muted-foreground">Export or reset your memory</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-1"><Download className="h-3 w-3" /> Export</Button>
          <Button size="sm" variant="outline" className="gap-1"><Upload className="h-3 w-3" /> Import</Button>
        </div>
      </div>
      <div className={cn('flex items-center gap-3 rounded-xl border border-success/30 bg-success/5 p-4', isDark ? '' : '')}>
        <Shield className="h-5 w-5 text-success" />
        <p className="text-xs text-muted-foreground">All settings apply instantly and stay on your device.</p>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, text, isDark }: { icon: typeof Search; text: string; isDark: boolean }) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <Icon className={cn('h-8 w-8 mb-3', isDark ? 'text-muted-foreground/50' : 'text-slate-300')} />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
