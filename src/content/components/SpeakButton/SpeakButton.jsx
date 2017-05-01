import React, { PureComponent } from 'react';
import speak from '../../services/speech.js';
import styles from './SpeakButton.css';


export default class SpeakButton extends PureComponent {
  constructor() {
    super();

    this.onClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      speak(this.props.word, this.props.lang);
    };
  }

  render() {
    return (
      <div className={ styles.button } onClick={ this.onClick }>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 75 75">
          <g>
            <polygon points="39.389,13.769 22.235,28.606 6,28.606 6,47.699 21.989,47.699 39.389,62.75 39.389,13.769"/>
            <path d="M 48.128,49.03 C 50.057,45.934 51.19,42.291 51.19,38.377 C 51.19,34.399 50.026,30.703 48.043,27.577"/>
            <path d="M 55.082,20.537 C 58.777,25.523 60.966,31.694 60.966,38.377 C 60.966,44.998 58.815,51.115 55.178,56.076"/>
            <path d="M 61.71,62.611 C 66.977,55.945 70.128,47.531 70.128,38.378 C 70.128,29.161 66.936,20.696 61.609,14.01"/>
          </g>
        </svg>
      </div>
    );
  }
}
