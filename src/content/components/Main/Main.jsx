import React, { PureComponent } from 'react';
import userOptions from '../../../common/services/user-options'
import lookup from '../../services/lookup.js';
import speak from '../../services/speech.js';
import Card from '../Card/Card.jsx';
import SaveButton from '../SaveButton/SaveButton.jsx';
import styles from './Main.css';


const options = userOptions.getDefaults();
userOptions.get().then(data => Object.assign(options, data));


export default class Main extends PureComponent {
  constructor() {
    super();

    this.state = {
      data: null
    };

    this._onLoad = result => this.onLoad(result);
  }

  onLoad(result) {
    this.props.onLoad();

    if (!result) return;

    // Display the definition
    this.setState({ data: result });

    // Speak the selection
    if (options.ttsEnabled) speak(this.props.word, result.lang);
  }

  componentDidMount() {
    lookup(this.props.word, this.props.context, options.targetLanguage)
      .then(data => this._onLoad(data))
      .catch(() => this._onLoad());
  }

  componentWillUnmount() {
    this._onLoad = () => null;
  }

  render() {
    return (
      <div className={ styles.main }>
        { this.state.data ? (
          <Card data={ this.state.data } lang={ this.state.data.lang }>
            <SaveButton
              saveOnMount={ this.props.shouldSave }
              word={ this.props.word }
              context={ this.props.context }
              data={ this.state.data } />
          </Card>
        ) : null }
      </div>
    );
  }
}
