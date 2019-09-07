import React, { PureComponent } from 'react';
import lookupsStore from '../../services/lookups-store';
import styles from './SaveButton.css';


export default class SaveButton extends PureComponent {
  constructor() {
    super();

    this.state = {
      saving: false,
      saved: false
    };

    this._onClick = () => this.saveWord();
  }

  saveWord() {
    this.setState({ saving: true });

    // Save the lookup in the storage
    lookupsStore
      .saveOne(this.props.word, this.props.context, this.props.data)
      .then(() => {
        this.setState({ saving: false, saved: true });
      })
      .catch(() => {
        this.setState({ saving: false });
      });
  }

  componentWillMount() {
    if (this.props.saveOnMount) {
      this.saveWord();
    }
  }

  render() {
    return (
      <div className={ styles.container }>
        <button onClick={ this._onClick } disabled={ this.state.saving || this.state.saved }>
          { this.state.saved ? 'Saved!' : 'Save word' }
        </button>
      </div>
    );
  }
}
