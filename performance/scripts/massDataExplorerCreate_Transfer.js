'use strict';

const utils = require('../examples/utils/utils');
const args = require('yargs').argv;
const {digitalAssetDriver, contextUtil, apiUtil, digitalAssetApi} = require('ng-rt-digitalAsset-sdk');
const logger = require('log4js').getLogger('ng-rt-digitalAsset-sdk.examples.basic.testData.blockExplorer');
logger.level = 'debug';
const serverEnv = 'default';
const digitalAssetType = 'sample_demoAsset';
var txs = args.txs;
if (!txs) {
  throw new Error('Please set number of transactions you want to post by --txs=NO_OF_TXS');
}
const alice = {
  privateKey: 'Db1mbaoCxmcqvkRCL3aDHmR18UDx3rViDecNMzmRAD77',
  publicKey: '3PtBLYHY9n3KEr5KeSQ5RQiQXGUkesa6Vvqvk3KTEfN3'
};
const bob = {
  privateKey: "149u6rWYs7JgRbQZUuLigbjisf1yx5UkvKk3toutpTqf",
  publicKey: "GYJSQ26pB24mwafXbMLpsjgD3QLS8oaKbjmnSPbiWBWB"
};
const charlie = {
  privateKey: '62xEiowgZDA9uXURt1RkLYZ35GPu95jCwBkv81ZCdhgo',
  publicKey: '2SRYD7njZV28cWtN8b6hioDrftUXKemDY6v2wuoWZrAW'
};
const dora = {
  privateKey: 'GdCYy84QEwVe5f6rG33pW64uY6TNAqDjANzYScBoKzVg',
  publicKey: 'CWVVM53w8FqYR37odSuZGsD6b8UA24D8d6YoShzQsEnd'
};

const metadata = {};

const txContext = contextUtil.createClientTxContext(digitalAssetType, serverEnv);
const amount = '1';

// The appKey must be a valid key created by the TBSP admin for the ng-rt-digitalAsset plugin
const appKey = txContext.serverEnvironment.appKey ? txContext.serverEnvironment.appKey : 'YOUR_APPKEY';

