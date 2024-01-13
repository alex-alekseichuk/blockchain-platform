/**
 * Dummy blockchain implementation.
 * It provides 2 factories and 2 interfaces respectively:
 *  for client service and for server service.
 *
 *  Common txRecord has:
 *    id of tx
 *    status of action
 *    timestamp of action
 *    data custom tx body
 */
'use strict';

const util = require('../../util');

const commonFunctions = {
  createWallet: async () => ({address: `dummy-address-${util.generateShortId()}`}),
  // data: type, payload, metadata
  createTx: (data, inputs, outputs) => Object.assign({id: util.generateId()}, data, {inputs, outputs}),
  createOutput: (address, outputData) => ({address, data: outputData}),
  signTx: (tx, wallet, inputIndex) => tx,
  record: (signedTx, status) => ({
    data: signedTx,
    id: signedTx.id,
    status,
    daType: signedTx.daType,
    timestamp: util.timestamp()
  })
};

const factories = {
  server: function blockchainImpl(context) {
    const EventEmitter = require('events');
    context.inject(require('./dummyRoutes'));

    const blockchainImpl = new EventEmitter();

    Object.assign(blockchainImpl, commonFunctions, {
      postTx: async signedTx => {
        // signedTx.timestamp = Date.now();
        setTimeout(() => {
          blockchainImpl.emit('update', blockchainImpl.record(signedTx, 'confirmed'));
        }, 1000);
        // return {id: signedTx.id};
        return commonFunctions.record(signedTx, 'posted');
      }
    });

    return blockchainImpl;
  },

  client: function blockchainImpl(context, apiBlockchain) {
    const apiDummy = context.inject(require('./apiDummy'));

    return Object.assign({}, commonFunctions, {
      postTx: async signedTx => await apiDummy.postTx(signedTx)
      // postTx: async signedTx => await apiBlockchain.postTx(signedTx)
    });
  },
  walletManager: require('./dummyWalletManager')
};

factories.client.__dependencies = ['context', 'apiBlockchain'];

module.exports = factories;
