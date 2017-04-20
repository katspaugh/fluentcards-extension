import ajax from '../utils/ajax.js';

const apiKeys = [
  'OTdiYTM4N2ItMGVlZC00NTI3LTllMGEtYTc1NjQ1MDMyMzMx'
];

const endpoint = 'https://www.dictionaryapi.com/api/v1/references/collegiate/xml';

function xmlToJson(xml) {
	if (!xml.hasChildNodes()) return null;

	const obj = {};

	for (let i = 0, len = xml.childNodes.length; i < len; i++) {
		const item = xml.childNodes.item(i);

    if (item.nodeType == 3) {
      if (len == 1) return item.nodeValue;
      continue;
    }

    if (item.nodeName == 'it') {
      return xml.textContent;
    }

		const nodeName = item.nodeName;
		if (obj[nodeName] == null) {
			obj[nodeName] = xmlToJson(item);
		} else {
			if (!(obj[nodeName] instanceof Array)) {
				obj[nodeName] = [ obj[nodeName] ];
			}
			obj[nodeName].push(xmlToJson(item));
		}
  }

	return obj;
};

/**
 * Download a dictionary definition of a word
 *
 * @param {string} text
 * @returns {promise}
 */
export default function mwDefine(text) {
  const key = atob(apiKeys[~~(Math.random() * apiKeys.length)]);
  const word = encodeURIComponent(text);
  const url = `${ endpoint }/${ word }?key=${ key }`;

  return ajax(url, { xml: true }).then((xml) => {
    const json = xmlToJson(xml);
    const entry = json.entry_list.entry;
    let suggestion = json.entry_list.suggestion;
    if (suggestion instanceof Array) suggestion = suggestion[0];

    if (!entry && suggestion) {
      return mwDefine(suggestion);
    }

    if (!entry && !suggestion) throw new Error('No data');

    const defs = (entry instanceof Array ? entry : [ entry ])
      .filter(entry => entry && (entry.def || entry.cx))
      .map(entry => {
        let dts = entry.def ? entry.def.dt : entry.cx ? entry.cx.cl + ' ' + entry.cx.ct : [];
        dts = (dts instanceof Array ? dts : [ dts ]);

        let trs = dts.filter(dt => typeof dt == 'string' && dt.length);

        if (!trs.length) {
          trs = dts
            .filter(dt => dt.sx && dt.sx.length)
            .map(dt => dt.sx instanceof Array ? dt.sx.join('; ') : dt.sx);
        }

        if (!trs.length) return null;

        trs = trs.map(dt => ({ text: dt.replace(/^:/, '') }));

        return { text: entry.ew, pos: entry.fl, ts: entry.pr, tr: trs };
      })
      .filter(Boolean);

    if (defs.length) return { source: 'mw', def: defs.slice(0, 1) };

    throw new Error('No data');
  });
}
