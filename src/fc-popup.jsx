import React from 'react';
import ReactDOM from 'react-dom';

import FcButton from './fc-button.jsx';
import FcDef from './fc-def.jsx';

export default class FcPopup extends React.Component {
  render() {
    let defs = this.props.data.map((def, index) => <FcDef key={index} data={ def } />);

    return (
      <fc-popup>
        <a className="fc-logo" href="https://fluencards.com">
          <FcButton />
        </a>

        {defs}

        <fc-div className="fc-powered">
          Powered by <a href="https://tech.yandex.com/dictionary/" target="_blank">Yandex.Dictionary</a>
        </fc-div>
      </fc-popup>
    );
  }
}


let loadingData = [ { text: 'Loading...' } ];
ReactDOM.render(
  <FcPopup data={ loadingData } />,
  document.getElementById('fc-popup-loading')
);

let data = [{"text":"class","pos":"noun","ts":"klɑːs","tr":[{"text":"grade","pos":"noun","syn":[{"text":"quality","pos":"noun"},{"text":"rank","pos":"noun"}]},{"text":"type","pos":"noun","syn":[{"text":"category","pos":"noun"},{"text":"group","pos":"noun"},{"text":"form","pos":"noun"},{"text":"kind","pos":"noun"},{"text":"variety","pos":"noun"},{"text":"sort","pos":"noun"},{"text":"breed","pos":"noun"},{"text":"cool","pos":"noun"}]},{"text":"course","pos":"noun","syn":[{"text":"lesson","pos":"noun"},{"text":"school","pos":"noun"},{"text":"study","pos":"noun"},{"text":"exercise","pos":"noun"}]},{"text":"tier","pos":"verb"},{"text":"social class","pos":"noun","syn":[{"text":"stratum","pos":"noun"}]},{"text":"classify","pos":"verb","syn":[{"text":"categorize","pos":"verb"}]},{"text":"occupation","pos":"noun","syn":[{"text":"employment","pos":"noun"},{"text":"pursuit","pos":"noun"}]},{"text":"classiness","pos":"noun"}]}];

ReactDOM.render(
  <FcPopup data={ data } />,
  document.getElementById('fc-popup-data')
);
