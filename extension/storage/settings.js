// Lightweight local settings store backed by chrome.storage.local.
// Exposed as window.EchoTabSettings for plain-script access.

var ECHOTAB_SETTINGS_DEFAULTS = {
  theme: 'system',
  autoIndex: true,
  semanticSearch: true,
  autoSummary: true,
  trackSessions: true,
  smartCollections: true,
  privacyMode: false,
  incognitoExcluded: true,
  retentionDays: 90,
  shortcutSearch: 'Ctrl+Shift+E',
  shortcutSave: 'Ctrl+Shift+S',
  shortcutNote: 'Ctrl+Shift+N',
  resultsPerPage: 20,
  fontSize: 'medium',
};

function getSettings() {
  return new Promise(function (resolve) {
    var merged = Object.assign({}, ECHOTAB_SETTINGS_DEFAULTS);
    try {
      if (chrome && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get('echotab_settings', function (stored) {
          if (stored && stored.echotab_settings) Object.assign(merged, stored.echotab_settings);
          resolve(merged);
        });
      } else {
        var raw = localStorage.getItem('echotab_settings');
        if (raw) Object.assign(merged, JSON.parse(raw));
        resolve(merged);
      }
    } catch {
      resolve(merged);
    }
  });
}

function setSettings(patch) {
  return getSettings().then(function (current) {
    var next = Object.assign({}, current, patch);
    try {
      if (chrome && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ echotab_settings: next });
      } else {
        localStorage.setItem('echotab_settings', JSON.stringify(next));
      }
    } catch {
      // ignore
    }
    return next;
  });
}

var EchoTabSettings = {
  getSettings: getSettings,
  setSettings: setSettings,
  DEFAULTS: ECHOTAB_SETTINGS_DEFAULTS,
};
