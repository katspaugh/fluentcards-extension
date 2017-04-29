import debounce from 'lodash/debounce';
import { isValidSelection } from './services/text-utils.js';
import { cancelRequests } from './services/ajax.js';
import { exportCards } from './services/export.js';
import userOptions from './stores/user-options.js';
import storage from './services/storage.js';
import Popup from './components/Popup/Popup.jsx';

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

function isDomainEnabled() {
  const domain = window.location.hostname;
  return storage.get(domain)
    .then(data => data[domain] == null ? true : data[domain]);
}

function init() {
  exportCards();

  isDomainEnabled().then(isEnabled => {
    if (isEnabled) initEvents();
  });
}

init();
