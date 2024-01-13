/**
 * blockchainList service on server side.
 *
 * @requires blockchainStorage
 * @requires blockchainCache
 */
'use strict';
const EventEmitter = require('events');

module.exports = function blockchainList(logger, blockchainStorage, blockchainCache) {
  const service = new EventEmitter();

  // TODO: check authorization by ctx.* and ctx.daType
  service.getTx = async (ctx, id) => await blockchainStorage.get(id);
  service.getTxFromCache = async (ctx, id) => await blockchainCache.get(id);
  service.listTx = async (ctx) => await blockchainStorage.list();
  service.listLatestTx = async (ctx, timestamp) => await blockchainCache.listLatest(timestamp);

  return service;
};

