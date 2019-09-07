import React from 'react';
import ReactDOM from 'react-dom';
import getCaretCoordinates from 'textarea-caret';
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
  const isInInput = sel.anchorNode.contains(document.activeElement) &&
    [ 'textarea', 'input' ].includes(document.activeElement.tagName.toLowerCase());
  const position = {};

  if (isInInput) {
    const input = document.activeElement;
    const coordsStart = getCaretCoordinates(input, input.selectionStart);
    const coordsEnd = getCaretCoordinates(input, input.selectionEnd);
    const bbox = input.getBoundingClientRect();
    position.left = bbox.left + coordsStart.left;
    position.right = bbox.left + coordsEnd.left;
    position.top = bbox.top + coordsStart.top;
    position.bottom = bbox.top + coordsStart.top + 20;
  } else {
    const startBbox = range.getBoundingClientRect();
    position.left = startBbox.left;

    // Collapse the selection range horizontally to align to the right
    // NB: do this after caching the original bbox
    const endRange = range.cloneRange();
    endRange.collapse();
    const endBbox = endRange.getBoundingClientRect();
    position.right = endBbox.left;
    position.top = endBbox.top;
    position.bottom = endBbox.bottom;
  }

  return {
    left: Math.round(position.left + scrollLeft),
    right: Math.round(position.right + scrollLeft),
    top: Math.round(position.top + scrollTop),
    bottom: Math.round(position.bottom + scrollTop)
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
  constructor(sel, shouldSave = false) {
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
      <Main word={ word } context={ context } onLoad={ onLoad } shouldSave={ shouldSave } />,
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

