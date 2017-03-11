import React from 'react';

import lookup from '../services/lookup.js';
import speak from '../services/speech.js';
import userOptions from '../user-options.js';
import lookupsStore from '../stores/lookups-store.js';
import FcButton from './button.jsx';
import FcCard from './card.jsx';

const Behaviours = {
  doubleClick: 'double-click',
  buttonClick: 'button-click'
};

export default class Ui extends React.Component {
  constructor(props) {
    super(props);

    this.loadImmediately = this.props.doubleClick && userOptions.behavior == Behaviours.doubleClick;

    this.state = {
      buttonAnimated: false,
      buttonVisible: true,
      data: null
    };

    this._clickHandler = this.clickHandler.bind(this);
  }

  loadData() {
    this.setState({ buttonAnimated: true });

    return lookup(this.props.word, this.props.context, userOptions.targetLanguage)
      .then((result) => {
        this.setState({ buttonAnimated: false, buttonVisible: false, data: result.data });

        lookupsStore.saveOne(result, this.props.word, this.props.context);

        if (userOptions.ttsEnabled) speak(this.props.word, result.lang);
      })
      .catch(() => this.setState({ buttonAnimated: false, buttonVisible: false, data: null }));
  }

  clickHandler(e) {
    e.preventDefault();

    this.setState({
      data: { def: [{ text: 'Loading...' }] }
    });

    this.loadData();
  }

  componentDidMount() {
    if (this.loadImmediately) this.loadData();
  }

  render() {
    return (
      <div>
        <div onClick={ this._clickHandler }>
          <FcButton animated={ this.state.buttonAnimated } visible={ this.state.buttonVisible } />
        </div>

        <FcCard data={ this.state.data } />
      </div>
    );
  }
}
