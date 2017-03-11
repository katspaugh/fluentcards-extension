import lookupsStore from './stores/lookups-store.js';
import debounce from './utils/debounce.js';
import { isValidSelection } from './utils/text-utils.js';
import userOptions from './user-options.js';
import config from './config.js';
import Popup from './components/popup.jsx';


function initEvents() {
  let isDoubleClick = false;
  let popup = null;

  document.addEventListener('dblclick', () => {
    isDoubleClick = true;
  });

  document.addEventListener('selectionchange', (e) => {
    if (popup) {
      popup.remove();
      popup = null;
    }

    let sel = window.getSelection();
    if (!isValidSelection(sel.toString())) return;

    popup = new Popup(sel, isDoubleClick && userOptions.behavior == config.behaviours.doubleClick);
    isDoubleClick = false;
  }, false);
}

function insertScript(src) {
  var node = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');
  script.setAttribute('src', 'data:text/javascript;charset=utf-8,' + encodeURIComponent(src));
  document.body.appendChild(script);
}

function exportCards() {
  if (!/fluentcards/.test(window.location.hostname)) return;

  lookupsStore.getAll()
    .then((items) => {
      insertScript('window.fluentcards = ' + JSON.stringify(items));
    });
}

function init() {
  initEvents();
  exportCards();
}

init();
