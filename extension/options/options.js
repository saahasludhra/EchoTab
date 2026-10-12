// EchoTab options/settings page — plain JS, no framework.

var $ = function (s, r) { return (r || document).querySelector(s); };

function send(msg) {
  return new Promise(function (resolve) {
    try { chrome.runtime.sendMessage(msg, resolve); }
    catch (e) { resolve({ ok: false, error: String(e) }); }
  });
}

var app;
var tab = 'general';
var settings = ECHOTAB_SETTINGS_DEFAULTS;

function escapeHtml(s) {
  return (s || '').replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function toggle(label, hint, key) {
  var on = settings[key];
  return '<div class="row">' +
    '<div><div class="row-label">' + escapeHtml(label) + '</div>' + (hint ? '<div class="row-hint">' + escapeHtml(hint) + '</div>' : '') + '</div>' +
    '<label class="switch"><input type="checkbox" data-key="' + key + '"' + (on ? ' checked' : '') + ' /><span class="slider"></span></label>' +
  '</div>';
}

function selectRow(label, hint, key, options) {
  return '<div class="row">' +
    '<div><div class="row-label">' + escapeHtml(label) + '</div>' + (hint ? '<div class="row-hint">' + escapeHtml(hint) + '</div>' : '') + '</div>' +
    '<select data-key="' + key + '">' +
      options.map(function (o) { return '<option value="' + o[0] + '"' + (settings[key] === o[0] ? ' selected' : '') + '>' + escapeHtml(o[1]) + '</option>'; }).join('') +
    '</select>' +
  '</div>';
}

function numRow(label, hint, key) {
  return '<div class="row">' +
    '<div><div class="row-label">' + escapeHtml(label) + '</div>' + (hint ? '<div class="row-hint">' + escapeHtml(hint) + '</div>' : '') + '</div>' +
    '<input type="number" data-key="' + key + '" value="' + settings[key] + '" min="1" max="365" style="width:90px" />' +
  '</div>';
}

function textRow(label, hint, key) {
  return '<div class="row">' +
    '<div><div class="row-label">' + escapeHtml(label) + '</div>' + (hint ? '<div class="row-hint">' + escapeHtml(hint) + '</div>' : '') + '</div>' +
    '<input type="text" data-key="' + key + '" value="' + escapeHtml(settings[key]) + '" class="shortcut" style="width:160px" />' +
  '</div>';
}

function loadStats() {
  return send({ type: 'get-all' }).then(function (res) {
    var d = (res && res.data) || {};
    return {
      pages: (d.pages || []).length,
      bookmarks: (d.bookmarks || []).length,
      notes: (d.notes || []).length,
      sessions: (d.sessions || []).length,
    };
  }).catch(function () { return { pages: 0, bookmarks: 0, notes: 0, sessions: 0 }; });
}

function renderTab() {
  var content = $('#content');
  if (!content) return;
  if (tab === 'general') {
    content.innerHTML =
      '<div class="card">' +
        '<h2>Appearance</h2><p class="desc">Choose how EchoTab looks.</p>' +
        selectRow('Theme', 'Dark, light, or match your system.', 'theme', [['system', 'System'], ['dark', 'Dark'], ['light', 'Light']]) +
        selectRow('Font size', 'Popup and notes text size.', 'fontSize', [['small', 'Small'], ['medium', 'Medium'], ['large', 'Large']]) +
      '</div>' +
      '<div class="card">' +
        '<h2>Intelligence</h2><p class="desc">Control how EchoTab understands your browsing.</p>' +
        toggle('Semantic search', 'Rank results by meaning, not just keywords.', 'semanticSearch') +
        toggle('Auto page summaries', 'Generate a local summary when you visit a page.', 'autoSummary') +
        toggle('Auto-index visits', 'Automatically add visited pages to your memory.', 'autoIndex') +
      '</div>';
  } else if (tab === 'sessions') {
    content.innerHTML =
      '<div class="card">' +
        '<h2>Research sessions</h2><p class="desc">EchoTab groups focused browsing into sessions automatically.</p>' +
        toggle('Track sessions', 'Detect research sessions from your tab activity.', 'trackSessions') +
        toggle('Smart collections', 'Suggest collections from your sessions.', 'smartCollections') +
        numRow('Retention (days)', 'Delete indexed pages older than this.', 'retentionDays') +
      '</div>';
  } else if (tab === 'shortcuts') {
    content.innerHTML =
      '<div class="card">' +
        '<h2>Keyboard shortcuts</h2><p class="desc">These mirror the Chrome commands. Change the real bindings at chrome://extensions/shortcuts.</p>' +
        textRow('Open search', 'Default: Ctrl+Shift+E', 'shortcutSearch') +
        textRow('Save page', 'Default: Ctrl+Shift+S', 'shortcutSave') +
        textRow('Quick note', 'Default: Ctrl+Shift+N', 'shortcutNote') +
      '</div>';
  } else if (tab === 'privacy') {
    content.innerHTML =
      '<div class="card">' +
        '<h2>Privacy controls</h2><p class="desc">Everything in EchoTab stays on your device.</p>' +
        toggle('Privacy mode', 'Pause all indexing until you turn this off.', 'privacyMode') +
        toggle('Exclude incognito', 'Never index pages visited in incognito mode.', 'incognitoExcluded') +
      '</div>' +
      '<div class="card">' +
        '<h2>Data</h2><p class="desc">Export or reset your local EchoTab memory.</p>' +
        '<div class="actions" style="margin-top:8px">' +
          '<button class="btn" id="export-btn">Export JSON</button>' +
          '<button class="btn btn-ghost" id="import-btn">Import JSON</button>' +
          '<input type="file" id="import-file" accept="application/json" style="display:none" />' +
          '<button class="btn btn-danger" id="reset-btn">Reset to demo data</button>' +
        '</div>' +
      '</div>';
  } else if (tab === 'about') {
    loadStats().then(function (stats) {
      content.innerHTML =
        '<div class="stats">' +
          '<div class="stat"><div class="stat-num">' + stats.pages + '</div><div class="stat-label">Pages</div></div>' +
          '<div class="stat"><div class="stat-num">' + stats.bookmarks + '</div><div class="stat-label">Bookmarks</div></div>' +
          '<div class="stat"><div class="stat-num">' + stats.notes + '</div><div class="stat-label">Notes</div></div>' +
          '<div class="stat"><div class="stat-num">' + stats.sessions + '</div><div class="stat-label">Sessions</div></div>' +
        '</div>' +
        '<div class="card">' +
          '<h2>About EchoTab</h2><p class="desc">A privacy-first, AI-powered memory for your browser.</p>' +
          '<div class="about-grid">' +
            '<div class="about-item"><div class="about-label">Version</div><div class="about-val">1.0.2</div></div>' +
            '<div class="about-item"><div class="about-label">Manifest</div><div class="about-val">V3</div></div>' +
            '<div class="about-item"><div class="about-label">Storage</div><div class="about-val">IndexedDB + chrome.storage (local only)</div></div>' +
            '<div class="about-item"><div class="about-label">Creator</div><div class="about-val">Saahas Ludhra</div></div>' +
            '<div class="about-item"><div class="about-label">Homepage</div><div class="about-val">echotab.app</div></div>' +
          '</div>' +
        '</div>';
      wireInputs();
    });
    return;
  }
  wireInputs();
}

function renderShell() {
  var tabs = [
    ['general', 'General'], ['sessions', 'Sessions'],
    ['shortcuts', 'Shortcuts'], ['privacy', 'Privacy & Data'], ['about', 'About'],
  ];
  app.innerHTML =
    '<div class="wrap">' +
      '<div class="head">' +
        '<div class="logo">E</div>' +
        '<div class="brand"><h1>Echo<span>Tab</span></h1><p>Settings & preferences</p></div>' +
      '</div>' +
      '<div class="tabs">' +
        tabs.map(function (t) { return '<button class="tab' + (t[0] === tab ? ' active' : '') + '" data-tab="' + t[0] + '">' + t[1] + '</button>'; }).join('') +
      '</div>' +
      '<div id="content"></div>' +
    '</div>';
  app.querySelectorAll('.tab').forEach(function (t) {
    t.addEventListener('click', function () { tab = t.dataset.tab; renderShell(); });
  });
  renderTab();
}

function wireInputs() {
  app.querySelectorAll('[data-key]').forEach(function (node) {
    var handler = function () {
      var key = node.dataset.key;
      var val = node.type === 'checkbox' ? node.checked : (node.type === 'number' ? Number(node.value) : node.value);
      var patch = {};
      patch[key] = val;
      setSettings(patch).then(function (s) {
        settings = s;
        if (key === 'theme') applyTheme();
        toast('Saved');
      });
    };
    node.addEventListener('change', handler);
  });
  var exportBtn = $('#export-btn');
  if (exportBtn) exportBtn.addEventListener('click', function () {
    send({ type: 'export' }).then(function (res) {
      var blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = 'echotab-export-' + Date.now() + '.json';
      a.click(); URL.revokeObjectURL(url);
      toast('Exported');
    });
  });
  var importBtn = $('#import-btn');
  if (importBtn) importBtn.addEventListener('click', function () { $('#import-file').click(); });
  var importFile = $('#import-file');
  if (importFile) importFile.addEventListener('change', function (e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    file.text().then(function (text) {
      try {
        var data = JSON.parse(text);
        var stores = ['pages', 'bookmarks', 'notes', 'sessions', 'collections'];
        var promises = [];
        stores.forEach(function (store) {
          if (Array.isArray(data[store])) {
            promises.push(send({ type: 'import-store', store: store, values: data[store] }));
          }
        });
        Promise.all(promises).then(function () { toast('Imported'); });
      } catch (err) { toast('Invalid file'); }
    });
  });
  var resetBtn = $('#reset-btn');
  if (resetBtn) resetBtn.addEventListener('click', function () {
    if (!confirm('Reset all EchoTab data to demo content?')) return;
    send({ type: 'reset-demo' }).then(function () { toast('Reset complete'); renderTab(); });
  });
}

function toast(msg) {
  var t = document.createElement('div');
  t.textContent = msg;
  t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#0b0f1a;color:#e6edf7;border:1px solid rgba(255,255,255,0.12);padding:10px 20px;border-radius:999px;font-size:13px;z-index:9999;opacity:0;transition:opacity .2s';
  document.body.appendChild(t);
  requestAnimationFrame(function () { t.style.opacity = '1'; });
  setTimeout(function () { t.style.opacity = '0'; setTimeout(function () { t.remove(); }, 200); }, 1600);
}

function applyTheme() {
  var theme = settings.theme || 'system';
  var isDark = theme === 'dark' || (theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
}

document.addEventListener('DOMContentLoaded', function () {
  app = $('#app');
  if (!app) { console.error('[EchoTab] #app element not found'); return; }
  getSettings().then(function (s) {
    settings = s;
    applyTheme();
    renderShell();
  });
});
