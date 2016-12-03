/**
 * Make an XMLHttprequest
 *
 * @param {string} url
 * @param {object} options
 * @returns {promise}
 */
export default function ajax(url, options) {
  let xhr = new XMLHttpRequest();
  xhr.open(options.method || 'GET', url, true);
  if (options.xml) xhr.overrideMimeType('text/xml');
  xhr.send();

  return new Promise((resolve, reject) => {
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

    xhr.onerror = () => {
      reject(xhr.statusText);
    };
  });
}
