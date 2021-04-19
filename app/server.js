require("dotenv").config()
const express = require('express')

const db = require( './models' );
const app = express();
const port = process.env.NODEJS_LOCAL_PORT;

app.get('/', (req, res) => {
  res.send('Hello World')
});

db.sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
    app.listen(port, (err) => {
      if (err) {
        return console.error('Failed', err);
      }
      console.log(`Listening on port ${port}`);
      return app;
    });
  })
  .catch((err) => console.error('Unable to connect to the database:', err));