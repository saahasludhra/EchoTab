// EchoTab local search engine.
// Pure-JS semantic-ish ranking: tokenizes the query into intent signals
// (time, topic, type, recency), scores each indexed page against those
// signals, and returns ranked results with a human-readable match reason.
// No network calls — everything runs in the extension.
// Exposed as window.EchoTabSearch for plain-script access.

var STOPWORDS = {
  'the': 1, 'a': 1, 'an': 1, 'of': 1, 'to': 1, 'in': 1, 'on': 1, 'for': 1,
  'and': 1, 'or': 1, 'is': 1, 'are': 1, 'was': 1, 'were': 1, 'i': 1, 'me': 1,
  'my': 1, 'we': 1, 'about': 1, 'that': 1, 'this': 1, 'it': 1, 'with': 1,
  'show': 1, 'find': 1, 'get': 1, 'all': 1, 'from': 1, 'read': 1, 'reading': 1,
  'look': 1, 'looking': 1,
};

var TIME_SIGNALS = {
  today: { ms: 86400000, label: 'today' },
  yesterday: { ms: 2 * 86400000, label: 'yesterday' },
  'this week': { ms: 7 * 86400000, label: 'this week' },
  week: { ms: 7 * 86400000, label: 'this week' },
  'this month': { ms: 30 * 86400000, label: 'this month' },
  month: { ms: 30 * 86400000, label: 'this month' },
  recently: { ms: 3 * 86400000, label: 'recently' },
};

var TYPE_SIGNALS = {
  article: ['article', 'blog', 'news', 'post', 'guide'],
  tutorial: ['tutorial', 'lesson', 'course', 'walkthrough', 'how-to', 'how to'],
  research: ['research', 'paper', 'arxiv', 'study', 'report'],
  docs: ['docs', 'documentation', 'reference', 'api', 'handbook'],
  repo: ['github', 'repo', 'repository', 'source'],
  video: ['video', 'youtube', 'watch'],
};

function etTokenize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(function (t) { return t.length > 1 && !STOPWORDS[t]; });
}

function etExtractSignals(query) {
  var q = (query || '').toLowerCase();
  var tokens = etTokenize(query);
  var time = { ms: null, label: null };
  var keys = Object.keys(TIME_SIGNALS);
  for (var i = 0; i < keys.length; i++) {
    if (q.indexOf(keys[i]) !== -1) {
      time.ms = TIME_SIGNALS[keys[i]].ms;
      time.label = TIME_SIGNALS[keys[i]].label;
      break;
    }
  }
  var types = [];
  var typeKeys = Object.keys(TYPE_SIGNALS);
  for (var j = 0; j < typeKeys.length; j++) {
    var words = TYPE_SIGNALS[typeKeys[j]];
    for (var k = 0; k < words.length; k++) {
      if (q.indexOf(words[k]) !== -1) { types.push(typeKeys[j]); break; }
    }
  }
  var topicTokens = tokens.filter(function (t) {
    var inTime = keys.some(function (k) { return k.indexOf(t) !== -1; });
    var inType = false;
    for (var m = 0; m < typeKeys.length; m++) {
      if (TYPE_SIGNALS[typeKeys[m]].indexOf(t) !== -1) { inType = true; break; }
    }
    return !inTime && !inType;
  });
  return { q: q, tokens: tokens, time: time, types: types, topicTokens: topicTokens };
}

