/**
 * Copyright (c) 2011 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */
'use strict';

const LANGS = [ 'be-be','be-ru','bg-ru','cs-en','cs-ru','da-en','da-ru','de-de','de-en','de-ru','de-tr','el-en','el-ru','en-cs','en-da','en-de','en-el','en-en','en-es','en-et','en-fi','en-fr','en-it','en-lt','en-lv','en-nl','en-no','en-pt','en-ru','en-sk','en-sv','en-tr','en-uk','es-en','es-es','es-ru','et-en','et-ru','fi-en','fi-ru','fr-en','fr-fr','fr-ru','it-en','it-it','it-ru','lt-en','lt-ru','lv-en','lv-ru','nl-en','nl-ru','no-en','no-ru','pl-ru','pt-en','pt-ru','ru-be','ru-bg','ru-cs','ru-da','ru-de','ru-el','ru-en','ru-es','ru-et','ru-fi','ru-fr','ru-it','ru-lt','ru-lv','ru-nl','ru-no','ru-pl','ru-pt','ru-ru','ru-sk','ru-sv','ru-tr','ru-tt','ru-uk','sk-en','sk-ru','sv-en','sv-ru','tr-de','tr-en','tr-ru','tt-ru','uk-en','uk-ru','uk-uk' ];

let BUTTON_TEMPLATE = () => {
    return `
<svg style="user-select: none; -webkit-user-select: none; cursor: pointer; transform: translateX(-100%); width: 24px" preserveAspectRatio viewBox="0 0 72 28" xmlns="http://www.w3.org/2000/svg">
  <g fill="#FBEA31">
    <rect x="0"  y="0" width="20" height="28" rx="4" ry="4" />
    <rect x="24" y="0" width="20" height="28" rx="4" ry="4" />
    <rect x="48" y="0" width="20" height="28" rx="4" ry="4" />
  </g>
</svg>
`;
}

let POPUP_TEMPLATE = (data) => {
    return `
<fc-popup>
  <a class="fc-logo" href="https://fluencards.com">${ BUTTON_TEMPLATE() }</a>
  ${ data.defs }
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
  <fc-span class="fc-text">${ data.text }</fc-span>
</fc-li>
`;
}


function getTargetLanguage() {
    return chrome.i18n.getUILanguage().split('-')[0];
}

function detectLanguage(sel, callback) {
    let context = '';
    let node = sel.focusNode;

    while (context.length <= 160) {
        context = node.textContent;
        node = node.parentNode;
    }

    chrome.i18n.detectLanguage(context, (result) => {
        let lang = result.languages[0] ? result.languages[0].language : 'en';
        callback(lang);
    });
}

function createPopup(sel, html, options) {
    options = options || {};

    let div = document.createElement('div');
    let bbox = sel.getRangeAt(0).getBoundingClientRect();
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    let scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;

    div.style.position = 'absolute';
    div.style.zIndex = 1000;
    div.style.left = (options.right ? bbox.right : bbox.left + scrollLeft) + 'px';
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
    ].join('&')

    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.send();

        xhr.onload = () => {
            let data;
            try {
                data = JSON.parse(xhr.responseText);
            } catch (e) {
                reject(e);
            }

            if (data && data.text && data.text.length) {
                let result = { def: [ { text: text, tr: [ { text: data.text[0] } ] } ] };
                resolve(result);
            } else {
                reject('No data');
            }
        };
        xhr.onerror = reject;
    });
}

function downloadDefinition(text, lang, callback, errback) {
    const apiKeys = [
        'ZGljdC4xLjEuMjAxNTA4MTdUMDgxMTAzWi43YWM4YTUzODk0OTFjYTE1LjkxNjQwNjQwNzEyM2Y2MDlmZDBiZjkzYzEyMjE5MGQ1NmFmNjM1OWM=',
        'ZGljdC4xLjEuMjAxNDA4MTBUMTgwODQyWi40YzA1ZmEyMzkyOWQ4OTFiLjA5Y2QzOTUyZDQ4Njk2YzYzOWIxNjRhNzcxZjY5NDU2N2IwNGJkZWY=',
        'ZGljdC4xLjEuMjAxNDExMjJUMTIwMzA2Wi40ZTQ2NzY1ZGQyMDYwMTBhLjNlNGExYjE4MmRmNWQ4OTJmZDc0ZGQzZTQ0ZjM4OWIwZTVhZWVhMjQ='
    ];
    const endpoint = 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup?&flags=4';

    let targetLang = getTargetLanguage();
    let langPair = lang + '-' + targetLang;

    if (LANGS.indexOf(langPair) == -1) {
        langPair = lang + '-' + en;
    }

    let url = [
        endpoint,
        'key=' + atob(apiKeys[~~(Math.random() * apiKeys.length)]),
        'lang=' + langPair,
        'text=' + encodeURIComponent(text)
    ].join('&')

    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.send();

        xhr.onload = () => {
            let data;
            try {
                data = JSON.parse(xhr.responseText);
            } catch (e) {
                reject(e);
            }

            if (data && data.def && data.def.length) {
                resolve(data);
            } else {
                reject('No data');
            }
        };
        xhr.onerror = reject;
    });
}

function formatData(data) {
    let defs = data.def.map((def) => {
        let items = def.tr.map((tr) => ITEM_TEMPLATE(tr));
        def.items = items.join('');
        return DEF_TEMPLATE(def);
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

function lookupSelection() {
    let sel = window.getSelection();
    let selectedText = sel.toString();

    if (!selectedText) return;

    let html = POPUP_TEMPLATE({ defs: 'Loading...' });
    let div = createPopup(sel, html);

    let onError = () => div.remove();
    let onSuccess = (data) => div.innerHTML = formatData(data);

    let fallback = () => {
    };

    detectLanguage(sel, (lang) => {
        downloadDefinition(selectedText, lang)
            .catch(() => downloadTranslation(selectedText, lang))
            .then(onSuccess)
            .catch(onError);

        speakWord(selectedText, lang);
    });
}

function renderButton() {
    let sel = window.getSelection();
    let selectedText = sel.toString();

    if (!selectedText) return;

    let html = BUTTON_TEMPLATE();
    return createPopup(sel, html, { right: true });
}

function onExtensionMessage(request) {
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
};

function initContentScript() {
    chrome.extension.onRequest.addListener(onExtensionMessage);
    chrome.extension.sendRequest({ init: true }, onExtensionMessage);

    let currButton = null;

    document.addEventListener('selectionchange', debounce((e) => {
        if (currButton) currButton.remove();

        currButton = renderButton();

        if (!currButton) return;

        currButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            currButton.remove();
            currButton = null;

            lookupSelection();
        });
    }, 100), false);
}

initContentScript();
