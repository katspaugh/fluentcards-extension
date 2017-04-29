import lookupsStore from './stores/lookups-store.js';
import debounce from 'lodash/debounce';
import { isValidSelection } from './utils/text-utils.js';
import { cancelRequests } from './utils/ajax.js';
import userOptions from './stores/user-options.js';
import storage from './services/storage.js';
import Popup from './components/popup.jsx';


function isDomainEnabled() {
  const domain = window.location.hostname;
  return storage.get(domain)
    .then(data => data[domain] == null ? true : data[domain]);
}

function initEvents() {
  let isDoubleClick = false;
  let popup = null;

  document.addEventListener('dblclick', () => {
    isDoubleClick = true;
  });

  document.addEventListener('selectionchange', debounce(() => {
    if (popup) {
      popup.remove();
      popup = null;
      cancelRequests();
    }

    const sel = window.getSelection();
    if (!isValidSelection(sel.toString())) return;

    const loadImmediately = isDoubleClick && userOptions.behavior == userOptions.DOUBLE_CLICK;
    popup = new Popup(sel, loadImmediately);
    isDoubleClick = false;
  }, 10), false);
}

function insertScript(src) {
  const script = document.createElement('script');
  script.setAttribute('src', 'data:text/javascript;charset=utf-8,' + encodeURIComponent(src));
  document.body.appendChild(script);
}

function exportCards() {
  if (!/fluentcards/.test(window.location.hostname)) return;

  lookupsStore.getAll()
    .then((items) => {
      insertScript('window.fluentcards = ' + JSON.stringify(items));

      setTimeout(() => {
        lookupsStore.clear();
      }, 3000);
    });
}

function init() {
  exportCards();

  isDomainEnabled().then(isEnabled => {
    if (isEnabled) initEvents();
  });
}

init();
