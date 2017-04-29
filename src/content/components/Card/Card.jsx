import React, { Component } from 'react';
import Def from '../Def/Def.jsx';
import styles from './Card.css';

const maxDefinitions = 2;

const Brandings = {
  yandex: (
    <div className={ styles.yandex }>
      Powered by <a href="https://tech.yandex.com/dictionary/" target="_blank">
        <span>Yandex.Dictionary</span>
      </a>
    </div>
  ),

  mw: (
    <div className={ styles.mw }></div>
  )
};

export default class Card extends Component {
  render() {
    if (!this.props.data) return null;

    const defData = this.props.data;
    const poweredBy = Brandings[defData.data.source];
    const items = defData.data.def
      .slice(0, maxDefinitions)
      .map((def, i) => <Def key={ i } data={ def } lang={ defData.lang } />);

    return (
      <div className={ styles.card }>
        { items }
        { poweredBy }
      </div>
    );
  }
}
