/* globals window */
import BlueBasket from './blue-basket/custom-element';
import BlueBuy from './blue-buy/custom-element';

window.blue = { count: 0 };
window.customElements.define('blue-basket', BlueBasket);
window.customElements.define('blue-buy', BlueBuy);
