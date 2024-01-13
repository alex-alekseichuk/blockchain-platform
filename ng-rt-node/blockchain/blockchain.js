/**
 * Blockchain service on server side.
 * It provides 2 interfaces:
 * 1) blockchainSetup: for setup: blockchain impl., DA Types; by admin/system
 * 2) blockchain: for posting to blockchain; context-authorized; for clients to use blockchain; by users
 *
 * @requires blockchainStorage
 * @requires blockchainCache
 *
 * TODO: if blockchainSetup should be used via HTTP/CLI, then add authorization for it.
 * TODO: support several implementations;
 * TODO: support several asset types, domain, app?
 * Keep in mind, one app may use several assetTypes
 */
'use strict';
const EventEmitter = require('events');
const common = require('ng-common').common;
const util = common.util;

const bcService = function(logger, blockchainStorage, blockchainCache) {
  const _blockchains = {};
  const _daTypes = {};

  const blockchain = new EventEmitter();
  blockchain.createWallet = (ctx) => {
    const blockchainImpl = getBlockchainImpl(ctx);
    return blockchainImpl.createWallet();
  };
  blockchain.createTx = (ctx, data, inputs, outputs) => {
    const blockchainImpl = getBlockchainImpl(ctx);
    return blockchainImpl.createTx(data, inputs, outputs);
  };
  blockchain.signTx = (ctx, tx, wallet, inputIndex) => {
    const blockchainImpl = getBlockchainImpl(ctx);
    return blockchainImpl.signTx(tx, wallet, inputIndex);
  };

  // writing interface
  blockchain.postTx = async (ctx, signedTx) => {
    const blockchainImpl = getBlockchainImpl(ctx);
    const data = await blockchainImpl.postTx(signedTx);
    if (data)
      updateTxStatus(blockchainImpl.record(data, 'posted'));
    return data;
  };

  const blockchainSetup = {
    regBlockchain: (bcName, _blockchainImpl) => {
      _blockchains[bcName] = _blockchainImpl;
      _blockchainImpl.on('update', updateTxStatus);
    },
    regDaType: (daType, blockchainImpl) => {
      if (typeof blockchainImpl === 'string')
        blockchainImpl = _blockchains[blockchainImpl];
      _daTypes[daType] = blockchainImpl;

      // TODO: think, do we need this DA specific blockchain interface. maybe?
      const bc = {
        createWallet: ctx => {
          return blockchainImpl.createWallet();
        },
        createTx: (ctx, data, inputs, outputs) => {
          return blockchainImpl.createTx(data, inputs, outputs);
        },
        signTx: (ctx, tx, wallet, inputIndex) => {
          return blockchainImpl.signTx(tx, wallet, inputIndex);
        },

        // writing interface
        postTx: async (ctx, signedTx) => {
          const data = await blockchainImpl.postTx(signedTx);
          if (data)
            updateTxStatus(blockchainImpl.record(data, 'posted'));
          return data;
        }

        // reading interface; TODO: think about it, as well
        // getTx: async (ctx, id) => await blockchainStorage.get(id),
        // getTxFromCache: async (ctx, id) => await blockchainCache.get(id),
        // listTx: async (ctx, query) => await blockchainStorage.list(query),
        // listLatestTx: async (ctx, tsFrom, tsTo, query) => await blockchainCache.listLatest(tsFrom, tsTo, query),
      };
      return bc;
    }
  };

  return {
    __components: {
      blockchain,
      blockchainSetup
    }
  };

  function updateTxStatus(txRecord) {
    // txRecord.timestamp = util.timestamp();

    blockchainStorage.update(txRecord);
    blockchainCache.update(txRecord);

    if (txRecord.status !== 'confirmed')
      return;

    blockchain.emit('tx', txRecord);
  }

  function getBlockchainImpl(ctx) {
    const blockchainImpl = _daTypes[ctx.daType];
    if (!blockchainImpl)
      throw new BlockchainError(bcService.UNKNOWN_DA_TYPE);

    // TODO: check authorization by ctx.* and ctx.daType

    return blockchainImpl;
  }
};


class BlockchainError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'BlockchainError';
    this.status = status;
  }
}

const UNKNOWN_DA_TYPE = 0;
const FORBIDDEN = 1;
Object.assign(bcService, util.createEnum([
  'UNKNOWN_DA_TYPE', 'FORBIDDEN'
]));

module.exports = bcService;
