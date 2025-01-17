/* eslint-disable no-console */
const bodyParser = require('body-parser');
const express = require('express');
const dotenv = require('dotenv');
const { Model } = require('objection');
const cors = require('cors');

dotenv.config({ path: '.env' });

const routes = require('./app/routes');
const knex = require('./database/knex');
const middlewares = require('./app/http/middlewares');

Model.knex(knex);

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(middlewares.me);

app.use('/api/patients', middlewares.auth);
app.use('/api/employees', middlewares.auth);

Object.keys(routes).map((route) => app.use('/api', routes[route]));

app.use((req, res) => {
  res.status(404).send('Api not found');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
