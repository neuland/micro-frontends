const data = {
  t_porsche: ['3', '5', '6'],
  t_fendt: ['3', '6', '4'],
  t_eicher: ['1', '8', '7'],
};

export default function recoApi(req, res) {
  setTimeout(() => {
    res.send(data[req.query.sku]);
  }, 1000);
}
