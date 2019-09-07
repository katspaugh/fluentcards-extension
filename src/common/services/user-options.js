import storage from './storage.js';

const defaultOptions = {
  targetLanguage: 'en',
  ttsEnabled: false
};

export default class UserOptions {
  static getDefaults() {
    return defaultOptions;
  }

  static get() {
    return storage.get('userOptions').then(options => {
      return Object.assign({}, defaultOptions, options ? JSON.parse(options) : {});
    });
  }

  static set(options) {
    return storage.set({ userOptions: JSON.stringify(options) });
  }
}
