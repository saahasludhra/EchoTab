# EchoTab

EchoTab was built because throughout my Internet surfing sessions, I kept losing track of which websites contained useful articles, documents and research I had already read. I often remembered what I had seen but not where I had found it. The bookmarks folder became very cluttered and my Chrome homepage was overall a mess. Thus, I built EchoTab to intelligently track my browsing history, turning it into a personalised, searchable memory.

> "Show me the React article I read yesterday."
> "Find the website about operating systems."
> "Show all AI research from this week."

Everything runs **locally** on your device. No accounts, no servers, no data leaves your browser.

## Install (Load Unpacked)

1. Download and extract this ZIP.
2. Open `chrome://extensions` (or `edge://extensions` in Edge).
3. Toggle **Developer mode** (top-right).
4. Click **Load unpacked**.
5. Select the `EchoTab` folder (the one containing `manifest.json`).
6. Pin EchoTab to your toolbar and press the icon (or `Ctrl+Shift+E`) to search.

## Features

- **Semantic search** — rank pages by meaning, recency, and type, not just keywords.
- **Smart collections** — browsing is auto-grouped into thematic collections.
- **AI page summary** — a local extractive summary is generated for every page.
- **Research sessions** — focused browsing is detected and saved as a session.
- **Quick notes** — attach notes to any page with a keyboard shortcut.
- **Knowledge timeline** — revisit your browsing chronologically.
- **Search history** — your past queries, searchable.
- **Favorite pages** — pin pages you keep coming back to.
- **Session replay** — reopen an entire research session at once.
- **Import & export** — your data is yours; export it anytime as JSON.
- **Dark mode** — dark, light, or follow your system.
- **Privacy controls** — pause indexing anytime; incognito is excluded by default.

## Keyboard shortcuts

| Action          | Default         |
| --------------- | --------------- |
| Open search     | `Ctrl+Shift+E`  |
| Save page       | `Ctrl+Shift+S`  |
| Quick note      | `Ctrl+Shift+N`  |

Change the bindings at `chrome://extensions/shortcuts`.

## Architecture

```
EchoTab/
├── manifest.json
├── background/service-worker.js   # indexing, sessions, commands, messaging
├── content/content.js             # quick-note composer + page text capture
├── popup/                         # search-first popup UI
├── options/                       # full settings page
├── storage/db.js                  # IndexedDB wrapper (all local)
├── storage/settings.js            # chrome.storage.local settings
├── storage/demo-data.js           # seed data for first run
├── utils/search.js                # local semantic search + summarizer
├── icons/                         # extension icons
└── styles/                        # shared styles
```

### Browser APIs used

- `chrome.history`, `chrome.bookmarks`, `chrome.tabs`, `chrome.action`
- `chrome.contextMenus`, `chrome.commands`, `chrome.idle`
- `chrome.storage.local`, `chrome.runtime` messaging
- IndexedDB for structured page/note/session storage
- Content scripts for on-page note composition

## Privacy

EchoTab is privacy-first by design:

- No network requests. No analytics. No accounts.
- All data lives in IndexedDB and `chrome.storage.local` on your machine.
- Privacy mode pauses indexing instantly.
- Incognito visits are never indexed.
- Export or wipe your memory anytime from **Settings → Privacy & Data**.

## Tech

Chrome Extension Manifest V3 · vanilla JS modules · IndexedDB · CSS.

## Creator

Built by **Saahas Ludhra** — Army Public School, Wellington, Coonoor.
Aspiring Computer Science student. AP Computer Science A: 4.

## License

MIT — see [LICENSE](./LICENSE).
