const mockChrome = {
  storage: {
    sync: {
      get: (key, callback) => callback && callback({}),
      set: (key, value, callback) => callback && callback({}),
      clear: (callback) => callback && callback({})
    }
  },

  runtime: {
    sendMessage: () => null,

    onMessage: {
      addListener: () => null
    }
  }
};



const hasChrome = (typeof chrome !== 'undefined' && chrome.storage);

export default (hasChrome ? chrome : mockChrome);
