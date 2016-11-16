/**
 * Make an XMLHttprequest
 *
 * @param {string} url
 * @return {promise}
 */
export default function ajax(url) {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.send();

  return new Promise((resolve, reject) => {
    xhr.onload = () => {
      let data;
      try {
        data = JSON.parse(xhr.responseText);
      } catch (e) {
        reject(e);
        return;
      }
      resolve(data);
    };

    xhr.onerror = () => {
      reject(xhr.statusText);
    };
  });
}
