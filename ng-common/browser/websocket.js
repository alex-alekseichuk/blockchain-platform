/**
 * WebSocket client layer for browser.
 */
'use strict';
const EventEmitter = require('eventemitter3');

const minReopenTimeout = 500;
const maxReopenTimeout = 10000;
const scaleReopenTimeout = 2;
let wsUrl = 'ws://localhost:3000/';

let webSocket;
let _logger;
let _instance;

module.exports = function websocket(logger, config, uiLock) {
  wsUrl = config.websocket && config.websocket.url ? config.websocket.url : wsUrl;
  _logger = logger.get('common:browser/websocket');
  _instance = new EventEmitter();
  _instance.connected = false;
  uiLock.addUnload(() => close());
  _instance.open = open;
  _instance.close = close;
  _instance.send = send;
  return _instance;
};

let _reopenTimeout = minReopenTimeout;

function open() {
  webSocket = new WebSocket(wsUrl);
  webSocket.onopen = event => {
    _reopenTimeout = minReopenTimeout;
    _instance.connected = true;
    _instance.emit('open');
  };
  webSocket.onmessage = event => {
    let message;
    try {
      message = JSON.parse(event.data);
    } catch (err) {
      _logger.error(`Can't parse JSON message ${event.data}`);
    }
    if (Array.isArray(message))
      message.forEach(msg => processMessage(msg));
    else
      processMessage(message);
  };
  webSocket.onclose = event => {
    _logger.warn(`websocket closed`);
    if (_instance.connected) {
      _instance.connected = false;
      _instance.emit('close');
    }
    setTimeout(() => open(), _reopenTimeout);
    if (_reopenTimeout < maxReopenTimeout)
      _reopenTimeout *= scaleReopenTimeout;
  };
  webSocket.onerror = event => {
    _logger.error(`websocket error`);
  };
}

function close() {
  if (!webSocket)
    return;
  const ws = webSocket;
  webSocket = null;
  ws.onclose = function () {}; // disable onclose handler first
  ws.close();
}

function send(packet) {
  if (!webSocket)
    return;
  if (typeof packet !== 'string')
    packet = JSON.stringify(packet);
  webSocket.send(packet);
}

function processMessage(message) {
  _instance.emit(message.msg, message);
}
