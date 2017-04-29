import React, { Component } from 'react';
import lookup from '../../services/lookup.js';
import speak from '../../services/speech.js';
import userOptions from '../../../common/services/user-options.js';
import lookupsStore from '../../services/lookups-store.js';
import Button from '../Button/Button.jsx';
import Card from '../Card/Card.jsx';


export default class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      buttonAnimated: false,
      buttonVisible: true,
      data: null
    };

    this.userOptions = userOptions.getDefaults();
    userOptions.get().then(data => Object.assign(this.userOptions, data));

    this._clickHandler = this.clickHandler.bind(this);
  }

  loadData() {
    this.setState({ buttonAnimated: true });

    return lookup(this.props.word, this.props.context, this.userOptions.targetLanguage)
      .then((result) => {
        this.setState({ buttonAnimated: false, buttonVisible: false, data: result });

        lookupsStore.saveOne(this.props.word, this.props.context, result);

        if (this.userOptions.ttsEnabled) speak(this.props.word, result.lang);
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
          <Button animated={ this.state.buttonAnimated } visible={ this.state.buttonVisible } />
        </div>

        <Card data={ this.state.data } />
      </div>
    );
  }
}
