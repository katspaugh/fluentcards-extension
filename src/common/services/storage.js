const storage = chrome.storage.local;

class Storage {
  set(data) {
    return new Promise(resolve => storage.set(data, resolve));
  }

  get(key) {
    return new Promise(resolve => storage.get(key, (data) => resolve(key ? data[key] : data)));
  }
}

export default new Storage();
