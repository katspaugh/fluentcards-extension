import React from 'react';
import styles from './Logo.css';

export default function render() {
  return (
    <a className={ styles.logo } href="https://fluentcards.com" target="_blank">
      <svg viewBox="0 0 72 28" xmlns="http://www.w3.org/2000/svg">
        <g fill="#333">
          <rect x="0"  y="0" width="20" height="28" rx="4" ry="4" />
          <rect x="24" y="0" width="20" height="28" rx="4" ry="4" />
          <rect x="48" y="0" width="20" height="28" rx="4" ry="4" />
        </g>
      </svg>

      <br />
      Fluentcards
    </a>
  )
}
