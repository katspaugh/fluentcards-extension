import storage from '../common/services/storage';
import config from '../common/config';

// Export words
chrome.runtime.onMessage.addListener(msg => {
  switch (msg && msg.event) {
      case 'exportCards':
        return chrome.tabs.create({ url: 'https://fluentcards.com/vocab' });
  }
});

// Saved words counter
function updateCount() {
  storage.getAll().then(data => {
    const count = Object.keys(data)
      .map(Number)
      .filter(key => !isNaN(Number(key)))
      .length;

    return chrome.browserAction.setBadgeText({ text: String(count) });
  });
}
updateCount();
chrome.storage.onChanged.addListener(updateCount);
chrome.browserAction.setBadgeBackgroundColor({ color: '#aaa' });


// Create a context menu item to save the selection
chrome.contextMenus.create({
  title: 'Add to Fluentcards', contexts: [ 'selection' ],
  onclick: (info, tab) => {
    chrome.tabs.sendMessage(tab.id, { event: 'saveSelection' });
  }
});

// Make requests on content script's behalf
chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.api) {
      fetch(config.urls[request.api] + request.params)
        .then(response => response.json())
        .then(data => sendResponse(data))
        .catch(error => sendResponse(error));
      return true;
    }
  });