function etScorePage(page, signals) {
  var tokens = signals.tokens;
  var time = signals.time;
  var types = signals.types;
  var topicTokens = signals.topicTokens;
  var score = 0;
  var reasons = [];

  var titleTokens = etTokenize(page.title);
  var summaryTokens = etTokenize(page.summary);
  var tagTokens = (page.tags || []).reduce(function (acc, t) { return acc.concat(etTokenize(t)); }, []);
  var domainTokens = etTokenize(page.domain);
  var collectionTokens = etTokenize(page.collection || '');

  for (var i = 0; i < tokens.length; i++) {
    var t = tokens[i];
    if (titleTokens.indexOf(t) !== -1) { score += 6; reasons.push('title match "' + t + '"'); }
    if (tagTokens.indexOf(t) !== -1) { score += 5; reasons.push('tag "' + t + '"'); }
    if (collectionTokens.indexOf(t) !== -1) { score += 4; reasons.push('collection "' + page.collection + '"'); }
    if (summaryTokens.indexOf(t) !== -1) { score += 2; }
    if (domainTokens.indexOf(t) !== -1) { score += 1; }
  }

  if (types.length) {
    var pageText = ((page.tags || []).join(' ') + ' ' + page.url).toLowerCase();
    for (var ti = 0; ti < types.length; ti++) {
      var words = TYPE_SIGNALS[types[ti]];
      for (var wi = 0; wi < words.length; wi++) {
        if (pageText.indexOf(words[wi]) !== -1) { score += 5; reasons.push('type: ' + types[ti]); break; }
      }
    }
  }

  if (time.ms !== null) {
    var age = Date.now() - (page.visitedAt || 0);
    if (age <= time.ms) { score += 8; reasons.push('visited ' + time.label); }
    else { score -= 3; }
  }

  var ageDays = (Date.now() - (page.visitedAt || 0)) / 86400000;
  if (ageDays < 1) score += 2;
  else if (ageDays < 3) score += 1;

  score += Math.min((page.visitCount || 0) * 0.5, 3);

  for (var p = 0; p < topicTokens.length; p++) {
    var tt = topicTokens[p];
    for (var st = 0; st < titleTokens.length; st++) {
      if (titleTokens[st].indexOf(tt) === 0 || tt.indexOf(titleTokens[st]) === 0) { score += 1; break; }
    }
  }

  return { score: score, reasons: reasons.slice(0, 3) };
}

function etSearch(query, pages, opts) {
  opts = opts || {};
  var signals = etExtractSignals(query);
  if (!signals.tokens.length && signals.time.ms === null && !signals.types.length) {
    return [];
  }
  var results = pages.map(function (page) {
    var r = etScorePage(page, signals);
    return { page: page, score: r.score, reasons: r.reasons };
  });
  results = results.filter(function (r) { return r.score > 0; });
  results.sort(function (a, b) {
    if (b.score !== a.score) return b.score - a.score;
    return (b.page.visitedAt || 0) - (a.page.visitedAt || 0);
  });
  if (opts.limit) results = results.slice(0, opts.limit);
  return results;
}

// Local extractive summary: pick the most informative sentences from text.
function etSummarize(text, maxSentences) {
  maxSentences = maxSentences || 3;
  var sentences = (text || '')
    .split(/(?<=[.!?])\s+/)
    .map(function (s) { return s.trim(); })
    .filter(function (s) { return s.length > 40; });
  if (sentences.length <= maxSentences) return sentences.join(' ');
  var wordFreq = {};
  sentences.forEach(function (s) {
    etTokenize(s).forEach(function (w) { wordFreq[w] = (wordFreq[w] || 0) + 1; });
  });
  var scored = sentences.map(function (s, i) {
    var toks = etTokenize(s);
    var freq = toks.reduce(function (acc, w) { return acc + (wordFreq[w] || 0); }, 0) / (toks.length || 1);
    var positionBoost = 1 - i / sentences.length * 0.3;
    return { s: s, score: freq * positionBoost, i: i };
  });
  scored.sort(function (a, b) { return b.score - a.score; });
  return scored
    .slice(0, maxSentences)
    .sort(function (a, b) { return a.i - b.i; })
    .map(function (x) { return x.s; })
    .join(' ');
}

// Heuristic collection suggestion from a set of pages.
function etSuggestCollection(pages) {
  if (!pages.length) return null;
  var tagCount = {};
  pages.forEach(function (p) {
    (p.tags || []).forEach(function (t) { tagCount[t] = (tagCount[t] || 0) + 1; });
  });
  var entries = Object.keys(tagCount).map(function (k) { return [k, tagCount[k]]; });
  entries.sort(function (a, b) { return b[1] - a[1]; });
  var top = entries[0];
  if (!top) return null;
  return { name: top[0].replace(/\b\w/g, function (c) { return c.toUpperCase(); }) + ' Research', tag: top[0] };
}

var EchoTabSearch = {
  search: etSearch,
  summarize: etSummarize,
  suggestCollection: etSuggestCollection,
  tokenize: etTokenize,
  extractSignals: etExtractSignals,
};
