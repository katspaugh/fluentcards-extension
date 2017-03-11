export function getContext(phrase, text) {
  let partialContext = text.replace(/\s+/g, ' ');
  let sentence = partialContext;

  partialContext.replace(/.+?[.!?]/g, (s, sentenceStart) => {
    if (s.indexOf(phrase) != -1) {
      sentence = s;
    }
  });

  return sentence.replace(/\n+/g, ' ').trim();
}

export function isValidSelection (selectedText) {
  if (!selectedText || !selectedText.trim()) return false;
  if (/^[0-9,.:;/?!@#$%&*()=_+<>|"'}{\[\]«»‘’“”~`±§ -]+$/.test(selectedText)) return false;
  let wordsLen = selectedText.trim().split(' ').length;
  return wordsLen >= 1 && wordsLen <= 3;
}

export function getArticle (data, lang) {
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
