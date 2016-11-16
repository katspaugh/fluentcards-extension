import React from 'react';

import lookup from './lookup.js';
import speak from './speech.js';
import userOptions from './user-options.js';
import lookupsStore from './lookups-store.js';
import FcButton from './button.jsx';
import FcCard from './card.jsx';

const Behaviours = {
  doubleClick: 'double-click',
  buttonClick: 'button-click'
};

export default class Ui extends React.Component {
  constructor(props) {
    super(props);

    let doubleClick = this.props.doubleClick && userOptions.behavior == Behaviours.doubleClick;

    if (doubleClick) this.loadData();

    this.state = {
      buttonAnimated: doubleClick,
      buttonVisible: true,
      data: null
    };
  }

  loadData() {
    this.setState({ animated: true });

    return lookup(this.props.word, this.props.context, userOptions.targetLanguage)
      .then((result) => {
        this.setState({ buttonVisible: false, data: result.data });
        lookupsStore.saveOne(result, this.props.word, this.props.context);
        if (userOptions.ttsEnabled) speak(this.props.word, result.lang);
      })
      .catch(() => this.setState({ buttonVisible: false, data: null }));
  }

  clickHandler() {
    this.setState({
      data: { def: [{ text: 'Loading...' }] }
    });

    this.loadData();
  }

  render() {
    const clickHandler = (e) => {
      e.preventDefault();
      this.clickHandler();
    };

    return (
      <fc-div>
        <fc-div onClick={clickHandler}>
          <FcButton animated={this.state.buttonAnimated} visible={this.state.buttonVisible} />
        </fc-div>

        <FcCard data={this.state.data} />
      </fc-div>
    );
  }
}
