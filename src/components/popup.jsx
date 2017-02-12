import React from 'react';
import ReactDOM from 'react-dom';

import { getContext } from '../utils/text-utils.js';
import FcUi from './ui.jsx';


function extractWord(sel) {
  return sel.toString();
}

function extractContext(sel) {
  return getContext(extractWord(sel), sel.focusNode.textContent);
}

export default class Popup {
  constructor(sel, isDoubleClick) {
    let div = document.createElement('div');
    let range = sel.getRangeAt(0);
    let bbox = range.getBoundingClientRect();
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    let scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
    range.collapse();
    let rightBbox = range.getBoundingClientRect();

    div.style.position = 'absolute';
    div.style.zIndex = 1000;
    div.style.left = (bbox.left + scrollLeft) + 'px';
    div.style.top = (bbox.bottom + scrollTop) + 'px';
    div.style.width = (rightBbox.left - bbox.left) + 'px';

    let word = extractWord(sel);
    let context = extractContext(sel);

    ReactDOM.render(
      <FcUi word={ word } context={ context } doubleClick={ isDoubleClick } />,
      div
    );
    document.body.appendChild(div);

    this.div = div;
  }

  remove() {
    ReactDOM.unmountComponentAtNode(this.div);
    this.div.remove();
  }
}

