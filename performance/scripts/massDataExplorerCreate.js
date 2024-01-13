'use strict';
/* eslint-disable */
var request = require("request");
const logger = require('log4js').getLogger('ng-rt-digitalAsset-sdk.examples.serverSide.CreateAsset');
logger.level = 'debug';
const { apiUtil } = require('ng-rt-digitalAsset-sdk');
const args = require('yargs').argv;

const assetFormat = {
  sdkVersion: '3.0',
  keyPairType: 'Ed25519',
  driverType: 'bdbDriver',
  encodeType: 'base64'
};
var url = args.url;
if (!url) {
  throw new Error('Please set your URL by --url=YOUR_URL');
}
var txs = args.txs;
if (!txs) {
  throw new Error('Please set number of transactions you want to post by --txs=NO_OF_TXS');
}
var appkey = args.appkey;
if (!appkey) {
  throw new Error('Please set your appkey for authentication by --appkey=YOUR_APPKEY');
}
var options = {
  method: 'POST',
  url: url + '/auth/applogin',
  form: {
    appID: 'ng-rt-digitalAsset',
    appKey: appkey
  },
  headers: {
    'Content-Type': 'application/json'
  },
  json: true
};
const postTxs = async() => {
  const txData = {
    serialNumber: '56288320528682648929801',
    Type: 'car',
    modelName: 'BMW x',
    registrationYear: '2019',
    colour: 'black',
    numberOfDoors: '3',
    fueltype: 'Diesel',
    time: Date.now().toString()
  };
  let token = await apiUtil.getToken(options);
  for (let i = 1; i <= txs; i++) {
    if (i % 100 === 0) {
      await new Promise(resolve => setTimeout(resolve, 8000));
    }
    var options1 = {
      method: 'POST',
      url: url + '/ng-rt-digitalAsset/assets/app',
      headers: {
        'content-type': 'application/json',
        'Authorization': `JWT ${token}`
      },
      body: {
        tx: txData,
        amount: '1',
        assetType: 'sample_demoAsset',
        keySource: 'generate',
        txMethod: 'Async',
        assetFormat: assetFormat
      },
      json: true
    };

    request(options1, function(error, response, body) {
      logger.debug(body);
    })
  }
}
postTxs();