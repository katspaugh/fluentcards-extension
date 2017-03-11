import React from 'react';
import FcButton from './button.jsx';
import FcDef from './def.jsx';

const maxDefinitions = 2;

const Brandings = {
  yandex: (
    <div className="fc-yandex">
      Powered by <a href="https://tech.yandex.com/dictionary/" target="_blank">
        <fc-span>Yandex.Dictionary</fc-span>
      </a>
    </div>
  ),

  mw: (
    <div className="fc-mw"></div>
  )
};

export default class FcCard extends React.Component {
  render() {
    if (!this.props.data) return null;

    let defData = this.props.data;
    let items = defData.data.def
        .slice(0, maxDefinitions)
        .map((def, i) => <FcDef key={ i } data={ def } lang={ defData.lang } />);

    let poweredBy = Brandings[defData.data.source];

    return (
      <div className="fc-card">
        { items }
        { poweredBy }
      </div>
    );
  }
}
