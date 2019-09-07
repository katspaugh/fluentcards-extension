const storage = chrome.storage.local;

export default class Storage {
  static set(data) {
    return new Promise(resolve => storage.set(data, resolve));
  }

  static get(key) {
    return new Promise(resolve => storage.get(key, (data) => resolve(key ? data[key] : data)));
  }
}
