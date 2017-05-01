import detectLanguage from './detect-language.js';
import yandexDefine from './yandex-dictionary.js';
import yandexTranslate from './yandex-translate.js';


const lookupYandexTranslate = (word, lang, targetLang) => {
  return yandexTranslate(word, lang, targetLang);
};

const lookupYandexDictionary = (word, lang, targetLang) => {
  return yandexDefine(word, lang, targetLang);
};

const load = (word, lang, targetLang) => {
  return lookupYandexDictionary(word, lang, targetLang)
    .catch(() => lookupYandexTranslate(word, lang, targetLang))
    .then(data => ({ lang: lang, data: data }));
}

export default function lookup(word, context, targetLang) {
  return detectLanguage(context)
    .then(lang => load(word, lang, targetLang));
}
