import React from 'react';
import ReactDOM from 'react-dom';

export default class FcButton extends React.Component {
  render() {
    return (
      <fc-button title="Click to view definition" class={this.props.animated ? 'fc-button-animated' : ''}>
        <svg viewBox="0 0 72 28" xmlns="http://www.w3.org/2000/svg">
          <g fill="#FBEA31">
            <rect x="0"  y="0" width="20" height="28" rx="4" ry="4" />
            <rect x="24" y="0" width="20" height="28" rx="4" ry="4" />
            <rect x="48" y="0" width="20" height="28" rx="4" ry="4" />
          </g>
        </svg>
      </fc-button>
    );
  }
}

ReactDOM.render(<FcButton animated="true" />, document.getElementById('fc-button'));
