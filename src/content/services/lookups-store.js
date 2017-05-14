import storage from '../../common/services/storage';


class LookupsStore {
  getAll() {
    return storage.get().then((data) => {
      return Object.keys(data)
        .map(Number)
        .filter(key => !isNaN(key))
        .sort()
        .map((key) => data[key]);
    });
  }

  saveOne(word, context, info) {
    const item = {
      language: info.lang,
      selection: word,
      context: context,
      def: info.data.def.slice(0, 1)
    };

    const isEqual = (it) => it.selection == item.selection && it.context == item.context;

    return this.getAll().then(items => {
      if (items.some(isEqual)) return;

      const toSave = {};
      toSave[Date.now()] = item;

      return storage.set(toSave);
    });
  }
}

export default new LookupsStore();
