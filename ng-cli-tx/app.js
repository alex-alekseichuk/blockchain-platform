/**
 * Service/business layer of console demo application of working with transactions.
 * @requires fs-extra
 */
'use strict';
const fs = require('fs-extra');
const {common, nodejs} = require('ng-common');

module.exports = async (argv) => {
  const app = await nodejs.cli.initApp(argv);
  if (!app) {
    process.exit(1);
  }

  app.reg(common.api.apiBlockchain);
  app.reg(common.blockchain);

  app.blockchain.setImplementation(app.inject(common.blockchain.dummy.client));

  const service = {
    createWallet: async () => {
      await createWallet(argv.out);
      if (app.websocket)
        app.websocket.close();
    },
    postCreateTx: async () => {
      const amount = +argv.amount || 1;

      let wallet;
      if (argv.wallet) {
        try {
          wallet = await fs.readJSON(argv.wallet);
        } catch (err) {
          app.logger.error(`Can't read wallet from ${argv.wallet}`)
          return;
        }
      } else {
        wallet = await createWallet();
      }

      const tx = app.blockchain.createTx(
        {
          amount,
          description: argv.description || '',
          daType: app.config.appTx.daType
        },
        null, // no inputs: CREATE tx
        [app.blockchain.createOutput(wallet.address, {amount})]
      );
      if (!tx) {
        app.logger.error(`Can't create transaction`);
        return;
      }

      const signedTx = app.blockchain.signTx(tx, wallet);
      if (!signedTx) {
        app.logger.error(`Can't sign transaction`);
        return;
      }

      let data = await app.blockchain.postWaitTx(signedTx);
      if (!data) {
        app.logger.error(`Can't post transaction`);
        return;
      }
      app.logger.debug(`The CREATE transaction with id: ${data.id} is confirmed.`);
      if (app.websocket)
        app.websocket.close();
    },
    postTransferTx: async () => {
      let wallet;
      try {
        wallet = await fs.readJSON(argv.wallet);
      } catch (err) {
        app.logger.error(`Can't read wallet from ${argv.wallet}.`)
        return;
      }

      const srcTx = await app.blockchain.getTx(argv.txId);

      const amount = srcTx.amount || 1; // TODO: remove this `|| 1`, because it should be strictly from srcTx

      const tx = app.blockchain.createTx(
        {
          amount,
          description: argv.description || '',
          daType: app.config.appTx.daType
        },
        [{txId: srcTx.id, outputIndex: 0}], // inputs: TRANSFER tx
        [app.blockchain.createOutput(argv.address, {amount})]
      );
      if (!tx) {
        app.logger.error(`Can't create transaction`);
        return;
      }

      const signedTx = app.blockchain.signTx(tx, wallet);
      if (!signedTx) {
        app.logger.error(`Can't sign transaction`);
        return;
      }

      let data = await app.blockchain.postWaitTx(signedTx);
      if (!data) {
        app.logger.error(`Can't post transaction`);
        return;
      }
      app.logger.debug(`The TRANSFER transaction with id: ${data.id} is confirmed.`);
      if (app.websocket)
        app.websocket.close();
    },
    getTx: async () => {
      const data = await app.blockchain.getTx(argv.txId);
      if (data)
        console.log(JSON.stringify(data, null, 2));
      else
        console.log('No such transaction.');
      if (app.websocket)
        app.websocket.close();
    },
    listenTx: async () => {
      let query = null;
      if (argv.query) {
        try {
          query = JSON.parse(argv.query);
        } catch (err) {}
      }
      const listener = app.blockchain.listenTx(query, tx => {
        _outputTx([tx]);
      });
      nodejs.cli.exitOnPressEnter(() => {
        listener.close();
        if (app.websocket)
          app.websocket.close();
      });
    },
    queryTx: async () => {
      let query = null;
      if (argv.query) {
        try {
          query = JSON.parse(argv.query);
        } catch (err) {}
      }
      const data = await app.blockchain.listTx(query);
      _outputTx(data.data);
      if (app.websocket)
        app.websocket.close();
    }
  };

  return service;

  function _outputTx(txs) {
    for (const tx of txs) {
      console.log(JSON.stringify(tx, null, 2));
    }

  }

  async function createWallet(filename) {
    const wallet = await app.blockchain.createWallet();
    const datetime = common.util.datetime().replace(' ', '_');
    filename = filename || `wallet-${datetime}.json`;
    await fs.outputFile(filename, JSON.stringify(wallet, null, 2));
    app.logger.debug(`A wallet is created in ${filename} file`);
    return wallet;
  }
};
