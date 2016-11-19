import React from 'react';

import FcButton from './button.jsx';
import FcDef from './def.jsx';

export default class FcCard extends React.Component {
  render() {
    if (!this.props.data) return null;

    let defs = this.props.data.def
    let items = defs.map((def, index) => <FcDef key={'def' + index} data={ def } />);

    return (
      <fc-card>
        <a className="fc-logo" href="https://fluentcards.com">
          <FcButton />
        </a>

        {items}

        <fc-div class="fc-powered">
          Powered by
          <a href="https://tech.yandex.com/dictionary/" target="_blank">
            <fc-span>Yandex.Dictionary</fc-span>
          </a>
        </fc-div>
      </fc-card>
    );
  }
}
