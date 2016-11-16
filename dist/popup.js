'use strict';

function sendMessage(msg, callback) {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, msg, callback);
  });
}

function storageGet() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(null, (data) => {
      let items = Object.keys(data)
          .filter((key) => !isNaN(Number(key)))
          .sort()
          .map((key) => data[key]);
      resolve(items);
    });
  });
}

function storageClear() {
  return new Promise((resolve) => {
    chrome.storage.sync.get('userOptions', (data) => {
      chrome.storage.sync.clear(() => {
        chrome.storage.sync.set('userOptions', data, resolve);
      });
    });
  });
}


document.addEventListener('DOMContentLoaded', () => {
  let stepWidth = document.getElementById('step1').clientWidth;

  let switchSteps = (number) => {
    for (let i = 1; i <= 5; i++) {
      let step = document.getElementById('step' + i);

      step.style.display = i == number ? '' : 'none';
      step.style.width = stepWidth + 'px';
    }
  };

  let updateCount = () => {
    storageGet().then((data) => {
      let len = Object.keys(data).length;
      switchSteps(len == 0 ? 2 : 1);
      chrome.runtime.sendMessage({ badgeCount: len });
    });
  };

  updateCount();

  document.getElementById('btn-export').addEventListener('click', () => {
    switchSteps(3);
  });

  document.getElementById('btn-clear').addEventListener('click', () => {
    switchSteps(4);
  });

  document.getElementById('btn-yes').addEventListener('click', () => {
    storageClear();
    switchSteps(5);

    setTimeout(updateCount, 1000);
  });

  document.getElementById('btn-no').addEventListener('click', () => {
    switchSteps(1);
  });

  document.getElementById('btn-basic').addEventListener('click', () => {
    sendMessage({ exportCards: 'basic' });
    switchSteps(1);
  });

  document.getElementById('btn-cloze').addEventListener('click', () => {
    sendMessage({ exportCards: 'cloze' });
    switchSteps(1);
  });

  document.getElementById('options-button').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });
});
