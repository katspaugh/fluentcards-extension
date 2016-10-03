/**
 * Copyright (c) 2011 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */
'use strict';

const BUTTON_TEMPLATE = () => {
    return `
<fc-button>
  <svg preserveAspectRatio viewBox="0 0 72 28" xmlns="http://www.w3.org/2000/svg">
    <g fill="#FBEA31">
      <rect x="0"  y="0" width="20" height="28" rx="4" ry="4" />
      <rect x="24" y="0" width="20" height="28" rx="4" ry="4" />
      <rect x="48" y="0" width="20" height="28" rx="4" ry="4" />
    </g>
  </svg>
</fc-button>
`;
}

const POPUP_TEMPLATE = (data) => {
    return `
<fc-popup>
  <a class="fc-logo" href="https://fluencards.com">${ BUTTON_TEMPLATE() }</a>
  ${ data.defs }
  <fc-div class="fc-powered">Powered by <a href="https://tech.yandex.com/dictionary/" target="_blank">Yandex.Dictionary</a>
</fc-popup>
`;
}

const DEF_TEMPLATE = (data) => {
    return `
<fc-div>
  <fc-span class="fc-text">${ data.text && data.text.length < 50 ? data.text : '' }</fc-span>
  <fc-span class="fc-fl">${ data.fl ? '; ' + data.fl : '' }</fc-span>
  <fc-span class="fc-gen">${ data.gen ? ', ' + data.gen : '' }</fc-span>
  <fc-span class="fc-pos">${ data.pos || '' }</fc-span>
  <fc-div class="fc-ts">${ data.ts ? '[' + data.ts + ']' : '' }</fc-div>

  <fc-ul>${ data.items }</fc-ul>
</fc-div>
`
};

const ITEM_TEMPLATE = (data) => {
    return `
<fc-li>
  <fc-span>${ data.text }</fc-span>
</fc-li>
`;
}


function storageSet(data) {
    return new Promise((resolve) => chrome.storage.sync.set(data, resolve));
}

function storageGet(key) {
    return new Promise((resolve) => chrome.storage.sync.get(key, resolve));
}

function storageClear() {
    return new Promise((resolve) => chrome.storage.sync.clear(resolve));
}

function getTargetLanguage() {
    return chrome.i18n.getUILanguage().split('-')[0];
}

function getContext(sel) {
    let selectedText = sel.toString();
    let fullContext = sel.focusNode.parentElement.textContent;
    let range = sel.getRangeAt(0);
    let partialContext = range.startContainer.textContent;
    let start = fullContext.indexOf(partialContext);
    let end = start + partialContext.length;
    let sentence = '';

    fullContext.replace(/\n/g, ' ').replace(/.+?[.!?]/g, (s, sentenceStart) => {
        let sentenceEnd = sentenceStart + s.length;
        let inSelection = (sentenceStart >= start || sentenceEnd <= end) ||
            (start <= sentenceStart || end <= sentenceEnd);
        if (!sentence && sentenceStart >= start && s.indexOf(selectedText) != -1) {
            sentence = s;
        }
    });

    return sentence.trim() || fullContext;
}

function detectLanguage(sel) {
    return new Promise((resolve, reject) => {
        let context = sel.focusNode.parentElement.textContent;

        chrome.i18n.detectLanguage(context, (result) => {
            let lang = (result && result.languages && result.languages.length) ?
                result.languages[0].language : 'en';
            resolve(lang);
        });
    });
}

function createPopup(sel, html, options) {
    options = options || {};

    let div = document.createElement('div');
    let range = sel.getRangeAt(0);
    if (options.right) range.collapse();
    let bbox = range.getBoundingClientRect();
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    let scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;

    div.style.position = 'absolute';
    div.style.zIndex = 1000;
    div.style.left = (bbox.left + scrollLeft) + 'px';
    div.style.top = (bbox.bottom + scrollTop) + 'px';
    div.innerHTML = html;
    document.body.appendChild(div);

    let onSelectionChange = () => {
        div.remove();
        document.removeEventListener('selectionchange', onSelectionChange);
    };
    document.addEventListener('selectionchange', onSelectionChange, false);

    return div;
}

