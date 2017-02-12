import React from 'react';

import FcButton from './button.jsx';
import FcDef from './def.jsx';

const maxDefinitions = 2;

export default class FcCard extends React.Component {
  render() {
    if (!this.props.data) return null;

    let data = this.props.data;
    let items = data.def
        .slice(0, maxDefinitions)
        .map((def, i) => <FcDef key={ i } data={ def } />);

    let Brandings = {};

    Brandings.yandex = (
      <div className="fc-yandex">
        Powered by
        <a href="https://tech.yandex.com/dictionary/" target="_blank">
          <fc-span>Yandex.Dictionary</fc-span>
        </a>
      </div>
    );

    Brandings.mw = (
      <div className="fc-mw"></div>
    );

    Brandings.fluentcards = (
      <a className="fc-logo" href="https://fluentcards.com">
        <FcButton />
      </a>
    );

    let brandLogo = Brandings[data.source] || Brandings.fluentcards;
    let poweredBy = '';

    if (brandLogo == Brandings.yandex) {
      brandLogo = Brandings.fluentcards;
      poweredBy = Brandings.yandex;
    }

    return (
      <div className="fc-card">
        <div className="fc-brand">{ brandLogo }</div>
        { items }
        { poweredBy }
      </div>
    );
  }
}
