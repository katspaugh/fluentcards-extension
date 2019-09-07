import React, { PureComponent } from 'react';
import { getArticle, splitWords } from '../../services/text-utils.js';
import SpeakButton from '../SpeakButton/SpeakButton.jsx';
import styles from './Def.css';

const maxTrs = 3;
const maxLongTrs = 2;

export default class Def extends PureComponent {
  renderHeading() {
    const data = this.props.data;

    const pos = this.props.showPos && data.pos ? (
      <span className={ styles.pos }>{ data.pos }</span>
    ) : '';

    let word = data.text;
    const article = getArticle(data, this.props.lang);
    if (article) word = article + ' ' + word;

    const extra = (data.fl || data.num || data.gen) ? (
      <span className={ styles.extra }>
        <span className={ styles.fl }>{ data.fl || '' }</span>
        { data.fl && (data.num || data.gen) ? ', ' : '' }
        <span className={ styles.gen }>{ data.num || data.gen || '' }</span>
      </span>
    ) : '';

    const transcription = data.ts ? (
      <span className={ styles.ts }>{ `${ data.ts }` }</span>
    ) : '';

    return (
      <div>
        <div className={ styles.word }>
          { word }

          { pos }

          { extra || transcription }
        </div>

        { extra ? (
          <div className={ styles.tsBlock }>{ transcription }</div>
        ) : '' }

        <div className={ styles.speak }>
          <SpeakButton word={ word } lang={ this.props.lang } />
        </div>
      </div>
    );
  }

  render() {
    const data = this.props.data;
    const trs = (data.tr || []).slice(0, maxTrs);

    const trTexts = trs.map(item => item.text).filter(Boolean);
    const list = trTexts.some(tr => splitWords(tr).length > 5) ?
      trTexts.slice(0, maxLongTrs).map((tr, i) => (
        <div key={ i }>{ tr }</div>
      )) : trTexts.join('; ');

    const trExamples = [];
    trs.forEach(tr => {
      tr.ex && tr.ex.forEach(ex => trExamples.push(ex.text));
    });
    const examplesList = trExamples.slice(0, maxLongTrs).join('; ');

    return (
      <div className={ styles.def }>
        { this.renderHeading() }

        <div className={ styles.definitions }>{ list }</div>

        { examplesList ? (
          <div className={ styles.examples }>
            <span>E. g.</span>&nbsp;
            { examplesList }
          </div>
        ) : '' }
      </div>
    );
  }
}
