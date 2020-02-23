import React, { PureComponent } from 'react';
import storage from '../../../common/services/storage';
import Logo from '../Logo/Logo.jsx';
import OptionsButton from '../OptionsButton/OptionsButton.jsx';
import DomainToggle from '../DomainToggle/DomainToggle.jsx';
import ExportButton from '../ExportButton/ExportButton.jsx';
import styles from './Root.css';


export default class Root extends PureComponent {
  constructor() {
    super();

    this.state = {
      hasItems: 0
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
  }

  render() {
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
        </div>
      </div>
    );
  }
}
