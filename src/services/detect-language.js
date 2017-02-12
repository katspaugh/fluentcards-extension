import chrome from './chrome.js';

const defaultLang = 'en';

export default function detectLanguage(text) {
  return new Promise((resolve, reject) => {
    chrome.i18n.detectLanguage(text, (result) => {
      let lang = (result && result.languages && result.languages.length) ?
          result.languages[0].language : defaultLang;
      resolve(lang);
    });
  });
}
