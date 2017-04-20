import ajax from '../utils/ajax.js';

const apiKeys = [
  'dHJuc2wuMS4xLjIwMTYwNzA5VDExNDkyOFouZDI4OWYyZjA0NDdkNDk3Mi5hOWYzMjVkOWM0ZWMxNWE1NDRmZDVhNzI1MTdjZDdjYTY0M2FhMDNk'
];

const endpoint = 'https://translate.yandex.net/api/v1.5/tr.json/detect?';

const defaultLanguage = 'en';

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
    'text=' + encodeURIComponent(text)
  ].join('&');

  return ajax(url, { json: true })
    .then(data => data.lang || defaultLanguage)
    .catch(() => defaultLanguage);
};
