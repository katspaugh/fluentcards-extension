import React from 'react';

const maxTrs = 3;

export default class FcDef extends React.Component {
  render() {
    let data = this.props.data;
    let trs = (data.tr || []).slice(0, maxTrs);

    let items = trs.map((item, i) => (
      <div key={ i } className="fc-li">{ item.text }</div>
    ));

    return (
      <div className="fc-def">
        <span className="fc-text">{ data.text }</span>
        <span className="fc-fl">{ data.fl ? '; ' + data.fl : '' }</span>
        <span className="fc-gen">{ data.gen ? ', ' + data.gen : '' }</span>
        <span className="fc-pos">{ data.pos || '' }</span>
        <div className="fc-ts">{ data.ts ? '[' + data.ts + ']' : '' }</div>

        <div className="fc-ul">{ items }</div>
      </div>
    );
  }
}
