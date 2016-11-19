import React from 'react';

export default class FcDef extends React.Component {
  render() {
    let data = this.props.data;
    let trs = data.tr || [];
    let items = trs.slice(0, 3).map((item, i) => <fc-li key={'item' + i}><fc-span>{ item.text }</fc-span></fc-li>);

    return (
      <fc-def>
        <fc-span className="fc-text">{ data.text }</fc-span>
        <fc-span class="fc-fl">{ data.fl ? '; ' + data.fl : '' }</fc-span>
        <fc-span class="fc-gen">{ data.gen ? ', ' + data.gen : '' }</fc-span>
        <fc-span class="fc-pos">{ data.pos || '' }</fc-span>
        <fc-div class="fc-ts">{ data.ts ? '[' + data.ts + ']' : '' }</fc-div>
        <fc-ul>{ items }</fc-ul>
      </fc-def>
    );
  }
}
