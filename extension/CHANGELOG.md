# Changelog

All notable changes to EchoTab are documented here.

## [1.0.1] — 2026-08-01

### Fixed
- Added missing `idle` permission so research sessions flush correctly when the browser goes idle (broke on both Chrome and Edge).
- Fixed context menu "Add quick note" — now sends the correct `open-quick-note` message the content script expects.
- Added a `page-text` message handler in the background so content script text capture no longer throws an unhandled error on every page load; captured text now enriches page records with summaries and auto-tags.
- Added `import-store` message handler so the Import JSON button in Settings actually works.
- Hardened content script and background messaging with try/catch guards so missing or slow background responses don't crash the page or popup.
- Removed non-existent `assets/*` reference from `web_accessible_resources` (could trigger a load warning in Edge).
- Cleaned up the popup render path to remove a wasteful double `innerHTML` overwrite that could cause race conditions.

## [1.0.0] — 2026-07-30

### Added
- Initial release.
- Semantic search over browser history with intent-aware ranking (time, topic, type).
- Smart collections: auto-grouping of browsing into thematic collections.
- AI page summary: local extractive summarization for every indexed page.
- Research sessions: automatic detection and capture of focused browsing.
- Knowledge timeline: chronological browsing view.
- Search history with re-run support.
- Quick notes attached to any page via keyboard shortcut.
- Favorite pages pinning.
- Session replay to reopen a whole research session.
- Import & export of all data as JSON.
- Dark, light, and system themes.
- Privacy mode and incognito exclusion.
- Realistic demo data seeded on first install.
- Keyboard shortcuts: open search, save page, quick note.
- Context menu actions: save, note, smart bookmark.
- Full settings page (general, sessions, shortcuts, privacy, about).

### Known limitations
- Summaries are extractive (sentence selection), not generative — no LLM runs locally by default.
- Semantic matching uses lexical + heuristic scoring; a full embedding model is on the roadmap.
- Session detection is time-gap based; tab-tree reconstruction is planned.
- Edge cases on very long pages may truncate captured text at 8000 chars.
