import storage from '../common/services/storage';

chrome.runtime.onMessage.addListener(msg => {
  switch (msg && msg.event) {
      case 'exportCards':
        return chrome.tabs.create({ url: 'https://fluentcards.com/books' });
  }
});

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
