import React, { PureComponent } from 'react';
import storage from '../../../common/services/storage';
import styles from './DomainToggle.css';


function getDomain() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, (tabs) => {
      if (!tabs[0]) {
        reject('No active tab');
        return;
      }

      const url = tabs[0].url;
      const link = document.createElement('a');
      link.href = url;
      const domain = link.hostname;

      resolve(domain);
    });
  });
}

function isDomainEnabled(domain) {
  return storage.get(domain)
    .then(data => (!data ? true : data.isEnabled));
}

function toggleSite(domain, isEnabled) {
  storage.set(domain, { isEnabled });
}

export default class DomainToggle extends PureComponent {
  constructor() {
    super();

    this.state = {
      domain: '',
      isEnabled: true
    };

    this.onChange = e => {
      const isEnabled = e.target.checked;
      toggleSite(this.state.domain, isEnabled);
      this.setState({ isEnabled });
    };
  }

  componentDidMount() {
    getDomain()
      .then(domain => {
        isDomainEnabled(domain).then(isEnabled => {
          this.setState({ domain, isEnabled });
        });
      });
  }

  render() {
    const domain = this.state.domain.replace(/^www\./, '');

    return (
      <div className={ styles.toggle }>
        <input type="checkbox"
               id="toggle-site"
               checked={ this.state.isEnabled }
               onChange={ this.onChange } />
        <label htmlFor="toggle-site">
          <span>on</span> <b>{ domain || 'this website' }</b>
        </label>
      </div>
    )
  }
}
