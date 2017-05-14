import React, { PureComponent } from 'react';
import { getArticle, splitWords } from '../../services/text-utils.js';
import SpeakButton from '../SpeakButton/SpeakButton.jsx';
import styles from './Def.css';

const maxTrs = 3;
const maxLongTrs = 2;

export default class Def extends PureComponent {
  render() {
    const data = this.props.data;

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

    const trs = (data.tr || []).slice(0, maxTrs).map(item => item.text);

    const list = trs.some(tr => splitWords(tr).length > 5) ?
      trs.slice(0, maxLongTrs).map((tr, i) => (
        <div key={ i }>{ tr }</div>
      )) : trs.join('; ');

    return (
      <div className={ styles.def }>
        <div className={ styles.word }>
          { word }
          <span className={ styles.pos }>{ data.pos || '' }</span>
        </div>

        <div className={ styles.speak }>
          <SpeakButton word={ word } lang={ this.props.lang } />
        </div>

        { extra }

        { transcription }

        <div className={ styles.definitions }>{ list }</div>
      </div>
    );
  }
}
