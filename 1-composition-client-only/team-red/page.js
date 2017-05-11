/* eslint-disable no-use-before-define */
/* globals document */
const $app = document.getElementById('app');

// data
const product = {
  name: 'Tractor',
  variants: [
    {
      sku: 't_porsche',
      color: 'red',
      name: 'Porsche-Diesel Master 419',
      image: './team-red/images/tractor-red.jpg',
      thumb: './team-red/images/tractor-red-thumb.jpg',
      price: '66,00 €',
    },
    {
      sku: 't_fendt',
      color: 'green',
      name: 'Fendt F20 Dieselroß',
      image: './team-red/images/tractor-green.jpg',
      thumb: './team-red/images/tractor-green-thumb.jpg',
      price: '54,00 €',
    },
    {
      sku: 't_eicher',
      color: 'blue',
      name: 'Eicher Diesel 215/16',
      image: './team-red/images/tractor-blue.jpg',
      thumb: './team-red/images/tractor-blue-thumb.jpg',
      price: '58,00 €',
    },
  ],
};

const state = {
  variant: 't_porsche',
};

function renderOption(variant) {
  const active = state.variant === variant.sku ? 'active' : '';
  return `
    <button class="${active}" type="button" data-sku="${variant.sku}">
      <img src="${variant.thumb}" alt="${variant.name}" />
    </button>
  `;
}

function renderPage() {
  const variant = product.variants.find(v => state.variant === v.sku);
  $app.innerHTML = `
    <h1 id="store">The Model Store</h1>
    <blue-basket id="basket"></blue-basket>
    <div id="image"><div><img src="${variant.image}" alt="${variant.name}" /></div></div>
    <h2 id="name">${product.name} <small>${variant.name}</small></h2>
    <div id="options">${product.variants.map(renderOption).join('')}</div>
    <blue-buy id="buy" sku="${variant.sku}"></blue-buy>
    <green-recos id="reco" sku="${variant.sku}"></green-recos>
  `;
}

function rerender() {
  removeListeners();
  renderPage();
  addListeners();
}

function handleClickOption(e) {
  const sku = e.currentTarget.getAttribute('data-sku');
  state.variant = sku;
  rerender();
}

function addListeners() {
  const $btns = document.querySelectorAll('#options button');
  Array.prototype.forEach.call($btns, $btn => (
     $btn.addEventListener('click', handleClickOption)
  ));
}

function removeListeners() {
  const $btns = document.querySelectorAll('#options button');
  Array.prototype.forEach.call($btns, $btn => (
     $btn.removeEventListener('click', handleClickOption)
  ));
}

renderPage();
addListeners();
