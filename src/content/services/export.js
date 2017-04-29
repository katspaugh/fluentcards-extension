import lookupsStore from '../services/lookups-store.js';


function insertScript(src) {
  const script = document.createElement('script');
  script.setAttribute('src', 'data:text/javascript;charset=utf-8,' + encodeURIComponent(src));
  document.body.appendChild(script);
}


export function exportCards() {
  if (!/fluentcards/.test(window.location.hostname)) return;

  lookupsStore.getAll()
    .then((items) => {
      insertScript('window.fluentcards = ' + JSON.stringify(items));

      setTimeout(() => {
        lookupsStore.clear();
      }, 3000);
    });
}
