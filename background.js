'use strict';

function initBackground() {
    chrome.browserAction.onClicked.addListener(
        (tab) => {
            chrome.tabs.sendRequest(
                tab.id,
                { exportVocab: true }
            );
        }
    );
}

initBackground();
