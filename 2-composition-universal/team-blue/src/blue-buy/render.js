const prices = {
  t_porsche: '66,00 €',
  t_fendt: '54,00 €',
  t_eicher: '58,00 €',
};

export default function renderBuy(sku = 't_porsche') {
  const price = prices[sku];
  return `<button type="button">buy for ${price}</button>`;
}
