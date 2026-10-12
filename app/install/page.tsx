'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Download, FileArchive, Puzzle, ToggleRight, FolderOpen,
  CheckCircle2, ArrowRight, Chrome, Terminal, Lightbulb,
} from 'lucide-react';
import { PageHero, Reveal } from '@/components/site/section';
import { Card } from '@/components/ui/card';
import { DownloadButton } from '@/components/site/download-button';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const steps = [
  {
    icon: Download,
    title: 'Download the ZIP',
    desc: 'Click the download button to get EchoTab.zip — a complete, loadable extension.',
    detail: 'The ZIP contains the full extension: manifest, popup, options, background worker, and all assets.',
    code: 'EchoTab.zip',
  },
  {
    icon: FileArchive,
    title: 'Extract the folder',
    desc: 'Unzip the archive. You will get a folder named EchoTab with manifest.json inside.',
    detail: 'On macOS, double-click the ZIP. On Windows, right-click → Extract All. Keep the folder somewhere permanent.',
    code: 'EchoTab/ └── manifest.json',
  },
  {
    icon: Puzzle,
    title: 'Open the extensions page',
    desc: 'Navigate to the extensions management page in your browser.',
    detail: 'In Chrome: type chrome://extensions in the address bar. In Edge: type edge://extensions.',
    code: 'chrome://extensions',
  },
  {
    icon: ToggleRight,
    title: 'Enable Developer mode',
    desc: 'Toggle Developer mode on — it is in the top-right corner of the extensions page.',
    detail: 'This reveals the “Load unpacked” button, which lets you install extensions from a local folder.',
    code: 'Developer mode: ON',
  },
  {
    icon: FolderOpen,
    title: 'Click Load unpacked',
    desc: 'Press “Load unpacked” and select the EchoTab folder you extracted.',
    detail: 'Select the folder that directly contains manifest.json — not its parent.',
    code: 'Select: EchoTab/',
  },
  {
    icon: CheckCircle2,
    title: 'Start using EchoTab',
    desc: 'Pin EchoTab to your toolbar. Click the icon or press Ctrl+Shift+E to search your memory.',
    detail: 'EchoTab seeds itself with demo data on first install, so you can try it instantly.',
    code: '⌘/Ctrl + Shift + E',
  },
];

export default function InstallPage() {
  const [active, setActive] = React.useState(0);

  return (
    <>
      <PageHero
        eyebrow="Installation"
        title="Up and running in two minutes"
        description="No build step, no dependencies. Download, extract, and load it unpacked into Chrome or Edge."
      >
        <DownloadButton size="lg" />
        <Link href="/demo">
          <Button variant="outline" size="lg">Try the demo first</Button>
        </Link>
      </PageHero>

      <div className="container py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          {/* Steps list */}
          <ol className="space-y-3">
            {steps.map((s, i) => (
              <li key={s.title}>
                <Reveal delay={i * 0.04}>
                  <button
                    onClick={() => setActive(i)}
                    className={`flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition-all ${
                      active === i
                        ? 'border-primary/50 bg-primary/5 shadow-glow'
                        : 'border-border bg-card/40 hover:border-border/80'
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display text-sm font-bold transition-colors ${
                        active === i
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <s.icon className="h-4 w-4 text-primary" />
                        <h3 className="font-semibold">{s.title}</h3>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                    </div>
                  </button>
                </Reveal>
              </li>
            ))}
          </ol>

          {/* Active step visual */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden">
                <div className="flex items-center gap-3 border-b border-border bg-muted/30 px-5 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-destructive/60" />
                    <span className="h-3 w-3 rounded-full bg-warning/60" />
                    <span className="h-3 w-3 rounded-full bg-success/60" />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    step {active + 1} / {steps.length}
                  </span>
                </div>
                <div className="p-8">
                  <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    {React.createElement(steps[active].icon, { className: 'h-7 w-7' })}
                  </div>
                  <h3 className="font-display text-2xl font-bold">
                    {steps[active].title}
                  </h3>
                  <p className="mt-3 text-muted-foreground">{steps[active].detail}</p>
                  <pre className="mt-6 overflow-x-auto rounded-xl border border-border bg-background/60 p-4 font-mono text-sm text-accent">
                    {steps[active].code}
                  </pre>
                  <div className="mt-6 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActive((a) => Math.max(0, a - 1))}
                      disabled={active === 0}
                    >
                      Previous
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setActive((a) => Math.min(steps.length - 1, a + 1))}
                      disabled={active === steps.length - 1}
                      className="gap-1"
                    >
                      Next <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Browser compatibility */}
        <Reveal className="mt-20">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { icon: Chrome, title: 'Chrome', v: 'v108+', note: 'Fully supported' },
              { icon: Puzzle, title: 'Microsoft Edge', v: 'v108+', note: 'Fully supported' },
              { icon: Terminal, title: 'Brave / Arc / Vivaldi', v: 'Chromium-based', note: 'Load unpacked works' },
            ].map((b) => (
              <Card key={b.title} className="flex items-center gap-4 p-5">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-foreground">
                  <b.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">{b.title}</p>
                  <p className="text-sm text-muted-foreground">{b.v}</p>
                </div>
                <span className="ml-auto inline-flex items-center gap-1 text-xs text-success">
                  <CheckCircle2 className="h-3.5 w-3.5" /> {b.note}
                </span>
              </Card>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-12">
          <Card className="flex items-start gap-4 border-warning/30 bg-warning/5 p-6">
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
            <div>
              <p className="font-semibold">Tip</p>
              <p className="mt-1 text-sm text-muted-foreground">
                After loading, pin EchoTab to your toolbar by clicking the puzzle
                icon and selecting the pin. Then press{' '}
                <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">Ctrl+Shift+E</kbd>{' '}
                anytime to open search without reaching for the mouse.
              </p>
            </div>
          </Card>
        </Reveal>
      </div>
    </>
  );
}
