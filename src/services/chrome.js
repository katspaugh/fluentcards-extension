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



const hasChrome = (typeof window !== 'undefined' && window.chrome && window.chrome.storage);

export default (hasChrome ? window.chrome : mockChrome);
