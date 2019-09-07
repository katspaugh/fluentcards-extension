export default function bFetch(api, params) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { api, params },

      (data) => {
        data instanceof Error ? reject(data) : resolve(data);
      }
    );
  });
}
