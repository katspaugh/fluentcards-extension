import React, { PureComponent } from 'react';
import Def from '../Def/Def.jsx';
import styles from './Card.css';

const maxDefinitions = 2;

export default class Card extends PureComponent {
  render() {
    const defData = this.props.data.data.def
      .slice(0, maxDefinitions);

    const showPos = defData.some((item, index) => {
      const prev = defData[index - 1]
      if (!prev) return false;
      return item.text === prev.text && item.pos !== prev.pos;
    });

    const items = defData
      .map((def, i) => {
        return (
          <Def key={ i } data={ def } lang={ this.props.lang } showPos={ showPos } />
        );
      });

    return (
      <div className={ styles.card }>
        { items }

        { this.props.children }

        <div className={ styles.yandex }>
          Powered by <a href="https://tech.yandex.com/translate/">
            Yandex.Translate
          </a> and <a href="https://www.wordsapi.com/">
            WordsAPI
          </a>
        </div>
      </div>
    );
  }
}
