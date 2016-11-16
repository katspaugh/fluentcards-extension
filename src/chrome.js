export default window.chrome.storage ? window.chrome : {
  storage: {
    sync: {
      get: (key, callback) => callback && callback({}),
      set: (key, value, callback) => callback && callback({}),
      clear: (callback) => callback && callback({})
    }
  },

  i18n: {
    detectLanguage: (text, callback) => callback('en')
  },

  runtime: {
    sendMessage: () => null,

    onMessage: {
      addListener: () => null
    }
  }
};