function ajax(url) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.send();

    var onChange = () => xhr.abort();
    var unsubscribe = () => document.removeEventListener('selectionchange', onChange);
    document.addEventListener('selectionchange', onChange);

    return new Promise((resolve, reject) => {
        xhr.onload = () => {
            unsubscribe();

            let data;
            try {
                data = JSON.parse(xhr.responseText);
            } catch (e) {
                reject(e);
                return;
            }
            resolve(data);
        };

        xhr.onerror = xhr.onabort = () => {
            unsubscribe();
            reject(xhr.statusText);
        };
    })
}

function downloadTranslation(text, lang) {
    const apiKeys = [
        'dHJuc2wuMS4xLjIwMTYwNzA5VDExNDkyOFouZDI4OWYyZjA0NDdkNDk3Mi5hOWYzMjVkOWM0ZWMxNWE1NDRmZDVhNzI1MTdjZDdjYTY0M2FhMDNk'
    ];
    const endpoint = 'https://translate.yandex.net/api/v1.5/tr.json/translate?format=html';

    let targetLang = getTargetLanguage();
    let langPair = lang + '-' + targetLang;

    let url = [
        endpoint,
        'key=' + atob(apiKeys[~~(Math.random() * apiKeys.length)]),
        'lang=' + langPair,
        'text=' + encodeURIComponent(text)
    ].join('&');

    return ajax(url).then((data) => {
        if (data && data.text && data.text.length) {
            return { def: [ { text: text, tr: [ { text: data.text[0] } ] } ] };
        }

        throw new Error('No data');
    });
}

function downloadDefinition(text, lang) {
    const apiKeys = [
        'ZGljdC4xLjEuMjAxNTA4MTdUMDgxMTAzWi43YWM4YTUzODk0OTFjYTE1LjkxNjQwNjQwNzEyM2Y2MDlmZDBiZjkzYzEyMjE5MGQ1NmFmNjM1OWM=',
        'ZGljdC4xLjEuMjAxNDA4MTBUMTgwODQyWi40YzA1ZmEyMzkyOWQ4OTFiLjA5Y2QzOTUyZDQ4Njk2YzYzOWIxNjRhNzcxZjY5NDU2N2IwNGJkZWY=',
        'ZGljdC4xLjEuMjAxNDExMjJUMTIwMzA2Wi40ZTQ2NzY1ZGQyMDYwMTBhLjNlNGExYjE4MmRmNWQ4OTJmZDc0ZGQzZTQ0ZjM4OWIwZTVhZWVhMjQ='
    ];
    const endpoint = 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup?&flags=4';

    const langs = [ 'be-be','be-ru','bg-ru','cs-en','cs-ru','da-en','da-ru','de-de','de-en','de-ru','de-tr','el-en','el-ru','en-cs','en-da','en-de','en-el','en-en','en-es','en-et','en-fi','en-fr','en-it','en-lt','en-lv','en-nl','en-no','en-pt','en-ru','en-sk','en-sv','en-tr','en-uk','es-en','es-es','es-ru','et-en','et-ru','fi-en','fi-ru','fr-en','fr-fr','fr-ru','it-en','it-it','it-ru','lt-en','lt-ru','lv-en','lv-ru','nl-en','nl-ru','no-en','no-ru','pl-ru','pt-en','pt-ru','ru-be','ru-bg','ru-cs','ru-da','ru-de','ru-el','ru-en','ru-es','ru-et','ru-fi','ru-fr','ru-it','ru-lt','ru-lv','ru-nl','ru-no','ru-pl','ru-pt','ru-ru','ru-sk','ru-sv','ru-tr','ru-tt','ru-uk','sk-en','sk-ru','sv-en','sv-ru','tr-de','tr-en','tr-ru','tt-ru','uk-en','uk-ru','uk-uk' ];

    let targetLang = getTargetLanguage();
    let langPair = lang + '-' + targetLang;

    if (langs.indexOf(langPair) == -1) {
        langPair = lang + '-' + 'en';
    }

    let url = [
        endpoint,
        'key=' + atob(apiKeys[~~(Math.random() * apiKeys.length)]),
        'lang=' + langPair,
        'text=' + encodeURIComponent(text)
    ].join('&');

    return ajax(url).then((data) => {
        if (data && data.def && data.def.length) return data;

        throw new Error('No data');
    });
}

