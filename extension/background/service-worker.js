// EchoTab background service worker (MV3).
// Uses importScripts() to load shared plain-JS utilities.
// Responsibilities: index pages, generate local summaries, track sessions,
// wire keyboard commands, provide a messaging bridge, context menus.

importScripts(
  '../storage/db.js',
  '../storage/settings.js',
  '../storage/demo-data.js',
  '../utils/search.js'
);

var SEED_FLAG = 'echotab_seeded_v1';

function makeId(prefix) {
  return prefix + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
}

function domainOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch (e) { return ''; }
}

function seedIfEmpty() {
  return dbCount('pages').then(function (cnt) {
    return new Promise(function (resolve) {
      chrome.storage.local.get(SEED_FLAG, function (seeded) {
        if (cnt === 0 && !seeded[SEED_FLAG]) {
          Promise.all([
            dbBulkAdd('pages', EchoTabDemoData.demoPages),
            dbBulkAdd('sessions', EchoTabDemoData.demoSessions),
            dbBulkAdd('notes', EchoTabDemoData.demoNotes),
            dbBulkAdd('collections', EchoTabDemoData.demoCollections),
            dbBulkAdd('searchHistory', EchoTabDemoData.demoSearchHistory),
          ]).then(function () {
            chrome.storage.local.set({ SEED_FLAG: true }, function () {
              console.log('[EchoTab] Seeded demo data.');
              resolve();
            });
          }).catch(function (e) {
            console.warn('[EchoTab] Seed failed', e);
            resolve();
          });
        } else {
          resolve();
        }
      });
    });
  }).catch(function (e) {
    console.warn('[EchoTab] Seed check failed', e);
  });
}

function indexPage(tab) {
  if (!tab || !tab.url) return Promise.resolve(null);
  var url = tab.url;
  if (
    url.indexOf('chrome://') === 0 ||
    url.indexOf('chrome-extension://') === 0 ||
    url.indexOf('edge://') === 0 ||
    url.indexOf('about:') === 0
  ) return Promise.resolve(null);
  return getSettings().then(function (settings) {
    if (settings.privacyMode) return null;
    var page = {
      id: makeId('pg'),
      url: url,
      title: tab.title || url,
      domain: domainOf(url),
      summary: 'Visited ' + (tab.title || 'this page') + ' on ' + domainOf(url) + '.',
      tags: [],
      collection: null,
      visitedAt: Date.now(),
      visitCount: 1,
      readingTime: 0,
      favIcon: tab.favIconUrl || 'https://www.google.com/s2/favicons?domain=' + domainOf(url) + '&sz=64',
    };
    return dbAdd('pages', page).then(function () { return page; });
  });
}

var sessionStart = Date.now();
var sessionPageIds = [];
var sessionTabCount = 0;

function flushSession() {
  if (sessionPageIds.length < 2) {
    sessionPageIds = [];
    sessionTabCount = 0;
    return Promise.resolve();
  }
  return getSettings().then(function (settings) {
    if (!settings.trackSessions) { sessionPageIds = []; return; }
    return dbAll('pages').then(function (pages) {
      var relevant = pages.filter(function (p) { return sessionPageIds.indexOf(p.id) !== -1; });
      if (relevant.length < 2) { sessionPageIds = []; return; }
      var suggestion = etSuggestCollection(relevant);
      var session = {
        id: makeId('sess'),
        title: (relevant[0] && relevant[0].title ? relevant[0].title.slice(0, 60) : 'Research session'),
        label: (suggestion && suggestion.name) || 'Session',
        startedAt: sessionStart,
        endedAt: Date.now(),
        pageIds: sessionPageIds.slice(),
        tabCount: sessionTabCount,
        summary: etSummarize(relevant.map(function (p) { return p.summary; }).join(' '), 2),
      };
      return dbAdd('sessions', session).then(function () {
        sessionPageIds = [];
        sessionTabCount = 0;
      });
    });
  });
}

chrome.tabs.onActivated.addListener(function (info) {
  chrome.tabs.get(info.tabId, function (tab) {
    if (chrome.runtime.lastError || !tab) return;
    sessionTabCount++;
    indexPage(tab).then(function (page) {
      if (page) sessionPageIds.push(page.id);
    });
  });
});

chrome.tabs.onUpdated.addListener(function (_id, info, tab) {
  if (info.status === 'complete' && tab.active) {
    indexPage(tab).then(function (page) {
      if (page) sessionPageIds.push(page.id);
    });
  }
});

chrome.idle.onStateChanged.addListener(function (state) {
  if (state === 'idle') flushSession();
});

chrome.runtime.onStartup.addListener(function () {
  seedIfEmpty();
  sessionStart = Date.now();
});

chrome.runtime.onInstalled.addListener(function (details) {
  seedIfEmpty();
  createContextMenus();
  // Do NOT auto-open the options page on install — that confused users.
  // The extension popup works immediately with seeded demo data.
});

function createContextMenus() {
  try {
    chrome.contextMenus.removeAll(function () {
      chrome.contextMenus.create({ id: 'echotab-save', title: 'Save to EchoTab memory', contexts: ['page', 'link'] });
      chrome.contextMenus.create({ id: 'echotab-note', title: 'Add quick note for this page', contexts: ['page'] });
      chrome.contextMenus.create({ id: 'echotab-bookmark', title: 'Smart bookmark this page', contexts: ['page'] });
    });
  } catch (e) { /* contextMenus may be unavailable */ }
}

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === 'echotab-save') {
    indexPage(tab);
  } else if (info.menuItemId === 'echotab-note') {
    if (tab && tab.id) {
      try { chrome.tabs.sendMessage(tab.id, { type: 'open-quick-note' }); } catch (e) {}
    }
  } else if (info.menuItemId === 'echotab-bookmark') {
    var b = {
      id: makeId('bm'),
      url: (tab && tab.url) || info.pageUrl,
      title: (tab && tab.title) || info.pageUrl,
      domain: domainOf((tab && tab.url) || info.pageUrl),
      createdAt: Date.now(),
      tags: [],
      favIcon: tab && tab.favIconUrl ? tab.favIconUrl : null,
    };
    dbAdd('bookmarks', b);
  }
});

