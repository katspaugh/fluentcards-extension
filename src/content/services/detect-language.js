const apiKeys = [
  'dHJuc2wuMS4xLjIwMTYwNzA5VDExNDkyOFouZDI4OWYyZjA0NDdkNDk3Mi5hOWYzMjVkOWM0ZWMxNWE1NDRmZDVhNzI1MTdjZDdjYTY0M2FhMDNk'
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
  const url = [
    endpoint,
    'key=' + atob(apiKeys[~~(Math.random() * apiKeys.length)]),
    'text=' + encodeURIComponent(text)
  ].join('&');

  return fetch(url)
    .then(resp => resp.json())
    .then(data => data.lang || defaultLanguage)
    .catch(() => defaultLanguage);
};
