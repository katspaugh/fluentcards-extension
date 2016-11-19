import ajax from './ajax.js';

const apiKeys = [
  'dHJuc2wuMS4xLjIwMTYwNzA5VDExNDkyOFouZDI4OWYyZjA0NDdkNDk3Mi5hOWYzMjVkOWM0ZWMxNWE1NDRmZDVhNzI1MTdjZDdjYTY0M2FhMDNk'
];

const endpoint = 'https://translate.yandex.net/api/v1.5/tr.json/translate?format=html';


function encodeLine(text, word) {
  let replace = text.replace(new RegExp('\\b' + word + '\\b'), '<b>$&</b>');
  // Languages like Japanese and Chinese don't have written word boundaries.
  if (replace == text) {
    replace = text.replace(word, '<b>$&</b>');
  }
  return replace;
}

function decodeLine(text) {
  let match = text.match(/<b>(.+?)<\/b>/);
  let word = match ? match[1] : '';
  return word.replace(/[,.?!():;]/g, '');
}

/**
 * Download a translation for text
 *
 * @param {string} word
 * @param {string} context
 * @param {string} lang
 * @param {string} targetLang
 * @return {promise}
 */
export default function downloadTranslation(word, context, lang, targetLang) {
  let langPair = lang + '-' + targetLang;
  let line = encodeLine(context, word);

  let url = [
    endpoint,
    'key=' + atob(apiKeys[~~(Math.random() * apiKeys.length)]),
    'lang=' + langPair,
    'text=' + encodeURIComponent(line)
  ].join('&');

  return ajax(url).then((data) => {
    let translatedWord = decodeLine(data.text[0]);

    if (translatedWord == word) {
      throw new Error('No translation');
    }

    return { def: [ { text: word, tr: [ { text: translatedWord } ] } ] };
  });
};
