/**
 * Common Blockchain Websocket interface for listening for tx.
 * On server side.
 * It's listening for `tx` messages.
 * `tx` message is for subscription (re-subscription) in terms of specific query.
 * message.query is the optional query object.
 * message.lastTimestamp is the optional timestamp of last tx received by the client.
 * if message.lastTimestamp is absent, then there is a first subscription.
 * @requires ws
 */
'use strict';
const util = require('../../../util');
const WsServer = require('ws');
let _blockchainCache;

module.exports = function blockchainListenWs(logger, wsServer, listenController, listenDispatcher, blockchainCache) {
  _blockchainCache = blockchainCache;

  wsServer.on('close', ws => {
    listenController.closeWs(ws);
  });

  wsServer.on('listenTx', (message, ws) => {
    const key = message.key;

    // TODO: look, this block is the same as below. maybe refactor?
    const query = {};
    if (message.query)
      Object.assign(query, message.query);
    if (!query.daType && ws.context && ws.context.daType)
      query.daType = ws.context.daType;

    const tsListenStart = listenController.listen(query, ws, key);
    if (message.lastTimestamp) {
      // need to load offline records
      listOfflineTx(ws, message.lastTimestamp, tsListenStart, query, key)
        .then(()=>{});
    } else {
      // no need to load offline records
      // reply just empty txs with current timestamp
      ws.send(JSON.stringify({msg: 'txs', key, timestamp: util.timestamp()}));
    }
  });

  wsServer.on('stopListenTx', (message, ws) => {
    // TODO: look, this block is the same as above. maybe refactor?
    const key = message.key;
    const query = {};
    if (message.query)
      Object.assign(query, message.query);
    if (!query.daType && ws.context && ws.context.daType)
      query.daType = ws.context.daType;

    listenController.close(query, ws, key);
  });

  return {
    notify: txRecord => {
      const message = {msg: 'tx', tx: txRecord};
      listenDispatcher.dispatch(txRecord, (ws, keys) => {
        message.keys = keys;
        send(ws, message);
      });
    }
  }
};

async function listOfflineTx(ws, tsFrom, tsTo, query, key) {
  const message = await _blockchainCache.listLatest(tsFrom, tsTo, query);
  message.msg = 'txs';
  message.key = key;
  send(ws, message);
}

function send(ws, message) {
  if (ws.readyState === WsServer.OPEN)
    ws.send(JSON.stringify(message));
}
