import React from 'react';

export default class FcButton extends React.Component {
  render() {
    let classes = [ 'fc-button' ];
    if (this.props.animated) classes.push('fc-button-animated');
    if (this.props.visible) classes.push('fc-button-visible');

    return (
      <div title="Click to view definition" className={ classes.join(' ') }>
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