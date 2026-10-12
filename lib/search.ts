// Website-side semantic search — mirrors the extension's search engine in TS.
import type { DemoPage } from './demo-data';

const STOPWORDS = new Set([
  'the', 'a', 'an', 'of', 'to', 'in', 'on', 'for', 'and', 'or', 'is', 'are',
  'was', 'were', 'i', 'me', 'my', 'we', 'about', 'that', 'this', 'it', 'with',
  'show', 'find', 'get', 'all', 'from', 'read', 'reading', 'look', 'looking',
]);

const TIME_SIGNALS: Record<string, { ms: number; label: string }> = {
  today: { ms: 86_400_000, label: 'today' },
  yesterday: { ms: 2 * 86_400_000, label: 'yesterday' },
  'this week': { ms: 7 * 86_400_000, label: 'this week' },
  week: { ms: 7 * 86_400_000, label: 'this week' },
  'this month': { ms: 30 * 86_400_000, label: 'this month' },
  month: { ms: 30 * 86_400_000, label: 'this month' },
  recently: { ms: 3 * 86_400_000, label: 'recently' },
};

const TYPE_SIGNALS: Record<string, string[]> = {
  article: ['article', 'blog', 'news', 'post', 'guide'],
  tutorial: ['tutorial', 'lesson', 'course', 'walkthrough', 'how-to', 'how to'],
  research: ['research', 'paper', 'arxiv', 'study', 'report'],
  docs: ['docs', 'documentation', 'reference', 'api', 'handbook'],
  repo: ['github', 'repo', 'repository', 'source'],
  video: ['video', 'youtube', 'watch'],
};

export type SearchResult = {
  page: DemoPage;
  score: number;
  reasons: string[];
};

function tokenize(text: string): string[] {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

function extractSignals(query: string) {
  const q = (query || '').toLowerCase();
  const tokens = tokenize(query);
  const time = { ms: null as number | null, label: null as string | null };
  for (const [key, val] of Object.entries(TIME_SIGNALS)) {
    if (q.includes(key)) {
      time.ms = val.ms;
      time.label = val.label;
      break;
    }
  }
  const types: string[] = [];
  for (const [type, words] of Object.entries(TYPE_SIGNALS)) {
    if (words.some((w) => q.includes(w))) types.push(type);
  }
  const topicTokens = tokens.filter(
    (t) =>
      !Object.keys(TIME_SIGNALS).some((k) => k.includes(t)) &&
      !Object.values(TYPE_SIGNALS).flat().includes(t)
  );
  return { q, tokens, time, types, topicTokens };
}

function scorePage(page: DemoPage, signals: ReturnType<typeof extractSignals>) {
  const { tokens, time, types, topicTokens } = signals;
  let score = 0;
  const reasons: string[] = [];

  const titleTokens = tokenize(page.title);
  const summaryTokens = tokenize(page.summary);
  const tagTokens = (page.tags || []).flatMap((t) => tokenize(t));
  const domainTokens = tokenize(page.domain);
  const collectionTokens = tokenize(page.collection || '');

  for (const t of tokens) {
    if (titleTokens.includes(t)) {
      score += 6;
      reasons.push(`title match "${t}"`);
    }
    if (tagTokens.includes(t)) {
      score += 5;
      reasons.push(`tag "${t}"`);
    }
    if (collectionTokens.includes(t)) {
      score += 4;
      reasons.push(`collection "${page.collection}"`);
    }
    if (summaryTokens.includes(t)) score += 2;
    if (domainTokens.includes(t)) score += 1;
  }

  if (types.length) {
    const pageText = `${(page.tags || []).join(' ')} ${page.url}`.toLowerCase();
    for (const type of types) {
      if (TYPE_SIGNALS[type].some((w) => pageText.includes(w))) {
        score += 5;
        reasons.push(`type: ${type}`);
      }
    }
  }

  if (time.ms !== null) {
    const age = Date.now() - (page.visitedAt || 0);
    if (age <= time.ms) {
      score += 8;
      reasons.push(`visited ${time.label}`);
    } else {
      score -= 3;
    }
  }

  const ageDays = (Date.now() - (page.visitedAt || 0)) / 86_400_000;
  if (ageDays < 1) score += 2;
  else if (ageDays < 3) score += 1;

  score += Math.min((page.visitCount || 0) * 0.5, 3);

  for (const t of topicTokens) {
    if (titleTokens.some((tt) => tt.startsWith(t) || t.startsWith(tt))) score += 1;
  }

  return { score, reasons: reasons.slice(0, 3) };
}

export function search(
  query: string,
  pages: DemoPage[],
  opts: { limit?: number } = {}
): SearchResult[] {
  const signals = extractSignals(query);
  if (!signals.tokens.length && signals.time.ms === null && !signals.types.length) {
    return [];
  }
  let results = pages.map((page) => {
    const { score, reasons } = scorePage(page, signals);
    return { page, score, reasons };
  });
  results = results.filter((r) => r.score > 0);
  results.sort(
    (a, b) => b.score - a.score || (b.page.visitedAt || 0) - (a.page.visitedAt || 0)
  );
  if (opts.limit) results = results.slice(0, opts.limit);
  return results;
}

export function summarize(text: string, maxSentences = 3): string {
  const sentences = (text || '')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 40);
  if (sentences.length <= maxSentences) return sentences.join(' ');
  const wordFreq: Record<string, number> = {};
  for (const s of sentences) {
    for (const w of tokenize(s)) wordFreq[w] = (wordFreq[w] || 0) + 1;
  }
  const scored = sentences.map((s, i) => {
    const toks = tokenize(s);
    const freq =
      toks.reduce((acc, w) => acc + (wordFreq[w] || 0), 0) / (toks.length || 1);
    const positionBoost = 1 - (i / sentences.length) * 0.3;
    return { s, score: freq * positionBoost, i };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored
    .slice(0, maxSentences)
    .sort((a, b) => a.i - b.i)
    .map((x) => x.s)
    .join(' ');
}
