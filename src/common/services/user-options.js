import storage from './storage.js';

const defaultOptions = {
  targetLanguage: 'en',
  behavior: 'double-click',
  ttsEnabled: false
};

class UserOptions {
  getDefaults() {
    return defaultOptions;
  }

  get() {
    return storage.get('userOptions').then(options => {
      return Object.assign({}, defaultOptions, options ? JSON.parse(options) : {});
    });
  }

  set(options) {
    return storage.set({ userOptions: JSON.stringify(options) });
  }
}

export default new UserOptions();
