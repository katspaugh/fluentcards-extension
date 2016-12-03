import detectLanguage from './detect-language.js';
import yandexDefine from './yandex-dictionary.js';
import yandexTranslate from './yandex-translate.js';
import mwDefine from './mw-dictionary.js';

const lookupYandex = (word, lang, targetLang) => {
  return yandexDefine(word, lang, targetLang)
    .catch(() => yandexTranslate(word, lang, targetLang));
};

export default function lookup(word, context, targetLang) {
  return detectLanguage(context).then((lang) => {
    let promise;

    // A special case for en-en definitions
    if (lang == 'en' && targetLang == 'en') {
      promise = mwDefine(word).catch(() => lookupYandex(word, lang, targetLang));
    } else {
      promise = lookupYandex(word, lang, targetLang);
    }

    return promise.then((data) => ({ lang: lang, data: data }));
  });
}
