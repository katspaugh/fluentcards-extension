'use strict';

function exportContent() {
  chrome.runtime.sendMessage({ event: 'exportCards' });
}

function checkContent() {
  return new Promise(resolve => {
    chrome.storage.sync.get(null, data => {
      resolve(Object.keys(data).some((key) => !isNaN(Number(key))));
    });
  });
}

function isDomainEnabled(domain) {
  return new Promise(resolve => {
    chrome.storage.sync.get(domain, data => {
      resolve(data ? data[domain] : true);
    });
  });
}

function getDomain() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, (tabs) => {
      if (!tabs[0]) {
        reject('No active tab');
        return;
      }

      const url = tabs[0].url;
      const link = document.createElement('a');
      link.href = url;
      const domain = link.hostname;

      resolve(domain);
    });
  });
}

function toggleSite(enabled) {
  getDomain().then(domain => {
    const data = {};
    data[domain] = enabled;
    chrome.storage.sync.set(data);
  });
}

function openOptions() {
  chrome.runtime.openOptionsPage();
}


document.addEventListener('DOMContentLoaded', () => {
  checkContent().then(hasContent => {
    if (!hasContent) {
      document.body.className = 'empty-content';
    }
  });

  getDomain().then(domain => {
    document.getElementById('domain').textContent = domain.replace(/^www\./, '');

    isDomainEnabled(domain).then(isEnabled => {
      document.getElementById('toggle-site').checked = isEnabled;
    });
  });

  document.getElementById('btn-export').addEventListener('click', (e) => {
    e.preventDefault();
    exportContent();
  });

  document.getElementById('options-button').addEventListener('click', (e) => {
    e.preventDefault();
    openOptions();
  });

  document.getElementById('toggle-site').addEventListener('change', (e) => {
    toggleSite(e.target.checked);
  });
});
