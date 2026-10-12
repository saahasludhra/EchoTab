'use client';

import * as React from 'react';
import { Mail, MessageSquare, Send, Github, Twitter, MapPin, Check } from 'lucide-react';
import { PageHero, Reveal } from '@/components/site/section';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { siteConfig } from '@/lib/site';

export default function ContactPage() {
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      toast.success('Message recorded', {
        description: 'Thanks for reaching out — this is a demo form, so no message was actually sent.',
      });
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setSent(false), 3000);
    }, 900);
  };

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in touch"
        description="Questions, feedback, or ideas for EchoTab? Reach out through any channel below."
      />

      <div className="container py-20">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          {/* Form */}
          <Reveal>
            <Card className="p-8">
              <h2 className="font-display text-xl font-bold">Send a message</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                This is a demo form — it validates locally and confirms on submit.
              </p>
              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" required placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required placeholder="you@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" name="subject" required placeholder="What is this about?" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" name="message" required rows={5} placeholder="Tell me more…" />
                </div>
                <Button type="submit" disabled={sending || sent} className="w-full gap-2">
                  {sent ? <><Check className="h-4 w-4" /> Sent</> : sending ? <Send className="h-4 w-4 animate-pulse" /> : <><Send className="h-4 w-4" /> Send message</>}
                </Button>
              </form>
            </Card>
          </Reveal>

          {/* Info */}
          <Reveal delay={0.1}>
            <div className="space-y-5">
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-sm text-muted-foreground">hello@echotab.app</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-foreground">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Feedback</p>
                    <p className="text-sm text-muted-foreground">Bug reports and feature requests welcome.</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <p className="mb-4 font-semibold">Elsewhere</p>
                <div className="flex gap-3">
                  <a href="#" className="flex h-11 w-11 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:text-foreground" aria-label="GitHub">
                    <Github className="h-5 w-5" />
                  </a>
                  <a href="#" className="flex h-11 w-11 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:text-foreground" aria-label="Twitter">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="mailto:hello@echotab.app" className="flex h-11 w-11 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:text-foreground" aria-label="Email">
                    <Mail className="h-5 w-5" />
                  </a>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Based in</p>
                    <p className="text-sm text-muted-foreground">{siteConfig.creator.school}</p>
                  </div>
                </div>
              </Card>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
