import lookupsStore from './stores/lookups-store.js';
import debounce from './utils/debounce.js';
import { isValidSelection } from './utils/text-utils.js';
import userOptions from './stores/user-options.js';
import storage from './services/storage.js';
import config from './config.js';
import Popup from './components/popup.jsx';


function isDomainEnabled() {
  const domain = window.location.hostname;
  return storage.get(domain).then(data => data[domain]);
}

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
  exportCards();

  isDomainEnabled().then(isEnabled => {
    if (isEnabled) initEvents();
  });
}

init();
