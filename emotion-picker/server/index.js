const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

app.get('/home', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(200);
});

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);