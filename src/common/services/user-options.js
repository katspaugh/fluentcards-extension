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
      return Object.assign({}, defaultOptions, options);
    });
  }

  set(options) {
    return storage.set({ userOptions: options });
  }
}

export default new UserOptions();
