import chrome from '../services/chrome.js';
import storage from '../services/storage.js';

class LookupsStore {
  constructor() {
    this.allItems = [];

    this.getAll().then((items) => {
      this.allItems.push.apply(this.allItems, items);
      this.emitCount();
    });
  }

  emitCount() {
    chrome.runtime.sendMessage({ event: 'lookupsCount', count: this.allItems.length });
  }

  getAll() {
    if (this.allItems.length) return Promise.resolve(this.allItems);

    return storage.get().then((data) => {
      return Object.keys(data)
        .filter((key) => !isNaN(key))
        .map(Number)
        .sort()
        .map((key) => data[key]);
    });
  }

  saveOne(result, word, context) {
    const location = typeof window !== 'undefined' ? window.location : {};

    const item = {
      language: result.lang,
      def: result.data.def,
      selection: word,
      context: context,
      url: location.href,
      domain: location.hostname
    };

    const isEqual = (it) => it.selection == item.selection && it.context == item.context;

    if (this.allItems.some(isEqual)) return;

    this.allItems.push(item);
    this.emitCount();

    const toSave = {};
    toSave[Date.now()] = item;

    return storage.set(toSave);
  }
}

let store = new LookupsStore();

export default store;
