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
        .map((def, index) => <FcDef key={'def' + index} data={ def } />);

    let Brandings = {};

    Brandings.yandex = (
      <fc-div class="fc-yandex">
        Powered by
        <a href="https://tech.yandex.com/dictionary/" target="_blank">
          <fc-span>Yandex.Dictionary</fc-span>
        </a>
      </fc-div>
    );

    Brandings.mw = (
      <fc-div class="fc-mw"></fc-div>
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
      <fc-card>
        <fc-div class="fc-brand">{brandLogo}</fc-div>
        {items}
        {poweredBy}
      </fc-card>
    );
  }
}
