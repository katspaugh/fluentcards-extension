const endpoint = 'https://a04fhmsri8.execute-api.eu-west-1.amazonaws.com/dev/ipa';

/**
 * Transcribe a text into IPA
 *
 * @param {string} text
 * @param {?string} language
 * @returns {promise}
 */
export default function ipa(text, language = 'en') {
  return fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify({ text, language })
  })
    .then(resp => resp.json());
};
