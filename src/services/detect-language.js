import chrome from './chrome.js';

const defaultLanguage = 'en';

export default function detectLanguage(text) {
  return new Promise((resolve, reject) => {
    chrome.i18n.detectLanguage(text, (result) => {
      if (!result || !result.isReliable || !result.languages.length) {
        resolve(defaultLanguage);
      } else {
        resolve(result.languages[0].language);
      }
    });
  });
}
