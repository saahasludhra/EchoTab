'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { PageHero } from '@/components/site/section';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const faqs = [
  {
    cat: 'Getting started',
    items: [
      { q: 'What is EchoTab?', a: 'EchoTab is a browser extension that turns your history, bookmarks, tabs, and notes into an intelligent, searchable memory. You search in natural language and it ranks results by meaning, recency, and content type.' },
      { q: 'Which browsers are supported?', a: 'Any Chromium-based browser v108 or newer: Chrome, Microsoft Edge, Brave, Arc, and Vivaldi. You install it by loading the unpacked folder.' },
      { q: 'Do I need an account?', a: 'No. There are no accounts, no sign-ups, and no servers. Everything runs and stays on your device.' },
      { q: 'How long does installation take?', a: 'About two minutes: download the ZIP, extract it, enable Developer mode, and load the folder. See the installation guide for a step-by-step walkthrough.' },
    ],
  },
  {
    cat: 'Privacy & data',
    items: [
      { q: 'Does EchoTab send my data anywhere?', a: 'No. The extension contains no network code. All data lives in IndexedDB and chrome.storage.local on your machine. It cannot transmit your browsing anywhere.' },
      { q: 'Is incognito browsing tracked?', a: 'No. Incognito visits are excluded by default, and the extension does not run in incognito contexts unless you explicitly grant it.' },
      { q: 'Can I export or delete my data?', a: 'Yes. Settings → Privacy & Data lets you export your entire memory as JSON, import a backup, or reset to demo data instantly.' },
      { q: 'What is privacy mode?', a: 'A single toggle that pauses all indexing until you turn it back on. Nothing new is recorded while it is active.' },
    ],
  },
  {
    cat: 'Features',
    items: [
      { q: 'How does semantic search work without a server?', a: 'EchoTab extracts intent signals — time, topic, and content type — from your query, then scores each page across its title, tags, summary, domain, and collection. The result reads like it understood you, but it is all local heuristics.' },
      { q: 'What are smart collections?', a: 'EchoTab groups your browsing into themes automatically based on the topics you read. You get collections like Frontend Fundamentals, AI Research, and CS Coursework without manually filing anything.' },
      { q: 'What is a research session?', a: 'When you focus on one topic across several tabs, EchoTab detects the pattern and saves the whole session with a generated summary. You can replay it later to reopen every tab in context.' },
      { q: 'How are AI summaries generated?', a: 'Locally and extractively. EchoTab selects the most informative sentences from the page text using word-frequency scoring and position weighting. No generative model runs by default.' },
    ],
  },
  {
    cat: 'Technical',
    items: [
      { q: 'What manifest version is used?', a: 'Manifest V3 — the current Chrome extension standard, with an event-driven service worker.' },
      { q: 'Will it slow down my browser?', a: 'No. The service worker sleeps when idle, and search runs against local IndexedDB indexes in milliseconds.' },
      { q: 'Can I change the keyboard shortcuts?', a: 'Yes, at chrome://extensions/shortcuts. The defaults are Ctrl+Shift+E (search), Ctrl+Shift+S (save), and Ctrl+Shift+N (note).' },
      { q: 'Is the code open source?', a: 'The extension is distributed as an unpacked loadable folder, so the full source is included in the download. See the README inside the ZIP.' },
    ],
  },
];

export default function FAQPage() {
  const [open, setOpen] = React.useState<string | null>('0-0');

  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Questions, answered"
        description="Everything about getting started, privacy, features, and the technical details."
      />

      <div className="container max-w-3xl py-16">
        <div className="space-y-12">
          {faqs.map((group, gi) => (
            <div key={group.cat}>
              <h2 className="mb-5 font-display text-lg font-bold text-muted-foreground uppercase tracking-wider">
                {group.cat}
              </h2>
              <div className="space-y-2">
                {group.items.map((item, ii) => {
                  const id = `${gi}-${ii}`;
                  const isOpen = open === id;
                  return (
                    <Card key={id} className="overflow-hidden">
                      <button
                        onClick={() => setOpen(isOpen ? null : id)}
                        className="flex w-full items-center justify-between gap-4 p-5 text-left"
                        aria-expanded={isOpen}
                      >
                        <span className="font-medium">{item.q}</span>
                        <ChevronDown className={cn('h-5 w-5 shrink-0 text-muted-foreground transition-transform', isOpen && 'rotate-180')} />
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <p className="px-5 pb-5 text-sm text-muted-foreground">{item.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <Card className="mt-12 flex flex-col items-center gap-4 p-8 text-center">
          <HelpCircle className="h-8 w-8 text-primary" />
          <h3 className="font-display text-xl font-bold">Still have questions?</h3>
          <p className="max-w-md text-sm text-muted-foreground">
            Check the full documentation or reach out directly.
          </p>
          <div className="flex gap-3">
            <Link href="/docs"><Button variant="outline">Documentation</Button></Link>
            <Link href="/contact"><Button className="gap-2">Contact <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
        </Card>
      </div>
    </>
  );
}
