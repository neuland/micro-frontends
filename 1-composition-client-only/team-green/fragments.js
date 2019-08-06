/* eslint-disable no-use-before-define, no-console, class-methods-use-this */
/* globals HTMLElement, window */
(function fragments() {
  const recos = {
    t_porsche: ['3', '5', '6'],
    t_fendt: ['3', '6', '4'],
    t_eicher: ['1', '8', '7'],
  };

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
      const reco = recos[sku] || [];
      this.innerHTML = `
        <h3>Related Products</h3>
        ${reco.map(id => `<img src="./team-green/images/reco_${id}.jpg" alt="Reco ${id}" />`).join('')}
      `;
    }

    disconnectedCallback() {
      const sku = this.getAttribute('sku');
      this.log('disconnected', sku);
    }

    log(...args) {
      console.log('🖼️ green-recos', ...args);
    }
  }
  window.customElements.define('green-recos', GreenRecos);
}());
