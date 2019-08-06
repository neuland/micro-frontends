/* eslint-disable no-use-before-define, no-console, class-methods-use-this */
/* globals HTMLElement */
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
    this.innerHTML = render(sku);
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
