import fetchJson from './fetch';

const apiKeys = [
  'dHJuc2wuMS4xLjIwMTkwOTA3VDE1MTAxNFouMTk2NTNhYjU3YzIzMzc2OS43NzA3MTc1YjQwMzRkYTRjZjg1NjM3NDJkYWM2MDcyNjkxNDQ3NDIz'
];

const endpoint = 'https://translate.yandex.net/api/v1.5/tr.json/detect?';

const defaultLanguage = 'en';

/**
 * Download a translation for text
 *
 * @param {string} text
 * @returns {promise}
 */
export default function detectLanguage(text) {
  const params = [
    'key=' + atob(apiKeys[~~(Math.random() * apiKeys.length)]),
    'text=' + encodeURIComponent(text)
  ].join('&');

  return fetchJson('detectApi', params)
    .then(data => data.lang || defaultLanguage)
    .catch(() => defaultLanguage);
};
