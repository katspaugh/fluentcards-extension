export function getContext(word, text) {
  let partialContext = text.replace(/\s+/g, ' ');
  let sentence = partialContext;

  partialContext.replace(/.+?[.!?]/g, s => {
    if (s.indexOf(word) != -1) {
      sentence = s;
    }
  });

  return sentence.replace(/\n+/g, ' ').trim();
}

export function isValidSelection (selectedText) {
  const minWords = 1;
  const maxWords = 5;

  if (!selectedText || !selectedText.trim()) return false;
  if (/^[0-9,.:;/?!@#$%&*()=_+<>|"'}{\[\]«»‘’“”~`±§ -]+$/.test(selectedText)) return false;
  let wordsLen = selectedText.trim().split(' ').length;
  return wordsLen >= minWords && wordsLen <= maxWords;
}

export function splitWords(text) {
  return text.split(' ');
}

export function getArticle(data, lang) {
  const articles = {
    de: {
      pl: 'die',
      m: 'der',
      f: 'die',
      n: 'das'
    }
  };

  return articles[lang] ? articles[lang][data.num] || articles[lang][data.gen] : null;
}
