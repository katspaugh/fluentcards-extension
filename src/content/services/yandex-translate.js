import fetchJson from './fetch';

const apiKeys = [
  'dHJuc2wuMS4xLjIwMTkwOTA3VDE1MTAxNFouMTk2NTNhYjU3YzIzMzc2OS43NzA3MTc1YjQwMzRkYTRjZjg1NjM3NDJkYWM2MDcyNjkxNDQ3NDIz'
];

const endpoint = 'https://translate.yandex.net/api/v1.5/tr.json/translate?format=html';


/**
 * Download a translation for text
 *
 * @param {string} text
 * @param {string} lang
 * @param {string} targetLang
 * @returns {promise}
 */
export default function yandexTranslate(text, lang, targetLang) {
  const langPair = lang + '-' + targetLang;

  const url = [
    endpoint,
    'key=' + atob(apiKeys[~~(Math.random() * apiKeys.length)]),
    'lang=' + langPair,
    'text=' + encodeURIComponent(text)
  ].join('&');

  return fetchJson(url)
    .then(data => {
      const translated = data.text[0];
      return { def: [ { text: text, tr: [ { text: translated } ] } ] };
    });
};
