import detectLanguage from './detect-language.js';
import yandexDefine from './yandex-dictionary.js';
import yandexTranslate from './yandex-translate.js';
import mwDefine from './mw-dictionary.js';

const defaultLang = 'en';

const lookupYandex = (word, lang, targetLang) => {
  return yandexDefine(word, lang, targetLang)
    .catch(() => yandexTranslate(word, lang, targetLang))
    .then((data) => Object.assign({ source: 'yandex' }, data));
};

const lookupMeriamWebster = (word) => {
  return mwDefine(word)
    .then((data) => Object.assign({ source: 'mw' }, data))
    .catch(() => lookupYandex(word, defaultLang, defaultLang));
}

const load = (word, lang, targetLang) => {
  const promise = (lang == defaultLang && targetLang == defaultLang) ?
    lookupMeriamWebster(word) :
    lookupYandex(word, lang, targetLang);

  return promise.then((data) => ({ lang: lang, data: data }));
}

export default function lookup(word, context, targetLang) {
  return detectLanguage(context)
    .then(lang => load(word, lang, targetLang))
    .catch(() => load(word, defaultLang, targetLang));
}
