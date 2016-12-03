import ajax from './ajax.js';

const apiKeys = [
  'dHJuc2wuMS4xLjIwMTYwNzA5VDExNDkyOFouZDI4OWYyZjA0NDdkNDk3Mi5hOWYzMjVkOWM0ZWMxNWE1NDRmZDVhNzI1MTdjZDdjYTY0M2FhMDNk'
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
  let langPair = lang + '-' + targetLang;

  let url = [
    endpoint,
    'key=' + atob(apiKeys[~~(Math.random() * apiKeys.length)]),
    'lang=' + langPair,
    'text=' + encodeURIComponent(text)
  ].join('&');

  return ajax(url, { json: true }).then((data) => {
    let translated = data.text[0];

    if (translated == text) {
      throw new Error('No translation');
    }

    return { source: 'yandex', def: [ { text: text, tr: [ { text: translated } ] } ] };
  });
};
