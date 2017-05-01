import React, { PureComponent } from 'react';
import Def from '../Def/Def.jsx';
import styles from './Card.css';

const maxDefinitions = 2;

export default class Card extends PureComponent {
  render() {
    const defData = this.props.data;

    const items = defData.data.def
      .slice(0, maxDefinitions)
      .map((def, i) => <Def key={ i } data={ def } lang={ defData.lang } />);

    return (
      <div className={ styles.card }>
        { items }

        <div className={ styles.yandex }>
          Powered by <a href="https://tech.yandex.com/dictionary/" target="_blank">
            Yandex.Dictionary
          </a>
        </div>
      </div>
    );
  }
}
