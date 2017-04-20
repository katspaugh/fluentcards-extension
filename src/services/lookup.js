import detectLanguage from './detect-language.js';
import yandexDefine from './yandex-dictionary.js';
import yandexTranslate from './yandex-translate.js';
import mwDefine from './mw-dictionary.js';

const defaultLang = 'en';

const lookupYandexTranslate = (word, lang, targetLang) => {
  return yandexTranslate(word, lang, targetLang)
    .then((data) => Object.assign({ source: 'yandex' }, data));
};

const lookupYandexDictionary = (word, lang, targetLang) => {
  return yandexDefine(word, lang, targetLang)
    .then((data) => Object.assign({ source: 'yandex' }, data));
};

const lookupMeriamWebster = (word) => {
  return mwDefine(word)
    .then((data) => Object.assign({ source: 'mw' }, data));
}

const load = (word, lang, targetLang) => {
  return lookupYandexDictionary(word, lang, targetLang)
    .catch(e => {
      if (lang === defaultLang && targetLang === defaultLang) {
        return lookupMeriamWebster(word);
      }
      throw e;
    })
    .catch(() => lookupYandexTranslate(word, lang, targetLang))
    .then(data => ({ lang: lang, data: data }));
}

export default function lookup(word, context, targetLang) {
  return detectLanguage(context)
    .then(lang => load(word, lang, targetLang));
}
