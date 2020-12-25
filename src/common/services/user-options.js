import storage from './storage.js';

const storageKey = 'userOptions';

const defaultOptions = {
  targetLanguage: 'en',
  sourceLanguage: '',
  ttsEnabled: false,
  autoDetectLanguage: true
};

export default class UserOptions {
  static getDefaults() {
    return defaultOptions;
  }

  static get() {
    return storage.get(storageKey).then(options => {
      return Object.assign({}, defaultOptions, options ? JSON.parse(options) : {});
    });
  }

  static set(options) {
    return storage.set(storageKey, JSON.stringify(options));
  }
}
