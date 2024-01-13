'use strict';
const logger = require('log4js').getLogger('app-documents-service');
const _ = require('lodash');
const SERVICE_NAME = 'docs.service';
const request = require('request-promise');

/**
 * API/Service/DocumentsService
 *
 * @module API/Service/DocumentsService
 * @type {object}
 */

/**
 *
 * @param {Object} services Services
 * @return {{
 *  save: (function(string, buffer, Object)),
 *  verify: (function(string)),
 *  getAll: (function()),
 *  subscribe: (function(Function)),
 *  unsubscribe: unsubscribe,
 *  createTx: (function(string, buffer, Object)),
 *  postTxRecord: (function(Object))
 * }} API
 * @constructor
 */
function DocumentsService(services) {
  logger.debug('activate docs. service');

  let utils = services.get('utils');
  let blockchain = services.get('blockchain');
  const configService = services.get("configService");

  let _document = (buffer, meta) => {
    return {
      hash: meta.hash || utils.hash(buffer),
      filename: meta.filename,
      size: meta.size
    };
  };

  /**
   * Create digital asset transaction in blockchain for a document
   * @name save
   * @function
   * @param  {string} ownerPubKey Owner's public key
   * @param  {buffer} buffer      Buffer
   * @param  {object} meta        Metadata
   * @return {promise}            Result of creating tx in blockchain
   */
  let save = (ownerPubKey, buffer, meta) => {
    // return new Promise(response => {
    //   blockchain.postDigitalAsset(ownerPubKey, _document(buffer, meta), response);
    // });
    // var pubKey = "F2P2J2GSkJXoHHsbucQwnXtfxFi31j3JFdFzzX5bo3wa";
    let prvKey = "6txfoK6TCz29adHg1ff1RindRaXNSjfzYHwSvDd5YBcG";
    return blockchain.postCreateTx(_document(buffer, meta), ownerPubKey, prvKey);
  };

  // check if tx for specified document already exists
  /**
   * Check if transaction for specified document already exists
   * @name verify
   * @function
   * @param  {string} hash Hash of document
   * @return {promise}     Result true|false
   */
  let verify = async hash => {
    logger.debug("hash:", hash);
    let result;
    try {
      result = JSON.parse(await request(`http://${configService.get('bigchainDbHost')}:${configService.get('bigchainDbPort')}/api/v1/assets?search=${hash}`));
    } catch (e) {
      return logger.error(e);
    }
    return result.length > 0;
  };

  /**
   * Get all documents transactions
   * @name getAll
   * @function
   * @param  {string} publicKey - public key
   * @return {Promise} Array of transactions
   */
  let getAll = async publicKey => {
    try {
      const bigchainTxs = await bigchainTransactions(publicKey, configService);
      const assetInfoPromises = bigchainTxs.map(txId => bigchainAssetInfo(txId, configService));
      const txData = await Promise.all(assetInfoPromises);
      return txData;
    } catch (e) {
      logger.error(_.get(e, 'response.body', e));
    }

    /**
     * Get all documents transactions
     * @param  {string} id - transaction id
     * @param  {string} configService - configService
     * @return {Promise} asset's data
     */
    async function bigchainAssetInfo(id, configService) {
      let assets = await request(`http://${configService.get('bigchainDbHost')}:${configService.get('bigchainDbPort')}/api/v1/transactions/${id}`);
      assets = JSON.parse(assets);
      return assets.asset.data;
    }

    /**
     * Get all documents transactions
     * @param  {string} publicKey - public key
     * @param  {string} configService - configService
     * @return {Promise} asset's data
     */
    async function bigchainTransactions(publicKey, configService) {
      let txs = [];
      let result = await request(
        `http://${configService.get('bigchainDbHost')}:${configService.get('bigchainDbPort')}/api/v1/outputs?public_key=${publicKey}`
      );
      try {
        result = JSON.parse(result);
        result.forEach(tx => {
          txs.push(tx.transaction_id);
        });
      } catch (e) {
      }
      return txs;
    }
  };

  /**
   * Create transaction in blockchain
   * @name createTx
   * @function
   * @param  {string} owner  Owner's public key
   * @param  {buffer} buffer Buffer
   * @param  {object} meta   Metadata
   * @return {promise}       Result for transaction creation
   */
  let createTx = (owner, buffer, meta) => {
    return blockchain.createTx(owner, _document(buffer, meta));
  };

  /**
   * Post transaction in blockchain
   * @name postTxRecord
   * @function
   * @param  {object} txRecord Transaction
   * @return {promise}         Result of posting transaction
   */
  let postTxRecord = txRecord => {
    return new Promise(response => {
      blockchain.postTxRecord(txRecord, response);
    });
  };

  let docsService = {
    save: save,
    verify: verify,
    getAll: getAll,
    createTx: createTx,
    postTxRecord: postTxRecord
  };

  services.add(SERVICE_NAME, docsService);

  return docsService;
}

module.exports = {
  activate: DocumentsService,
  deactivate: SERVICE_NAME
};
