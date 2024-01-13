/**
 * HTTP server by express
 * @requires express
 */
'use strict';
const express = require('express');
const {nodejs} = require('ng-common');

let _context;
let _domains;
let _logger;

module.exports = function httpServer(context, config, logger, domains) {
  _context = context;
  _domains = domains;
  _logger = logger.get('ng-rt-node:http/httpServer');

  const address = config.http.address || 'localhost';
  const port = config.http.port || 3000;

  const app = express();
  app.jsonParser = express.json();
  app.use(express.static('client'));

  const router = express.Router();
  router.jsonParser = app.jsonParser;

  app.use('/', router);
  app.use(errorHandler);

  const server = app.listen(port, address)
    .on('error', err => {
      _logger.error(`Can't listen on ${address}:${port}`);
    });

  const wsServer = nodejs.server.wsServer(logger, server);

  return {
    __components: {
      httpServer: router,
      wsServer
    }
  };
};

function errorHandler(err, req, res, next) {
  _logger.error(err.stack);
  if (res.headersSent) {
    return next(err)
  }
  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    res.status(500).send({ error: err.message || 'Server error' })
  } else {
    res.status(500).send(err.message || 'Server Error')
  }
}
