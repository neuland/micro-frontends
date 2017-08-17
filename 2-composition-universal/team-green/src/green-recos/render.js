const recos = {
  t_porsche: ['3', '5', '6'],
  t_fendt: ['3', '6', '4'],
  t_eicher: ['1', '8', '7'],
};

export default function renderRecos(sku = 't_porsche') {
  const reco = recos[sku] || [];
  return `
    <h3>Related Products</h3>
    ${reco.map(id => `<img src="./green/images/reco_${id}.jpg" alt="Reco ${id}" />`).join('')}
  `;
}
