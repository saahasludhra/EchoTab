'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { GraduationCap, Code2, Brain, Palette, Cpu, Sparkles, ArrowUpRight, Award } from 'lucide-react';
import { PageHero, Reveal, SectionHeading } from '@/components/site/section';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/site/logo';
import { siteConfig } from '@/lib/site';

const interests = [
  { icon: Brain, label: 'Human-Centered AI' },
  { icon: Cpu, label: 'Browser Technologies' },
  { icon: Palette, label: 'UI/UX Design' },
  { icon: Sparkles, label: 'Intelligent Interfaces' },
  { icon: Code2, label: 'React & Angular' },
  { icon: GraduationCap, label: 'AI Productivity Software' },
];

export default function CreatorPage() {
  return (
    <>
      <PageHero
        eyebrow="The maker"
        title="Built by one student, with care"
        description="EchoTab is the work of a single developer exploring how browsers can remember what we learn."
      />

      <div className="container py-20">
        <div className="mx-auto max-w-4xl">
          {/* Profile */}
          <Reveal>
            <Card className="overflow-hidden">
              <div className="relative h-32 bg-gradient-to-br from-primary via-accent to-chart-5">
                <div className="absolute inset-0 bg-grid opacity-20" />
              </div>
              <div className="px-8 pb-8">
                <div className="-mt-12 flex items-end gap-5">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-background bg-card shadow-lg">
                    <Logo className="h-14 w-14" />
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-2xl font-bold">{siteConfig.creator.name}</h2>
                    <p className="text-muted-foreground">{siteConfig.creator.role}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <GraduationCap className="h-4 w-4" /> {siteConfig.creator.school}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-success/30 bg-success/5 px-4 py-2.5">
                    <Award className="h-5 w-5 text-success" />
                    <div>
                      <p className="text-xs text-muted-foreground">AP Computer Science A</p>
                      <p className="font-display text-lg font-bold text-success">Score: 4</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Reveal>

          {/* About */}
          <Reveal delay={0.05} className="mt-10">
            <Card className="p-8">
              <h3 className="font-display text-lg font-bold">About</h3>
              <div className="mt-4 space-y-4 text-muted-foreground">
                <p>
                  I am an aspiring Computer Science student fascinated by the
                  intersection of artificial intelligence and the tools we use
                  every day. EchoTab started as a simple question: why does my
                  browser forget everything I learn?
                </p>
                <p>
                  Building it taught me about browser extension architecture
                  (Manifest V3, service workers, content scripts), local-first
                  data design with IndexedDB, and how to approximate
                  &ldquo;intelligence&rdquo; with lightweight, privacy-preserving
                  heuristics — all without sending a single byte to a server.
                </p>
                <p>
                  My interests span human-centered AI, browser technologies,
                  UI/UX design, and intelligent interfaces built with React and
                  Angular. I care about software that feels considered — products
                  that respect both the user&rsquo;s attention and their privacy.
                </p>
              </div>
            </Card>
          </Reveal>

          {/* Interests */}
          <Reveal delay={0.1} className="mt-10">
            <SectionHeading align="left" eyebrow="Interests" title="What I care about" />
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {interests.map((it, i) => (
                <motion.div
                  key={it.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.05 }}
                >
                  <Card className="flex items-center gap-3 p-5 transition-colors hover:border-primary/40">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <it.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">{it.label}</span>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Reveal>

          {/* The project */}
          <Reveal delay={0.1} className="mt-10">
            <Card className="border-primary/20 bg-primary/5 p-8">
              <h3 className="font-display text-lg font-bold">On building EchoTab</h3>
              <p className="mt-3 text-muted-foreground">
                EchoTab is a study in making a browser extension feel like a real
                product. Every feature — semantic search, smart collections,
                research sessions, AI summaries, the full settings page — was
                designed to work together as one coherent system, entirely
                on-device. The goal was engineering depth without sacrificing
                polish.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/architecture"><Button variant="outline" className="gap-2">See the architecture <ArrowUpRight className="h-4 w-4" /></Button></Link>
                <Link href="/demo"><Button variant="outline">Try the demo</Button></Link>
              </div>
            </Card>
          </Reveal>

          <Reveal delay={0.1} className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              EchoTab is a personal project, not affiliated with any institution.
            </p>
          </Reveal>
        </div>
      </div>
    </>
  );
}
