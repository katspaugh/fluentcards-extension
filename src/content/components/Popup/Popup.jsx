import React from 'react';
import ReactDOM from 'react-dom';
import { getContext } from '../../services/text-utils.js';
import Main from '../Main/Main.jsx';


function extractWord(sel) {
  return sel.toString();
}

function extractContext(sel, word) {
  return getContext(word, (sel.focusNode.parentNode || sel.focusNode).textContent);
}

function getPosition(sel) {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
  const range = sel.getRangeAt(0);
  const startBbox = range.getBoundingClientRect();
  const startBboxLeft = startBbox.left;

  // Collapse the selection range horizontally to align to the right
  // NB: do this after caching the original bbox
  const endRange = range.cloneRange();
  endRange.collapse();
  const endBbox = endRange.getBoundingClientRect();

  return {
    left: Math.round(startBboxLeft + scrollLeft),
    right: Math.round(endBbox.left + scrollLeft),
    top: Math.round(endBbox.top + scrollTop),
    bottom: Math.round(endBbox.bottom + scrollTop)
  };
}

function createDiv({ left, right, top, bottom }) {
  const padding = 3;
  const div = document.createElement('div');

  div.style.position = 'absolute';
  div.style.zIndex = '1000';
  div.style.left = `${ left }px`;
  div.style.top = `${ top - padding }px`;
  div.style.width = `${ (right - left) }px`;
  div.style.paddingTop = `${ padding + (bottom - top) }px`;

  document.body.appendChild(div);

  return div;
}

export default class Popup {
  constructor(sel) {
    const maxWait = 100;
    const start = Date.now();
    const word = extractWord(sel);
    const context = extractContext(sel, word);
    const pos = getPosition(sel);

    this.isDismissable = true;
    const onLoad = () => this.isDismissable = (Date.now() - start) <= maxWait;

    this.div = createDiv(pos);

    this.div.addEventListener('mouseleave', () => {
      if (this.isDismissable) this.remove();
    });

    ReactDOM.render(
      <Main word={ word } context={ context } onLoad={ onLoad } />,
      this.div
    );
  }

  remove() {
    if (!this.div) return;

    ReactDOM.unmountComponentAtNode(this.div);
    this.div.remove();
    this.div = null;
  }
}

