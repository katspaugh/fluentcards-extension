/**
 * Speak a piece of text
 *
 * @param {string} text
 * @param {string} lang
 */
export default function speak(text, lang) {
  let speech = new window.SpeechSynthesisUtterance();
  speech.text = text;
  speech.lang = lang;
  speech.rate = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(speech);
}
