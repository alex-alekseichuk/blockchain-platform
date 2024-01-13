/**
 * Transaction Application
 * Business logic
 * TODO: catch/throw errors
 */
'use strict';
const {common, browser} = require('ng-common');
window.common = common;

let app;
let logger;
let delegate;

const txs = [];

const states = {
  '*': {
    actions: {
      error: async ({message}) => {
        return {state: 'ready', payload: {toast: message}};
      },
      // route: ({state}) => state,
      // logout: () => {
      //   app.session.logout();
      //   location = '/app-login/';
      // }
    }
  },
  init: {
    actions: {
      loadTx: () => {
        setTimeout(listenTx, 0);
        return 'listeningTx';
      },
    }
  },
  listeningTx: {
    actions: {
      loaded: 'ready'
    }
  },
  ready: {
    actions: {
      createWallet: () => {
        createWallet();
        return 'creatingWallet';
      },
      postCreateTx: data => {
        postCreateTx(data);
        return 'postingCreateTx';
      },
      postTransferTx: async data => {
        postTransferTx(data);
        return 'postingTransferTx';
      }
    }
  },
  creatingWallet: {
    actions: {
      created: async () => {
        const wallets = await app.walletManager.getWallets();
        return {state: 'ready', payload: {
            wallets
          }};
      }
    }
  },
  postingCreateTx: {
    actions: {
      confirmed: async ({tx}) => {
        return {state: 'ready', payload: {
            tx
          }};
      }
    }
  },
  postingTransferTx: {
    actions: {
      confirmed: async ({tx}) => {
        return {state: 'ready', payload: {
            tx
          }};
      }
    }
  }
};

async function appFactory(_delegate) {
  delegate = _delegate;

  // TODO: better approach w/o this hardcode
  // const baseURL = 'http://192.168.3.107:3000/';
  // const baseURL = 'http://localhost:8443/';
  // const baseURL = 'http://ng-web-tx.localhost:3000/';
  const baseURL = 'http://localhost:3000/';
  // const baseURL = 'http://europe.localnet:3000/';

  app = await browser.initApp(baseURL);
  if (!app) {
    return null;
  }
  logger = app.logger.get('ng-web-tx:src/app');

  app.reg(common.api.apiBlockchain);
  app.reg(common.blockchain);
  app.blockchain.setImplementation(app.inject(common.blockchain.dummy.client));
  app.reg(common.blockchain.dummy.walletManager);

  const wallets = await app.walletManager.getWallets();

  app.sm = common.sm.init({delegate, states}, 'init', {wallets});

  return app;
}

module.exports = appFactory;

async function createWallet() {
  try {
    const wallet = await app.walletManager.createWallet();
    app.sm.action('created', {wallet});
  } catch (err) {
    app.logger.error(err.message);
    error("Can't create new Wallet");
  }
}

async function postCreateTx(data) {
  try {
    const wallet = await app.walletManager.getWallet(data.walletId);
    if (!wallet)
      return error(`Unknown Wallet ID: ${data.walletId}`);

    const tx = app.blockchain.createTx({
        amount: data.amount,
        description: data.description || '',
        daType: app.config.appTx.daType
      },
      null, // no inputs: CREATE tx
      [app.blockchain.createOutput(wallet.address, {amount: data.amount})]
    );
    if (!tx)
      return error("Can't create transaction");

    const signedTx = app.blockchain.signTx(tx, wallet);
    if (!signedTx)
      return error(`Can't sign transaction`);

    let resultTx = await app.blockchain.postWaitTx(signedTx);
    if (!resultTx)
      return error(`Can't post transaction`);

    txs.push(resultTx);

    app.sm.action('confirmed', {tx: resultTx});
  } catch (err) {
    error(`Can't post TRANSFER transaction ${JSON.stringify(data)}`);
  }
}

async function postTransferTx(data) {
  try {
    const inWallet = await app.walletManager.getWallet(data.inWalletId);
    if (!inWallet)
      return error("Unknown input Wallet");

    if (!data.outAddress)
      return error("Unknown output Address");

    const srcTx = await app.blockchain.getTx(data.srcTxId);

    const amount = srcTx.amount || 1; // TODO: remove this `|| 1`, because it should be strictly from srcTx

    const tx = app.blockchain.createTx(
      {
        amount,
        description: data.description || '',
        daType: app.config.appTx.daType
      },
      [{txId: srcTx.id, outputIndex: 0}], // inputs: TRANSFER tx
      [app.blockchain.createOutput(data.outAddress, {amount})]
    );
    if (!tx)
      return error(`Can't create transaction`);

    const signedTx = app.blockchain.signTx(tx, inWallet);
    if (!signedTx)
      return error(`Can't sign transaction`);

    let resultTx = await app.blockchain.postWaitTx(signedTx);
    if (!resultTx)
      return error(`Can't post transaction`);

    txs.push(resultTx);

    app.sm.action('confirmed', {tx: resultTx});
  } catch (err) {
    error(`Can't post CREATE transaction ${JSON.stringify(data)}`);
  }
}

async function listenTx() {
  const listener = app.blockchain.listenTx(null, tx => {
    delegate.appendTx([{timestamp: tx.timestamp, status: tx.status, ...(tx.data)}]);
  });
  app.sm.action('loaded');
}

function error(message) {
  app.logger.error(message);
  app.sm.action('error', {message});
}
