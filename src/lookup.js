import detectLanguage from './detect-language.js';
import downloadTranslation from './translation.js';
import downloadDefinition from './definition.js';

export default function lookup(word, context, targetLang) {
  return detectLanguage(context).then((lang) => {
    return downloadDefinition(word, lang, targetLang)
      .catch(() => downloadTranslation(word, lang, targetLang))
      .then((data) => ({ lang: lang, data: data }));
  });
}
