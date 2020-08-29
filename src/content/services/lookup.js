import detectLanguage from './detect-language';
import yandexDefine from './yandex-dictionary';
import wordsApiDefine from './words-api';

function load(word, lang, targetLang) {
  return wordsApiDefine(word, lang, targetLang)
    .catch(() => yandexDefine(word, lang, targetLang))
    .then(data => ({ lang: lang, data: data }));
}

export default function lookup(word, targetLang, sourceLang) {
  const lang = detectLanguage() || sourceLang || 'en';
  return load(word, lang, targetLang);
}
