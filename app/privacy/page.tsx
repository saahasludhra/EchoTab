'use client';

import { Shield, Lock, Eye, Database, Trash2, Download, Check, Network } from 'lucide-react';
import { PageHero, Reveal, SectionHeading } from '@/components/site/section';
import { Card } from '@/components/ui/card';

const promises = [
  { icon: Network, title: 'Zero network requests', desc: 'EchoTab contains no code that contacts any server. Your browsing data cannot be transmitted, because the capability does not exist in the extension.' },
  { icon: Database, title: 'On-device storage only', desc: 'All data is stored in IndexedDB and chrome.storage.local, scoped to the extension origin on your machine. There is no cloud copy.' },
  { icon: Lock, title: 'No accounts, no tracking', desc: 'No sign-up, no login, no analytics, no telemetry. Nothing identifies you to anyone.' },
  { icon: Eye, title: 'Incognito is excluded', desc: 'Pages visited in incognito mode are never indexed, by default. The extension does not run in incognito unless you explicitly allow it.' },
  { icon: Download, title: 'Your data is portable', desc: 'Export your entire memory as open JSON at any time. Import it back or move it to another browser.' },
  { icon: Trash2, title: 'Delete in one click', desc: 'Reset your memory to demo data, or clear individual stores, instantly and permanently.' },
];

const dataItems = [
  { store: 'pages', what: 'URL, title, domain, summary, tags, visit time, visit count', where: 'IndexedDB' },
  { store: 'bookmarks', what: 'URL, title, domain, tags, created time', where: 'IndexedDB' },
  { store: 'notes', what: 'Note title, body, tags, linked page', where: 'IndexedDB' },
  { store: 'sessions', what: 'Session title, time range, page IDs, tab count, summary', where: 'IndexedDB' },
  { store: 'collections', what: 'Collection name, label, color, icon', where: 'IndexedDB' },
  { store: 'searchHistory', what: 'Past queries and result counts', where: 'IndexedDB' },
  { store: 'favorites', what: 'Pinned page references', where: 'IndexedDB' },
  { store: 'settings', what: 'Theme, toggles, shortcuts, retention', where: 'chrome.storage.local' },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title="Your browsing is yours alone"
        description="EchoTab is privacy-first by design, not by promise. Here is exactly what is collected, where it lives, and the controls you have."
      />

      <div className="container py-20">
        {/* Promises */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {promises.map((p, i) => (
            <Reveal key={p.title} delay={(i % 3) * 0.05}>
              <Card className="h-full p-6">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-success/10 text-success">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              </Card>
            </Reveal>
          ))}
        </div>

        {/* Data table */}
        <Reveal className="mt-20">
          <SectionHeading
            align="left"
            eyebrow="Data inventory"
            title="Exactly what is stored, and where"
            description="Full transparency on every piece of data EchoTab keeps."
          />
          <Card className="mt-8 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="px-5 py-3 text-left font-semibold">Store</th>
                    <th className="px-5 py-3 text-left font-semibold">What it holds</th>
                    <th className="px-5 py-3 text-left font-semibold">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {dataItems.map((d) => (
                    <tr key={d.store} className="border-t border-border">
                      <td className="px-5 py-3 font-mono font-semibold text-primary">{d.store}</td>
                      <td className="px-5 py-3 text-muted-foreground">{d.what}</td>
                      <td className="px-5 py-3"><span className="rounded bg-muted px-2 py-0.5 font-mono text-xs">{d.where}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </Reveal>

        {/* Controls */}
        <Reveal className="mt-20">
          <SectionHeading
            align="left"
            eyebrow="Your controls"
            title="You are in charge"
            description="Four controls give you complete authority over your data."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {[
              { icon: Lock, title: 'Privacy mode', desc: 'A single toggle in settings that pauses all indexing instantly. Nothing new is recorded while it is on.' },
              { icon: Download, title: 'Export', desc: 'Settings → Privacy & Data → Export JSON. Download your entire memory as a portable file.' },
              { icon: Download, title: 'Import', desc: 'Restore a previous export, or move your memory to a different browser.' },
              { icon: Trash2, title: 'Reset & clear', desc: 'Wipe everything back to demo data, or clear individual stores — permanently, in one click.' },
            ].map((c) => (
              <Card key={c.title} className="flex items-start gap-4 p-6">
                <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{c.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </Reveal>

        {/* Manifest pledge */}
        <Reveal className="mt-20">
          <Card className="border-success/20 bg-success/5 p-8">
            <div className="flex items-center gap-3">
              <Shield className="h-7 w-7 text-success" />
              <h3 className="font-display text-xl font-bold">The privacy pledge</h3>
            </div>
            <p className="mt-4 text-muted-foreground">
              EchoTab will never add network capabilities, analytics, accounts, or
              any data transmission of any kind. If a future feature requires
              connectivity (such as opt-in encrypted sync), it will be strictly
              opt-in, end-to-end encrypted, and clearly disclosed — never on by
              default. This is a structural guarantee: the extension today has no
              fetch, XMLHttpRequest, WebSocket, or beacon code.
            </p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {['No fetch() calls', 'No XMLHttpRequest', 'No WebSocket', 'No analytics SDK', 'No third-party scripts', 'No cookies set'].map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-success" /> {t}
                </li>
              ))}
            </ul>
          </Card>
        </Reveal>
      </div>
    </>
  );
}
