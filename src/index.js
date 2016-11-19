import chrome from './chrome.js';
import debounce from './debounce.js';
import Popup from './popup.jsx';
import userOptions from './user-options.js';
import lookupsStore from './lookups-store.js';


function exportCards(mode) {
  lookupsStore.getCsv(mode).then((csv) => {
    let url = 'data:text/plain;charset=utf-8,' + encodeURIComponent(csv)
    window.open(url);
  });
}

function isValidSelection (sel) {
  let selectedText = sel.toString();
  if (!selectedText) return false;
  if (/^[0-9,.:;/?!@#$%&*()=_+<>|"'}{\[\]«»‘’“”~`±§ -]+$/.test(selectedText)) return false;
  let wordsLen = selectedText.trim().split(' ').length;
  return wordsLen >= 1 && wordsLen <= 3;
}

function initEvents() {
  let isDoubleClick = false;
  let popup = null;

  document.addEventListener('dblclick', () => {
    isDoubleClick = true;
  });

  document.addEventListener('selectionchange', debounce((e) => {
    if (popup) {
      popup.remove();
      popup = null;
    }

    // Find the qualifying selection
    let sel = window.getSelection();
    if (!isValidSelection(sel)) return;

    popup = new Popup(sel, isDoubleClick);
    isDoubleClick = false;
  }, 100), false);
}

function initRuntime() {
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.exportCards) exportCards(msg.exportCards);
  });
}

function init() {
  initEvents();
  initRuntime();
}

init();
