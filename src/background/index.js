import storage from '../common/services/storage';


// Export words
chrome.runtime.onMessage.addListener(msg => {
  switch (msg && msg.event) {
      case 'exportCards':
        return chrome.tabs.create({ url: 'https://fluentcards.com/vocab' });
  }
});


// Saved words counter
function updateCount() {
  storage.get().then(data => {
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
