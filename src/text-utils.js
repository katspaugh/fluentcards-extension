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

export function getCloze(context, word) {
  let cloze = context.replace(new RegExp('\\b' + word + '\\b', 'g'), '{{c1::$&}}');

  // Languages like Japanese and Chinese don't have written word boundaries.
  if (cloze == context) {
    cloze = context.replace(new RegExp(word, 'g'), '{{c1::$&}}');
  }

  return cloze;
}
