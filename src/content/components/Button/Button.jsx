import React, { PureComponent } from 'react';
import classnames from 'classnames';
import styles from './Button.css';

export default class Button extends PureComponent {
  render() {
    const classes = classnames(styles.button, {
      [styles.buttonAnimated]: this.props.animated,
      [styles.buttonVisible]: this.props.visible
    });

    return (
      <div title="Click to view the definition" className={ classes }>
        <svg viewBox="0 0 72 28" xmlns="http://www.w3.org/2000/svg">
          <g fill="#FBEA31">
            <rect x="0"  y="0" width="20" height="28" rx="4" ry="4" />
            <rect x="24" y="0" width="20" height="28" rx="4" ry="4" />
            <rect x="48" y="0" width="20" height="28" rx="4" ry="4" />
          </g>
        </svg>
      </div>
    );
  }
}
