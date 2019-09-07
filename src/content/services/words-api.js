import fetchJson from './fetch';

/**
 * Download a definition of a word
 *
 * @param {string} word
 * @returns {promise}
 */
export default function getDefinition(word, lang, targetLang) {
  if (lang !== 'en' || targetLang !== 'en') {
    return Promise.reject(new Error('Unsupported language'));
  }

  return fetchJson('wordsApi', word)
    .then(data => ({
      def: data.results
        .reduce((acc, next) => {
          const prev = acc[acc.length - 1];

          if (prev && prev.partOfSpeech === next.partOfSpeech) {
            prev.definition.push(next.definition);
          } else {
            next.definition = [ next.definition ];
            acc.push(next);
          }

          return acc;
        }, [])
        .map(result => ({
          text: data.word,
          ts: data.pronunciation ?
            data.pronunciation[result.partOfSpeech] || data.pronunciation.all :
            '',
          tr: result.definition.map(text => ({ text })),
          pos: result.partOfSpeech
        }))
    }));
};
