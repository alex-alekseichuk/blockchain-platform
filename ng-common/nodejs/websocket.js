/**
 * WebSocket client layer for nodejs.
 */
'use strict';
const EventEmitter = require('events');
const WebSocket = require('ws');

const minReopenTimeout = 500;
const maxReopenTimeout = 10000;
const scaleReopenTimeout = 2;
let defaultWsUrl = 'ws://localhost:3000/';
let _logger;

module.exports = function websocket(logger, config) {
  if (!_logger)
    _logger = logger.get(`common:nodejs/websocket`);
  const instance = new EventEmitter();
  return Object.assign(instance, {
    wsUrl: config.websocket && config.websocket.url ? config.websocket.url : defaultWsUrl,
    connected: false,
    _reopenTimeout: minReopenTimeout,
    open: open.bind(instance),
    close: close.bind(instance),
    send: send.bind(instance),
    _process: _process.bind(instance)
  });
};

function open() {
  const instance = this;
  _logger.trace(`websocket open ${instance.wsUrl}`);
  instance.ws = new WebSocket(instance.wsUrl);
  instance.ws.on('open', function _open() {
    _logger.trace(`websocket opened`);
    instance._reopenTimeout = minReopenTimeout;
    instance.connected = true;
    instance.emit('open');
  });
  instance.ws.on('error', function error(err) {
    _logger.error(`websocket error ${err.message}`);
  });
  instance.ws.on('close', function onclose() {
    _logger.warn(`websocket closed`);
    if (instance.connected) {
      instance.connected = false;
      instance.emit('close');
    }
    if (!instance.ws) // close by hand: w/o reconnect
      return;
    setTimeout(() => instance.open(), instance._reopenTimeout);
    if (instance._reopenTimeout < maxReopenTimeout)
      instance._reopenTimeout *= scaleReopenTimeout;
  });
  instance.ws.on('message', function incoming(data) {
    let message;
    try {
      message = JSON.parse(data);
    } catch (err) {
      _logger.error(`Can't parse JSON message ${data}`);
    }
    _logger.trace(`websocket message ${message.msg}`);
    if (!message.msg) {
      _logger.trace(JSON.stringify(message, null, 2));
    }
    if (Array.isArray(message))
      message.forEach(msg => instance._process(msg));
    else
      instance._process(message);
  });
}

function close() {
  _logger.debug('close websocket');
  if (!this.ws)
    return;
  const _ws = this.ws;
  this.ws = null;
  _ws.terminate();
}

function send(packet) {
  if (!this.ws)
    return;
  if (typeof packet !== 'string')
    packet = JSON.stringify(packet);
  this.ws.send(packet);
}

function _process(message) {
  this.emit(message.msg, message);
}
