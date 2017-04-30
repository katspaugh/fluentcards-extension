import React, { PureComponent } from 'react';
import { getArticle } from '../../services/text-utils.js';
import styles from './Def.css';

const maxTrs = 3;

export default class Def extends PureComponent {
  render() {
    const data = this.props.data;
    const trs = (data.tr || []).slice(0, maxTrs);

    let word = data.text;
    const article = getArticle(data, this.props.lang);
    if (article) word = article + ' ' + word;

    const extra = (data.fl || data.num || data.gen) ? (
      <div className={ styles.extra }>
        <span className={ styles.fl }>{ data.fl || '' }</span>
        { data.fl && (data.num || data.gen) ? ', ' : '' }
        <span className={ styles.gen }>{ data.num || data.gen || '' }</span>
      </div>
    ) : '';

    const transcription = data.ts ? (
      <div className={ styles.ts }>{ data.ts ? '[' + data.ts + ']' : '' }</div>
    ) : '';

    return (
      <div className={ styles.def }>
        <div className={ styles.word }>
          { word }
          <span className={ styles.pos }>{ data.pos || '' }</span>
        </div>

        { extra }

        { transcription }

        <div className={ styles.list }>{ trs.map(item => item.text).join('; ') }</div>
      </div>
    );
  }
}
