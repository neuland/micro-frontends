/* eslint-disable no-use-before-define, no-console, class-methods-use-this */
/* globals HTMLElement, window, CustomEvent */
import render from './render';

class BlueBuy extends HTMLElement {
  static get observedAttributes() {
    return ['sku'];
  }

  connectedCallback() {
    this.addToCart = this.addToCart.bind(this);
    const sku = this.getAttribute('sku');
    this.log('connected', sku);
    this.render();
    this.firstChild.addEventListener('click', this.addToCart);
  }

  addToCart() {
    window.blue.count += 1;
    this.log('event sent "blue:basket:changed"');
    this.dispatchEvent(new CustomEvent('blue:basket:changed', {
      bubbles: true,
    }));
  }

  render() {
    const sku = this.getAttribute('sku');
    this.innerHTML = render(sku);
  }

  attributeChangedCallback(attr, oldValue, newValue) {
    this.log('attributeChanged', attr, oldValue, newValue);
    this.render();
  }

  disconnectedCallback() {
    this.firstChild.removeEventListener('click', this.addToCart);
    const sku = this.getAttribute('sku');
    this.log('disconnected', sku);
  }

  log(...args) {
    console.log('🔘 blue-buy', ...args);
  }
}

export default BlueBuy;
