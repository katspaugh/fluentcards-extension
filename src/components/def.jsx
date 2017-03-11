import React from 'react';
import { getArticle } from '../utils/text-utils.js';

const maxTrs = 3;

export default class FcDef extends React.Component {
  render() {
    const data = this.props.data;
    const trs = (data.tr || []).slice(0, maxTrs);

    let word = data.text;
    const article = getArticle(data, this.props.lang);
    if (article) word = article + ' ' + word;

    const extra = (data.fl || data.num || data.gen) ? (
      <div className="fc-extra">
        <span className="fc-fl">{ data.fl || '' }</span>
        { data.fl && (data.num || data.gen) ? ', ' : '' }
        <span className="fc-gen">{ data.num || data.gen || '' }</span>
      </div>
    ) : '';

    const transcription = data.ts ? (
      <div className="fc-ts">{ data.ts ? '[' + data.ts + ']' : '' }</div>
    ) : '';

    return (
      <div className="fc-def">
        <div className="fc-word">
          { word }
          <span className="fc-pos">{ data.pos || '' }</span>
        </div>

        { extra }

        { transcription }

        <div className="fc-list">{ trs.map(item => item.text).join('; ') }</div>
      </div>
    );
  }
}
