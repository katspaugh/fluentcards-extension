const storage = chrome.storage.local;

export default class Storage {
  static set(key, data) {
    return new Promise(resolve => storage.set({ [key]: data }, resolve));
  }

  static get(key) {
    return new Promise(resolve => storage.get([ key ], (data) => resolve(data[key])));
  }

  static getAll() {
    return new Promise(resolve => storage.get(undefined, (data) => resolve(data)));
  }
}
