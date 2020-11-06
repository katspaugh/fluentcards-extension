import React, { PureComponent } from 'react';
import storage from '../../../common/services/storage';
import userOptions from '../../../common/services/user-options';
import Logo from '../Logo/Logo.jsx';
import OptionsButton from '../OptionsButton/OptionsButton.jsx';
import DomainToggle from '../DomainToggle/DomainToggle.jsx';
import ExportButton from '../ExportButton/ExportButton.jsx';
import styles from './Root.css';

const langs = {
  es: 'Spanish',
  fr: 'French',
  de: 'German'
};

export default class Root extends PureComponent {
  constructor() {
    super();

    this.state = {
      hasItems: 0,
      userLang: ''
    };
  }

  checkItems() {
    return storage.getAll().then((data) => {
      return Object.keys(data).some(key => !isNaN(Number(key)));
    });
  }

  componentDidMount() {
    this.checkItems().then(hasItems => {
      this.setState({ hasItems });
    });

    userOptions.get().then(options => {
      this.setState({ userLang: options.sourceLanguage });
    });
  }

  render() {
    const targetLang = langs[this.state.userLang] || 'a foreign language';

    return (
      <div className={ styles.container }>
        <h1 className={ styles.heading }>
          <Logo />

          <OptionsButton />
        </h1>

        <div className={ styles.main }>
          <DomainToggle />

          <p className={ styles.desc }>
            Double-click on any word on the page to look it up in the dictionary.
          </p>

          { this.state.hasItems ? (
            <div className={ styles.controls }>
              <ExportButton />
            </div>
          ) : null }

          <p className={ styles.link }>
            <a target="_blank" href="https://www.lingoda.com/en/referral/hwnm43">Get 50$ to learn {targetLang}!</a>
          </p>
        </div>
      </div>
    );
  }
}
