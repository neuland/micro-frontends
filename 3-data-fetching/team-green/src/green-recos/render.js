const placeholder = "data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><circle cx='100' cy='100' r='60' style='fill: lightgray;' /></svg>";

export default function renderRecos(reco) {
  let content = '';

  if (reco) {
    content = reco.map((id) => `<img src="./green/images/reco_${id}.jpg" alt="Reco ${id}" />`).join('');
  } else {
    // return '';
    content = [1, 2, 3].map(() => `<img src="${placeholder}" role="presentation" />`).join('');
  }

  return `
    <h3>Related Products</h3>
    ${content}
  `;
}
