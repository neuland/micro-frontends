/* eslint-disable no-console */
import express from 'express';
import morgan from 'morgan';
import renderBasket from './blue-basket/render.js';
import renderBuy from './blue-buy/render.js';

const app = express();
app.use(morgan('dev'));
app.use('/blue', express.static('./build'));

app.use('/blue-buy', (req, res) => {
  res.send(renderBuy());
});
app.use('/blue-basket', (req, res) => {
  res.send(renderBasket(0));
});

app.listen(3001);
console.log(`🔵  team blue running. fragments are available here:
>> http://127.0.0.1:3001/blue-buy
>> http://127.0.0.1:3001/blue-basket`);