chrome.commands.onCommand.addListener(function (command) {
  if (command === 'open-search') {
    try { chrome.action.openPopup(); } catch (e) {}
  } else if (command === 'save-page') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0]) indexPage(tabs[0]);
    });
  } else if (command === 'quick-note') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0] && tabs[0].id) {
        try { chrome.tabs.sendMessage(tabs[0].id, { type: 'open-quick-note' }); } catch (e) {}
      }
    });
  }
});

function enrichPage(url, text) {
  if (!url || !text) return;
  dbAll('pages').then(function (pages) {
    var match = null;
    for (var i = 0; i < pages.length; i++) {
      if (pages[i].url === url) {
        if (!match || pages[i].visitedAt > match.visitedAt) match = pages[i];
      }
    }
    if (!match) return;
    var summary = etSummarize(text, 2);
    var tokens = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/);
    var freq = {};
    tokens.forEach(function (t) { if (t.length > 3) freq[t] = (freq[t] || 0) + 1; });
    var entries = Object.keys(freq).map(function (k) { return [k, freq[k]]; });
    entries.sort(function (a, b) { return b[1] - a[1]; });
    var tags = entries.slice(0, 5).map(function (e) { return e[0]; });
    dbAdd('pages', Object.assign({}, match, {
      summary: summary || match.summary,
      tags: tags.length ? tags : match.tags,
    }));
  }).catch(function () {});
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (!msg || !msg.type) { sendResponse({ ok: false, error: 'missing type' }); return false; }
  var handled = true;
  switch (msg.type) {
    case 'search':
      dbAll('pages').then(function (pages) {
        var results = etSearch(msg.query, pages, { limit: msg.limit || 20 });
        sendResponse({ ok: true, results: results });
      }).catch(function (e) { sendResponse({ ok: false, error: String(e) }); });
      break;
    case 'get-all':
      Promise.all([
        dbAll('pages'), dbAll('bookmarks'), dbAll('notes'),
        dbAll('sessions'), dbAll('collections'), dbAll('searchHistory'), dbAll('favorites'),
      ]).then(function (vals) {
        sendResponse({
          ok: true,
          data: {
            pages: vals[0], bookmarks: vals[1], notes: vals[2],
            sessions: vals[3], collections: vals[4], searchHistory: vals[5], favorites: vals[6],
          },
        });
      }).catch(function (e) { sendResponse({ ok: false, error: String(e) }); });
      break;
    case 'save-search':
      dbAdd('searchHistory', {
        id: makeId('sh'), query: msg.query, createdAt: Date.now(), resultsCount: msg.count || 0,
      }).then(function () { sendResponse({ ok: true }); });
      break;
    case 'add-note':
      dbAdd('notes', {
        id: makeId('note'), pageId: msg.pageId || null, title: msg.title || 'Note',
        body: msg.body || '', tags: msg.tags || [], createdAt: Date.now(), updatedAt: Date.now(),
      }).then(function (note) { sendResponse({ ok: true, note: note }); });
      break;
    case 'add-bookmark':
      dbAdd('bookmarks', {
        id: makeId('bm'), url: msg.url, title: msg.title, domain: domainOf(msg.url),
        createdAt: Date.now(), tags: msg.tags || [], favIcon: msg.favIcon || null,
      }).then(function (b) { sendResponse({ ok: true, bookmark: b }); });
      break;
    case 'summarize-text':
      sendResponse({ ok: true, summary: etSummarize(msg.text, msg.maxSentences || 3) });
      break;
    case 'suggest-collection':
      dbAll('pages').then(function (pages) {
        sendResponse({ ok: true, suggestion: etSuggestCollection(pages.slice(0, 20)) });
      });
      break;
    case 'page-text':
      enrichPage(msg.url, msg.text);
      sendResponse({ ok: true });
      break;
    case 'import-store':
      if (Array.isArray(msg.values)) {
        dbBulkAdd(msg.store, msg.values).then(function () { sendResponse({ ok: true }); });
      } else {
        sendResponse({ ok: false, error: 'values must be an array' });
      }
      break;
    case 'reset-demo':
      clearAllStores().then(function () {
        return chrome.storage.local.remove(SEED_FLAG, function () {
          seedIfEmpty().then(function () { sendResponse({ ok: true }); });
        });
      });
      break;
    case 'export':
      Promise.all([
        dbAll('pages'), dbAll('bookmarks'), dbAll('notes'),
        dbAll('sessions'), dbAll('collections'), dbAll('searchHistory'), dbAll('favorites'),
      ]).then(function (vals) {
        sendResponse({
          ok: true,
          data: {
            pages: vals[0], bookmarks: vals[1], notes: vals[2],
            sessions: vals[3], collections: vals[4], searchHistory: vals[5], favorites: vals[6],
            exportedAt: new Date().toISOString(), version: '1.0.2',
          },
        });
      });
      break;
    default:
      sendResponse({ ok: false, error: 'unknown message type' });
      handled = false;
  }
  return true; // keep the message channel open for async responses
});

// Kick off initial seed when the service worker starts.
seedIfEmpty();
