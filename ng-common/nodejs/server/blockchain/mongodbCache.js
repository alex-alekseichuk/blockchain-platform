/**
 * Blockchain cache service (or backend?).
 * For saving/querying data about tx.
 * It's based on mongodb as a persistent storage.
 * It can be used in the multi-node mode for production.
 *
 * TODO: add config and get parameters from mongodbCache config section
 *
 * @requires mongodb
 */
'use strict';

const CACHE_TTL = 10; // seconds
const MongoClient = require('mongodb').MongoClient;
const util = require('../../../util');

module.exports = function blockchainCache(logger) {
  const _logger = logger.get('ng-rt-node:services/blockchain/mongodbCache');
  const url = 'mongodb://localhost:27017';

  return {
    update,
    get,
    listLatest
  };

  async function update(txRecord) {
    let client, db;
    try {
      ({client, db} = await _connect());
      const colTx = db.collection('tx');
      const record = Object.assign({_id: txRecord.id}, txRecord);
      delete record.id;
      record.createdAt = new Date();
      await colTx.updateOne({_id: record._id}, {$set: record}, {upsert: true});
    } catch (err) {
      _logger.error(err.message);
    } finally {
      if (client)
        client.close();
    }
  }
  async function get(id) {
    let client, db;
    try {
      ({client, db} = await _connect());
      const colTx = db.collection('tx');
      const record = await colTx.findOne({_id: id});
      if (record) {
        record.id = record._id;
        delete record._id;
        return record;
      }
    } catch (err) {
      _logger.error(err.message);
    } finally {
      if (client)
        client.close();
    }
  }
  async function listLatest(tsFrom, tsTo, query) {
    let client, db;
    try {
      ({client, db} = await _connect());
      const colTx = db.collection('tx');
      const where = {};
      if (query)
        Object.assign(where, query);
      Object.assign(where, {
        timestamp: {$gt: +tsFrom}
      });
      if (tsTo)
        where.timestamp['$lt'] = +tsTo;

      const records = await colTx.find(where).toArray();
      records.forEach(record => {
        record.id = record._id;
        delete record._id;
      });
      return {
        data: records,
        timestamp: util.timestamp()
      };
    } catch (err) {
      _logger.error(err.message);
    } finally {
      if (client)
        client.close();
    }
    return {
      timestamp: util.timestamp()
    };
  }

  async function _connect() {
    const client = await MongoClient.connect(url, {
      poolSize: 10,
      useUnifiedTopology: true
    });
    if (! client) {
      const err = new Error(`Can't connect to cache server ${url}`);
      _logger.error(err.message);
      throw err;
    }
    try {
      const db = client.db('tx');
      await db.createIndex('tx', {createdAt: 1}, {expireAfterSeconds: CACHE_TTL});
      return {client, db};
    } catch (err) {
      client.close();
      _logger.error(err.message);
      err = new Error(`Can't connect to cache server ${url}`);
      _logger.error(err.message);
      throw err;
    }
  }
};


