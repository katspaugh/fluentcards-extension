import ajax from './ajax.js';

const apiKeys = [
  'OTdiYTM4N2ItMGVlZC00NTI3LTllMGEtYTc1NjQ1MDMyMzMx'
];

const endpoint = 'http://www.dictionaryapi.com/api/v1/references/collegiate/xml';

function xmlToJson(xml) {
	if (!xml.hasChildNodes()) return null;

	let obj = {};

	for (let i = 0, len = xml.childNodes.length; i < len; i++) {
		let item = xml.childNodes.item(i);

    if (item.nodeType == 3) {
      if (len == 1) return item.nodeValue;
      continue;
    }

		let nodeName = item.nodeName;
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
  let key = atob(apiKeys[~~(Math.random() * apiKeys.length)]);
  let word = encodeURIComponent(text);
  let url = `${ endpoint }/${ word }?key=${ key }`;

  return ajax(url, { xml: true }).then((xml) => {
    let json = xmlToJson(xml);
    let entry = json.entry_list.entry;

    let defs = (entry instanceof Array ? entry : [ entry ])
        .filter((entry) => entry.def || entry.cx)
        .map((entry) => {
          let dts = entry.def ? entry.def.dt : entry.cx ? entry.cx.cl + ' ' + entry.cx.ct : [];

          let trs = (dts instanceof Array ? dts : [ dts ])
            .filter((dt) => typeof dt == 'string')
            .map((dt) => ({ text: dt.replace(/^:/, '') }))

          if (!trs.length) return null;

          return { text: entry.ew, pos: entry.fl, ts: entry.pr, tr: trs };
        })
        .filter(Boolean);

    if (defs.length) return { source: 'mw', def: defs.slice(0, 1) };

    throw new Error('No data');
  });
}
