import detectLanguage from './services/detect-language.js';
import speak from './services/speech.js';
import ipa from './services/ipa.js';

const tags = [
  'p:not([id]):not([class])',
  'ol:not([id]):not([class])',
  'ul:not([id]):not([class])',
  'h1:not([class])',
  'h2:not([class])',
  'h3:not([class])',
  'h4:not([class])'
];

const minWordLength = 4;

const stopWords = 'about|after|along|also|around|back|because|been|before|came|come|could|does' +
  '|down|from|gave|give|going|gone|good|have|here|html|http|into|just|know|left|like|look|mean' +
  '|mine|near|next|okay|ours|over|really|right|since|some|such|tell|than|that|their|theirs' +
  '|them|then|there|these|they|think|this|those|though|through|time|under|until|want|well' +
  '|went|were|what|when|where|which|will|with|would|your|yours'.split('|');

function collectElements(list, el) {
  const toReplace = [];

  Array.prototype.forEach.call(el.childNodes, node => {
    if (node.nodeType === node.ELEMENT_NODE) {
      if (node.childElementCount) {
        collectElements(list, node);
      } else {
        list.push(node);
      }
      return;
    }

    if (node.nodeType === node.TEXT_NODE) {
      const text = node.textContent;
      if (!text.trim()) return;
      const span = document.createElement('span');
      span.textContent = text;
      list.push(span);

      toReplace.push(() => el.replaceChild(span, node));
    }
  });

  toReplace.forEach(fn => fn());
}

function extractWords() {
  const elements = [];

  tags.forEach(tag => {
    const els = document.querySelectorAll(tag);
    Array.prototype.forEach.call(els, el => collectElements(elements, el));
  });

  const elWords = elements.map(el => ({
    element: el,

    words: el.textContent.trim().split(/\b/g)
      .map(s => s.trim())
      .filter(s => (
        s.length >= minWordLength &&
          !/\W|\d/.test(s) &&
          !stopWords.includes(s)
      ))
  }));

  return elWords;
}

function renderRuby(word, ts) {
  const rubyStyles = `
line-height: 2.2;
`;

  const rtStyles = `
user-select: none;
cursor: default;
color: #999;
font-size: 10px;
font-style: normal;
font-weight: 100;
font-family: Monaco, Consolas, monospace;
`;

  return [
    `<ruby style="${ rubyStyles }">`,
    `<rb>${ word }</rb>`,
    `<rt style="${ rtStyles }">${ ts }</rt>`,
    `</ruby>`
  ].join('');
}

function transcribe(language) {
  const elWords = extractWords();

  const joinedWords = elWords
    .map(item => item.words.join(' ; '))
    .join('\n;\n;\n;\n');

  ipa(joinedWords, language)
    .catch(() => null)
    .then(data => {
      if (!data) return;

      const ipaTexts = data.text.split('\n\n\n');

      ipaTexts.forEach((ipaText, index) => {
        const elItem = elWords[index];
        const ipas = ipaText.trim().split('\n');
        const html = elItem.element.innerHTML;

        const newHtml = html.replace(/\b(\w+)(?=\b)/g, (s, word) => {
          if (elItem.words.includes(word)) {
            const ts = ipas.shift();

            if (!ts) return s;

            return renderRuby(word, ts);
          }

          return s;
        });

        if (html !== newHtml) {
          elItem.element.innerHTML = newHtml;
        }
      });
    });
}

function speakOnClick(language) {
  document.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'rt') {
      const word = e.target.parentNode.querySelector('rb').textContent;
      speak(word, language === 'en' ? 'en-GB' : language);
    }
  });
}

export default function transcribeTexts() {
  detectLanguage(document.body.textContent).then(language => {
    if (language !== 'en') return;

    transcribe(language);
    speakOnClick(language);
  });
}
