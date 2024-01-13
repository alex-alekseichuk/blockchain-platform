/**
 * WebSocket server by ws lib
 * It's not registered via DI, it's instantiated by hand instead, in httpServer.js
 * @requires ws
 */
'use strict';
const EventEmitter = require('events');
const WsServer = require('ws');

let _logger;
let wss;
let ready = false;
let _instance;

module.exports = function wsServer(logger, server) {
  _logger = logger.get('common:nodejs/server/wsServer');

  wss = new WsServer.Server({server});

  wss.on('connection', function connection(ws) {
    /*
    // TODO: design/implement solution instead of this hardcoded connection context
    const domain = 'demo';
    ws.context = (domains.getContext(domain) || context).clone({
      userId: 1,
      roles: [],
    });
    ws.context.domain = ws.context.domain || domain;
    */

    if (!ready) {
      _logger.debug('Websocket module is not ready');
      ws.terminate();
      return;
    }

    ws.on('message', function incoming(message) {
      if (typeof message === 'string') {
        try {
          message = JSON.parse(message);
        } catch (err) {
          _logger.error(`Can't parse JSON message ${message}`);
        }
      }
      if (Array.isArray(message))
        message.forEach(msg => process(ws, msg));
      else
        process(ws, message);
    });
    ws.on('close', function() {
      _instance.emit('close', ws);
    });
  });

  wss.on('close', function close() {
    _logger.debug('wss close');
  });
  wss.on('error', function close() {
    _logger.debug('wss error');
  });

  ready = true;

  _instance = new EventEmitter();

  _instance.close = () => {
    ready = false;
    wss.clients.forEach(ws => ws.terminate());
    wss.terminate();
  };
  _instance.sendToAll = (data) => {
    if (typeof data !== 'string')
      data = JSON.stringify(data);
    wss.clients.forEach(client => {
      if (client.readyState === WsServer.OPEN) {
        client.send(data);
      }
    });
  };

  return _instance;
};

function process(ws, message) {
  _instance.emit(message.msg, message, ws);
}

function clientsNum() {
  let counter = 0;
  wss.clients.forEach(client => counter++);
  return counter;
}
