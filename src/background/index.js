chrome.runtime.onMessage.addListener((msg) => {
  switch (msg && msg.event) {
      case 'lookupsCount':
        return chrome.browserAction.setBadgeText({ text: String(msg.count) });

      case 'exportCards':
        return chrome.tabs.create({ url: 'https://fluentcards.com/books' });
  }
});

chrome.browserAction.setBadgeBackgroundColor({ color: '#aaa' });
