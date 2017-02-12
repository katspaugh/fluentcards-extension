'use strict';

function sendMessage(msg) {
  chrome.runtime.sendMessage(msg);
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
      let len = data.length;
      switchSteps(len == 0 ? 2 : 1);
      sendMessage({ event: 'lookupsCount', count: len });
    });
  };

  updateCount();

  document.getElementById('btn-export').addEventListener('click', () => {
    sendMessage({ event: 'exportCards' });
    switchSteps(1);
  });

  document.getElementById('btn-clear').addEventListener('click', () => {
    switchSteps(3);
  });

  document.getElementById('btn-yes').addEventListener('click', () => {
    storageClear();
    switchSteps(4);

    setTimeout(updateCount, 1000);
  });

  document.getElementById('btn-no').addEventListener('click', () => {
    switchSteps(1);
  });

  document.getElementById('options-button').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });
});
