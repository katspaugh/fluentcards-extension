let requests = [];

const registerRequest = (req) => requests.push(req);
const unregisterRequest = (req) => requests = requests.filter(item => item !== req);

/**
 * Make an XMLHttpRequest
 *
 * @param {string} url
 * @param {any} options
 * @returns {promise}
 */
export default function ajax(url, options) {
  let xhr = new XMLHttpRequest();
  xhr.open(options.method || 'GET', url, true);
  if (options.xml) xhr.overrideMimeType('text/xml');
  xhr.send();

  const promise = new Promise((resolve, reject) => {
    xhr.onload = () => {
      if (!(xhr.readyState == xhr.DONE && xhr.status == 200)) return;

      let data;

      if (options.json) {
        try {
          data = JSON.parse(xhr.responseText);
        } catch (e) {
          reject(e);
          return;
        }
      } else if (options.xml) {
        data = xhr.responseXML;
      } else {
        data = xhr.responseText;
      }

      resolve(data);
    };

    xhr.onerror = xhr.onabort = () => {
      reject(xhr.statusText);
    };
  });

  registerRequest(xhr);

  return promise
    .catch(err => {
      unregisterRequest(xhr);
      throw err;
    })
    .then(data => {
      unregisterRequest(xhr);
      return data;
    })
}

export function cancelRequests() {
  requests.forEach(xhr => xhr.abort());
}
