'use strict';

const routes = require('./server/routes/routes');
const services = require('./server/services');

describe('tests', () => {
  describe('server.routes', routes);

  describe('server.services', services);
});
