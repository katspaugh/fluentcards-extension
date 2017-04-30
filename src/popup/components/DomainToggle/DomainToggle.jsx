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
    .then(isEnabled => (isEnabled == null ? true : isEnabled));
}

function toggleSite(domain, isEnabled) {
  const data = {};
  data[domain] = isEnabled;
  storage.set(data);
}

export default class DomainToggle extends PureComponent {
  constructor() {
    super();

    this.state = {
      domain: '',
      isEnabled: null
    };

    this.onChange = e => {
      toggleSite(this.state.domain, e.target.checked);
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
               defaultChecked={ this.state.isEnabled }
               onChange={ this.onChange } />
        <label htmlFor="toggle-site">
          <span>on</span> <b>{ domain || 'this website' }</b>
        </label>
      </div>
    )
  }
}
