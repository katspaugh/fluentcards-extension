import chrome from '../services/chrome.js';
import storage from '../services/storage.js';

class LookupsStore {
  constructor() {
    this.getCount().then(count => this.emitCount(count));
  }

  emitCount(count) {
    chrome.runtime.sendMessage({ event: 'lookupsCount', count: count });
  }

  getCount() {
    return storage.get('count').then(data => Number(data.count || 0));
  }

  incrementCount() {
    return this.getCount()
      .then(count => {
        const newCount = count + 1;
        return storage.set({ count: newCount })
          .then(() => this.emitCount(newCount));
      });
  }

  getAll() {
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
      selection: word,
      context: context,
      def: result.data.def.slice(0, 1),
      url: typeof window !== 'undefined' ? window.location.href : ''
    };

    const isEqual = (it) => it.selection == item.selection && it.context == item.context;

    return this.getAll().then(items => {
      if (items.some(isEqual)) return;

      const toSave = {};
      toSave[Date.now()] = item;

      return storage.set(toSave).then(() => {
        this.incrementCount();
      });
    });
  }

  clear() {
    return new Promise((resolve) => {
      return chrome.storage.sync.get(null, (data) => {
        const toRestore = Object.keys(data)
          .filter(key => isNaN(key))
          .reduce((acc, key) => {
            acc[key] = data[key];
            return acc;
          }, {});

        return chrome.storage.sync.clear(
          () => chrome.storage.sync.set(toRestore)
        );
      });
    });
  }
}

let store = new LookupsStore();

export default store;
