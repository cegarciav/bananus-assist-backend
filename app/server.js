require("dotenv").config()
const express = require('express');
const cors = require('cors');

const index = require('./routes/index');
const users = require('./routes/users');
const sell_points = require('./routes/sale_point');
const stores = require('./routes/stores');
const products = require('./routes/products');
const technical_chars = require('./routes/technical_chars');

const db = require( './models' );
const app = express();
const port = process.env.NODEJS_LOCAL_PORT;
const frontendClient = process.env.FRONTEND_CLIENT_ORIGIN



app.use(cors({
  origin: frontendClient,
  optionsSuccessStatus: 200
}));
app.use(express.json()); 
app.use('/', index);
app.use('/users', users);
app.use('/sell-points', sell_points);
app.use('/stores', stores);
app.use('/products', products);
app.use('/chars', technical_chars);


db.sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');

    if(process.env.NODE_ENV !== "test"){
      app.listen(port, (err) => {
        if (err) {
          return console.error('Failed', err);
        }
        console.log(`Listening on port ${port}`);
        return app;
      });
    }
  })
  .catch((err) => console.error('Unable to connect to the database:', err));
  module.exports = app;