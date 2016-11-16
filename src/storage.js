import chrome from './chrome.js';

class Storage {
  set(data) {
    return new Promise((resolve) => chrome.storage.sync.set(data, resolve));
  }

  get(key) {
    return new Promise((resolve) => chrome.storage.sync.get(key, resolve));
  }
}

export default new Storage();
