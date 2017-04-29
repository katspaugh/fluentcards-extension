import debounce from 'lodash/debounce';
import { isValidSelection } from './services/text-utils.js';
import { cancelRequests } from './services/ajax.js';
import { exportCards } from './services/export.js';
import userOptions from '../common/services/user-options.js';
import storage from '../common/services/storage.js';
import Popup from './components/Popup/Popup.jsx';

function initEvents() {
  let isDoubleClick = false;
  let popup = null;

  let options = userOptions.getDefaults();
  const doubleClick = options.behavior;
  userOptions.get().then(data => options = data);

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

    const loadImmediately = isDoubleClick && options.behavior == doubleClick;
    popup = new Popup(sel, loadImmediately);
    isDoubleClick = false;
  }, 10), false);
}

function isDomainEnabled() {
  const domain = window.location.hostname;
  return storage.get(domain)
    .then(domain => domain == null ? true : domain);
}

function init() {
  exportCards();

  isDomainEnabled().then(isEnabled => {
    if (isEnabled) initEvents();
  });
}

init();
