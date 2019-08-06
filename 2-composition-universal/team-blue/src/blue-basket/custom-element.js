/* eslint-disable no-use-before-define, no-console, class-methods-use-this */
/* globals HTMLElement, window */
import render from './render';

class BlueBasket extends HTMLElement {
  connectedCallback() {
    this.refresh = this.refresh.bind(this);
    this.log('connected');
    this.render();
    window.addEventListener('blue:basket:changed', this.refresh);
  }

  refresh() {
    this.log('event recieved "blue:basket:changed"');
    this.render();
  }

  render() {
    this.innerHTML = render(window.blue.count);
  }

  disconnectedCallback() {
    window.removeEventListener('blue:basket:changed', this.refresh);
    this.log('disconnected');
  }

  log(...args) {
    console.log('🛒 blue-basket', ...args);
  }
}

export default BlueBasket;
