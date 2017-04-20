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
  constructor(sel, loadAtOnce) {
    const div = document.createElement('div');
    const range = sel.getRangeAt(0);
    const bbox = range.getBoundingClientRect();
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
    const bboxBottom = bbox.bottom;
    const bboxLeft = bbox.left;
    // Collapse the selection range horizontally to align to the right
    // NB: do this after caching the original bbox
    range.collapse();
    const rightBbox = range.getBoundingClientRect();
    const rightBoxLeft = rightBbox.left;

    div.style.position = 'absolute';
    div.style.zIndex = 1000;
    div.style.top = (bboxBottom + scrollTop) + 'px';
    div.style.left = (bboxLeft + scrollLeft) + 'px';
    div.style.width = (rightBoxLeft - bboxLeft) + 'px';

    const word = extractWord(sel);
    const context = extractContext(sel);

    ReactDOM.render(
      <FcUi word={ word } context={ context } loadAtOnce={ loadAtOnce } />,
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

