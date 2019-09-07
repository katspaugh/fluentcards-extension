import detectLanguage from './detect-language';
import yandexDefine from './yandex-dictionary';
import yandexTranslate from './yandex-translate';
import wordsApiDefine from './words-api';

function load(word, lang, targetLang) {
  return wordsApiDefine(word, lang, targetLang)
    .catch(() => yandexDefine(word, lang, targetLang))
    .catch(() => yandexTranslate(word, lang, targetLang))
    .then(data => ({ lang: lang, data: data }));
}

export default function lookup(word, context, targetLang) {
  return detectLanguage(context)
    .then(lang => load(word, lang, targetLang));
}
