/* globals document */
/* eslint-disable no-use-before-define */
import renderPage from './page/render';

const $app = document.getElementById('app');

function handleClickOption(e) {
  const sku = e.currentTarget.getAttribute('data-sku');
  rerender(sku);
}

function addListeners() {
  const $btns = $app.querySelectorAll('#options button');
  Array.prototype.forEach.call($btns, $btn => (
     $btn.addEventListener('click', handleClickOption)
  ));
}

function removeListeners() {
  const $btns = $app.querySelectorAll('#options button');
  Array.prototype.forEach.call($btns, $btn => (
     $btn.removeEventListener('click', handleClickOption)
  ));
}

function rerender(sku) {
  removeListeners();
  $app.innerHTML = renderPage(sku);
  addListeners();
}

addListeners();
