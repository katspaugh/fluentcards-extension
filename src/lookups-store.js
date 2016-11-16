import storage from './storage.js';
import chrome from './chrome.js';
import {getCloze} from './text-utils.js';

class LookupsStore {
  getAll() {
    return storage.get().then((data) => {
      return Object.keys(data)
        .filter((key) => !isNaN(Number(key)))
        .sort()
        .map((key) => data[key]);
    });
  }

  updateBadge() {
    this.getAll().then((items) => {
      chrome.runtime.sendMessage({ badgeCount: items.length });
    });
  }

  saveOne(result, word, context) {
    let item = {};
    let key = Date.now();

    item[key] = {
      language: result.lang,
      def: result.data.def,
      selection: word,
      context: context,
      url: window.location.href,
      domain: window.location.hostname
    };

    let promise = storage.set(item);

    promise.then(() => this.updateBadge());

    return promise;
  }

  getCsv(mode) {
    let getWord = (def) => {
      let word = [ def.text ];
      if (def.fl) word.push(def.fl);
      if (def.gender) word.push(def.fl);
      return word.join(', ');
    };

    return this.getAll().then((items) => {
      let lines = items.map((item) => {
        let def = item.def[0];
        let word = getWord(def);
        let translation = def.tr[0].text || '';
        let items;

        if (mode == 'cloze') {
          items = [
            getCloze(item.context, item.selection),
            translation,
            word
          ];
        } else {
          items = [
            word,
            translation,
            item.context
          ];
        }

        return items.join('\t');
      });

      let unique = lines.filter((line, index) => {
        return lines.indexOf(line) == index;
      });

      return unique.join('\n');
    });
  }
}

let store = new LookupsStore();
store.updateBadge();

export default store;
