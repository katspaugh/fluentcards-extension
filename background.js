chrome.runtime.onMessage.addListener((msg) => {
    if ('badgeCount' in msg) {
        chrome.browserAction.setBadgeText({ text: String(msg.badgeCount) });
    }
});

chrome.browserAction.setBadgeBackgroundColor({ color: '#aaa' });