function formatData(data) {
    let defs = data.def.map((def) => {
        let items = def.tr.map((tr) => ITEM_TEMPLATE(tr));
        let result = Object.create(def);
        result.items = items.join('');
        return DEF_TEMPLATE(result);
    }).join('');

    return POPUP_TEMPLATE({ defs: defs });
}

function speakWord(text, lang) {
    let speech = new window.SpeechSynthesisUtterance();
    speech.text = text;
    speech.lang = lang;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
}

function updateBadge() {
    getUniqueLines().then((lines) => {
        chrome.runtime.sendMessage({ badgeCount: lines.length });
    });
}

function saveData(data, lang, selectedText, context) {
    let item = {};
    let key = Date.now();
    item[key] = {
        def: data.def,
        selection: selectedText,
        context: context,
        lang: lang,
        url: window.location.href,
        domain: window.location.hostname
    };
    storageSet(item);
    updateBadge();

    return data;
}

function lookupSelection(sel) {
    let selectedText = sel.toString();
    if (!selectedText) return;

    let popup = createPopup(sel, POPUP_TEMPLATE({ defs: 'Loading...' }));
    let onSuccess = (data) => popup.innerHTML = formatData(data);
    let onError = () => popup.remove();

    return detectLanguage(sel).then((lang) => {
        return downloadDefinition(selectedText, lang)
            .catch(() => downloadTranslation(selectedText, lang))
            .then((data) => saveData(data, lang, selectedText, getContext(sel)))
            .then(onSuccess)
            .then(() => speakWord(selectedText, lang))
            .catch(onError)
    });
}

function renderButton(sel) {
    let html = BUTTON_TEMPLATE();
    return createPopup(sel, html, { right: true });
}

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
	var context = this, args = arguments;
	var later = function() {
	    timeout = null;
	    if (!immediate) func.apply(context, args);
	};
	var callNow = immediate && !timeout;
	clearTimeout(timeout);
	timeout = setTimeout(later, wait);
	if (callNow) func.apply(context, args);
    };
}

function getCloze(context, word) {
    let cloze = context.replace(new RegExp('\\b' + word + '\\b', 'g'), '{{c1::$&}}');

    // Languages like Japanese and Chinese don't have written word boundaries.
    if (cloze == context) {
        cloze = context.replace(new RegExp(word, 'g'), '{{c1::$&}}');
    }

    return cloze;
}

function getUniqueLines() {
    return storageGet().then((data) => {
        let defs = Object.keys(data).sort().map((key) => data[key]);

        if (!defs.length) {
            return [];
        }

        let lines = defs.map((item) => {
            let vocab = item.def[0];

            let word = vocab.text;

            if (vocab.fl) {
                word += ', ' + vocab.fl;
            }

            if (vocab.gender) {
                word += ', ' + vocab.gender;
            }

            let items = [ word ];

            items.push(vocab.tr[0].text || '');
            items.push(getCloze(item.context, item.selection));

            return items.join('\t');
        });

        let unique = lines.filter((line, index) => {
            return lines.indexOf(line) == index;
        });

        return unique;
    });
}

function exportCards() {
    getUniqueLines().then((lines) => {
        let csv = lines.join('\n');
        let url = 'data:text/plain;charset=utf-8,' + encodeURIComponent(csv)

        window.open(url);
    });
}

function onExtensionMessage(msg, sender, response) {
    if (msg.exportCards) return exportCards();
}

function isValidSelection (sel) {
    let selectedText = sel.toString();
    return selectedText && selectedText.split(' ').length <= 3;
}

function initContentScript() {
    let currButton = null;
    let timeout;

    document.addEventListener('selectionchange', debounce((e) => {
        let sel = window.getSelection();

        if (currButton) currButton.remove();

        if (!isValidSelection(sel)) return;

        currButton = renderButton(sel);

        if (!currButton) return;

        currButton.addEventListener('mouseenter', (e) => {
            timeout = setTimeout(() => lookupSelection(sel), 300);
        });
        currButton.addEventListener('mouseleave', (e) => {
            timeout && clearTimeout(timeout);
        });
    }, 100), false);

    chrome.runtime.onMessage.addListener(onExtensionMessage);
    updateBadge();
}

initContentScript();
