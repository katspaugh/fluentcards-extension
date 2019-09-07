import React from 'react';
import styles from './ExportButton.css';


function exportContent() {
  chrome.runtime.sendMessage({ event: 'exportCards' });
}

export default function render() {
  return (
    <button className={ styles.button } onClick={ exportContent }>
      View saved words
    </button>
  )
}
