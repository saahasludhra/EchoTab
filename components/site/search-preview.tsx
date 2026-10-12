'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { demoPages, timeAgo, searchExamples } from '@/lib/demo-data';
import { search, type SearchResult } from '@/lib/search';
import { cn } from '@/lib/utils';

export function SearchPreview({ className }: { className?: string }) {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [active, setActive] = React.useState(false);
  const [typing, setTyping] = React.useState(false);

  // Auto-cycling demo
  React.useEffect(() => {
    let i = 0;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const typeQuery = (text: string, done: () => void) => {
      setTyping(true);
      setQuery('');
      let j = 0;
      const tick = () => {
        if (cancelled) return;
        if (j <= text.length) {
          setQuery(text.slice(0, j));
          j++;
          timer = setTimeout(tick, 45 + Math.random() * 50);
        } else {
          setTyping(false);
          done();
        }
      };
      tick();
    };

    const runCycle = () => {
      if (cancelled || active) return;
      const ex = searchExamples[i % searchExamples.length];
      typeQuery(ex, () => {
        const r = search(ex, demoPages, { limit: 4 });
        setResults(r);
        timer = setTimeout(() => {
          if (!active && !cancelled) {
            setResults([]);
            i++;
            timer = setTimeout(runCycle, 700);
          }
        }, 4200);
      });
    };

    if (!active) runCycle();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const handleInput = (val: string) => {
    setActive(true);
    setQuery(val);
    setResults(search(val, demoPages, { limit: 5 }));
  };

  const reset = () => {
    setActive(false);
    setQuery('');
    setResults([]);
  };

  return (
    <div
      className={cn(
        'relative w-full max-w-xl rounded-2xl border border-border/70 bg-card/80 p-3 shadow-glow backdrop-blur-xl',
        className
      )}
    >
      <div className="flex items-center gap-3 rounded-xl bg-background/60 px-4 py-3 ring-1 ring-border/60">
        <Search className="h-5 w-5 shrink-0 text-primary" />
        <input
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={reset}
          placeholder="Search your browser memory…"
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          aria-label="Search demo"
        />
        {typing && (
          <span className="h-4 w-px animate-pulse bg-primary" />
        )}
        <kbd className="hidden rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:block">
          ⌘K
        </kbd>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {searchExamples.map((ex) => (
          <button
            key={ex}
            onClick={() => handleInput(ex)}
            className="rounded-full border border-border/60 bg-background/40 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            {ex}
          </button>
        ))}
      </div>

      <div className="mt-3 space-y-1.5">
        <AnimatePresence mode="popLayout">
          {results.length === 0 && !typing && query && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-3 py-6 text-center text-sm text-muted-foreground"
            >
              No matches. Try a suggested query above.
            </motion.div>
          )}
          {results.map((r, i) => (
            <motion.a
              key={r.page.id}
              href={r.page.url}
              target="_blank"
              rel="noopener noreferrer"
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="group flex items-start gap-3 rounded-xl border border-transparent p-3 transition-colors hover:border-border hover:bg-background/60"
            >
              <img
                src={r.page.favIcon}
                alt=""
                className="mt-0.5 h-7 w-7 rounded-md bg-muted"
                onError={(e) => ((e.target as HTMLImageElement).style.visibility = 'hidden')}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {r.page.title}
                  </p>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {r.page.domain}
                  <span className="mx-1.5">·</span>
                  <Clock className="mr-1 inline h-3 w-3" />
                  {timeAgo(r.page.visitedAt)}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground/80">
                  {r.page.summary}
                </p>
                {r.reasons.length > 0 && (
                  <div className="mt-1.5 flex items-center gap-1 text-[10px] font-medium text-accent">
                    <Sparkles className="h-3 w-3" />
                    {r.reasons.join(' · ')}
                  </div>
                )}
              </div>
              <ArrowRight className="mt-2 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.a>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
