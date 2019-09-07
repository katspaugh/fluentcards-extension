import { debounce } from 'lodash';
import { isValidSelection } from './services/text-utils.js';
import { exportCards } from './services/export.js';
import storage from '../common/services/storage.js';
import Popup from './components/Popup/Popup.jsx';


function createPopup(selection, shouldSave = false) {
  return new Popup(selection, shouldSave);
}

function initEvents() {
  let isDoubleClick = false;
  let popup = null;

  const reset = () => {
    if (popup) {
      popup.remove();
      popup = null;
    }
  };

  document.addEventListener('dblclick', () => {
    isDoubleClick = true;
  });

  document.addEventListener('selectionchange', debounce(() => {
    reset();

    if (!isDoubleClick) return;

    const selection = window.getSelection();
    if (!isValidSelection(selection.toString())) return;

    popup = createPopup(selection);
    isDoubleClick = false;
  }, 200));

  // To avoid showing the definition when the user double-clicks
  // to copy the selection
  document.addEventListener('keydown', () => {
    if (popup && popup.isDismissable) reset();
  });

  // Save the selection from the context menu
  chrome.runtime.onMessage.addListener(msg => {
    if (msg && msg.event === 'saveSelection') {
      popup = createPopup(window.getSelection(), true);
    }
  });
}

function isDomainEnabled() {
  return storage.get(window.location.hostname)
    .then(domain => domain == null ? true : domain);
}

function init() {
  exportCards();

  isDomainEnabled().then(isEnabled => {
    if (isEnabled) initEvents();
  });
}

init();
