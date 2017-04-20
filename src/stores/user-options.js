import storage from '../services/storage.js';

const defaultBehavior = 'doubleClick';

const defaultOptions = {
  targetLanguage: 'en',
  behavior: defaultBehavior,
  ttsEnabled: true
};

let userOptions = Object.assign({}, defaultOptions);

userOptions.DOUBLE_CLICK = defaultBehavior;

storage.get('userOptions').then((data) => {
  if (!data || !data.userOptions) return;
  Object.assign(userOptions, JSON.parse(data.userOptions));
});

export default userOptions;
