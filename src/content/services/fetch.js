export default function bFetch(url) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { contentScriptQuery: url },

      (data) => {
        data instanceof Error ? reject(data) : resolve(data);
      }
    );
  });
}
