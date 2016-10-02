'use strict';

function sendMessage(msg, callback) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, msg, callback);
    });
}

function storageSet(data) {
    return new Promise((resolve) => chrome.storage.sync.set(data, resolve));
}

function storageGet(key) {
    return new Promise((resolve) => chrome.storage.sync.get(key, resolve));
}

function storageClear() {
    return new Promise((resolve) => chrome.storage.sync.clear(resolve));
}


document.addEventListener('DOMContentLoaded', () => {
    let exportButton = document.getElementById('btn-export');
    let clearButton = document.getElementById('btn-clear');

    let toggleButtons = (toggle) => {
        exportButton.disabled = !toggle;
        clearButton.disabled = !toggle;
    };

    let switchSteps = (toggle) => {
        let step1 = document.getElementById('step1');
        let step2 = document.getElementById('step2');
        let width;

        if (toggle) {
            step2.style.width = step1.clientWidth + 'px';
        }

        step1.style.display = toggle ? 'none' : 'block';
        step2.style.display = toggle ? 'block' : 'none';
    };

    storageGet().then((data) => {
        if (Object.keys(data).length == 0) {
            toggleButtons(false);
        }
    });

    exportButton.addEventListener('click', () => {
        sendMessage({ exportCards: true });
    });

    clearButton.addEventListener('click', () => {
        switchSteps(true);
    });

    document.getElementById('btn-yes').addEventListener('click', () => {
        storageClear();
        toggleButtons(false);
        switchSteps(false);
        chrome.runtime.sendMessage({ badgeCount: 0 });
    });

    document.getElementById('btn-no').addEventListener('click', () => {
        switchSteps(false);
    });
});
