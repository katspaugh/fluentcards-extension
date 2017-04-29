import storage from '../../common/services/storage.js';


class LookupsStore {
  constructor() {
    this.getCount().then(count => this.emitCount(count));
  }

  emitCount(count) {
    chrome.runtime.sendMessage({ event: 'lookupsCount', count: count });
  }

  getCount() {
    return storage.get('count').then(count => Number(count || 0));
  }

  incrementCount() {
    return this.getCount()
      .then(count => {
        const newCount = count + 1;
        this.emitCount(newCount);
        return storage.set({ count: newCount });
      });
  }

  getAll() {
    return storage.get().then((data) => {
      return Object.keys(data)
        .filter((key) => !isNaN(Number(key)))
        .map(Number)
        .sort()
        .map((key) => data[key]);
    });
  }

  saveOne(word, context, info) {
    const item = {
      language: info.lang,
      selection: word,
      context: context,
      def: info.data.def.slice(0, 1),
      url: window.location.href
    };

    const isEqual = (it) => it.selection == item.selection && it.context == item.context;

    return this.getAll().then(items => {
      if (items.some(isEqual)) return;

      const toSave = {};
      toSave[Date.now()] = item;

      return storage.set(toSave)
        .then(() => this.incrementCount());
    });
  }

  clear() {
    return storage.get()
      .then(data => {
        return Object.keys(data)
          .filter(key => isNaN(Number(key)))
          .reduce((acc, key) => {
            acc[key] = data[key];
            return acc;
          }, {});
      })
      .then(filteredData => {
        return storage.clear().then(() => {
          return storage.set(filteredData);
        });
      });
  }
}

export default new LookupsStore();
