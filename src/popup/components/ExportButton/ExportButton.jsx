import React from 'react';
import styles from './ExportButton.css';


function exportContent() {
  chrome.runtime.sendMessage({ event: 'exportCards' });
}

export default function render(props) {
  return (
    <button className={ styles.button } onClick={ exportContent }>
      View collected words
    </button>
  )
}
