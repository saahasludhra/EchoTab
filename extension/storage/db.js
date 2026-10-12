// IndexedDB wrapper for EchoTab — all data stays local.
// Stores: pages, bookmarks, notes, sessions, collections, searchHistory, favorites
// Exposed as window.EchoTabDB for plain-script access (no ES modules).

var ECHOTAB_DB_NAME = 'echotab-db';
var ECHOTAB_DB_VERSION = 1;

var ECHOTAB_STORES = {
  pages: { keyPath: 'id', indexes: ['url', 'title', 'visitedAt', 'domain', 'tags', 'collection'] },
  bookmarks: { keyPath: 'id', indexes: ['url', 'title', 'createdAt', 'domain', 'tags'] },
  notes: { keyPath: 'id', indexes: ['pageId', 'createdAt', 'updatedAt', 'tags'] },
  sessions: { keyPath: 'id', indexes: ['title', 'startedAt', 'endedAt', 'label'] },
  collections: { keyPath: 'id', indexes: ['name', 'createdAt', 'label'] },
  searchHistory: { keyPath: 'id', indexes: ['query', 'createdAt'] },
  favorites: { keyPath: 'id', indexes: ['url', 'title', 'createdAt'] },
};

var _echotabDb = null;

function openDB() {
  return new Promise(function (resolve, reject) {
    if (_echotabDb) return resolve(_echotabDb);
    var req = indexedDB.open(ECHOTAB_DB_NAME, ECHOTAB_DB_VERSION);
    req.onupgradeneeded = function () {
      var db = req.result;
      for (var name in ECHOTAB_STORES) {
        if (!db.objectStoreNames.contains(name)) {
          var cfg = ECHOTAB_STORES[name];
          var store = db.createObjectStore(name, { keyPath: cfg.keyPath });
          (cfg.indexes || []).forEach(function (idx) {
            store.createIndex(idx, idx, { unique: false });
          });
        }
      }
    };
    req.onsuccess = function () {
      _echotabDb = req.result;
      resolve(_echotabDb);
    };
    req.onerror = function () { reject(req.error); };
  });
}

function dbAdd(store, value) {
  return openDB().then(function (db) {
    return new Promise(function (resolve, reject) {
      var tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).put(value);
      tx.oncomplete = function () { resolve(value); };
      tx.onerror = function () { reject(tx.error); };
    });
  });
}

function dbBulkAdd(store, values) {
  return openDB().then(function (db) {
    return new Promise(function (resolve, reject) {
      var tx = db.transaction(store, 'readwrite');
      var os = tx.objectStore(store);
      values.forEach(function (v) { os.put(v); });
      tx.oncomplete = function () { resolve(values); };
      tx.onerror = function () { reject(tx.error); };
    });
  });
}

function dbAll(store) {
  return openDB().then(function (db) {
    return new Promise(function (resolve, reject) {
      var tx = db.transaction(store, 'readonly');
      var req = tx.objectStore(store).getAll();
      req.onsuccess = function () { resolve(req.result || []); };
      req.onerror = function () { reject(req.error); };
    });
  });
}

function dbCount(store) {
  return openDB().then(function (db) {
    return new Promise(function (resolve, reject) {
      var tx = db.transaction(store, 'readonly');
      var req = tx.objectStore(store).count();
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
  });
}

function dbClear(store) {
  return openDB().then(function (db) {
    return new Promise(function (resolve, reject) {
      var tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).clear();
      tx.oncomplete = function () { resolve(); };
      tx.onerror = function () { reject(tx.error); };
    });
  });
}

function clearAllStores() {
  var names = Object.keys(ECHOTAB_STORES);
  return Promise.all(names.map(function (n) { return dbClear(n); }));
}

// Expose to other scripts
var EchoTabDB = {
  openDB: openDB,
  dbAdd: dbAdd,
  dbBulkAdd: dbBulkAdd,
  dbAll: dbAll,
  dbCount: dbCount,
  dbClear: dbClear,
  clearAllStores: clearAllStores,
};
