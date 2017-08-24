/* globals window */

// stores already requested data
const loadedRecos = {};

export default function fetch(sku) {
  return new Promise((resolve, reject) => {
    const reco = loadedRecos[sku];
    if (reco) {
      resolve(loadedRecos[sku]);
    } else {
      window.fetch(`/green/api/reco?sku=${sku}`).then((response) => {
        const data = response.json();
        loadedRecos[sku] = data;
        resolve(data);
      }, reject);
    }
  });
}
