import storage from './services/storage.js';

const defaultOptions = {
  targetLanguage: 'en',
  behavior: '',
  ttsEnabled: true
};

let userOptions = Object.assign({}, defaultOptions);

storage.get('userOptions').then((data) => {
  if (!data || !data.userOptions) return;
  Object.assign(userOptions, JSON.parse(data.userOptions));
});

export default userOptions;
