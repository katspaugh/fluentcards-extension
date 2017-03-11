import React from 'react';

import lookup from '../services/lookup.js';
import speak from '../services/speech.js';
import userOptions from '../user-options.js';
import config from '../config.js';
import lookupsStore from '../stores/lookups-store.js';
import FcButton from './button.jsx';
import FcCard from './card.jsx';

export default class Ui extends React.Component {
  constructor(props) {
    super(props);

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
        this.setState({ buttonAnimated: false, buttonVisible: false, data: result });

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
    if (this.props.loadAtOnce) this.loadData();
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
