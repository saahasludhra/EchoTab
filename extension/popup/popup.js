// EchoTab popup — primary search interface.
// Plain JS: renders search, collections, sessions, notes, recent pages.
// Depends on etSearch/etSummarize from ../utils/search.js (loaded globally).

var $ = function (sel, root) { return (root || document).querySelector(sel); };

function timeAgo(ts) {
  var s = (Date.now() - ts) / 1000;
  if (s < 60) return 'just now';
  if (s < 3600) return Math.floor(s / 60) + 'm ago';
  if (s < 86400) return Math.floor(s / 3600) + 'h ago';
  return Math.floor(s / 86400) + 'd ago';
}

function send(msg) {
  return new Promise(function (resolve) {
    try {
      chrome.runtime.sendMessage(msg, resolve);
    } catch (e) { resolve({ ok: false, error: String(e) }); }
  });
}

function escapeHtml(s) {
  return (s || '').replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

var app;
var activeTab = 'search';

function renderHeader() {
  return '' +
    '<div class="et-header">' +
      '<div class="et-logo">E</div>' +
      '<div class="et-brand">Echo<span>Tab</span></div>' +
      '<button class="et-settings" id="open-options" title="Settings" aria-label="Settings">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>' +
      '</button>' +
    '</div>';
}

function renderTabs() {
  var tabs = [
    ['search', 'Search'],
    ['collections', 'Collections'],
    ['sessions', 'Sessions'],
    ['notes', 'Notes'],
    ['recent', 'Recent'],
  ];
  return '<div class="et-tabs">' + tabs.map(function (t) {
    return '<button class="et-tab ' + (t[0] === activeTab ? 'active' : '') + '" data-tab="' + t[0] + '">' + t[1] + '</button>';
  }).join('') + '</div>';
}

function renderSearch() {
  var suggestions = [
    'React article I read yesterday',
    'Three.js animation tutorial',
    'AI research this week',
    'website about operating systems',
  ];
  return '' +
    '<div class="et-search-wrap">' +
      '<svg class="et-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>' +
      '<input id="search-input" class="et-search" placeholder="Search your browser memory…" autocomplete="off" />' +
    '</div>' +
    '<div class="et-suggest">' +
      suggestions.map(function (s) { return '<span class="et-chip" data-q="' + escapeHtml(s) + '">' + escapeHtml(s) + '</span>'; }).join('') +
    '</div>';
}

function resultCard(r) {
  var p = r.page;
  var tagsHtml = (p.tags || []).slice(0, 4).map(function (t) {
    return '<span class="et-tag">' + escapeHtml(t) + '</span>';
  }).join('');
  var reasonsHtml = (r.reasons && r.reasons.length) ? '<div class="et-reason">matched: ' + escapeHtml(r.reasons.join(' · ')) + '</div>' : '';
  return '' +
    '<div class="et-result" data-url="' + escapeHtml(p.url) + '">' +
      '<img class="et-fav" src="' + escapeHtml(p.favIcon || '') + '" onerror="this.style.visibility=\'hidden\'" alt="" />' +
      '<div class="et-r-body">' +
        '<div class="et-r-title">' + escapeHtml(p.title) + '</div>' +
        '<div class="et-r-domain">' + escapeHtml(p.domain) + ' · ' + timeAgo(p.visitedAt) + '</div>' +
        '<div class="et-r-summary">' + escapeHtml(p.summary) + '</div>' +
        '<div class="et-r-tags">' + tagsHtml + '</div>' +
        reasonsHtml +
      '</div>' +
    '</div>';
}

function renderEmpty(msg) {
  return '<div class="et-empty"><div class="et-empty-icon">&#x2315;</div>' + escapeHtml(msg) + '</div>';
}

function renderFoot() {
  return '' +
    '<div class="et-foot">' +
      '<span>Local · Private</span>' +
      '<span><a id="open-options-link">Options</a> · <a id="reset-demo-link">Reset demo</a></span>' +
    '</div>';
}

function doSearch(query) {
  send({ type: 'search', query: query, limit: 20 }).then(function (res) {
    var results = (res && res.results) || [];
    send({ type: 'save-search', query: query, count: results.length });
    var container = $('#results');
    if (!container) return;
    if (!query.trim()) {
      container.innerHTML = renderEmpty('Start typing to search your memory');
      return;
    }
    if (!results.length) {
      container.innerHTML = renderEmpty('No matches. Try "React article yesterday".');
      return;
    }
    container.innerHTML = '<div class="et-section-title">' + results.length + ' results</div>' + results.map(resultCard).join('');
    container.querySelectorAll('.et-result').forEach(function (node) {
      node.addEventListener('click', function () { chrome.tabs.create({ url: node.dataset.url }); });
    });
  });
}

function renderCollections() {
  return send({ type: 'get-all' }).then(function (res) {
    var data = (res && res.data) || {};
    var pages = data.pages || [];
    var collections = data.collections || [];
    var counts = {};
    pages.forEach(function (p) { if (p.collection) counts[p.collection] = (counts[p.collection] || 0) + 1; });
    if (!collections.length) return renderEmpty('No collections yet.');
    return collections.map(function (c) {
      return '<div class="et-collection" data-name="' + escapeHtml(c.name) + '">' +
        '<span class="et-col-dot" style="background:' + c.color + '"></span>' +
        '<span class="et-col-name">' + escapeHtml(c.name) + '</span>' +
        '<span class="et-col-count">' + (counts[c.name] || 0) + ' pages</span>' +
      '</div>';
    }).join('');
  });
}

function renderSessions() {
  return send({ type: 'get-all' }).then(function (res) {
    var sessions = ((res && res.data && res.data.sessions) || []).sort(function (a, b) { return b.startedAt - a.startedAt; });
    if (!sessions.length) return renderEmpty('No research sessions yet.');
    return sessions.map(function (s) {
      return '<div class="et-session">' +
        '<div class="et-s-title">' + escapeHtml(s.title) + '</div>' +
        '<div class="et-s-meta">' + s.tabCount + ' tabs · ' + timeAgo(s.startedAt) + ' · ' + Math.round((s.endedAt - s.startedAt) / 60000) + 'm</div>' +
        '<div class="et-s-summary">' + escapeHtml(s.summary || '') + '</div>' +
        '<span class="et-s-label">' + escapeHtml(s.label || '') + '</span>' +
      '</div>';
    }).join('');
  });
}

function renderNotes() {
  return send({ type: 'get-all' }).then(function (res) {
    var notes = ((res && res.data && res.data.notes) || []).sort(function (a, b) { return b.updatedAt - a.updatedAt; });
    if (!notes.length) return renderEmpty('No notes yet. Press the note shortcut.');
    return notes.map(function (n) {
      return '<div class="et-note-row">' +
        '<div>' +
          '<div class="et-note-title">' + escapeHtml(n.title) + '</div>' +
          '<div class="et-note-body">' + escapeHtml(n.body) + '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  });
}

function renderRecent() {
  return send({ type: 'get-all' }).then(function (res) {
    var pages = ((res && res.data && res.data.pages) || []).sort(function (a, b) { return b.visitedAt - a.visitedAt; }).slice(0, 20);
    if (!pages.length) return renderEmpty('No pages indexed yet.');
    return pages.map(function (p) {
      return '<div class="et-result" data-url="' + escapeHtml(p.url) + '">' +
        '<img class="et-fav" src="' + escapeHtml(p.favIcon || '') + '" onerror="this.style.visibility=\'hidden\'" alt="" />' +
        '<div class="et-r-body">' +
          '<div class="et-r-title">' + escapeHtml(p.title) + '</div>' +
          '<div class="et-r-domain">' + escapeHtml(p.domain) + ' · ' + timeAgo(p.visitedAt) + '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  });
}

function paint() {
  if (activeTab === 'search') {
    app.innerHTML =
      renderHeader() + renderSearch() + renderTabs() +
      '<div id="results" class="et-results scroll">' + renderEmpty('Start typing to search your memory') + '</div>' +
      renderFoot();
  } else {
    app.innerHTML =
      renderHeader() + renderTabs() +
      '<div id="results" class="et-results scroll"><div class="et-empty">Loading…</div></div>' +
      renderFoot();
    var container = $('#results');
    if (activeTab === 'collections') renderCollections().then(function (html) { container.innerHTML = html; });
    if (activeTab === 'sessions') renderSessions().then(function (html) { container.innerHTML = html; });
    if (activeTab === 'notes') renderNotes().then(function (html) { container.innerHTML = html; });
    if (activeTab === 'recent') renderRecent().then(function (html) {
      container.innerHTML = html;
      container.querySelectorAll('.et-result').forEach(function (node) {
        node.addEventListener('click', function () { chrome.tabs.create({ url: node.dataset.url }); });
      });
    });
  }
  wire();
}

function wire() {
  var openOpts = $('#open-options');
  if (openOpts) openOpts.addEventListener('click', function () { chrome.runtime.openOptionsPage(); });
  var openOptsLink = $('#open-options-link');
  if (openOptsLink) openOptsLink.addEventListener('click', function (e) { e.preventDefault(); chrome.runtime.openOptionsPage(); });
  var resetLink = $('#reset-demo-link');
  if (resetLink) resetLink.addEventListener('click', function (e) {
    e.preventDefault();
    send({ type: 'reset-demo' }).then(function () { paint(); });
  });
  app.querySelectorAll('.et-tab').forEach(function (t) {
    t.addEventListener('click', function () { activeTab = t.dataset.tab; paint(); });
  });
  app.querySelectorAll('.et-chip').forEach(function (c) {
    c.addEventListener('click', function () {
      var input = $('#search-input');
      input.value = c.dataset.q;
      doSearch(c.dataset.q);
    });
  });
  var input = $('#search-input');
  if (input) {
    input.focus();
    var debounce;
    input.addEventListener('input', function () {
      clearTimeout(debounce);
      debounce = setTimeout(function () { doSearch(input.value); }, 160);
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') doSearch(input.value);
    });
  }
  app.querySelectorAll('.et-result').forEach(function (node) {
    node.addEventListener('click', function () { chrome.tabs.create({ url: node.dataset.url }); });
  });
}

function applyTheme() {
  try {
    chrome.storage.local.get('echotab_settings', function (s) {
      var theme = (s && s.echotab_settings && s.echotab_settings.theme) || 'system';
      var isDark = theme === 'dark' || (theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    });
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}

document.addEventListener('DOMContentLoaded', function () {
  app = $('#app');
  if (!app) { console.error('[EchoTab] #app element not found'); return; }
  applyTheme();
  paint();
});
