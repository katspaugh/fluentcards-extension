import React from 'react';
import ReactDOM from 'react-dom';

import { getContext } from '../../services/text-utils.js';
import Main from '../Main/Main.jsx';


function extractWord(sel) {
  return sel.toString();
}

function extractContext(sel, word) {
  return getContext(word, sel.focusNode.textContent);
}

function getPosition(sel) {
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

  return {
    left: bboxLeft + scrollLeft,
    right: rightBoxLeft + scrollLeft,
    bottom: bboxBottom + scrollTop
  };
}

function createDiv({ left, top, width }) {
  const div = document.createElement('div');

  div.style.position = 'absolute';
  div.style.zIndex = '1000';
  div.style.left = `${ left }px`;
  div.style.top = `${ top }px`;
  div.style.width = `${ width }px`;

  document.body.appendChild(div);

  return div;
}

export default class Popup {
  constructor(sel, loadAtOnce) {
    const word = extractWord(sel);
    const context = extractContext(sel, word);
    const pos = getPosition(sel);

    this.div = createDiv({
      left: pos.left,
      top: pos.bottom,
      width: pos.right - pos.left
    });

    ReactDOM.render(
      <Main word={ word } context={ context } loadAtOnce={ loadAtOnce } />,
      this.div
    );
  }

  remove() {
    ReactDOM.unmountComponentAtNode(this.div);
    this.div.remove();
  }
}

