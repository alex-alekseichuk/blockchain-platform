/**
 * Blockchain service for client side.
 * Common for both the browser and nodejs clients.
 */
'use strict';
const util = require('../util');

function blockchain(logger, apiBlockchain) {
  const _logger = logger.get('common:blockchain');
  const service = {
    setImplementation: blockchainImpl => {
      Object.assign(service, blockchainImpl);
    },
    postWaitTx: async signedTx => {
      try {
        let record = await service.postTx(signedTx);
        if (!record || !record.id)
          return;
        return await apiBlockchain.waitTx(record.id, record.timestamp);
      } catch (err) {
        _logger.error(`Can't post and confirm tx ${JSON.stringify(signedTx)}`);
        return null;
      }
    },
    getTx: async id => {
      try {
        return await apiBlockchain.getTx(id);
      } catch {
        _logger.error(`Can't get tx ${id}`);
        return null;
      }
    },
    listTx: async () => {
      try {
        return await apiBlockchain.listTx();
      } catch {
        _logger.error(`Can't get transactions`);
        return null;
      }
    },
    listenTx: (query, cb) => apiBlockchain.listenTx(query, cb)
  };
  return service;
}

// Add more blockchain implementations here, or load them from separated npm
blockchain.dummy = require('./dummy');

module.exports = blockchain;