// Create, transfer and read a transaction asynchronously by entering keypair using and using 'default' server env
const createAndTransferTx = async() => {
  try {
    // car1 attributes
    const car1 = {
      serialNumber: '56288320528682648929801',
      Type: 'car',
      modelName: 'BMW x',
      registrationYear: '2019',
      colour: 'black',
      numberOfDoors: '3',
      fueltype: 'Diesel',
      time: Date.now().toString()
    };

    // car2 attributes
    const car2 = {
      serialNumber: '897007508355702487350052',
      Type: 'car',
      modelName: 'Mercedes',
      registrationYear: '2018',
      colour: 'white',
      numberOfDoors: '5',
      fueltype: 'petrol',
      time: Date.now().toString()
    };

    // book1 details
    const book1 = {
      title: 'the alchemist',
      author: 'Mr x',
      year: '2015',
      language: 'english',
      time: Date.now().toString()
    };

    // book2 details
    const book2 = {
      title: 'harry potter',
      author: 'Mr ABC',
      year: '2018',
      language: 'english',
      time: Date.now().toString()
    };

    // book3 details
    const book3 = {
      title: '2 states',
      author: 'Mr John',
      year: '2016',
      language: 'german',
      time: Date.now().toString()
    };
    const pluginInfo = await digitalAssetApi.getPluginConfiguration(txContext);
    if (pluginInfo.routeValidation === true) {
      const jwtToken = await apiUtil.appLogin(appKey);
      txContext.jwtToken = jwtToken;
    } else {
      logger.info('validation is off');
    }

    logger.info('Alice is creating car1');
    const createTxAlice = await digitalAssetDriver.createDigitalAsset(txContext, car1, amount, metadata, alice.publicKey, alice.privateKey);
    const transactionIdAlice = createTxAlice.result.hash;
    logger.info('Transaction ID for alice car1 is : ', transactionIdAlice);

    const aliceTx = await utils.getTxById(txContext, transactionIdAlice);
    logger.info(aliceTx.txId);

    logger.info('bob is creating car2');
    const createTxBobCar = await digitalAssetDriver.createDigitalAsset(txContext, car2, amount, metadata, bob.publicKey, bob.privateKey);
    const transactionIdBobCar = createTxBobCar.result.hash;
    logger.info('Transaction ID for bob car2 is : ', transactionIdBobCar);

    const bobTx = await utils.getTxById(txContext, transactionIdBobCar);
    logger.info(bobTx.txId);

    logger.info('charlie is creating book1');
    const createTxCharlie = await digitalAssetDriver.createDigitalAsset(txContext, book1, amount, metadata, charlie.publicKey, charlie.privateKey);
    const transactionIdCharlie = createTxCharlie.result.hash;
    logger.info('Transaction ID for charlie book1 is : ', transactionIdCharlie);

    const charlieTx = await utils.getTxById(txContext, transactionIdCharlie);
    logger.info(charlieTx.txId);

    logger.info('dora is creating book2');
    const createTxDora = await digitalAssetDriver.createDigitalAsset(txContext, book2, amount, metadata, dora.publicKey, dora.privateKey);
    const transactionIdDora = createTxDora.result.hash;
    logger.info('Transaction ID for dora book2 is : ', transactionIdDora);

    const doraTx = await utils.getTxById(txContext, transactionIdDora);
    logger.info(doraTx.txId);

    logger.info('bob is creating book3');
    const createTxBobBook = await digitalAssetDriver.createDigitalAsset(txContext, book3, amount, metadata, bob.publicKey, bob.privateKey);
    const transactionIdBobBook = createTxBobBook.result.hash;
    logger.info('Transaction ID for bob book3 is : ', transactionIdBobBook);

    const bobTxCar = await utils.getTxById(txContext, transactionIdBobBook);
    logger.info(bobTxCar.txId);

    logger.info('Now Alice is transferring his car1 to charlie');
    const transferTxA2C = await digitalAssetDriver.transferDigitalAsset(txContext, transactionIdAlice, metadata, alice.publicKey, alice.privateKey, charlie.publicKey);
    const transferTransactionIdA2C = transferTxA2C.result.hash;
    logger.info('TRANSFER from alice to charlie, transaction id for charlie: ' + transferTransactionIdA2C);

    logger.info('Now bob is transferring his car2 to alice');
    const transferTxB2A = await digitalAssetDriver.transferDigitalAsset(txContext, transactionIdBobCar, metadata, bob.publicKey, bob.privateKey, alice.publicKey);
    const transferTransactionIdB2A = transferTxB2A.result.hash;
    logger.info('TRANSFER from bob to alice, transaction id for alice: ' + transferTransactionIdB2A);

    logger.info('Now charlie is transferring his book1 to bob');
    const transferTxC2B = await digitalAssetDriver.transferDigitalAsset(txContext, transactionIdCharlie, metadata, charlie.publicKey, charlie.privateKey, bob.publicKey);
    const transferTransactionIdC2B = transferTxC2B.result.hash;
    logger.info('TRANSFER from charlie to bob, transaction id for bob: ' + transferTransactionIdC2B);

    logger.info('Now bob is transferring his book3 to dora');
    const transferTxB2D = await digitalAssetDriver.transferDigitalAsset(txContext, transactionIdBobBook, metadata, bob.publicKey, bob.privateKey, dora.publicKey);
    const transferTransactionIdB2D = transferTxB2D.result.hash;
    logger.info('TRANSFER from bob to dora, transaction id for dora: ' + transferTransactionIdB2D);

    logger.info('Now dora is transferring his book2 to alice');
    const transferTxD2A = await digitalAssetDriver.transferDigitalAsset(txContext, transactionIdDora, metadata, dora.publicKey, dora.privateKey, alice.publicKey);
    const transferTransactionIdD2A = transferTxD2A.result.hash;
    logger.info('TRANSFER from dora to alice, transaction id for alice: ' + transferTransactionIdD2A);
  } catch (error) {
    logger.error(error.message);
  }
};

const postTxs = async() => {
  for (let i = 1; i <= txs; i++) {
    if (i % 100 === 0) {
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
    await createAndTransferTx();
  }
}
postTxs();
