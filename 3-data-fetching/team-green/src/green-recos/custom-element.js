/* eslint-disable no-use-before-define, no-console, class-methods-use-this */
/* globals HTMLElement */

import fetch from './fetch';
import render from './render';

class GreenRecos extends HTMLElement {
  static get observedAttributes() {
    return ['sku'];
  }

  connectedCallback() {
    const sku = this.getAttribute('sku');
    this.log('connected', sku);
    this.render();
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    this.log('attributeChanged', attr, newValue);
    this.render();
  }

  render() {
    const sku = this.getAttribute('sku');
    // immediately render skeleton view (no data)
    this.innerHTML = render();
    // load data asynchronously and rerender with actual data
    fetch(sku).then((data) => { this.innerHTML = render(data); });
  }

  disconnectedCallback() {
    const sku = this.getAttribute('sku');
    this.log('disconnected', sku);
  }

  log(...args) {
    console.log('🖼️ green-recos', ...args);
  }
}

export default GreenRecos;
