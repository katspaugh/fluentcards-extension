import detectLanguage from './detect-language.js';
import yandexDefine from './yandex-dictionary.js';
import yandexTranslate from './yandex-translate.js';
import wordsApiDefine from './words-api.js';


const lookupYandexTranslate = (word, lang, targetLang) => {
  return yandexTranslate(word, lang, targetLang);
};

const lookupYandexDictionary = (word, lang, targetLang) => {
  return yandexDefine(word, lang, targetLang);
};

const load = (word, lang, targetLang) => {
  const request = (lang == 'en' && targetLang == 'en') ?
    wordsApiDefine(word) :
    lookupYandexDictionary(word, lang, targetLang);

  return request
    .catch(() => lookupYandexTranslate(word, lang, targetLang))
    .then(data => ({ lang: lang, data: data }));
}

export default function lookup(word, context, targetLang) {
  return detectLanguage(context)
    .then(lang => load(word, lang, targetLang));
}
