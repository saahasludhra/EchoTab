// EchoTab content script — runs on every page.
// Adds a floating Quick Note composer and sends page text to the background
// for local summarization. No data leaves the browser. Plain JS, no modules.

(function () {
  if (window.__echotabInjected) return;
  window.__echotabInjected = true;

  var noteEl = null;

  function buildQuickNote() {
    if (noteEl) {
      noteEl.classList.add('et-open');
      var ta = noteEl.querySelector('textarea');
      if (ta) ta.focus();
      return;
    }
    noteEl = document.createElement('div');
    noteEl.className = 'et-quicknote et-open';
    noteEl.innerHTML =
      '<div class="et-qn-head">' +
        '<span class="et-qn-title">Quick Note</span>' +
        '<button class="et-qn-close" aria-label="Close">\u00d7</button>' +
      '</div>' +
      '<input class="et-qn-input" placeholder="Note title (optional)" />' +
      '<textarea class="et-qn-body" placeholder="Write a note about this page\u2026"></textarea>' +
      '<div class="et-qn-foot">' +
        '<span class="et-qn-domain">' + location.hostname + '</span>' +
        '<button class="et-qn-save">Save note</button>' +
      '</div>';
    document.body.appendChild(noteEl);

    var close = function () { noteEl.classList.remove('et-open'); };
    noteEl.querySelector('.et-qn-close').addEventListener('click', close);

    noteEl.querySelector('.et-qn-save').addEventListener('click', function () {
      var titleInput = noteEl.querySelector('.et-qn-input');
      var bodyInput = noteEl.querySelector('.et-qn-body');
      var title = (titleInput && titleInput.value) || 'Quick note';
      var body = (bodyInput && bodyInput.value) || '';
      try {
        chrome.runtime.sendMessage({
          type: 'add-note',
          pageId: null,
          title: title,
          body: body,
          tags: ['quick', location.hostname],
        });
      } catch (e) { /* background not ready */ }
      if (titleInput) titleInput.value = '';
      if (bodyInput) bodyInput.value = '';
      close();
      flashSaved();
    });

    var body = noteEl.querySelector('.et-qn-body');
    if (body) body.focus();
  }

  function flashSaved() {
    var t = document.createElement('div');
    t.className = 'et-toast';
    t.textContent = 'Saved to EchoTab';
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add('et-show'); }, 10);
    setTimeout(function () {
      t.classList.remove('et-show');
      setTimeout(function () { if (t.parentNode) t.remove(); }, 300);
    }, 1800);
  }

  try {
    chrome.runtime.onMessage.addListener(function (msg) {
      if (msg && msg.type === 'open-quick-note') buildQuickNote();
    });
  } catch (e) { /* runtime unavailable */ }

  function collectPageText() {
    var blocks = Array.prototype.slice.call(
      document.querySelectorAll('article, main, p, h1, h2, h3, li')
    ).slice(0, 200);
    var texts = blocks.map(function (el) {
      var txt = el.innerText;
      return txt ? txt.trim() : '';
    }).filter(Boolean);
    return texts.join('\n').slice(0, 8000);
  }

  var sent = false;
  function sendSignal() {
    if (sent) return;
    sent = true;
    var text = collectPageText();
    if (text.length > 120) {
      try {
        chrome.runtime.sendMessage({ type: 'page-text', url: location.href, text: text });
      } catch (e) { /* background not ready */ }
    }
  }

  if (document.readyState === 'complete') {
    sendSignal();
  } else {
    window.addEventListener('load', function () { setTimeout(sendSignal, 1200); });
  }
})();
